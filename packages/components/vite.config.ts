import { fileURLToPath, URL } from "url";

import { defineConfig } from "vite";
import Vue from "@vitejs/plugin-vue";
import VueJsx from "@vitejs/plugin-vue-jsx";
import Icons from "unplugin-icons/vite";
import Dts from "vite-plugin-dts";
import path from "path";

export default defineConfig({
  plugins: [
    Vue(),
    VueJsx(),
    Icons(),
    Dts({
      entryRoot: "./src",
      outputDir: "./dist-typings",
      insertTypesEntry: true,
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    outDir: path.resolve(__dirname, "dist"),
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "HaloComponents",
      formats: ["es", "cjs", "umd", "iife"],
      fileName: (format) => `halo-components.${format}.js`,
    },
    rollupOptions: {
      external: ["vue", "vue-router"],
      output: {
        globals: {
          vue: "Vue",
          "vue-router": "VueRouter",
        },
        exports: "named",
      },
    },
    sourcemap: true,
  },
});
