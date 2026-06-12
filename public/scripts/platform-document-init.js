(function () {
  // Last matching value wins (same as readPlatformPreferenceCookie) — avoids stale host-only cookies.
  function readCookie(name) {
    var prefix = name + "=";
    var parts = document.cookie.split(";");
    var last = null;
    for (var i = 0; i < parts.length; i++) {
      var trimmed = parts[i].trim();
      if (trimmed.indexOf(prefix) === 0) {
        last = decodeURIComponent(trimmed.slice(prefix.length));
      }
    }
    return last;
  }

  function writeLocalStorage(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {}
  }

  function isLangCode(value) {
    return typeof value === "string" && /^[a-z]{2}$/.test(value);
  }

  var platformLangs = { en: 1, es: 1, pt: 1, ar: 1 };

  function resolvePlatformLang(value) {
    return value && platformLangs[value] ? value : null;
  }

  // Language — shared cookie is source of truth across subdomains.
  try {
    var lang = null;
    var langCookie = resolvePlatformLang(readCookie("klab-language"));
    if (langCookie) lang = langCookie;
    if (!lang) {
      var langStored = resolvePlatformLang(localStorage.getItem("klab-language"));
      if (langStored) lang = langStored;
    }
    if (!lang) {
      var nav = (navigator.language || "en").slice(0, 2).toLowerCase();
      lang = resolvePlatformLang(nav) || "en";
    }
    var rtlLangs = { ar: 1, he: 1, fa: 1, ur: 1 };
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir", rtlLangs[lang] ? "rtl" : "ltr");
    writeLocalStorage("klab-language", lang);
  } catch (e) {}

  // Theme — shared cookie first, then localStorage; auth pages stay light.
  try {
    var root = document.documentElement;
    var path = window.location.pathname || "";
    var isAuthPage =
      path === "/login" ||
      path === "/forgot-password" ||
      path === "/reset-password";

    if (isAuthPage) {
      root.classList.remove("dark");
    } else {
      var theme = readCookie("k-lab-components-theme");
      if (theme !== "light" && theme !== "dark" && theme !== "system") {
        theme = localStorage.getItem("k-lab-components-theme") || "system";
      }
      if (theme === "dark") {
        root.classList.add("dark");
      } else if (theme === "light") {
        root.classList.remove("dark");
      } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
      writeLocalStorage("k-lab-components-theme", theme);
    }
  } catch (e2) {}

  // Sidebar — SSR reads the same cookie; data attribute helps any CSS hooks.
  try {
    var collapsed = readCookie("k-lab-sidebar-collapsed");
    if (collapsed === "true" || collapsed === "false") {
      document.documentElement.setAttribute("data-sidebar-collapsed", collapsed);
    }
  } catch (e3) {}
})();
