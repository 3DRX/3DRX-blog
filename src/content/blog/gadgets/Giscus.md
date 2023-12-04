---
title: "Giscus: github based comment section"
description: "How I set up comment section based on github discussions"
pubDate: "06/24/2023"
updatedDate: "06/24/2023"
heroImage: "https://source.unsplash.com/xv7-GlvBLFw"
---

Since I started this blog, I've always wanted to add a nice comment section to it.
However, I don't want to use any BAAS service, or self-host anything either.
I just wanted to make my blog simple: no database and "no server",
keep all content data at GitHub, and deploy using Vercel.

Fortunately, I found https://giscus.app, which is a discussion system
based on GitHub discussions. This meets my need.

To add it to my blog, all I need to do is add following tag
by the end of blog-post page.

```html
<script
  src="https://giscus.app/client.js"
  data-repo="3DRX/3DRX-blog"
  data-repo-id="R_kgDOJvPgqQ"
  data-category="Announcements"
  data-category-id="DIC_kwDOJvPgqc4CXcFb"
  data-mapping="url"
  data-strict="0"
  data-reactions-enabled="1"
  data-emit-metadata="1"
  data-input-position="top"
  data-theme="preferred_color_scheme"
  data-lang="en"
  data-loading="lazy"
  crossorigin="anonymous"
  async
></script>
```
