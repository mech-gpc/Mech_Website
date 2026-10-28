(function () {
  var KEY = "site-theme", root = document.documentElement;
  function saved() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function apply(t) {
    if (t === "dark") root.setAttribute("data-theme", "dark"); else root.removeAttribute("data-theme");
    var m = document.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute("content", t === "dark" ? "#0b141d" : "#172C3F");
  }
  apply(saved());
  document.addEventListener("DOMContentLoaded", function () {
    var host = document.querySelector(".site-header-tools");
    if (!host) return;
    var b = document.createElement("button");
    b.type = "button"; b.className = "theme-switch notranslate"; b.setAttribute("translate", "no");
    b.setAttribute("role", "switch");
    b.innerHTML = '<span class="theme-knob"><span class="material-symbols-outlined theme-sun" aria-hidden="true">light_mode</span><span class="material-symbols-outlined theme-moon" aria-hidden="true">dark_mode</span></span>';
    function sync() {
      var d = root.getAttribute("data-theme") === "dark";
      b.setAttribute("aria-checked", d ? "true" : "false");
      b.setAttribute("aria-label", d ? "Switch to light mode" : "Switch to dark mode");
      b.title = b.getAttribute("aria-label");
    }
    b.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      apply(next);
      try { localStorage.setItem(KEY, next); } catch (e) {}
      sync();
    });
    sync();
    host.appendChild(b);
  });
})();
