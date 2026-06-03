(function () {
  try {
    var root = document.documentElement;
    var path = window.location.pathname || "";
    var isAuthPage =
      path === "/login" || path === "/forgot-password" || path === "/reset-password";

    // Auth pages always start in light theme to avoid a dark flash.
    if (isAuthPage) {
      root.classList.remove("dark");
      return;
    }

    var theme = localStorage.getItem("k-lab-components-theme") || "system";
    if (theme === "dark") {
      root.classList.add("dark");
    } else if (theme === "light") {
      root.classList.remove("dark");
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      root.classList.add("dark");
    }
  } catch {}
})();
