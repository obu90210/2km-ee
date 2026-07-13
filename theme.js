// Applies the saved theme before first paint. Loaded blocking in <head> (same-origin, CSP-safe).
(function () {
  try {
    var t = localStorage.getItem('theme');
    if (t === 'dark' || t === 'light') document.documentElement.dataset.theme = t;
  } catch (e) { /* storage unavailable — media query default applies */ }
})();
