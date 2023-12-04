import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://www.3drx.top/",
  integrations: [mdx(), sitemap()],
  markdown: {
    remarkPlugins: ["remark-math"],
    rehypePlugins: [
      [
        "rehype-katex",
        {
          // Katex plugin options
          strict: false,
        },
      ],
    ],
  },
});
