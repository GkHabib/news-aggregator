# News Aggregator

A news reader that merges **NewsAPI.org**, **The Guardian** and **The New York Times** into one newest-first feed, with search, filters and a personalized "For you" feed. Built with React 19, TypeScript and Vite; runs with a single `docker compose up`.

## Features

| Challenge requirement        | How it is covered                                                                                                                                                                                                                                                                       |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Article search and filtering | Keyword search plus filters for date (today, past week, past month or a custom range), category and source. Filters live in the URL, so results are shareable and Back steps through every change. Hints appear when a source doesn't cover a chosen category.                          |
| Personalized news feed       | "Your feed" lets you pick sources, categories and authors. Authors can be followed from any story's ⋯ menu or added by name, with suggestions from writers in recent stories. Preferences are saved on the device and the feed becomes "For you".                                       |
| Mobile-responsive design     | Phone, tablet and desktop layouts: one column with a bottom-sheet filter panel on phones, a two-column grid with a side sheet on tablets, and a sticky filter column on desktop. Accessible throughout: keyboard support, visible focus, 44px touch targets and reduced-motion support. |

Also: infinite scroll, partial-failure handling (if one provider is down or over its quota, the others still show), and a mock mode that serves captured real data without spending API quota.

## Quick start (Docker)

The only requirement is **Docker** with Compose v2 (Docker Desktop, or Docker Engine with the compose plugin). Everything else (Node, pnpm, dependencies, the build and the web server) is installed and built inside the container. The images are multi-architecture, so the same commands work on **arm64** (Apple silicon, ARM servers) and **x86_64**.

### 1. Set up environment variables

The app needs a free API key per provider. Create your `.env` from the example:

```bash
cp .env.example .env
```

Then fill it in:

