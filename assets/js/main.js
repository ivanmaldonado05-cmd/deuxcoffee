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

  // Precios en Guaraníes (los montos existen solo en Gs).
  var CUR = "Gs.";
  function formatPrice(price) {
    if (price == null) return null;
    var val = (typeof price === "object") ? price.gs : price;
    if (val == null) return null;
    try { return Number(val).toLocaleString("es-PY"); }
    catch (e) { return String(val); }
  }
  function priceHTML(price) {
    var f = formatPrice(price);
    if (f == null) return '<span class="pending">' + esc(t("price_pending")) + "</span>";
    return '<span class="cur">' + CUR + "</span> " + esc(f);
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
          '<div class="card__body"><h3 class="card__name">' + esc(it.n) + "</h3></div>");
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

  function branchSlug(b) { return b.slug || (b.imgs && b.imgs[0] ? b.imgs[0].replace(/-\d+$/, "") : ""); }

  function renderBranches(rootId, list, kind) {
    var root = document.getElementById(rootId);
    if (!root || !list) return;
    root.innerHTML = "";
    list.forEach(function (b) {
      if (b.soon) {
        var scard = el("article", "branch is-soon reveal",
          '<div class="branch__media"><div class="card__nophoto"><span>&#9788;</span>' + esc(t("photo_pending")) + "</div></div>" +
          '<div class="branch__body">' +
            '<span class="branch__tag branch__tag--soon">' + esc(t("soon_label")) + "</span>" +
            '<h3 class="branch__name">' + esc(t("soon_label")) + "</h3>" +
            '<p class="branch__soon">' + esc(t("soon_desc")) + "</p>" +
          "</div>");
        root.appendChild(scard);
        return;
      }
      var slug = branchSlug(b);
      var cover = (b.imgs && b.imgs[0]) ? '<img loading="lazy" src="' + IMG + b.imgs[0] + '.webp" alt="' + esc(b.name) + '" width="640" height="440">' : "";
      var sticker = b.isNew ? '<span class="sticker sticker--new">' + esc(t("sticker_new")) + "</span>" : "";
      var tagClass = kind === "togo" ? "branch__tag--togo" : "branch__tag--dinein";
      var tagLabel = kind === "togo" ? "To Go" : "Dine In";
      var a = document.createElement("a");
      a.className = "branch branch--link reveal";
      a.href = "sucursal.html?id=" + encodeURIComponent(slug);
      a.innerHTML =
        '<div class="branch__media">' + cover + sticker + "</div>" +
        '<div class="branch__body">' +
          '<span class="branch__tag ' + tagClass + '">' + esc(tagLabel) + "</span>" +
          '<h3 class="branch__name">' + esc(b.name) + "</h3>" +
          '<span class="branch__more">' + esc(t("branch_view")) + " &rarr;</span>" +
        "</div>";
      root.appendChild(a);
    });
    observeReveals();
  }

  /* ---------- página individual de sucursal ---------- */
  function renderBranchDetail() {
    var root = document.getElementById("branch-detail");
    if (!root || !window.DEUX_DATA) return;
    var id = new URLSearchParams(location.search).get("id");
    var all = window.DEUX_DATA.branches.dinein.map(function (b) { return { b: b, kind: "dinein" }; })
      .concat(window.DEUX_DATA.branches.togo.map(function (b) { return { b: b, kind: "togo" }; }));
    var match = all.filter(function (x) { return !x.b.soon && branchSlug(x.b) === id; })[0];
    if (!match) { location.replace("dine-in.html"); return; }
    var b = match.b, kind = match.kind;
    var tagLabel = kind === "togo" ? "To Go" : "Dine In";
    var tagline = kind === "togo" ? t("branch_togo_tagline") : t("branch_dinein_tagline");
    document.title = b.name + " — Deux Coffee Roasters";

    var gallery = carouselHTML(b.imgs, b.name);
    var mapHTML = b.maps
      ? '<div class="branchpage__map"><iframe src="' + esc(b.maps) + '" title="' + esc(b.name) + ' — Google Maps" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe></div>'
      : "";

    root.innerHTML =
      '<div class="wrap branchpage__head reveal">' +
        '<a class="branchpage__back" href="' + (kind === "togo" ? "to-go.html" : "dine-in.html") + '">&larr; ' + esc(t("branch_back")) + "</a>" +
        '<p class="eyebrow">' + esc(tagLabel) + (b.isNew ? ' · <span class="sticker sticker--new sticker--inline">' + esc(t("sticker_new")) + "</span>" : "") + "</p>" +
        '<h1 class="branchpage__title">' + esc(b.name) + "</h1>" +
        '<p class="branchpage__tagline">' + esc(tagline) + "</p>" +
      "</div>" +
      '<div class="wrap branchpage__gallery reveal">' + gallery + "</div>" +
      '<div class="wrap branchpage__grid">' +
        '<div class="branchpage__about reveal">' +
          '<p class="eyebrow">' + esc(t("branch_about_eyebrow")) + "</p>" +
          "<p>" + esc(t("branch_detail_intro")) + "</p>" +
          '<div class="branchpage__cta">' +
            '<a class="btn" href="https://wa.me/595973853007" target="_blank" rel="noopener">' + esc(t("cta_order_wa")) + "</a>" +
            (b.maps ? '<a class="btn btn--ghost" href="https://maps.google.com/?q=' + encodeURIComponent(b.name + " Deux Coffee") + '" target="_blank" rel="noopener">' + esc(t("branch_how")) + "</a>" : "") +
          "</div>" +
        "</div>" +
        mapHTML +
      "</div>";

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
      var sticker = p.bestseller ? '<span class="sticker sticker--best">' + esc(t("sticker_best")) + "</span>" : "";
      var meta = "";
      if (p.notes || p.brew) {
        meta = '<div class="product__meta">';
        if (p.notes) meta += '<p><span>' + esc(t("notes_label")) + '</span> ' + esc(p.notes) + "</p>";
        if (p.brew) meta += '<p><span>' + esc(t("brew_label")) + '</span> ' + esc(p.brew) + "</p>";
        meta += "</div>";
      }
      var card = el("article", "product reveal",
        '<div class="product__media">' + media + sticker + "</div>" +
        '<div class="product__body">' +
          '<h3 class="product__name">' + esc(p.n) + "</h3>" +
          meta +
          '<div class="card__foot"><span class="price">' + priceHTML(p.price) + "</span>" +
            '<button class="add-btn" type="button" aria-label="' + esc(t("cart_add")) + " — " + esc(p.n) + '">+</button>' +
          "</div>" +
        "</div>");
      var addBtn = card.querySelector(".add-btn");
      addBtn.addEventListener("click", function () {
        if (p.grind) openGrindPopup(p, addBtn);
        else doAdd(p, null, addBtn);
      });
      root.appendChild(card);
    });
    observeReveals();
  }

  function doAdd(p, grind, addBtn) {
    cartAdd({ id: (p.img || p.n) + (grind ? "__" + grind : ""), name: p.n, img: p.img, price: p.price, grind: grind || null });
    if (addBtn) {
      addBtn.classList.add("is-added"); addBtn.textContent = "✓";
      var cb = document.querySelector(".cart-btn"); if (cb) { cb.classList.remove("bump"); void cb.offsetWidth; cb.classList.add("bump"); }
      setTimeout(function () { addBtn.textContent = "+"; addBtn.classList.remove("is-added"); }, 900);
    }
    cartOpen();
  }

  /* ---------- Modal genérico ---------- */
  function buildModal(innerHTML, cls) {
    var wrap = document.createElement("div");
    wrap.className = "modal" + (cls ? " " + cls : "");
    wrap.innerHTML = '<div class="modal__overlay"></div><div class="modal__panel" role="dialog" aria-modal="true">' + innerHTML + "</div>";
    document.body.appendChild(wrap);
    document.body.style.overflow = "hidden";
    requestAnimationFrame(function () { wrap.classList.add("is-open"); });
    function close() { wrap.classList.remove("is-open"); document.body.style.overflow = ""; setTimeout(function () { wrap.remove(); }, 300); }
    wrap.querySelector(".modal__overlay").addEventListener("click", close);
    return { el: wrap, close: close };
  }

  /* ---------- Pop-up de molienda ---------- */
  var GRIND_I18N = {
    "En grano": { pt: "Em grão", en: "Whole bean" },
    "V60 / Filtrado": { en: "V60 / Pour over" },
    "Prensa Francesa": { en: "French Press" },
    "No estoy seguro": { pt: "Não tenho certeza", en: "Not sure" }
  };
  function grindLabel(o) { var m = GRIND_I18N[o]; return (m && m[lang()]) ? m[lang()] : o; }

  function openGrindPopup(p, addBtn) {
    var opts = window.DEUX_DATA.grindOptions || ["En grano"];
    var optsHTML = opts.map(function (o, i) {
      return '<button class="grind-opt' + (i === 0 ? " is-sel" : "") + '" type="button" data-grind="' + esc(o) + '">' + esc(grindLabel(o)) + "</button>";
    }).join("");
    var m = buildModal(
      '<button class="modal__close" type="button" aria-label="Cerrar">&times;</button>' +
      '<p class="modal__eyebrow">' + esc(p.n) + "</p>" +
      '<h3 class="modal__title">' + esc(t("grind_title")) + "</h3>" +
      '<div class="grind-opts">' + optsHTML + "</div>" +
      '<button class="btn modal__confirm" type="button">' + esc(t("grind_confirm")) + "</button>",
      "modal--grind");
    var sel = opts[0];
    m.el.querySelectorAll(".grind-opt").forEach(function (b) {
      b.addEventListener("click", function () {
        m.el.querySelectorAll(".grind-opt").forEach(function (x) { x.classList.remove("is-sel"); });
        b.classList.add("is-sel"); sel = b.getAttribute("data-grind");
      });
    });
    m.el.querySelector(".modal__close").addEventListener("click", m.close);
    m.el.querySelector(".modal__confirm").addEventListener("click", function () { doAdd(p, sel, addBtn); m.close(); });
  }

  /* ---------- CARRITO → WhatsApp ---------- */
  var CART_KEY = "deux-cart";
  var cart = [];
  var WA_GLYPH = '<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm5.8 14.03c-.24.68-1.42 1.31-1.95 1.35-.5.05-.98.24-3.3-.69-2.79-1.1-4.55-3.97-4.69-4.16-.14-.19-1.13-1.5-1.13-2.86s.71-2.03.97-2.31c.24-.26.53-.32.71-.32h.5c.16.01.38-.06.59.45.24.58.82 2 .89 2.14.07.14.12.31.02.5-.09.19-.14.31-.28.48-.14.17-.29.38-.42.5-.14.14-.28.29-.12.57.16.28.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.22 1.37.28.14.44.12.6-.07.16-.19.69-.8.87-1.08.18-.28.36-.23.61-.14.25.09 1.6.75 1.87.89.28.14.46.21.53.32.07.12.07.68-.17 1.35z"/></svg>';

  function cartLoad() { try { cart = JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch (e) { cart = []; } }
  function cartSave() { try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) {} }
  function cartCount() { return cart.reduce(function (a, i) { return a + i.qty; }, 0); }
  function cartFind(id) { return cart.filter(function (i) { return i.id === id; })[0]; }
  function priceBase(price) { return price == null ? null : (typeof price === "object" ? price.gs : price); }
  function priceText(price) {
    var f = formatPrice(price);
    return f == null ? t("price_pending") : (CUR + " " + f);
  }
  function cartTotalNumber() {
    if (!cart.length) return null;
    var ok = cart.every(function (i) { return priceBase(i.price) != null; });
    if (!ok) return null;
    return cart.reduce(function (a, i) { return a + Number(priceBase(i.price)) * i.qty; }, 0);
  }
  function fmtNum(n) { try { return n.toLocaleString("es-PY"); } catch (e) { return String(n); } }
  function cartTotalText() {
    var n = cartTotalNumber();
    return n == null ? t("cart_pending") : (CUR + " " + fmtNum(n));
  }

  function cartAdd(item) {
    var ex = cartFind(item.id);
    if (ex) ex.qty += 1;
    else cart.push({ id: item.id, name: item.name, img: item.img, price: item.price, qty: 1, grind: item.grind || null });
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

  function loadLeaflet(cb) {
    if (window.L) { cb(); return; }
    var css = document.createElement("link");
    css.rel = "stylesheet"; css.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(css);
    var s = document.createElement("script");
    s.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    s.onload = cb; s.onerror = function () { cb(); };
    document.head.appendChild(s);
  }
  function buildOrderMessage(method, address, coords) {
    var lines = cart.map(function (i) {
      var base = priceBase(i.price);
      var lt = base == null ? "" : " — " + CUR + " " + fmtNum(Number(base) * i.qty);
      var g = i.grind ? " (" + grindLabel(i.grind) + ")" : "";
      return "• " + i.name + g + " ×" + i.qty + lt;
    });
    var msg = t("cart_greeting") + "\n\n" + lines.join("\n") + "\n\n" + t("cart_total") + ": " + cartTotalText();
    msg += "\n" + t("cart_delivery") + ": " + method;
    if (address) msg += "\n" + t("cart_address") + ": " + address;
    if (coords) msg += "\n" + t("cart_location") + ": https://maps.google.com/?q=" + coords.lat + "," + coords.lng;
    return msg;
  }
  function cartCheckout() { if (cart.length) { cartClose(); openDeliveryPopup(); } }

  function openDeliveryPopup() {
    var methods = [
      { key: "pickup",   label: t("deliv_pickup"),   free: true },
      { key: "cde",      label: t("deliv_cde"),      free: false },
      { key: "national", label: t("deliv_national"), free: false }
    ];
    var optsHTML = methods.map(function (mth, i) {
      return '<button class="deliv-opt' + (i === 0 ? " is-sel" : "") + '" type="button" data-key="' + mth.key + '">' +
        '<span class="deliv-opt__name">' + esc(mth.label) + "</span>" +
        '<span class="deliv-opt__tag">' + (mth.free ? esc(t("deliv_free")) : esc(t("deliv_cost"))) + "</span></button>";
    }).join("");
    var m = buildModal(
      '<button class="modal__close" type="button" aria-label="Cerrar">&times;</button>' +
      '<h3 class="modal__title">' + esc(t("deliv_title")) + "</h3>" +
      '<div class="deliv-opts">' + optsHTML + "</div>" +
      '<div class="deliv-map-wrap" hidden>' +
        '<p class="deliv-map-hint">' + esc(t("deliv_map_hint")) + "</p>" +
        '<div class="deliv-map" id="deliv-map"></div>' +
        '<input class="deliv-address" id="deliv-address" type="text" placeholder="' + esc(t("deliv_address_ph")) + '">' +
      "</div>" +
      '<button class="btn cart-checkout modal__confirm" type="button">' + WA_GLYPH + "<span>" + esc(t("cart_checkout")) + "</span></button>",
      "modal--deliv");

    var sel = methods[0];
    var mapWrap = m.el.querySelector(".deliv-map-wrap");
    var coords = null, mapObj = null, marker = null;

    function reverseGeocode(c) {
      var inp = document.getElementById("deliv-address");
      if (!inp) return;
      fetch("https://nominatim.openstreetmap.org/reverse?format=json&lat=" + c.lat + "&lon=" + c.lng + "&zoom=18", { headers: { "Accept-Language": lang() } })
        .then(function (r) { return r.json(); })
        .then(function (d) { if (d && d.display_name) inp.value = d.display_name; })
        .catch(function () {});
    }
    function initMap() {
      mapWrap.hidden = false;
      if (mapObj) { setTimeout(function () { mapObj.invalidateSize(); }, 50); return; }
      loadLeaflet(function () {
        if (!window.L) return;
        var start = [-25.5097, -54.6111];
        mapObj = L.map("deliv-map").setView(start, 14);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: "© OpenStreetMap" }).addTo(mapObj);
        marker = L.marker(start, { draggable: true }).addTo(mapObj);
        coords = { lat: start[0], lng: start[1] };
        function upd(ll) { coords = { lat: +ll.lat.toFixed(6), lng: +ll.lng.toFixed(6) }; reverseGeocode(coords); }
        marker.on("dragend", function () { upd(marker.getLatLng()); });
        mapObj.on("click", function (e) { marker.setLatLng(e.latlng); upd(e.latlng); });
        setTimeout(function () { mapObj.invalidateSize(); }, 80);
      });
    }

    m.el.querySelectorAll(".deliv-opt").forEach(function (b) {
      b.addEventListener("click", function () {
        m.el.querySelectorAll(".deliv-opt").forEach(function (x) { x.classList.remove("is-sel"); });
        b.classList.add("is-sel");
        sel = methods.filter(function (x) { return x.key === b.getAttribute("data-key"); })[0];
        if (sel.key === "pickup") mapWrap.hidden = true; else initMap();
      });
    });
    m.el.querySelector(".modal__close").addEventListener("click", m.close);
    m.el.querySelector(".modal__confirm").addEventListener("click", function () {
      var address = null;
      if (sel.key !== "pickup") { var inp = document.getElementById("deliv-address"); address = inp ? inp.value.trim() : ""; }
      var msg = buildOrderMessage(sel.label, address, sel.key !== "pickup" ? coords : null);
      window.open("https://wa.me/595973853007?text=" + encodeURIComponent(msg), "_blank", "noopener");
      m.close();
    });
  }

  function cartInjectUI() {
    if (document.body.classList.contains("landing")) return; // sin carrito en la landing
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
          (i.grind ? '<p class="cart-item__grind">' + esc(t("grind_label")) + ": " + esc(grindLabel(i.grind)) + "</p>" : "") +
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
    renderBranchDetail();
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

  /* ---------- Tema claro / oscuro ---------- */
  function toggleTheme() {
    var isDark = document.documentElement.getAttribute("data-theme") === "dark";
    if (isDark) { document.documentElement.removeAttribute("data-theme"); }
    else { document.documentElement.setAttribute("data-theme", "dark"); }
    try { localStorage.setItem("deux-theme", isDark ? "light" : "dark"); } catch (e) {}
  }
  function initTheme() {
    var tools = document.querySelector(".header-tools");
    if (!tools || document.querySelector(".theme-btn")) return;
    var b = el("button", "theme-btn");
    b.type = "button";
    b.setAttribute("aria-label", "Cambiar tema claro / oscuro");
    b.innerHTML =
      '<svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>' +
      '<svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
    b.addEventListener("click", toggleTheme);
    tools.insertBefore(b, tools.firstChild);
  }

  /* ---------- init ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    initTheme();
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
