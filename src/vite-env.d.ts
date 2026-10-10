/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Exposed to the client via `envPrefix` in vite.config.ts. */
  readonly ENABLE_MOCK_DATA?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
