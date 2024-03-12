import path from "path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
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
    sourcemap: true,
  },
  server: {
    port: 1234,
    host: "0.0.0.0",
  },
  define: {
    "process.env": {
      ENV: "Browser",
      PYRA_APP_ID: "8fb3e03f-05d6-4a27-9960-9d113ffb1246",
      PYRA_POST_MODEL_ID:
        "kjzl6hvfrbw6c5cjz4boft9bthoj452w31ocf7wm0vrwsnz6fv2wg90bt1zsham",
    },
  },
});
