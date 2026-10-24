// Applies the saved choice or the light default before first paint (same-origin, CSP-safe).
(function () {
  var theme = 'light';
  try {
    var t = localStorage.getItem('theme');
    if (t === 'dark' || t === 'light') theme = t;
  } catch (e) { /* storage unavailable — light default applies */ }
  document.documentElement.dataset.theme = theme;
})();
