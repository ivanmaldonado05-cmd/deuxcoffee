# Deux Coffee Roasters — Pendientes y notas

Estado actual del sitio y lo que falta confirmar con el cliente.

## Novedades de esta versión
- **Landing con video** (`index.html`): pantalla de entrada con el video de fondo,
  logo centrado, transición de logo al abrir, botón de sonido (apagado por defecto),
  header transparente. Se entra al sitio con el logo o "Inicio".
  - El home real (con secciones) ahora es **`home.html`**.
  - ⚠️ El video se comprimió de 264 MB → **14 MB** (720p) para que cargue en la web.
    El original quedó fuera del repo. Si el cliente quiere otro video, reemplazar
    `assets/video/deux-hero.mp4` (ideal < 15 MB).
- **Modo claro/oscuro** en todo el sitio (botón ☀️/🌙 en el header, se recuerda).
- **Diseño minimalista** (blanco/negro/beige, estilo %Arabica): se quitaron las
  secciones marrones y el verde del botón de WhatsApp.
- **Tienda con carrito**: 11 productos, sticker "Más vendido" (Red Catuai),
  molienda por café (pop-up), y checkout por WhatsApp con **forma de retiro/envío**
  (Retiro en Deux Plaza / Delivery CDE / Envío nacional) + **mapa** para marcar la
  dirección (Delivery/Envío). Los costos de envío se coordinan por WhatsApp.
- **Sucursales**: cada local abre su **página individual** (`sucursal.html?id=…`)
  con galería grande, mapa de Google y texto. Sticker "Nuevo" en Área 4 y Jebai.
- **Menú**: ahora es demostrativo (solo foto + nombre). Se quitó la categoría "Otros".

## 1. Precios de tienda
- Cafés cargados: Red Catuai 250g Gs 80.000 / 500g Gs 150.000 · Yellow Bourbon
  igual · Ethiopian Yirgacheffe 250g Gs 150.000. (Con notas y recomendación barista.)
- **Falta precio** de: Juego de cafeteras, Timemore Kettle, Molino de café, Sombrilla,
  Termo, Vaso térmico → en `assets/js/data.js` (`store`, cambiar `price: null`).
- Los precios están en **Guaraníes**. Si se quiere mostrar montos en R$/US$ en PT/EN,
  hay que definirlos (hoy toda la tienda muestra Gs.).

## 2. Sucursales — horarios
Cada local ya tiene fotos (galería) + mapa. Falta cargar el **horario** de cada uno
en `assets/js/data.js` (`branches`, campo `hours`). Algunas fotos muestran horarios
(ej. Centro 07:30–18:00) pero conviene confirmarlos.

## 3. Fotos
Todas las fotos de productos, tienda y sucursales están cargadas desde el sitio actual.
(Las aguas/gaseosa/jugo se quitaron con la categoría "Otros".)

## 4. Tipografía
Cuerpo y títulos en **Jost** (la real del sitio, libre). Si el cliente quiere
*Outside Voice Medium* en títulos, pasar el `.woff2` licenciado → cambiar
`--font-heading` en `assets/css/styles.css`.

## 5. Contacto
Dirección de la sucursal principal y horario general siguen pendientes
(`contact_loc_p`, `contact_hours_p`, `footer_hours` en `assets/i18n/*.json`).

## 6. Formularios
Contacto, trabajo, franquicias y reclamos → todos abren WhatsApp con el mensaje
categorizado. Si se prefiere email/otro número, ver `initGestionForms` / `initContactForm`
en `assets/js/main.js`.
