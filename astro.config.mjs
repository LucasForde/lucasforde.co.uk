import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://lucasforde.co.uk",
  devToolbar: {
    enabled: false,
  },
  vite: {
    build: {
      cssMinify: false,
    },
  },
});
