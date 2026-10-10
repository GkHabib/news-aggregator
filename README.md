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

## Scripts

| Script           | Purpose                       |
| ---------------- | ----------------------------- |
| `pnpm dev`       | Dev server on :3000           |
| `pnpm build`     | Type-check + production build |
| `pnpm lint`      | Lint with oxlint              |
| `pnpm format`    | Format with Prettier          |
| `pnpm typecheck` | Type-check only               |
