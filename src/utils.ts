import { THEME_STORAGE_KEY } from "./consts";

export function setPreference(themeName: string) {
  localStorage.setItem(THEME_STORAGE_KEY, themeName);
  if (document.firstElementChild) {
    document.firstElementChild.setAttribute("data-theme", themeName);
  }
}

export function togglePreference() {
  setPreference(getColorPreference() === "dark" ? "light" : "dark");
}

export function getColorPreference() {
  let preference = localStorage.getItem(THEME_STORAGE_KEY);
  if (!preference) {
    preference = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return preference;
}

type Message = {
  setConfig: {
    theme: string;
  };
};

function sendMessage(message: Message) {
  const iframe = document.querySelector("iframe.giscus-frame");
  if (!iframe) {
    console.log(`no iframe to set`);
    return;
  }
  iframe.contentWindow.postMessage({ giscus: message }, "https://giscus.app");
}

export function setGiscusTheme(pref: string) {
  if (pref !== "dark" && pref !== "light") {
    return;
  } else {
    sendMessage({
      setConfig: {
        theme: pref,
      },
    });
  }
}

export function toggleGiscusTheme() {
  sendMessage({
    setConfig: {
      theme: getColorPreference(),
    },
  });
}
