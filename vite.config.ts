import { defineConfig } from "vite";

export default defineConfig({
  build: {
    copyPublicDir: false,
    lib: {
      entry: "./lib/main.ts",
      fileName: "plugin",
      formats: ["es"],
    },
    rollupOptions: {
      external: ["vite", "node:path"],
    },
  },
});
