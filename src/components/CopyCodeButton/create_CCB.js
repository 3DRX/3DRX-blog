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
