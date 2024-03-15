import path from "path";

import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import { PluginOption, defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), visualizer() as PluginOption],
  resolve: {
    dedupe: ["react", "react-dom"],
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // buffer: "rollup-plugin-node-polyfills/polyfills/buffer-es6", // add buffer
    },
  },
  // esbuild: {
  //   jsxFactory: "jsx",
  //   jsxInject: `import React from 'react'`,
  // },
  build: {
    target: "es2020",
    // sourcemap: true,
  },
  server: {
    port: 1234,
    host: "0.0.0.0",
  },
  define: {
    "process.env": {
      ENV: "Browser",
      CHAIN_ID: 80001,
      PYRA_APP_ID: "e104c799-3cb6-4f4d-ba8a-16649cd9701a",
      PYRA_POST_MODEL_ID:
        "kjzl6hvfrbw6c8nivefcu4rozay0y3rzm8pomdsxl4abfc3n1rokft2m04flbd4",
    },
  },
});
