import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import remarkAsides from "./src/plugins/remark-asides";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import { SITE } from "./src/config";

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
    sitemap(),
    mdx(),
  ],
  markdown: {
    remarkPlugins: [
      [
        remarkToc,
        {
          maxDepth: 2,
          skip: "^$",
          heading: "(table[ -]of[ -])?contents?|toc|目录",
        },
      ],
      [
        remarkCollapse,
        {
          test: "(table[ -]of[ -])?contents?|toc|目录",
          summary: (s: string) => "打开" + s,
        },
      ],
      ...remarkAsides({}),
    ],
    shikiConfig: {
      theme: "material-theme-palenight",
      wrap: true,
    },
  },
  vite: {
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
  scopedStyleStrategy: "where",
  prefetch: true,
});
