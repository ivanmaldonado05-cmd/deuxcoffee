/* =============================================================
   DEUX — main.js
   Nav móvil · reveals on scroll · render de menú / sucursales / tienda
   ============================================================= */
(function () {
  "use strict";
  var IMG = "assets/img/";
  var t = function (k) { return window.DeuxI18n ? window.DeuxI18n.t(k) : k; };
  var lang = function () { return window.DeuxI18n ? window.DeuxI18n.lang : "es"; };

  /* ---------- helpers ---------- */
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
  }); }

  function formatPrice(price) {
    if (price == null) return null;
    var map = { es: "gs", pt: "brl", en: "usd" };
    var val = (typeof price === "object") ? price[map[lang()]] : price;
    if (val == null) return null;
    try { return Number(val).toLocaleString(lang() === "es" ? "es-PY" : lang() === "pt" ? "pt-BR" : "en-US"); }
    catch (e) { return String(val); }
  }
  function priceHTML(price) {
    var f = formatPrice(price);
    if (f == null) return '<span class="pending">' + esc(t("price_pending")) + "</span>";
    return '<span class="cur">' + esc(t("currency")) + "</span>" + esc(f);
  }
  function mediaHTML(img, name) {
    if (img) return '<img loading="lazy" src="' + IMG + img + '.webp" alt="' + esc(name) + '" width="600" height="600">';
    return '<div class="card__nophoto"><span>&#9788;</span>' + esc(t("photo_pending")) + "</div>";
  }

  /* ---------- reveals ---------- */
  var io = null;
  function observeReveals() {
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll(".reveal").forEach(function (n) { n.classList.add("is-in"); });
      return;
    }
    if (!io) {
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
    }
    document.querySelectorAll(".reveal:not(.is-in)").forEach(function (n) { io.observe(n); });
  }

  /* ---------- nav móvil ---------- */
  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.querySelector(".nav");
    if (!toggle || !nav) return;
    function close() { nav.classList.remove("is-open"); toggle.setAttribute("aria-expanded", "false"); }
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    nav.addEventListener("click", function (e) { if (e.target.closest(".nav__link")) close(); });
    window.addEventListener("resize", function () { if (window.innerWidth > 780) close(); });
  }

  /* ---------- render: MENÚ ---------- */
  function renderMenu() {
    var root = document.getElementById("menu-root");
    var tabsRoot = document.getElementById("menu-tabs");
    if (!root || !window.DEUX_DATA) return;
    var data = window.DEUX_DATA.menu;
    root.innerHTML = "";
    if (tabsRoot) tabsRoot.innerHTML = "";

    data.forEach(function (catg) {
      if (tabsRoot) {
        var tab = el("button", "menu-tab", esc(t(catg.cat_i18n)));
        tab.type = "button";
        tab.setAttribute("data-target", catg.id);
        tabsRoot.appendChild(tab);
      }
      var sec = el("section", "menu-cat");
      sec.id = catg.id;
      var head = el("div", "menu-cat__head",
        '<h2>' + esc(t(catg.cat_i18n)) + '</h2>' +
        '<span class="menu-cat__rule"></span>' +
        '<span class="count">' + catg.items.length + " " + esc(t("count_items")) + "</span>");
      sec.appendChild(head);

      var grid = el("div", "menu-grid");
      catg.items.forEach(function (it) {
        var card = el("article", "card reveal",
          '<div class="card__media">' + mediaHTML(it.img, it.n) + "</div>" +
          '<div class="card__body">' +
            '<h3 class="card__name">' + esc(it.n) + "</h3>" +
            '<p class="card__desc desc-pending">' + esc(t("desc_pending")) + "</p>" +
            '<div class="card__foot"><span class="price">' + priceHTML(it.price) + "</span></div>" +
          "</div>");
        grid.appendChild(card);
      });
      sec.appendChild(grid);
      root.appendChild(sec);
    });

    // Adicionales
    var addons = window.DEUX_DATA.addons || [];
    if (addons.length) {
      var sec2 = el("section", "menu-cat");
      sec2.id = "adicionales";
      sec2.appendChild(el("div", "menu-cat__head",
        '<h2>' + esc(t("addons_title")) + '</h2><span class="menu-cat__rule"></span>'));
      var wrap = el("div", "addons");
      addons.forEach(function (a) { wrap.appendChild(el("span", "addon", esc(a))); });
      sec2.appendChild(wrap);
      root.appendChild(sec2);
    }

    initMenuTabs();
    observeReveals();
  }

  function initMenuTabs() {
    var tabs = Array.prototype.slice.call(document.querySelectorAll(".menu-tab"));
    if (!tabs.length) return;
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var target = document.getElementById(tab.getAttribute("data-target"));
        if (target) {
          var y = target.getBoundingClientRect().top + window.pageYOffset - 130;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      });
    });
    // scrollspy
    if ("IntersectionObserver" in window) {
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            var id = en.target.id;
            tabs.forEach(function (tb) { tb.classList.toggle("is-active", tb.getAttribute("data-target") === id); });
          }
        });
      }, { rootMargin: "-140px 0px -70% 0px" });
      document.querySelectorAll(".menu-cat[id]").forEach(function (s) { if (s.id !== "adicionales") spy.observe(s); });
    }
  }

  /* ---------- render: SUCURSALES ---------- */
  function pinIcon() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>';
  }
  function clockIcon() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';
  }
  function renderBranches(rootId, list, kind) {
    var root = document.getElementById(rootId);
    if (!root || !list) return;
    root.innerHTML = "";
    list.forEach(function (b) {
      var soon = !!b.soon;
      var media = b.img
        ? '<img loading="lazy" src="' + IMG + b.img + '.webp" alt="' + esc(b.name) + '" width="600" height="420">'
        : '<div class="card__nophoto"><span>&#9788;</span>' + esc(t("photo_pending")) + "</div>";
      var tagClass = soon ? "branch__tag--soon" : (kind === "togo" ? "branch__tag--togo" : "branch__tag--dinein");
      var tagLabel = soon ? t("soon_label") : (kind === "togo" ? "To Go" : "Dine In");

      var body;
      if (soon) {
        body =
          '<span class="branch__tag ' + tagClass + '">' + esc(t("soon_label")) + "</span>" +
          '<h3 class="branch__name">' + esc(t("soon_label")) + "</h3>" +
          '<p class="branch__row" style="color:var(--ink-55)">' + esc(t("soon_desc")) + "</p>";
      } else {
        var hrs = b.hours ? esc(b.hours) : '<span class="pending">' + esc(t("branch_hours_pending")) + "</span>";
        var map = b.maps
          ? '<div class="branch__map-embed"><iframe src="' + esc(b.maps) + '" title="' + esc(b.name) + ' — Google Maps" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe></div>'
          : '<span class="pending">' + esc(t("branch_map_pending")) + "</span>";
        body =
          '<span class="branch__tag ' + tagClass + '">' + esc(tagLabel) + "</span>" +
          '<h3 class="branch__name">' + esc(b.name) + "</h3>" +
          '<div class="branch__row">' + clockIcon() + "<span>" + hrs + "</span></div>" +
          '<div class="branch__foot">' + map + "</div>";
      }
      var card = el("article", "branch reveal" + (soon ? " is-soon" : ""),
        '<div class="branch__media">' + media + "</div>" +
        '<div class="branch__body">' + body + "</div>");
      root.appendChild(card);
    });
    observeReveals();
  }

  /* ---------- render: TIENDA ---------- */
  function renderStore() {
    var root = document.getElementById("store-root");
    if (!root || !window.DEUX_DATA) return;
    root.innerHTML = "";
    window.DEUX_DATA.store.forEach(function (p) {
      var media = p.img
        ? '<img loading="lazy" src="' + IMG + p.img + '.webp" alt="' + esc(p.n) + '" width="600" height="750">'
        : '<div class="card__nophoto"><span>&#9788;</span>' + esc(t("photo_pending")) + "</div>";
      var card = el("article", "product reveal",
        '<div class="product__media">' + media + "</div>" +
        '<div class="product__body">' +
          '<h3 class="product__name">' + esc(p.n) + "</h3>" +
          '<p class="product__desc desc-pending">' + esc(t("desc_pending")) + "</p>" +
          '<div class="card__foot"><span class="price">' + priceHTML(p.price) + "</span></div>" +
        "</div>");
      root.appendChild(card);
    });
    observeReveals();
  }

  /* ---------- render en cambio de idioma ---------- */
  function renderAll() {
    renderMenu();
    if (window.DEUX_DATA) {
      renderBranches("dinein-root", window.DEUX_DATA.branches.dinein, "dinein");
      renderBranches("togo-root", window.DEUX_DATA.branches.togo, "togo");
    }
    renderStore();
  }
  document.addEventListener("deux:i18n", renderAll);

  /* ---------- formulario de contacto → WhatsApp ---------- */
  function initContactForm() {
    var form = document.getElementById("contact-form");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = (document.getElementById("cf-name").value || "").trim();
      var email = (document.getElementById("cf-email").value || "").trim();
      var msg = (document.getElementById("cf-msg").value || "").trim();
      if (!name) { document.getElementById("cf-name").focus(); return; }
      if (!msg) { document.getElementById("cf-msg").focus(); return; }
      var text = "Hola Deux 👋 Soy " + name + (email ? " (" + email + ")" : "") + ".\n" + msg;
      window.open("https://wa.me/595973853007?text=" + encodeURIComponent(text), "_blank", "noopener");
    });
  }

  /* ---------- acordeón (trabajo / franquicias / reclamos) ---------- */
  function initAccordion() {
    document.querySelectorAll(".acc-head").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var panel = document.getElementById(btn.getAttribute("aria-controls"));
        var open = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", String(!open));
        if (panel) panel.classList.toggle("is-open", !open);
      });
    });
  }

  /* ---------- formularios de gestión → WhatsApp categorizado ---------- */
  function initGestionForms() {
    document.querySelectorAll(".gestion-form").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var firstEmpty = Array.prototype.slice.call(form.querySelectorAll("[required]"))
          .find(function (f) { return !(f.value || "").trim(); });
        if (firstEmpty) { firstEmpty.focus(); return; }
        var item = form.closest(".acc-item");
        var cat = item ? (item.querySelector(".acc-title").textContent || "").trim() : "Consulta";
        var lines = [];
        form.querySelectorAll("input, textarea").forEach(function (f) {
          var lbl = form.querySelector('label[for="' + f.id + '"]');
          var name = lbl ? lbl.textContent.trim() : (f.name || "");
          var val = (f.value || "").trim();
          if (val) lines.push(name + ": " + val);
        });
        var text = "*" + cat + "*\n" + lines.join("\n");
        window.open("https://wa.me/595973853007?text=" + encodeURIComponent(text), "_blank", "noopener");
      });
    });
  }

  /* ---------- init ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    initContactForm();
    initAccordion();
    initGestionForms();
    var y = document.querySelector("[data-year]");
    if (y) y.textContent = new Date().getFullYear();
    observeReveals();
    // Si i18n ya emitió antes de este listener, forzamos un primer render.
    if (window.DEUX_I18N) renderAll();
  });
})();
