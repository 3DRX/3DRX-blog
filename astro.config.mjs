import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://www.3drx.top/",
  integrations: [sitemap()],
  markdown: {
    remarkPlugins: ["remark-math"],
    rehypePlugins: [["rehype-katex", { strict: false }]],
  },
});
