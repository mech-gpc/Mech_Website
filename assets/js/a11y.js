/* Accessibility options: colour-vision modes, high contrast, underlined links, reduced motion.
   Choices are remembered on this device. Screen-reader and Braille-display users get the normal page
   structure (skip link, landmarks, headings, labelled controls); this panel adds visual options only. */
(function () {
  var KEY = "site-a11y", root = document.documentElement;
  var DEF = { cb: "none", hc: false, ul: false, rm: false };
  var st = (function () { try { return Object.assign({}, DEF, JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) { return Object.assign({}, DEF); } })();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} }
  function apply() {
    if (st.cb !== "none") root.setAttribute("data-cb", st.cb); else root.removeAttribute("data-cb");
    ["hc", "ul", "rm"].forEach(function (k) { if (st[k]) root.setAttribute("data-" + k, ""); else root.removeAttribute("data-" + k); });
  }
  apply();

  var MODES = [
    ["none", "Normal colours", ""],
    ["deut", "Green-weak (deuteranopia)", "Helps tell reds and greens apart"],
    ["prot", "Red-weak (protanopia)", "Helps tell reds and greens apart"],
    ["trit", "Blue-weak (tritanopia)", "Helps tell blues and yellows apart"]
  ];
  var MAT = { prot: "1.0000 0.0000 0.0000 0 0 0.4789 0.4769 0.0442 0 0 0.5973 -0.6887 1.0914 0 0 0 0 0 1 0", deut: "1.0000 0.0000 0.0000 0 0 0.1628 0.7250 0.1122 0 0 0.4547 -0.6454 1.1907 0 0 0 0 0 1 0", trit: "0.7412 -0.4072 0.6660 0 0 0.0751 0.5852 0.3397 0 0 0.0000 0.0000 1.0000 0 0 0 0 0 1 0" };

  function addFilters() {
    var ns = "http://www.w3.org/2000/svg", svg = document.createElementNS(ns, "svg");
    svg.setAttribute("width", "0"); svg.setAttribute("height", "0"); svg.setAttribute("aria-hidden", "true"); svg.style.cssText = "position:absolute;width:0;height:0";
    svg.innerHTML = Object.keys(MAT).map(function (k) {
      return '<filter id="cb-' + k + '" color-interpolation-filters="linearRGB"><feColorMatrix type="matrix" values="' + MAT[k] + '"/></filter>';
    }).join("");
    document.body.appendChild(svg);
  }

  document.addEventListener("DOMContentLoaded", function () {
    var host = document.querySelector(".site-header-tools"); if (!host) return;
    addFilters();
    var btn = document.createElement("button");
    btn.type = "button"; btn.className = "a11y-btn notranslate"; btn.setAttribute("translate", "no");
    btn.setAttribute("aria-label", "Accessibility options"); btn.setAttribute("aria-haspopup", "dialog"); btn.setAttribute("aria-expanded", "false"); btn.setAttribute("aria-controls", "a11y-panel");
    btn.title = "Accessibility options";
    btn.innerHTML = '<span class="material-symbols-outlined" aria-hidden="true">accessibility_new</span>';
    var sw = host.querySelector(".theme-switch"); host.insertBefore(btn, sw || null);

    var p = document.createElement("div");
    p.id = "a11y-panel"; p.className = "a11y-panel"; p.hidden = true; p.setAttribute("role", "dialog"); p.setAttribute("aria-labelledby", "a11y-title");
    p.innerHTML = '<div class="a11y-head"><h2 id="a11y-title">Accessibility options</h2><button type="button" class="a11y-close" aria-label="Close accessibility options">&times;</button></div>' +
      '<fieldset><legend>Colour vision</legend>' + MODES.map(function (m) {
        return '<label class="a11y-row"><input type="radio" name="a11y-cb" value="' + m[0] + '"' + (st.cb === m[0] ? " checked" : "") + '><span>' + m[1] + (m[2] ? "<small>" + m[2] + "</small>" : "") + "</span></label>";
      }).join("") + '</fieldset>' +
      '<fieldset><legend>Reading and display</legend>' +
      '<label class="a11y-row"><input type="checkbox" data-k="hc"' + (st.hc ? " checked" : "") + '><span>High contrast<small>Black background, white text, yellow links</small></span></label>' +
      '<label class="a11y-row"><input type="checkbox" data-k="ul"' + (st.ul ? " checked" : "") + '><span>Underline all links<small>So links do not depend on colour</small></span></label>' +
      '<label class="a11y-row"><input type="checkbox" data-k="rm"' + (st.rm ? " checked" : "") + '><span>Stop motion<small>No blinking, animation, auto-playing slides or hover pop-ups</small></span></label></fieldset>' +
      '<p class="a11y-note">This site works with screen readers and refreshable Braille displays: use the &ldquo;Skip to main content&rdquo; link, then move by headings, links and tables.</p>' +
      '<button type="button" class="a11y-reset">Reset all</button><p class="sr-only" role="status" aria-live="polite" id="a11y-live"></p>';
    document.body.appendChild(p);
    var live = p.querySelector("#a11y-live");
    function say(t) { live.textContent = ""; setTimeout(function () { live.textContent = t; }, 50); }
    function open() { p.hidden = false; btn.setAttribute("aria-expanded", "true"); var f = p.querySelector("input:checked") || p.querySelector("input"); f && f.focus(); }
    function close(back) { p.hidden = true; btn.setAttribute("aria-expanded", "false"); if (back) btn.focus(); }
    btn.addEventListener("click", function () { p.hidden ? open() : close(true); });
    p.querySelector(".a11y-close").addEventListener("click", function () { close(true); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !p.hidden) close(true); });
    document.addEventListener("click", function (e) { if (!p.hidden && !p.contains(e.target) && !btn.contains(e.target)) close(false); });
    p.addEventListener("change", function (e) {
      var t = e.target;
      if (t.name === "a11y-cb") { st.cb = t.value; say("Colour mode: " + t.nextSibling.firstChild.textContent); }
      else if (t.getAttribute("data-k")) { st[t.getAttribute("data-k")] = t.checked; say(t.nextSibling.firstChild.textContent + (t.checked ? " on" : " off")); }
      save(); apply();
    });
    p.querySelector(".a11y-reset").addEventListener("click", function () {
      st = Object.assign({}, DEF); save(); apply();
      p.querySelectorAll("input").forEach(function (i) { if (i.type === "radio") i.checked = i.value === "none"; else i.checked = false; });
      say("All accessibility options reset");
    });
  });
})();
