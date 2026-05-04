// @ts-check

import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  i18n: {
    defaultLocale: "es",
    locales: ["es", "en", "br"],
    routing: {
      prefixDefaultLocale: false,
    },
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