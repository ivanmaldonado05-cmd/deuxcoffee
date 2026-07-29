# Deux Coffee Roasters — Sitio web

Rediseño del sitio de **Deux Coffee Roasters** (Paraguay). Sitio estático en
HTML/CSS/JS vanilla (sin frameworks), listo para **GitHub Pages**. Trilingüe
**ES / PT / EN**.

## Estructura

```
deux-coffee/
├── index.html            # Inicio
├── quienes-somos.html    # Quiénes somos
├── dine-in.html          # Cafeterías (Área 4, Centro, Arena, Asunción)
├── to-go.html            # Puntos To Go (Jebai, Paris, Plaza City, Coming soon)
├── menu.html             # Menú por categorías (render por JS)
├── tienda.html           # Tienda
├── contacto.html         # Contacto (WhatsApp + form)
├── assets/
│   ├── css/styles.css    # Design system: tokens de color, tipografía, componentes
│   ├── js/
│   │   ├── data.js       # ← CONTENIDO editable (menú, sucursales, tienda)
│   │   ├── i18n.js        # Motor de idiomas
│   │   └── main.js       # Nav, render, reveals, form
│   ├── i18n/{es,pt,en}.json  # Textos por idioma
│   ├── img/              # Fotos reales del cliente (WebP)
│   └── fonts/            # (para Outside Voice Medium licenciado, si se agrega)
├── NOTES.md              # ⚠️ Pendientes a completar con el cliente
├── server.cjs            # Server local opcional (solo para previsualizar)
└── .nojekyll            # Para GitHub Pages
```

## Previsualizar localmente

El sitio usa `fetch()` para los idiomas, así que necesita un servidor (no abrir
como `file://`). Cualquiera sirve:

```bash
npx serve .
```

O el server incluido (Node, sin dependencias):

```bash
node server.cjs   # http://localhost:8123
```

> Nota: si se abre el HTML directo (`file://`) el sitio igual se ve completo en
> **español** (hay un fallback embebido), pero el cambio de idioma no funciona sin
> servidor.

## Editar contenido

- **Menú / tienda / sucursales:** `assets/js/data.js` (precios, fotos, datos).
- **Textos e idiomas:** `assets/i18n/es.json`, `pt.json`, `en.json`
  (las 3 comparten las mismas claves).
- **Colores / tipografía:** variables al inicio de `assets/css/styles.css`.

### Cambiar la fuente de títulos por *Outside Voice Medium*
1. Poner el `.woff2` licenciado en `assets/fonts/` y declarar el `@font-face`.
2. Cambiar **una línea** en `styles.css`: `--font-heading: 'Outside Voice', ...`.

### Precios por moneda
En `data.js`, `price` puede ser un número (mismo valor, símbolo por idioma) o un
objeto `{ gs, brl, usd }` para montos distintos por idioma. Ver `NOTES.md`.

## Deploy a GitHub Pages
1. Subir el contenido de `deux-coffee/` a un repositorio.
2. Settings → Pages → Branch `main` / carpeta raíz.
3. El `.nojekyll` ya está incluido. Listo.

## Estado
Sitio maquetado y funcional. **Antes de publicar, ver `NOTES.md`** — faltan datos
reales del cliente (precios, descripciones, direcciones/horarios, algunas fotos).
