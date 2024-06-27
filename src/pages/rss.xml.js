import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context) {
  const posts = await getCollection("blog");
  return rss({
    title: "3DRX’s Blog",
    description: "A random dude on the internet",
    site: context.site,
    items: posts
      .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
      .map((post) => {
        return {
          title: post.data.title,
          description: post.data.description,
          pubDate: post.data.pubDate,
          link: `/blog/${post.slug}`,
          content: post.body,
        };
      }),
  });
}
