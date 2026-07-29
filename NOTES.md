# Deux Coffee Roasters — Pendientes antes de publicar

Lista de todo lo que quedó marcado como `[PENDIENTE]` en el sitio. Nada acá es
un bug: son datos reales que **no existían** en el sitio actual ni en redes y hay
que confirmar con el cliente. Todo se completa editando **un solo archivo** salvo
donde se indique: `assets/js/data.js`.

---

## 1. Precios (todos) — `assets/js/data.js`
Ningún producto del sitio actual tiene precio publicado. Todos aparecen como
**"Precio pendiente"** (localizado por idioma).

- **Cómo cargarlos:** en `data.js`, cambiar `price: null` por un número.
  - Si el precio es el mismo valor base y solo cambia el símbolo:
    `price: 25000` → se muestra `Gs. 25.000` / `R$ 25.000` / `$ 25.000`.
  - ⚠️ **Importante:** el símbolo lo pone el idioma automáticamente, pero **los
    montos por moneda los define el cliente** — no es una conversión automática.
    Para montos distintos por moneda usar el formato objeto:
    `price: { gs: 25000, brl: 25, usd: 4 }`
- Falta definir precios de: **39 productos del menú** + **5 artículos de la tienda**
  + los **adicionales** (Dosis extra de café, Syrup, Chantilly, Leche sin lactosa).

## 2. Descripciones cortas (todas) — `assets/js/data.js`
Cada producto muestra **"Descripción a confirmar"**. Falta 1 línea por producto
(ingredientes o estilo de preparación). Actualmente el layout está listo; solo
hay que agregar el campo de descripción cuando el cliente lo pase.

## 3. Datos de sucursales — `assets/js/data.js` → `branches`
Cada sucursal ya tiene **foto real de fachada/interior + mapa de Google embebido**
(extraídos del sitio actual). Falta solo:
- **Horario** de cada sucursal (`hours`) — no está como texto en el sitio actual;
  algunas fotos muestran horarios (ej. Centro 07:30–18:00, Plaza City Lun–Vie
  07:00–21:00) pero conviene que el cliente los confirme por sucursal.
- Sucursales con foto + mapa listos: **Área 4, Centro, Arena, Asunción** (Dine In)
  y **Jebai, Paris, Plaza City** (To Go). La 4.ª de To Go es "Coming soon".

## 4. Fotos faltantes → marcadas como "Foto pendiente"
Recuperé del sitio actual casi todas (Americano, Mousse mburucuyá, Tumbler, etc.).
Quedan sin foto **solo las que tampoco existen en el sitio original**:
- **Cold Brew Macchiato** y **Cold Brew Moccha** (daban **404** en el sitio actual).
- **Agua sin gas** y **Agua con gas** (el sitio no tiene foto de estos).

## 5. Asignaciones de foto a confirmar (según el orden del menú del sitio actual)
El mapeo foto→producto se hizo siguiendo el **orden exacto** del menú del sitio
original, pero como las imágenes no tienen etiqueta, conviene una revisión rápida:
- **Cookies:** `cookie1→Avena`, `cookie2→Tradicional`, `cookie3→Peanut & choco`.
- **Salados / Dulces / Otros:** asignados en el orden del sitio; confirmar que cada
  foto corresponde al producto (ej. `Gaseosa → soda-italiana`, `Jugo → Frozen-Ade`).

## 6. Tipografías
- **Cuerpo (resuelto):** el sitio actual usa **Jost** (Google Fonts, libre). El
  rediseño usa la misma → variable `--font-body`.
- **Títulos:** también **Jost** por ahora (rima con el logo). El brief mencionaba
  **"Outside Voice Medium"** (fuente **paga**, no está en el sitio actual: la home
  en vivo carga Jost + "Graphemic", no Outside Voice). Si se quiere usar Outside
  Voice en títulos, el cliente debe pasar el **`.woff2` licenciado** o el link de
  **Adobe Fonts**; luego se cambia **una sola línea**: `--font-heading` en
  `assets/css/styles.css` (y agregar el `@font-face`).
- **"Graphemic"** (la usa el menú del sitio viejo): **licencia desconocida**, no se
  redistribuyó. Si el cliente tiene licencia y el `.otf`, se puede sumar.

## 7. Contacto
- **Dirección de la sucursal principal** y **horario general**: pendientes
  (editar en `assets/i18n/es.json` / `pt.json` / `en.json` → `contact_loc_p`,
  `contact_hours_p`, y `footer_hours`).
- **Formulario:** al enviar abre **WhatsApp** con el mensaje ya escrito (funciona
  sin backend). Si se prefiere recibir por email, se puede conectar Formspree /
  Getform / EmailJS en `assets/js/main.js` → `initContactForm()`.
- **Acordeón "Trabajo / Franquicias / Reclamos":** cada uno abre WhatsApp con el
  mensaje **ya categorizado** (`*Quiero trabajar en Deux*`, etc.). Mismo criterio:
  si el cliente quiere que RRHH/franquicias/reclamos lleguen por **email** o a
  **números distintos**, se ajusta en `initGestionForms()` (`assets/js/main.js`).
  Para trabajo, si quieren recibir **CV adjunto**, WhatsApp permite adjuntar el
  archivo al abrir el chat (o conectar un form con subida de archivos).

## 8. Otros / opcionales
- **WhatsApp:** ya configurado con `+595 973 853 007` (`https://wa.me/595973853007`).
- **Favicon:** usa `logo.webp`. Opcional: generar un set `.ico`/`.png` para
  compatibilidad total con navegadores viejos.
- **Imágenes sin usar:** `togo9.webp` y `togo13.webp` quedaron descargadas por si
  se necesitan (espresso / iced extra).
- **Hero:** imagen `cold-brew.webp` (limpia, liviana). Cambiar el hero = 1 línea
  en `index.html` (`.hero__media img`).
- **Video corto opcional:** si más adelante se quiere movimiento en el hero, dejar
  un `.mp4` comprimido (<3MB, muted, con `poster`) — hoy es imagen estática a
  propósito (el video pesado del sitio viejo fue lo que se reemplazó).

---

### Resumen para pedirle al cliente
1. Lista de **precios** por producto (y si difieren en Gs / R$ / US$).
2. Una **descripción de 1 línea** por producto.
3. **Dirección + horario + link de Maps** de las 8 sucursales.
4. **Fotos** de: Americano, Mocca, Cold Brew Macchiato, Cold Brew Moccha, Mousse
   mburucuyá & choco, Agua c/ y s/ gas, Tumbler, y **fachadas de cada sucursal**.
5. Confirmar mapeo de **cookies** y **salados**.
6. Si quieren **Outside Voice Medium** en títulos: pasar el `.woff2` o link de Adobe Fonts.
7. **Dirección + horario** de la sucursal principal para Contacto.
