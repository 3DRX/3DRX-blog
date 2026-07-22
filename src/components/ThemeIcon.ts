import { setPreference, togglePreference, getColorPreference } from "../utils";

function init() {
  document.querySelectorAll("input.theme-toggle").forEach((el) => {
    const button = el as HTMLInputElement;
    button.checked = getColorPreference() === "dark";
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
