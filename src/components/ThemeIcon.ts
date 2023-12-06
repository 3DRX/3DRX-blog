import { THEME_STORAGE_KEY } from "../consts";

function getColorPreference() {
  let preference = localStorage.getItem(THEME_STORAGE_KEY);
  if (!preference) {
    preference = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return preference;
}

function setPreference(themeName: string) {
  localStorage.setItem(THEME_STORAGE_KEY, themeName);
  if (document.firstElementChild) {
    document.firstElementChild.setAttribute("data-theme", themeName);
  }
}

function togglePreference() {
  setPreference(getColorPreference() === "dark" ? "light" : "dark");
}

function init() {
  document.querySelectorAll("input.theme-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      togglePreference();
    });
  });
  setPreference(getColorPreference());
}

init();

document.addEventListener("astro:after-swap", init);
