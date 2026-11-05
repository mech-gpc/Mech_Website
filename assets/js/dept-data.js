/* Helpers for the department data pages (Staff, Laboratories, Faculty training,
   Student projects, Student performance). The data lives in data/*.json. No need to edit. */
(function (w) {
  var esc = function (v) {
    return String(v == null ? "" : v).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  // Sheet-backed lists: column headings = the JSON field names (spaces allowed, e.g. "Academic year").
  // num: numeric fields, bool: yes/no fields, need: columns that must exist.
  var SRC = {
    "data/staff.json": { key: "staff", need: ["name"] },
    "data/training.json": { key: "training", need: ["faculty", "programme"] },
    "data/projects.json": { key: "projects", need: ["title"], num: ["group", "students"], bool: ["report_available"] },
    "data/nptel.json": { parts: {
      courses: { key: "nptelCourses", need: ["faculty", "course"], num: ["weeks", "score_percent"] },
      stars: { key: "nptelStars", need: ["name"] } } }
  };
  var parseCSV = function (text) {
    var rows = [], row = [], f = "", q = false;
    for (var i = 0; i < text.length; i++) {
      var c = text[i];
      if (q) { if (c === '"') { if (text[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; }
      else if (c === '"') q = true;
      else if (c === ",") { row.push(f); f = ""; }
      else if (c === "\n" || c === "\r") { if (c === "\r" && text[i + 1] === "\n") i++; row.push(f); rows.push(row); row = []; f = ""; }
      else f += c;
    }
    if (f || row.length) { row.push(f); rows.push(row); }
    return rows;
  };
  var sheetRows = function (url, cfg) {
    return fetch(url + (url.indexOf("?") > -1 ? "&" : "?") + "_=" + Math.floor(Date.now() / 60000)).then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.text();
    }).then(function (t) {
      if (/^\s*</.test(t)) throw new Error("not CSV");
      var rows = parseCSV(t).filter(function (r) { return r.some(function (c) { return c.trim(); }); });
      var head = rows.shift().map(function (h) { return h.trim().toLowerCase().replace(/[\s\-]+/g, "_"); });
      (cfg.need || []).forEach(function (n) { if (head.indexOf(n) < 0) throw new Error("Sheet is missing column " + n); });
      return rows.map(function (r) {
        var o = {}; head.forEach(function (h, i) { if (h) o[h] = (r[i] || "").trim(); });
        return o;
      }).filter(function (o) {
        return !/^(no|n|hide|false|left)$/i.test(o.show || "") && (cfg.need || []).every(function (n) { return o[n]; });
      }).map(function (o) {
        delete o.show;
        (cfg.num || []).forEach(function (k) { if (k in o) { var v = parseFloat(o[k]); o[k] = isNaN(v) ? 0 : v; } });
        (cfg.bool || []).forEach(function (k) { if (k in o) o[k] = /^(yes|y|true|1)$/i.test(o[k]); });
        return o;
      });
    });
  };
  w.dd = {
    esc: esc,
    // Loads data/*.json. If a Google Sheet CSV is configured for it (window.SHEETS in notices-config.js),
    // the sheet is used instead; the JSON file stays as the automatic fallback.
    load: function (path) {
      var json = function () {
        return fetch(path).then(function (r) {
          if (!r.ok) throw new Error("Could not load " + path + " (" + r.status + ")");
          return r.json();
        });
      };
      var S = w.SHEETS || {}, cfg = SRC[path];
      if (!cfg) return json();
      if (cfg.parts) {                       // object with lists inside (NPTEL)
        var any = Object.keys(cfg.parts).some(function (k) { return S[cfg.parts[k].key]; });
        if (!any) return json();
        return json().then(function (base) {
          return Promise.all(Object.keys(cfg.parts).map(function (k) {
            var part = cfg.parts[k];
            if (!S[part.key]) return null;
            return sheetRows(S[part.key], part).then(function (rows) { if (rows.length) base[k] = rows; }, function () {});
          })).then(function () { return base; });
        });
      }
      if (!S[cfg.key]) return json();
      return sheetRows(S[cfg.key], cfg).then(function (rows) { if (!rows.length) throw 0; return rows; }).catch(json);
    },
    // Shown in place of the data when it cannot load (most often: page opened by double-click)
    fail: function (el, e) {
      el.innerHTML = '<div class="p-space-lg rounded-xl bg-surface-container-low text-on-surface-variant">' +
        "<strong class=\"text-on-surface\">The data could not be loaded.</strong> " +
        (location.protocol === "file:" ? "Browsers block data files when a page is opened by double-click. It works on the published website, or preview with <code>python3 -m http.server</code>."
          : esc(e && e.message)) + "</div>";
    },
    count: function (rows, field) {
      var o = {}; rows.forEach(function (r) { o[r[field]] = (o[r[field]] || 0) + 1; }); return o;
    },
    // items: [[value, label], ...]
    stats: function (el, items) {
      el.innerHTML = items.map(function (i) {
        return '<div class="bg-surface-container-lowest/10 backdrop-blur-md rounded-xl p-space-md">' +
          '<span class="block font-display text-stat-number-mobile md:text-stat-number text-on-primary">' + esc(i[0]) + "</span>" +
          '<span class="block text-caption uppercase text-on-primary-container">' + esc(i[1]) + "</span></div>";
      }).join("");
    },
    // cols: [["Heading", "field" | function(row)], ...]
    table: function (el, cols, rows) {
      var cell = function (c, r) { return typeof c[1] === "function" ? c[1](r) : esc(r[c[1]]); };
      el.innerHTML = '<table class="dd-table"><thead><tr>' +
        cols.map(function (c) { return '<th scope="col">' + esc(c[0]) + "</th>"; }).join("") + "</tr></thead><tbody>" +
        rows.map(function (r) { return "<tr>" + cols.map(function (c) { return "<td>" + cell(c, r) + "</td>"; }).join("") + "</tr>"; }).join("") +
        "</tbody></table>";
    },
    // Search box + optional filter chips over any set of items (table rows or cards)
    filter: function (opts) {
      var q = "", f = "All", chips = opts.chips, items = function () { return opts.root.querySelectorAll(opts.itemSelector); };
      var apply = function () {
        var shown = 0;
        items().forEach(function (it) {
          var ok = (!q || it.textContent.toLowerCase().indexOf(q) > -1) && (f === "All" || it.getAttribute("data-group") === f);
          it.style.display = ok ? "" : "none"; if (ok) shown++;
        });
        if (opts.counter) opts.counter.textContent = shown + " shown";
      };
      if (opts.input) opts.input.addEventListener("input", function () { q = opts.input.value.trim().toLowerCase(); apply(); });
      if (chips && opts.groups) {
        chips.innerHTML = ["All"].concat(opts.groups).map(function (g, i) {
          return '<button type="button" data-chip="' + esc(g) + '" class="dd-chip' + (i === 0 ? " is-on" : "") + '">' + esc(g) + "</button>";
        }).join("");
        chips.addEventListener("click", function (e) {
          var b = e.target.closest("[data-chip]"); if (!b) return;
          f = b.getAttribute("data-chip");
          chips.querySelectorAll(".dd-chip").forEach(function (c) { c.classList.toggle("is-on", c === b); });
          apply();
        });
      }
      apply();
    },
    colors: { blue: "#4C7CA9", navy: "#172C3F", indigo: "#38628A", gold: "#F5A524", green: "#10B981", grid: "#DBE3EB", text: "#49525A" },
  };
})(window);
