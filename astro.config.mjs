import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

// Get base path from environment variable
// For GitHub Pages: if repo is username.github.io, use "" (root)
// Otherwise use /repo-name
// Can be set via BASE_PATH env var or defaults to empty (root)
const base = process.env.BASE_PATH || "";

export default defineConfig({
  integrations: [react(), tailwind()],
  base: base,
  output: "static",
});
