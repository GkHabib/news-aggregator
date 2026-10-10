# News Aggregator

React + TypeScript (Vite) news aggregator UI.

## Environment variables

The app pulls articles from NewsAPI.org, The New York Times and The Guardian, each of which needs a free API key. Copy the example file and fill in your keys:

```bash
cp .env.example .env
```

| Variable           | Source                                                                  |
| ------------------ | ----------------------------------------------------------------------- |
| `API_KEY_NEWSAPI`  | [NewsAPI.org](https://newsapi.org/register)                             |
| `API_KEY_NYTIMES`  | [NYT Developer](https://developer.nytimes.com/get-started)              |
| `API_KEY_GUARDIAN` | [Guardian Open Platform](https://open-platform.theguardian.com/access/) |
| `ENABLE_MOCK_DATA` | `true` serves built-in fixture data instead of calling the APIs         |

API keys never reach the browser. The app calls `/api/<source>/…` and a proxy adds the key: the Vite dev server in development (`vite.config.ts`) and nginx in Docker (`nginx/default.conf.template`, filled in from `.env` when the container starts).

Use `ENABLE_MOCK_DATA=true` while working on the UI to avoid the providers' daily limits (NewsAPI's free plan allows 100 requests/day). It is read at build time, so restart `pnpm dev` or `docker compose up` after changing it.

## Run with Docker

```bash
docker compose up
```

Open http://localhost:3000. Stop with `Ctrl+C` (or `docker compose down` when started with `-d`).

Only Docker is required; Node and pnpm are not needed on the host.

The image is a production build (static files served by nginx), so it has no hot reload. Every `up` rebuilds the image (`pull_policy: build`), so restart it to see code changes. For day-to-day development, use `pnpm dev` below.

## Local development

| Tool | Version                                               |
| ---- | ----------------------------------------------------- |
| Node | 24 (pinned in `.nvmrc`)                               |
| pnpm | 12.10.1 (pinned in `package.json` → `packageManager`) |

### 1. Install Node 24

With [nvm](https://github.com/nvm-sh/nvm) (reads `.nvmrc`):

```bash
nvm install && nvm use
```

Or download Node 24 LTS from https://nodejs.org.

### 2. Install pnpm via Corepack

Corepack installs the exact pnpm version pinned in `package.json`. pnpm 12 needs Corepack 0.36+, so update it first (Node 25+ no longer bundles Corepack at all):

```bash
npm install -g corepack@latest
```

```bash
corepack enable
```

> pnpm 12 rejects packages published less than 24h ago (`minimumReleaseAge`) as supply-chain protection. If an install fails with `ERR_PNPM_MINIMUM_RELEASE_AGE_VIOLATION`, wait or pin the previous version; don't add exclusions.

### 3. Install and run

Make sure `.env` exists (see [Environment variables](#environment-variables)), then:

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000.

## Architecture

```
src/
├── types/                        # Domain types, one concept per file (barrel: @/types)
│   ├── article.ts                # Article, ArticleId
│   ├── articleQuery.ts           # ArticleQuery
│   ├── author.ts · category.ts · source.ts
│   ├── date.ts                   # IsoDateTime, CalendarDate (branded strings)
│   ├── searchResult.ts           # SearchResult, SourceError
│   └── brand.ts                  # Brand<T, Name> helper for nominal types
├── utils/date.ts                 # Validating constructors for the date types
├── config/env.ts                 # Build-time flags
├── queries/                      # React data access (TanStack Query); the only React-aware data code
│   ├── queryClient.ts            # Cache policy: 2 min fresh, 5 min kept, 1 retry for transient errors
│   ├── articleQueryKeys.ts       # Cache key factory
│   ├── articlePages.ts           # Infinite feed: next-page params, appending pages
│   └── useArticles.ts            # useInfiniteQuery over articleService
└── services/news/                # Data layer: framework-agnostic, the only code that knows about providers
    ├── index.ts                  # Composition root + public API (real or mock)
    ├── articleService.ts         # Fan-out, merge, per-source error isolation, paging info
    ├── articleFilters.ts         # Filters re-applied after merging (dates, categories, authors)
    ├── articleQuery.ts           # normalizeArticleQuery: canonical form for cache keys / URLs
    ├── articleCollection.ts      # dedupe + sort helpers
    ├── errors.ts                 # AllSourcesFailedError, isTransientError
    ├── api/                      # Real providers
    │   ├── http.ts               # FetchJson contract, fetch wrapper, URL builder
    │   ├── newsSource.ts         # NewsSource contract every provider implements
    │   ├── sources.ts            # Registry: SourceId -> provider
    │   ├── shared/               # Category mapping + normalization helpers
    │   └── <provider>/           # newsApi/, guardian/, nyTimes/, each with:
    │       ├── *.types.ts        #   raw response types (never leave this folder)
    │       ├── *.categories.ts   #   our Category <-> provider sections
    │       ├── *.client.ts       #   request building + fetching
    │       ├── *.normalizer.ts   #   raw -> Article (drops incomplete items)
    │       └── *.source.ts       #   NewsSource implementation wiring the above
    └── mock/                     # In-memory fake providers
        ├── mockFetchJson.ts      # Routes /api/<provider> to its handler
        └── <provider>/           # *.fixtures.ts (raw data) + *.handler.ts (emulates the API's filters)
```

**Data flow:** `articleService` → each relevant `NewsSource` → client fetches raw JSON → normalizer turns it into `Article`s independently per provider → the service merges, de-duplicates, re-applies filters and sorts. The UI only sees `Article` and `SearchResult`. If one provider fails (rate limit, outage), the others still return results and the failure is reported in `errors`.

**Caching and the feed:** `useArticles` wraps the service in `useInfiniteQuery`. Queries are normalized first, so equivalent filters share one cache entry. Each page asks only the sources that reported more results (`sourcesWithMore`); pages are appended in load order, so loading more never reshuffles what was already shown. Partial failures come back in `errors`; the query only fails when every source failed, and it retries once for network/5xx errors only (retrying a 401/429 would just burn quota).

**Mock mode** swaps only the `FetchJson` implementation. Clients and normalizers run unchanged against fake providers that return raw responses and honour keyword, category, date and paging parameters like the real APIs. The mock is lazy-loaded, so real-data builds never download it.

**Adding a source:** add its id to `SourceId`, create `api/<provider>/` implementing `NewsSource`, register it in `api/sources.ts`, add a proxy route in `vite.config.ts` and `nginx/default.conf.template`, and add a fake provider in `mock/`. TypeScript flags a missing registry entry.

**Removing a source:** do the reverse. Nothing outside `services/news` changes.

## Scripts

| Script           | Purpose                       |
| ---------------- | ----------------------------- |
| `pnpm dev`       | Dev server on :3000           |
| `pnpm build`     | Type-check + production build |
| `pnpm lint`      | Lint with oxlint              |
| `pnpm format`    | Format with Prettier          |
| `pnpm typecheck` | Type-check only               |
| `pnpm test`      | Run unit tests (Vitest)       |
