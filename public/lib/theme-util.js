const storageKey = "theme-preference";

const getColorPreference = () => {
  let preference = localStorage.getItem(storageKey);

  if (!preference) {
    preference = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  return preference;
};

const setPreference = (themeName) => {
  localStorage.setItem(storageKey, themeName);

  document.firstElementChild.setAttribute("data-theme", themeName);
};

const togglePreference = () => {
  setPreference(getColorPreference() === "dark" ? "light" : "dark");
};

(() => {
  const theme = getColorPreference();

  setPreference(theme);
})();
