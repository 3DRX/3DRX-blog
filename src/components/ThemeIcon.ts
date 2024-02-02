import { setPreference, togglePreference, getColorPreference } from "../utils";

function init() {
  document.querySelectorAll("input.theme-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      togglePreference();
      const event = new CustomEvent("theme:change");
      document.dispatchEvent(event);
    });
  });
  setPreference(getColorPreference());
}

init();

document.addEventListener("astro:after-swap", init);
