---
title: "Copy code button using vanilla js"
description: "adding copy code button to my blog"
pubDate: "06/24/2023"
updatedDate: "06/24/2023"
heroImage: "https://source.unsplash.com/vpOeXr5wmR4"
---

This blog is build on top of the Astro.js blog template,
which is great. But it doesn't provide a copy code button
for every code block by default.
So I'm adding it by myself.

## Crafting the button

I found [this repo](https://github.com/littlesticks/astro-examples/tree/main/copy-code-button/src/CopyCodeButton)
containing the perfect copy code button I want, so I used this code.
The author also have a YouTube video explaining the code,
please check it out.

<iframe width="560" height="315" src="https://www.youtube.com/embed/_0eBQREJTDo" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
<style>
iframe {
    max-width: 65ch;
    height: 36.5ch;
    width: 90vw;
}
</style>

However, the layout approach the above component offered is not optimal,
when the code block scrolls horizontally, the button scrolls with it too.

Down below is my workaround to the problem.

## Changing layout

By analyzing the HTML generated by Astro,
I found that all code block is a `pre` object.
And the "copy" button should be a div that floats
in the top right corner of the `pre`.

My approach using vanilla js and css:

```js
let blocks = document.querySelectorAll("pre");

blocks.forEach((block) => {
  // replace every pre with a div containing a pre and a copy-code-button
  let div = document.createElement("div");
  div.classList.add("code-block-wrapper");
  let button = document.createElement("copy-code-button");
  div.appendChild(button);
  div.appendChild(block.cloneNode(true));
  block.replaceWith(div);
});
```

```css
.code-block-wrapper {
  position: relative;
}
pre {
  padding: 1rem;
  border-radius: 12px;
  padding: 1rem;
  border-radius: 0.5rem;
  position: relative;
}
pre > code {
  all: unset;
  overflow: auto;
}
.code-block-wrapper > copy-code-button {
  z-index: 99;
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  overflow: hidden;
  visibility: hidden;
}
.code-block-wrapper:hover > copy-code-button {
  visibility: visible;
}
```
