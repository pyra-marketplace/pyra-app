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
      CHAIN_ID: 84532,
      PYRA_APP_ID: "dac72c7d-a5b5-41ca-832c-8f5d3b40ed48",
      PYRA_POST_MODEL_ID:
        "kjzl6hvfrbw6capno86lza74nlcxk43o4pyv9q3dj3llle8atzzbg4rgr3hjts2",
    },
  },
});
