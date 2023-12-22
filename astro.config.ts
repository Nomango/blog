import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import remarkDirective from "remark-directive";
import remarkAsides from "./src/plugins/remark-asides";
import remarkDirectiveCollapse from "./src/plugins/remark-directive-collapse";
import remarkDirectivToc from "./src/plugins/remark-directive-toc";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import astroExpressiveCode from "astro-expressive-code";
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
    astroExpressiveCode({
      themes: ["github-light", "material-theme-palenight"],
      themeCssSelector: theme => {
        return `[data-theme='${theme.name === "github-light" ? "light" : "dark"}']`;
      },
    }),
    mdx(),
  ],
  markdown: {
    remarkPlugins: [
      remarkDirective,
      remarkAsides({}),
      remarkDirectiveCollapse({ label: "展开" }),
      remarkDirectivToc({
        maxDepth: 2,
        skip: "^$",
        label: "目录",
      }),
    ],
    shikiConfig: {
      theme: "css-variables",
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
