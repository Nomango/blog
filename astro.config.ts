import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import remarkDirective from "remark-directive";
import rehypeExternalLinks from "rehype-external-links";
import remarkAsides from "./src/plugins/remark-asides";
import remarkDirectiveCollapse from "./src/plugins/remark-directive-collapse";
import remarkDirectivToc from "./src/plugins/remark-directive-toc";
import remarkDirectiveButton from "./src/plugins/remark-directive-button";
import remarkDirectiveHTML from "./src/plugins/remark-directive-html";
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
      remarkDirectiveButton,
      remarkDirectiveHTML,
    ],
    rehypePlugins: [[rehypeExternalLinks, { target: "_blank", rel: ["nofollow"] }]],
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
