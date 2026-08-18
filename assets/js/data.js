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
      { n: "Espresso",        img: "togo11",    cafe: "cafe4",  price: null },
      { n: "Espresso duplo",  img: "togo12",    cafe: "cafe11", price: null },
      { n: "Americano",       img: "americano", cafe: "cafe12", price: null },
      { n: "Flat White",      img: "togo14",    cafe: "cafe8",  price: null },
      { n: "Latte",           img: "togo5",     cafe: "cafe10", price: null },
      { n: "Capuccino",       img: "togo6",     cafe: "cafe9",  price: null },
      { n: "Mocca",           img: "togo9",     cafe: "cafe7",  price: null },
      { n: "Caramel",         img: "togo2",     cafe: "cafe3",  price: null }
    ]},
    { id: "iced", cat_i18n: "cat_iced", items: [
      { n: "Iced Americano",  img: "togo1",  cafe: "cafe1", price: null },
      { n: "Iced Mocca",      img: "togo10", cafe: "cafe6", price: null },
      { n: "Iced Caramel",    img: "togo3",  cafe: "cafe2", price: null }
    ]},
    { id: "coldbrew", cat_i18n: "cat_coldbrew", items: [
      { n: "Cold Brew",         img: "togo13", cafe: "cafe5", price: null },
      { n: "Cold Brew Moccha",  img: "togo10", cafe: "cafe6", price: null },
      { n: "Cold Brew Caramel", img: "togo3",  cafe: "cafe2", price: null }
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
  ],

  /* Adicionales (chips, sin foto) */
  addons: ["Dosis extra de café", "Syrup", "Chantilly", "Leche sin lactosa"],

  /* ---------- SUCURSALES (foto real + mapa de Google del sitio actual) ---------- */
  branches: {
    dinein: [
      { name: "Área 4",   isNew: true, ig: "https://www.instagram.com/deuxcoffee.a4/", imgs: ["area4-1","area4-2","area4-3","area4-4","area4-5"], hours: null,
        maps: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3600.143904942153!2d-54.62491987196657!3d-25.533583009260287!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94f68f004ef8d67b%3A0x290a5358746600b6!2sDeux%20Coffee%20%C3%81rea%204!5e0!3m2!1ses!2sbr!4v1779566100554!5m2!1ses!2sbr" },
      { name: "Centro",   ig: "https://www.instagram.com/deuxcoffee.centro/", imgs: ["centro-1","centro-2","centro-3","centro-4","centro-5"], hours: null,
        maps: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3600.807853571016!2d-54.6119528!3d-25.511454!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94f6850c5ecaf2bf%3A0x97a3e6f7c4e5b98a!2sDeux%20Coffee%20Centro!5e0!3m2!1ses!2sbr!4v1779566280828!5m2!1ses!2sbr" },
      { name: "Arena",    ig: "https://www.instagram.com/deuxcoffee.arena/", imgs: ["arena-1","arena-2","arena-3","arena-4","arena-5"], hours: null,
        maps: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3600.827968559699!2d-54.6345114!3d-25.5107833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94f68566fb855555%3A0x3986d6d22073ceda!2sDeux%20Coffee%20Roasters%20Arena%20Shops!5e0!3m2!1ses!2sbr!4v1779565807675!5m2!1ses!2sbr" },
      { name: "Asunción", ig: "https://www.instagram.com/deuxcoffee.asu/", imgs: ["asuncion-1","asuncion-2","asuncion-3"], hours: null,
        maps: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3607.5130937326735!2d-57.59378312552512!3d-25.286959777653202!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x945da7d7e363d95b%3A0x5ba8ee505d622ccb!2sDeux%20Coffee%20Roasters!5e0!3m2!1ses!2sbr!4v1779880655448!5m2!1ses!2sbr" }
    ],
    togo: [
      { name: "Jebai",      isNew: true, ig: "https://www.instagram.com/deuxcoffee.jebai/", imgs: ["jebai-1","jebai-2","jebai-3","jebai-4","jebai-5"], hours: null,
        maps: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3600.8318800081297!2d-54.61205332551607!3d-25.510652877510452!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94f6850045c6544d%3A0xd4585139be2d53c9!2sDeux%20Coffee%20Roasters%20Jebai!5e0!3m2!1ses!2sbr!4v1779832389194!5m2!1ses!2sbr" },
      { name: "Paris",      ig: "https://www.instagram.com/deuxcoffee.paris/", imgs: ["paris-1","paris-2","paris-3","paris-4","paris-5"], hours: null,
        maps: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3600.7888595699787!2d-54.60754358968812!3d-25.51208730747655!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94f691004602f731%3A0x710f7aec09862db3!2sDeux%20Coffee%20Roasters%20-%20Shop.%20Paris!5e0!3m2!1ses!2sbr!4v1779564461329!5m2!1ses!2sbr" },
      { name: "Plaza City", ig: "https://www.instagram.com/deuxcoffee.plz/", imgs: ["plazacity-1","plazacity-2","plazacity-3","plazacity-4","plazacity-5"], hours: null,
        maps: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3176.4249481920583!2d-54.67830394772834!3d-25.497804170159586!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94f685007f6c8a45%3A0xc39e97a060330c69!2sCafeter%C3%ADa%20Deux%20Plaza%20City!5e0!3m2!1ses!2spy!4v1779488976864!5m2!1ses!2spy" },
      { name: "Coming soon", imgs: null, hours: null, maps: null, soon: true }
    ]
  },

  /* ---------- TIENDA (11 productos reales del sitio actual) ----------
     - Precios en Guaraníes.  grind:true → abre pop-up de molienda al agregar.
     - bestseller:true → sticker "Más vendido". */
  store: [
    { n: "Café Red Catuai · 500g",          img: "store-red-catuai-500",    price: 150000, grind: true, bestseller: true,
      notes: "Chocolate, almendrado", brew: "Espresso, Cafetera Italiana, Aeropress" },
    { n: "Café Red Catuai Brazil · 250g",   img: "store-red-catuai-250",    price: 80000,  grind: true, bestseller: true,
      notes: "Chocolate, almendrado", brew: "Espresso, Cafetera Italiana, Aeropress" },
    { n: "Café Yellow Bourbon · 500g",      img: "store-yellow-bourbon-500",price: 150000, grind: true,
      notes: "Naranja, miel", brew: "Espresso, Cafetera Italiana, Aeropress" },
    { n: "Café Yellow Bourbon Brazil · 250g", img: "store-yellow-bourbon-250", price: 80000, grind: true,
      notes: "Naranja, miel", brew: "Espresso, Cafetera Italiana, Aeropress" },
    { n: "Café Ethiopian Yirgacheffe · 250g", img: "store-ethiopian-250",   price: 150000, grind: true,
      notes: "Jazmín, durazno, floral", brew: "Filtrados (V60, Kalita, Chemex)" },
    { n: "Juego de cafeteras Deux",         img: "store-juego-cafeteras",   price: null },
    { n: "Timemore Kettle",                 img: "store-timemore-kettle",   price: null },
    { n: "Molino de café · Set",            img: "store-molino-set",        price: null },
    { n: "Sombrilla Deux",                  img: "store-sombrilla",         price: null },
    { n: "Termo Deux",                      img: "store-termo",             price: null },
    { n: "Vaso térmico Deux",               img: "store-vaso-termico",      price: null }
  ],

  /* opciones de molienda (pop-up al agregar café) */
  grindOptions: ["En grano", "Espresso", "V60 / Filtrado", "Prensa Francesa", "Moka", "No estoy seguro"]
};