| Variable           | Value                                                                                             |
| ------------------ | ------------------------------------------------------------------------------------------------- |
| `API_KEY_NEWSAPI`  | Key from [NewsAPI.org](https://newsapi.org/register)                                              |
| `API_KEY_NYTIMES`  | Key from [NYT Developer](https://developer.nytimes.com/get-started) (enable "Article Search API") |
| `API_KEY_GUARDIAN` | Key from [Guardian Open Platform](https://open-platform.theguardian.com/access/)                  |
| `ENABLE_MOCK_DATA` | `true` to serve built-in data instead of calling the APIs (no keys needed); `false` for live data |

No keys yet? Set `ENABLE_MOCK_DATA=true` and leave the keys empty: the app runs on real stories captured from the APIs. The `.env` file must exist either way.

API keys never reach the browser. The app only calls its own `/api/<provider>/…` routes, and a proxy adds the keys server-side.

### 2. Start

```bash
docker compose up
```

Open **http://localhost:3000**. Stop with `Ctrl+C`, or run `docker compose down` if you started it with `-d`.

What happens on `up`:

1. **Build stage** (`node:24-alpine`): Corepack installs the pinned pnpm, `pnpm install --frozen-lockfile` installs the exact locked dependencies, and `pnpm build` type-checks and builds the app. `ENABLE_MOCK_DATA` is read here from `.env`.
2. **Serve stage** (`nginx:1.27-alpine`): nginx serves the static build and proxies `/api/*` to the providers. Keys are inserted into its config from `.env` when the container starts, so they never end up in the image.

Every `up` rebuilds the image, so it always reflects the current code and `.env`. The first build takes a minute or two; later ones reuse Docker's cache. If port 3000 is taken, change the left side of `"3000:80"` in `docker-compose.yml`.

## Development setup

For day-to-day work, run Vite's dev server with hot reload:

1. **Node 24** (pinned in `.nvmrc`). With [nvm](https://github.com/nvm-sh/nvm): `nvm install && nvm use`.
2. **pnpm** via Corepack, which installs the exact version pinned in `package.json`. pnpm 12 needs Corepack 0.36+:
   ```bash
   npm install -g corepack@latest
   ```
   ```bash
   corepack enable
   ```
3. **`.env`** as described in [Set up environment variables](#1-set-up-environment-variables). `ENABLE_MOCK_DATA=true` is recommended while developing.
4. Install and run:
   ```bash
   pnpm install
   ```
   ```bash
   pnpm dev
   ```
   Open http://localhost:3000. The dev server proxies `/api/*` with your keys, like nginx does in Docker.

Notes:

- `ENABLE_MOCK_DATA` is read at startup; restart `pnpm dev` after changing it.
- With live data, `pnpm dev` sends each request twice: React's StrictMode remounts components in development only. Production builds don't, but mock mode saves quota while you work.
- pnpm 12 rejects packages published less than 24 hours ago (supply-chain protection). If an install fails with `ERR_PNPM_MINIMUM_RELEASE_AGE_VIOLATION`, pin the previous version instead of adding an exclusion.

### Scripts

| Script               | Purpose                                                                              |
| -------------------- | ------------------------------------------------------------------------------------ |
| `pnpm dev`           | Dev server with hot reload on :3000                                                  |
| `pnpm build`         | Type-check and production build                                                      |
| `pnpm test`          | Run all tests once                                                                   |
| `pnpm test:watch`    | Tests in watch mode                                                                  |
| `pnpm test:coverage` | Tests with a coverage report in `coverage/`                                          |
| `pnpm typecheck`     | Type-check only                                                                      |
| `pnpm lint`          | Lint with oxlint                                                                     |
| `pnpm format`        | Format with Prettier                                                                 |
| `pnpm mock:capture`  | Refresh the mock data from the live APIs (needs a live-data `pnpm dev`; 14 requests) |

## Project structure

```
├── Dockerfile · docker-compose.yml   # Two-stage image: build with Node, serve with nginx
├── nginx/default.conf.template       # Static hosting, API proxy with keys and rate limit
├── scripts/                          # capture-mock-snapshot.ts (pnpm mock:capture)
├── public/                           # favicon, touch icon
└── src/
    ├── types/          # Domain types, one concept per file: Article, ArticleQuery, Category, …
    ├── services/news/  # Data layer, framework-agnostic; the only code that knows about providers
    │   ├── api/        #   One folder per provider: raw types, request client, normalizer
    │   └── mock/       #   Fake providers over test fixtures or the captured snapshot
    ├── queries/        # TanStack Query: cache policy and the infinite feed hook
    ├── features/       # Domain UI: articles, filters, preferences, sources
    ├── components/     # Generic UI: buttons, chips, autocomplete, sheet, toast, …
    ├── layout/ · pages/ · routes.tsx  # Header, the two pages and routing
    ├── styles/         # Design tokens and global styles
    ├── utils/ · hooks/ # Small shared helpers
    └── test/           # Test setup and render helpers
```

## How it works

**Data layer.** Each provider has an adapter (`services/news/api/<provider>/`) that builds requests from our query, fetches raw JSON and normalizes it into one `Article` type. Raw provider types never leave their folder. `articleService` queries the relevant providers in parallel, merges the results, removes duplicates and re-applies the filters some APIs don't support (NewsAPI headlines ignore dates; no API filters by author). Adding or removing a provider only touches `services/news` and the proxy routes.

**Failures.** If one provider fails (outage, quota), the others still return results and a notice explains what's missing. The request only fails when every provider failed, and it retries once for network or 5xx errors only: retrying a 401 or 429 would just spend more quota.

**State.**

| State                                 | Where                                                      | Lifetime                         |
| ------------------------------------- | ---------------------------------------------------------- | -------------------------------- |
| Keyword and filters                   | URL, e.g. `/?q=climate&date=week&cat=science&src=guardian` | Shareable; Back steps through it |
| Followed sources, categories, authors | `localStorage`, validated on read and synced across tabs   | Saved on the device              |
| Dismissed failure notices             | `sessionStorage`                                           | Until the tab closes             |
| Articles                              | TanStack Query cache                                       | Fresh for 2 min, dropped after 5 |

All filters and preferences combine with AND. URL and storage values are treated as untrusted input: invalid values are dropped, never thrown on.

**Infinite feed.** A sentinel 800px before the end of the list requests the next page from every provider that still has results. New pages are appended, so nothing already on screen moves.

**API keys and the proxy.** The browser only talks to `/api/*`. The Vite dev server (`vite.config.ts`) and nginx (`nginx/default.conf.template`) add the keys. nginx also rate-limits each client to 1 request/second with bursts of 20 and rejects anything but GET, so the proxy can't be used to drain the quotas.

**Mock mode.** `ENABLE_MOCK_DATA=true` swaps only the HTTP layer for in-memory fake providers that understand the same query parameters as the real APIs, so the clients, normalizers and service run unchanged. `pnpm dev` and Docker serve a snapshot of real stories captured with `pnpm mock:capture`, re-dated so the newest story is always "now". Tests use small hand-made fixtures instead, so their expectations stay stable. Mock code is loaded on demand and never downloaded in a live-data build.

## Testing

[Vitest](https://vitest.dev) (Jest-compatible) with [Testing Library](https://testing-library.com) and jsdom. Run `pnpm test`.

- **Unit tests:** normalizers, the article service, URL and storage parsing, formatting.
- **Component tests:** the follow menu, filter drafts and Apply, search, the author autocomplete, the retry cool-down, infinite scroll.
- **Integration tests** (`src/App.test.tsx`): the whole app through the real data layer on the mock providers, covering search, filters, coverage hints, undo, history, following authors and persistence.

## Known limitations

- **Free API plans.** NewsAPI allows 100 requests a day, is licensed for development only, returns at most 100 results per query and has no politics or world categories. NYT allows 5 requests a minute and 500 a day.
- **Author suggestions** come from stories the app has already loaded; no provider offers a list of authors.
- **The rate limit is per client IP.** Behind Docker Desktop or another proxy, all visitors can share one IP and therefore one allowance.
