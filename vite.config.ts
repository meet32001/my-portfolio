import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  server: {
    host: true,
    proxy: { "/api": { target: "http://localhost:5050", changeOrigin: true } },
    hmr: { overlay: false }, // optional: no red error overlay
  },
  optimizeDeps: {
    // pre-bundle big deps once; keeps reloads fast
    include: [
      "react", "react-dom",
      "lucide-react",
      "recharts",
      "@radix-ui/react-tooltip",
      "@radix-ui/react-dialog",
      "@radix-ui/react-popover",
      "@radix-ui/react-dropdown-menu"
    ],
    entries: ["src/main.tsx"],
  },
  esbuild: {
    target: "es2020",
    legalComments: "none",
  },
  build: {
    sourcemap: false,           // faster cold builds
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          charts: ["recharts"],
          icons: ["lucide-react"],
          ui: [
            "@radix-ui/react-tooltip",
            "@radix-ui/react-dialog",
            "@radix-ui/react-popover",
            "@radix-ui/react-dropdown-menu",
          ],
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
});