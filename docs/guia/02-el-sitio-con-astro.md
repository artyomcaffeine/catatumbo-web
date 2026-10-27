# 2 · El sitio con Astro

## Qué es Astro y por qué lo usamos

Astro genera HTML a partir de componentes (`.astro`) y de Markdown. Por defecto no envía JavaScript al navegador: la página llega hecha. Con `output: 'static'`, `npm run build` deja todo el sitio en `dist/` como archivos normales.

## Pasos

1. Crea el proyecto y entra en él:

   ```sh
   npm create astro@latest mi-guia -- --template minimal
   cd mi-guia
   ```

2. Añade la revisión de tipos:

   ```sh
   npm i -D @astrojs/check typescript@^6
   ```

   En este proyecto `typescript` se mantiene en `^6`, porque `@astrojs/check` 0.9.x no funciona con TypeScript 7. Cuando una herramienta tiene un límite de versión así, anótalo en `CLAUDE.md` o en el `README.md`.

3. Deja los scripts como en `package.json` del ejemplo:

   ```json
   "dev": "astro dev",
   "build": "astro build",
   "preview": "astro preview",
   "check": "astro check"
   ```

4. Configura `astro.config.mjs` (versión mínima; en el capítulo 5 se añade GitHub Pages):

   ```js
   import { defineConfig } from 'astro/config';

   export default defineConfig({
     output: 'static',
     trailingSlash: 'always',
   });
   ```

   `trailingSlash: 'always'` hace que cada página sea una carpeta con su `index.html`: `/es/ejemplo/` → `es/ejemplo/index.html`. Es la forma que mejor funciona en GitHub Pages. (En el capítulo 6 verás que la app necesita un ajuste por esto.)

5. Crea el layout común, `src/layouts/Base.astro`: el `<head>`, la barra superior, un `<slot />` para el contenido de cada página y el pie. Todas las páginas lo usan, así el `<head>` se escribe una sola vez.

6. Arranca y mira el resultado:

   ```sh
   npm run dev      # http://localhost:4321
   ```

## Dónde verlo en el ejemplo

- `src/layouts/Base.astro`: el `<head>` completo. Fíjate en `lang`, `description`, `theme-color`, los iconos (`asset('icons/…')`), los `hreflang` y el `preload` de las fuentes.
- `src/components/`: cada pieza es un componente pequeño con un comentario arriba que explica qué es. `Topbar.astro` lleva el JavaScript de la barra (abrir el menú en el móvil, cerrar el selector de idioma), escrito a mano y muy corto.

## Errores comunes

- **Meter lógica de servidor.** Nada de `output: 'server'`, adaptadores ni rutas de API: la app no puede llevar un servidor dentro.
- **Instalar un framework de UI por costumbre.** Para menús y botones basta Astro y un poco de JavaScript. Añade una dependencia solo si ahorra trabajo de verdad, y explica en el commit por qué.

## Ejercicio

Crea el proyecto, añade un `Base.astro` con `<html lang>`, `<title>`, la meta `description` y un `<slot />`, y una página `src/pages/index.astro` que lo use.

**Comprobación:** `npm run check` sin errores, y `npm run build` deja `dist/index.html`. Ábrelo con `npm run preview`.
