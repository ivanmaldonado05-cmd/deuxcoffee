/* =============================================================
   DEUX — Datos de contenido (menú, sucursales, tienda)
   ► ÚNICO archivo que el cliente edita para completar pendientes.
     - price: null  → muestra "[PRECIO PENDIENTE]". Poné un número (mismo
       valor base; el símbolo de moneda lo agrega el idioma automáticamente).
       Si el precio difiere por moneda, usá: { gs: 25000, brl: 25, usd: 4 }.
     - img: null    → muestra "[FOTO PENDIENTE]".
     - Fotos y mapas extraídos del sitio actual (deuxcoffee.com.py).
   ============================================================= */
window.DEUX_DATA = {

  /* ---------- MENÚ (mapeo de fotos según el orden real del sitio) ---------- */
  menu: [
    { id: "hot", cat_i18n: "cat_hot", items: [
      { n: "Espresso",        img: "togo11",    price: null },
      { n: "Espresso duplo",  img: "togo12",    price: null },
      { n: "Americano",       img: "americano", price: null },
      { n: "Flat White",      img: "togo14",    price: null },
      { n: "Latte",           img: "togo5",     price: null },
      { n: "Capuccino",       img: "togo6",     price: null },
      { n: "Mocca",           img: "togo9",     price: null },
      { n: "Caramel",         img: "togo2",     price: null }
    ]},
    { id: "iced", cat_i18n: "cat_iced", items: [
      { n: "Iced Americano",  img: "togo13", price: null },
      { n: "Cold Brew",       img: "togo1",  price: null },
      { n: "Iced Mocca",      img: "togo10", price: null },
      { n: "Iced Caramel",    img: "togo3",  price: null }
    ]},
    { id: "coldbrew", cat_i18n: "cat_coldbrew", items: [
      { n: "Cold Brew",                img: "cold-brew",               price: null },
      { n: "Cold Brew Latte",          img: "cold-brew-latte",         price: null },
      { n: "Cold Brew Vainilla Latte", img: "cold-brew-vainilla-latte", price: null },
      { n: "Cold Brew Macchiato",      img: null, price: null },   // no existe en el sitio actual (404)
      { n: "Cold Brew Moccha",         img: null, price: null }    // no existe en el sitio actual (404)
    ]},
    { id: "frappe", cat_i18n: "cat_frappe", items: [
      { n: "Frappe de vainilla",  img: "togo8", price: null },
      { n: "Frappe de chocolate", img: "togo7", price: null },
      { n: "Frappe de matcha",    img: "togo4", price: null }
    ]},
    { id: "dulces", cat_i18n: "cat_dulces", items: [
      { n: "Brownie",                    img: "brownie-1", price: null },
      { n: "Mocca cake",                 img: "torta1",    price: null },
      { n: "Triple choco",               img: "torta",     price: null },
      { n: "Mousse mburucuyá & choco",   img: "mousse",    price: null },
      { n: "Red velvet",                 img: "redvelvet", price: null },
      { n: "Cinnamon roll",              img: "roll",      price: null },
      { n: "Cookie de Avena",            img: "cookie1",   price: null },
      { n: "Cookie Tradicional",         img: "cookie2",   price: null },
      { n: "Cookie Peanut & choco",      img: "cookie3",   price: null }
    ]},
    { id: "salados", cat_i18n: "cat_salados", items: [
      { n: "Egg & Bacon Brioche",   img: "salado5", price: null },
      { n: "Foccacia Turkey Melt",  img: "salado6", price: null },
      { n: "Caprese Grilled Cheese",img: "salado2", price: null },
      { n: "Croissant",             img: "salado1", price: null },
      { n: "Pan de queso",          img: "salado4", price: null },
      { n: "Coxinha",               img: "salado3", price: null }
    ]},
    { id: "otros", cat_i18n: "cat_otros", items: [
      { n: "Agua sin gas", img: null, price: null },              // sin foto en el sitio actual
      { n: "Agua con gas", img: null, price: null },              // sin foto en el sitio actual
      { n: "Gaseosa",      img: "soda-italiana-1", price: null },
      { n: "Jugo natural", img: "Frozen-Ade",      price: null }
    ]}
  ],

  /* Adicionales (chips, sin foto) */
  addons: ["Dosis extra de café", "Syrup", "Chantilly", "Leche sin lactosa"],

  /* ---------- SUCURSALES (foto real + mapa de Google del sitio actual) ---------- */
  branches: {
    dinein: [
      { name: "Área 4",   img: "suc-area4",    hours: null,
        maps: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3600.143904942153!2d-54.62491987196657!3d-25.533583009260287!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94f68f004ef8d67b%3A0x290a5358746600b6!2sDeux%20Coffee%20%C3%81rea%204!5e0!3m2!1ses!2sbr!4v1779566100554!5m2!1ses!2sbr" },
      { name: "Centro",   img: "suc-centro",   hours: null,
        maps: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3600.807853571016!2d-54.6119528!3d-25.511454!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94f6850c5ecaf2bf%3A0x97a3e6f7c4e5b98a!2sDeux%20Coffee%20Centro!5e0!3m2!1ses!2sbr!4v1779566280828!5m2!1ses!2sbr" },
      { name: "Arena",    img: "suc-arena",    hours: null,
        maps: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3600.827968559699!2d-54.6345114!3d-25.5107833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94f68566fb855555%3A0x3986d6d22073ceda!2sDeux%20Coffee%20Roasters%20Arena%20Shops!5e0!3m2!1ses!2sbr!4v1779565807675!5m2!1ses!2sbr" },
      { name: "Asunción", img: "suc-asuncion", hours: null,
        maps: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3607.5130937326735!2d-57.59378312552512!3d-25.286959777653202!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x945da7d7e363d95b%3A0x5ba8ee505d622ccb!2sDeux%20Coffee%20Roasters!5e0!3m2!1ses!2sbr!4v1779880655448!5m2!1ses!2sbr" }
    ],
    togo: [
      { name: "Jebai",      img: "suc-jebai",     hours: null,
        maps: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3600.8318800081297!2d-54.61205332551607!3d-25.510652877510452!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94f6850045c6544d%3A0xd4585139be2d53c9!2sDeux%20Coffee%20Roasters%20Jebai!5e0!3m2!1ses!2sbr!4v1779832389194!5m2!1ses!2sbr" },
      { name: "Paris",      img: "suc-paris",     hours: null,
        maps: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3600.7888595699787!2d-54.60754358968812!3d-25.51208730747655!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94f691004602f731%3A0x710f7aec09862db3!2sDeux%20Coffee%20Roasters%20-%20Shop.%20Paris!5e0!3m2!1ses!2sbr!4v1779564461329!5m2!1ses!2sbr" },
      { name: "Plaza City", img: "suc-plazacity", hours: null,
        maps: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3176.4249481920583!2d-54.67830394772834!3d-25.497804170159586!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94f685007f6c8a45%3A0xc39e97a060330c69!2sCafeter%C3%ADa%20Deux%20Plaza%20City!5e1!3m2!1ses!2spy!4v1779488976864!5m2!1ses!2spy" },
      { name: "Coming soon", img: null, hours: null, maps: null, soon: true }
    ]
  },

  /* ---------- TIENDA ---------- */
  store: [
    { n: "Drip Box Ethiopia",     img: "Drip-BOX-Ethiopia",     price: null },
    { n: "Tumbler",               img: "tumbler",               price: null },
    { n: "Moledor de café",       img: "moledor-de-cafe",       price: null },
    { n: "Drip travel kit",       img: "drip-travel-kit",       price: null },
    { n: "Tetera cuello de cisne",img: "TETERA-CUELLO-DE-CISNE",price: null }
  ]
};
