import rss from "@astrojs/rss";
import sanitizeHtml from "sanitize-html";
import { SITE_DESCRIPTION, SITE_TITLE } from "../consts";

export async function GET(context) {
  const postImportResult = import.meta.glob("../content/blog/**/*.md", {
    eager: true,
  });
  const posts = Object.values(postImportResult);
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: posts
      .map((post) => ({
        link: post.url,
        content: sanitizeHtml(post.compiledContent()),
        ...post.frontmatter,
      })),
  });
}
