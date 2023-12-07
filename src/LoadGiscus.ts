import { getColorPreference } from "./utils";

const giscusAttributes = {
  src: "https://giscus.app/client.js",
  "data-repo": "3DRX/3DRX-blog",
  "data-repo-id": "R_kgDOJvPgqQ",
  "data-category": "Announcements",
  "data-category-id": "DIC_kwDOJvPgqc4CXcFb",
  "data-mapping": "url",
  "data-strict": "0",
  "data-reactions-enabled": "1",
  "data-emit-metadata": "1",
  "data-input-position": "top",
  "data-theme": getColorPreference(),
  "data-lang": "en",
  "data-loading": "lazy",
  crossorigin: "anonymous",
  async: "",
};
const giscusScript = document.createElement("script");
Object.entries(giscusAttributes).forEach(([key, value]) =>
  giscusScript.setAttribute(key, value),
);
document.body.appendChild(giscusScript);
