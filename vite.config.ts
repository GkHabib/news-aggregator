import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

const withApiKey = (path: string, key = "") =>
  `${path}${path.includes("?") ? "&" : "?"}api-key=${encodeURIComponent(key)}`;

export default defineConfig(({ mode }) => {
  // Keys stay server-side: the proxy adds them, the browser bundle never sees them.
  // Mirrors nginx/default.conf.template used in Docker.
  const env = loadEnv(mode, process.cwd(), "API_KEY_");

  return {
    plugins: [react()],
    // Expose only this non-secret flag to client code (besides Vite's default VITE_*).
    envPrefix: ["VITE_", "ENABLE_MOCK_DATA"],
    resolve: {
      alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
    },
    server: {
      host: true,
      port: 3000,
      strictPort: true,
      proxy: {
        "/api/newsapi": {
          target: "https://newsapi.org",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/newsapi/, "/v2"),
          headers: { "X-Api-Key": env.API_KEY_NEWSAPI ?? "" },
        },
        "/api/guardian": {
          target: "https://content.guardianapis.com",
          changeOrigin: true,
          rewrite: (path) => withApiKey(path.replace(/^\/api\/guardian/, ""), env.API_KEY_GUARDIAN),
        },
        "/api/nytimes": {
          target: "https://api.nytimes.com",
          changeOrigin: true,
          rewrite: (path) =>
            withApiKey(path.replace(/^\/api\/nytimes/, "/svc/search/v2"), env.API_KEY_NYTIMES),
        },
      },
    },
    preview: { port: 3000, strictPort: true },
  };
});
