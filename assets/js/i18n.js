/* =============================================================
   DEUX — Motor i18n (ES / PT / EN)
   - Default: Español. Idioma recordado en localStorage.
   - Textos vía atributo data-i18n (innerHTML) y data-i18n-attr (atributos).
   - Diccionarios en assets/i18n/*.json (cargados por fetch → funciona en
     GitHub Pages / cualquier server HTTP).
   - Fallback ES embebido: si se abre como file:// (sin server) y el fetch
     falla, la página igual se ve completa en español.
   ============================================================= */
(function () {
  "use strict";
  var LANGS = ["es", "pt", "en"];
  var DEFAULT = "es";
  var STORAGE = "deux-lang";

  // Fallback mínimo (ES) para el contenido renderizado por JS cuando no hay fetch.
  var FALLBACK_ES = {
    html_lang: "es",
    currency: "Gs.",
    price_pending: "Precio pendiente",
    photo_pending: "Foto pendiente",
    desc_pending: "Descripción a confirmar",
    data_pending: "Dato pendiente",
    branch_address_pending: "Dirección a confirmar",
    branch_hours_pending: "Horario a confirmar",
    branch_map: "Ver en Maps",
    branch_map_pending: "Mapa a confirmar",
    soon_label: "Próximamente",
    soon_desc: "Estamos por abrir un nuevo punto. Seguinos para enterarte primero.",
    count_items: "productos",
    addons_title: "Adicionales",
    cat_hot: "Hot Coffees", cat_iced: "Iced Coffees", cat_coldbrew: "Cold Brew",
    cat_frappe: "Frappe", cat_dulces: "Dulces", cat_salados: "Salados", cat_otros: "Otros"
  };

  var dict = FALLBACK_ES;
  var current = DEFAULT;

  function pickInitial() {
    var saved = null;
    try { saved = localStorage.getItem(STORAGE); } catch (e) {}
    if (saved && LANGS.indexOf(saved) !== -1) return saved;
    return DEFAULT; // Español por defecto (definido por el cliente)
  }

  function t(key) {
    if (dict && dict[key] != null) return dict[key];
    if (FALLBACK_ES[key] != null) return FALLBACK_ES[key];
    return key;
  }
  function stripTags(s) { return String(s).replace(/<[^>]*>/g, ""); }

  function apply() {
    document.documentElement.lang = dict.html_lang || current;

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var k = el.getAttribute("data-i18n");
      if (dict[k] != null) el.innerHTML = dict[k];
    });

    document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      el.getAttribute("data-i18n-attr").split("|").forEach(function (pair) {
        var idx = pair.indexOf(":");
        if (idx === -1) return;
        var attr = pair.slice(0, idx).trim();
        var k = pair.slice(idx + 1).trim();
        if (dict[k] != null) el.setAttribute(attr, stripTags(dict[k]));
      });
    });

    var tk = document.body && document.body.getAttribute("data-title-key");
    if (tk && dict[tk]) document.title = stripTags(dict[tk]);

    document.querySelectorAll(".lang__btn").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === current));
    });

    // Avisar a los renderizadores (menú, sucursales, tienda)
    window.DEUX_I18N = { lang: current, t: t };
    document.dispatchEvent(new CustomEvent("deux:i18n", { detail: { lang: current, t: t } }));
  }

  function load(lang) {
    current = lang;
    fetch("assets/i18n/" + lang + ".json", { cache: "no-cache" })
      .then(function (r) { if (!r.ok) throw new Error("http " + r.status); return r.json(); })
      .then(function (json) { dict = json; apply(); })
      .catch(function () {
        // Sin server (file://) o fetch bloqueado → usar fallback ES.
        dict = FALLBACK_ES;
        current = "es";
        apply();
      });
  }

  function setLang(lang) {
    if (LANGS.indexOf(lang) === -1) return;
    try { localStorage.setItem(STORAGE, lang); } catch (e) {}
    load(lang);
  }

  // API pública
  window.DeuxI18n = {
    setLang: setLang,
    t: t,
    langs: LANGS,
    get lang() { return current; }
  };

  // Delegación de clicks en el selector de idioma
  document.addEventListener("click", function (e) {
    var btn = e.target.closest(".lang__btn");
    if (btn && btn.getAttribute("data-lang")) setLang(btn.getAttribute("data-lang"));
  });

  // Init
  document.addEventListener("DOMContentLoaded", function () { load(pickInitial()); });
})();
