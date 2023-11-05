import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
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
        remarkToc as any,
        {
          maxDepth: 2,
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
});
