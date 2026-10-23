// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { VitePWA } from "vite-plugin-pwa";

// Bump to invalidate the offline UI cache on the next release.
const CACHE_VERSION = "v2";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    plugins: [
      VitePWA({
        registerType: "prompt",
        injectRegister: null,
        manifest: false,
        filename: "sw.js",
        outDir: "dist/client",
        devOptions: { enabled: false },
        workbox: {
          globDirectory: "dist/client",
          cacheId: `frame-${CACHE_VERSION}`,
          globPatterns: ["**/*.{js,css,woff2,png,svg,ico,webmanifest}"],
           additionalManifestEntries: [
             { url: "/", revision: `${CACHE_VERSION}-${Date.now()}` },
             { url: "/__l5e/assets-v1/d12304db-361f-43d8-a59c-b59c3483eb3c/vimo-symbol.svg", revision: "d12304db-361f-43d8-a59c-b59c3483eb3c" },
           ],
          cleanupOutdatedCaches: true,
          navigateFallback: null,
          runtimeCaching: [
            {
              urlPattern: ({ request, url }) =>
                request.mode === "navigate" && !url.pathname.startsWith("/~oauth"),
              handler: "NetworkFirst",
              options: {
                cacheName: `frame-pages-${CACHE_VERSION}`,
                networkTimeoutSeconds: 4,
                expiration: { maxEntries: 30 },
                precacheFallback: { fallbackURL: "/" },
              },
            },
            {
              urlPattern: ({ url }) => url.origin === "https://image.tmdb.org",
              handler: "CacheFirst",
              options: {
                cacheName: `frame-imagens-${CACHE_VERSION}`,
                expiration: { maxEntries: 40, maxAgeSeconds: 60 * 60 * 24 * 30, purgeOnQuotaError: true },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
            {
              urlPattern: ({ url }) =>
                url.origin === "https://fonts.googleapis.com" || url.origin === "https://fonts.gstatic.com",
              handler: "StaleWhileRevalidate",
              options: { cacheName: `frame-fontes-${CACHE_VERSION}`, expiration: { maxEntries: 10 } },
            },
          ],
        },
      }),
    ],
  },
});
