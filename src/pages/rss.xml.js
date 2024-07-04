import rss from "@astrojs/rss";
import sanitizeHtml from "sanitize-html";
import { marked } from "marked";
import { getCollection } from "astro:content";
import { SITE_DESCRIPTION, SITE_TITLE } from "../consts";

export async function GET(context) {
  const posts = (await getCollection("blog")).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: posts.map((post) => ({
      link: `/blog/${post.slug}`,
      content: sanitizeHtml(
        marked.parse(
          `
<blockquote>
  <p>The document may have style rendering errors and images that cannot be displayed. To view the complete article, please click on "Read Original".</p>
</blockquote>
<br />
` + post.body,
        ),
      ),
      ...post.data,
    })),
  });
}
