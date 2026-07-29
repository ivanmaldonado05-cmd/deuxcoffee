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
  function carouselHTML(imgs, name) {
    if (!imgs || !imgs.length) {
      return '<div class="card__nophoto"><span>&#9788;</span>' + esc(t("photo_pending")) + "</div>";
    }
    var slides = imgs.map(function (im, i) {
      return '<div class="carousel__slide"><img ' + (i === 0 ? "" : 'loading="lazy" ') +
        'src="' + IMG + im + '.webp" alt="' + esc(name) + " — " + (i + 1) + '" width="640" height="440"></div>';
    }).join("");
    if (imgs.length === 1) {
      return '<div class="carousel"><div class="carousel__track">' + slides + "</div></div>";
    }
    var dots = imgs.map(function (_, i) {
      return '<button class="carousel__dot' + (i === 0 ? " is-active" : "") + '" type="button" aria-label="' + esc(name) + " " + (i + 1) + '"></button>';
    }).join("");
    return '<div class="carousel" data-carousel>' +
      '<div class="carousel__track">' + slides + "</div>" +
      '<button class="carousel__btn carousel__btn--prev" type="button" aria-label="Anterior">‹</button>' +
      '<button class="carousel__btn carousel__btn--next" type="button" aria-label="Siguiente">›</button>' +
      '<div class="carousel__dots">' + dots + "</div>" +
      "</div>";
  }

  function initCarousels(scope) {
    (scope || document).querySelectorAll("[data-carousel]").forEach(function (car) {
      if (car.dataset.ready) return;
      car.dataset.ready = "1";
      var track = car.querySelector(".carousel__track");
      var slides = car.querySelectorAll(".carousel__slide");
      var dots = car.querySelectorAll(".carousel__dot");
      var count = slides.length;
      function current() { return Math.round(track.scrollLeft / track.clientWidth); }
      function go(i) {
        i = (i + count) % count;
        track.scrollTo({ left: i * track.clientWidth, behavior: "smooth" });
      }
      car.querySelector(".carousel__btn--prev").addEventListener("click", function () { go(current() - 1); });
      car.querySelector(".carousel__btn--next").addEventListener("click", function () { go(current() + 1); });
      dots.forEach(function (d, i) { d.addEventListener("click", function () { go(i); }); });
      var raf;
      track.addEventListener("scroll", function () {
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(function () {
          var idx = current();
          dots.forEach(function (d, i) { d.classList.toggle("is-active", i === idx); });
        });
      }, { passive: true });
    });
  }

  function renderBranches(rootId, list, kind) {
    var root = document.getElementById(rootId);
    if (!root || !list) return;
    root.innerHTML = "";
    list.forEach(function (b) {
      var soon = !!b.soon;
      var media = carouselHTML(b.imgs, b.name);
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
    initCarousels(root);
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
          '<div class="card__foot"><span class="price">' + priceHTML(p.price) + "</span>" +
            '<button class="add-btn" type="button" aria-label="' + esc(t("cart_add")) + " — " + esc(p.n) + '">+</button>' +
          "</div>" +
        "</div>");
      var addBtn = card.querySelector(".add-btn");
      addBtn.addEventListener("click", function () {
        cartAdd({ id: p.img || p.n, name: p.n, img: p.img, price: p.price });
        addBtn.classList.add("is-added"); addBtn.textContent = "✓";
        var cb = document.querySelector(".cart-btn"); if (cb) { cb.classList.remove("bump"); void cb.offsetWidth; cb.classList.add("bump"); }
        setTimeout(function () { addBtn.textContent = "+"; addBtn.classList.remove("is-added"); }, 900);
      });
      root.appendChild(card);
    });
    observeReveals();
  }

  /* ---------- CARRITO → WhatsApp ---------- */
  var CART_KEY = "deux-cart";
  var cart = [];
  var WA_GLYPH = '<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm5.8 14.03c-.24.68-1.42 1.31-1.95 1.35-.5.05-.98.24-3.3-.69-2.79-1.1-4.55-3.97-4.69-4.16-.14-.19-1.13-1.5-1.13-2.86s.71-2.03.97-2.31c.24-.26.53-.32.71-.32h.5c.16.01.38-.06.59.45.24.58.82 2 .89 2.14.07.14.12.31.02.5-.09.19-.14.31-.28.48-.14.17-.29.38-.42.5-.14.14-.28.29-.12.57.16.28.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.22 1.37.28.14.44.12.6-.07.16-.19.69-.8.87-1.08.18-.28.36-.23.61-.14.25.09 1.6.75 1.87.89.28.14.46.21.53.32.07.12.07.68-.17 1.35z"/></svg>';

  function cartLoad() { try { cart = JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch (e) { cart = []; } }
  function cartSave() { try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) {} }
  function cartCount() { return cart.reduce(function (a, i) { return a + i.qty; }, 0); }
  function cartFind(id) { return cart.filter(function (i) { return i.id === id; })[0]; }
  function priceBase(price) {
    if (price == null) return null;
    var map = { es: "gs", pt: "brl", en: "usd" };
    return (typeof price === "object") ? price[map[lang()]] : price;
  }
  function priceText(price) {
    var f = formatPrice(price);
    return f == null ? t("price_pending") : (t("currency") + " " + f);
  }
  function cartTotalNumber() {
    if (!cart.length) return null;
    var ok = cart.every(function (i) { return priceBase(i.price) != null; });
    if (!ok) return null;
    return cart.reduce(function (a, i) { return a + Number(priceBase(i.price)) * i.qty; }, 0);
  }
  function fmtNum(n) {
    try { return n.toLocaleString(lang() === "es" ? "es-PY" : lang() === "pt" ? "pt-BR" : "en-US"); }
    catch (e) { return String(n); }
  }
  function cartTotalText() {
    var n = cartTotalNumber();
    return n == null ? t("cart_pending") : (t("currency") + " " + fmtNum(n));
  }

  function cartAdd(item) {
    var ex = cartFind(item.id);
    if (ex) ex.qty += 1;
    else cart.push({ id: item.id, name: item.name, img: item.img, price: item.price, qty: 1 });
    cartSave(); cartRender();
  }
  function cartSetQty(id, q) {
    var it = cartFind(id); if (!it) return;
    it.qty = Math.max(0, q);
    if (it.qty === 0) cart = cart.filter(function (i) { return i.id !== id; });
    cartSave(); cartRender();
  }
  function cartRemove(id) { cart = cart.filter(function (i) { return i.id !== id; }); cartSave(); cartRender(); }

  function cartOpen() {
    var d = document.getElementById("cart-drawer"), o = document.getElementById("cart-overlay");
    if (!d) return;
    o.hidden = false; requestAnimationFrame(function () { o.classList.add("is-open"); });
    d.classList.add("is-open"); d.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function cartClose() {
    var d = document.getElementById("cart-drawer"), o = document.getElementById("cart-overlay");
    if (!d) return;
    d.classList.remove("is-open"); d.setAttribute("aria-hidden", "true");
    o.classList.remove("is-open"); setTimeout(function () { o.hidden = true; }, 300);
    document.body.style.overflow = "";
  }

  function cartCheckout() {
    if (!cart.length) return;
    var lines = cart.map(function (i) {
      var base = priceBase(i.price);
      var lt = base == null ? "" : " — " + t("currency") + " " + fmtNum(Number(base) * i.qty);
      return "• " + i.name + " ×" + i.qty + lt;
    });
    var msg = t("cart_greeting") + "\n\n" + lines.join("\n") + "\n\n" + t("cart_total") + ": " + cartTotalText();
    window.open("https://wa.me/595973853007?text=" + encodeURIComponent(msg), "_blank", "noopener");
  }

  function cartInjectUI() {
    var tools = document.querySelector(".header-tools");
    if (tools && !document.querySelector(".cart-btn")) {
      var b = el("button", "cart-btn");
      b.type = "button";
      b.setAttribute("aria-label", t("cart_title"));
      b.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.3"/><circle cx="18" cy="20" r="1.3"/><path d="M2.5 3.5h2.2l2.1 11.4a1.5 1.5 0 0 0 1.5 1.2h8.3a1.5 1.5 0 0 0 1.47-1.16L21 8H6.2"/></svg><span class="cart-badge" hidden>0</span>';
      b.addEventListener("click", cartOpen);
      tools.appendChild(b);
    }
    if (!document.getElementById("cart-drawer")) {
      var wrap = document.createElement("div");
      wrap.innerHTML =
        '<div class="cart-overlay" id="cart-overlay" hidden></div>' +
        '<aside class="cart-drawer" id="cart-drawer" role="dialog" aria-modal="true" aria-hidden="true">' +
          '<div class="cart-drawer__head"><h2 class="cart-drawer__title"></h2>' +
          '<button class="cart-close" type="button" aria-label="Cerrar">&times;</button></div>' +
          '<div class="cart-drawer__body" id="cart-items"></div>' +
          '<div class="cart-drawer__foot" id="cart-foot"></div>' +
        "</aside>";
      document.body.appendChild(wrap);
      document.getElementById("cart-overlay").addEventListener("click", cartClose);
      wrap.querySelector(".cart-close").addEventListener("click", cartClose);
      document.addEventListener("keydown", function (e) { if (e.key === "Escape") cartClose(); });
    }
  }

  function cartRender() {
    var badge = document.querySelector(".cart-badge");
    if (badge) { var c = cartCount(); badge.textContent = c; badge.hidden = c === 0; }
    var title = document.querySelector(".cart-drawer__title");
    if (title) title.textContent = t("cart_title");
    var items = document.getElementById("cart-items");
    var foot = document.getElementById("cart-foot");
    if (!items || !foot) return;

    if (!cart.length) {
      items.innerHTML = '<p class="cart-empty">' + esc(t("cart_empty")) + "</p>";
      foot.innerHTML = "";
      return;
    }
    items.innerHTML = cart.map(function (i) {
      return '<div class="cart-item">' +
        '<img class="cart-item__img" src="' + IMG + i.img + '.webp" alt="' + esc(i.name) + '" width="60" height="60" loading="lazy">' +
        '<div class="cart-item__info">' +
          '<div class="cart-item__top"><span class="cart-item__name">' + esc(i.name) + "</span>" +
          '<button class="cart-item__remove" data-remove="' + esc(i.id) + '">' + esc(t("cart_remove")) + "</button></div>" +
          '<div class="cart-item__bottom">' +
            '<div class="stepper"><button data-dec="' + esc(i.id) + '" aria-label="−">−</button><span>' + i.qty + '</span><button data-inc="' + esc(i.id) + '" aria-label="+">+</button></div>' +
            '<span class="cart-item__price">' + priceText(i.price) + "</span>" +
          "</div></div></div>";
    }).join("");
    foot.innerHTML =
      '<div class="cart-total"><span>' + esc(t("cart_total")) + "</span><strong>" + cartTotalText() + "</strong></div>" +
      '<button class="btn cart-checkout" type="button">' + WA_GLYPH + "<span>" + esc(t("cart_checkout")) + "</span></button>" +
      '<p class="cart-note">' + esc(t("cart_note")) + "</p>";

    items.querySelectorAll("[data-inc]").forEach(function (b) { b.onclick = function () { var it = cartFind(b.dataset.inc); cartSetQty(b.dataset.inc, it.qty + 1); }; });
    items.querySelectorAll("[data-dec]").forEach(function (b) { b.onclick = function () { var it = cartFind(b.dataset.dec); cartSetQty(b.dataset.dec, it.qty - 1); }; });
    items.querySelectorAll("[data-remove]").forEach(function (b) { b.onclick = function () { cartRemove(b.dataset.remove); }; });
    foot.querySelector(".cart-checkout").onclick = cartCheckout;
  }

  /* ---------- render en cambio de idioma ---------- */
  function renderAll() {
    renderMenu();
    if (window.DEUX_DATA) {
      renderBranches("dinein-root", window.DEUX_DATA.branches.dinein, "dinein");
      renderBranches("togo-root", window.DEUX_DATA.branches.togo, "togo");
    }
    renderStore();
    cartRender();
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
    cartLoad();
    cartInjectUI();
    cartRender();
    var y = document.querySelector("[data-year]");
    if (y) y.textContent = new Date().getFullYear();
    observeReveals();
    // Si i18n ya emitió antes de este listener, forzamos un primer render.
    if (window.DEUX_I18N) renderAll();
  });
})();
