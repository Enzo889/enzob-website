// @ts-check

import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";


// https://astro.build/config
export default defineConfig({
  site: "https://enzobustamante.pages.dev",
  trailingSlash: "always",
  i18n: {
    defaultLocale: "es",
    locales: ["es", "en", "br"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  build: {
    format: 'directory',
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [mdx({
    syntaxHighlight: 'shiki',
    shikiConfig: { theme: 'horizon' },
    remarkRehype: { footnoteLabel: 'Footnotes' },
    gfm: false,
  })],
});