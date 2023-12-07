import {
  setPreference,
  togglePreference,
  getColorPreference,
  toggleGiscusTheme,
} from "../utils";

function init() {
  document.querySelectorAll("input.theme-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      togglePreference();
      toggleGiscusTheme();
    });
  });
  setPreference(getColorPreference());
}

init();

document.addEventListener("astro:after-swap", init);
