# 5 · Publicar en GitHub Pages

## Qué conseguimos

Cada push a `main` compila el sitio y lo publica en `https://<usuario>.github.io/<repo>/`. Nadie tiene que subir archivos a mano.

## 5.1 · El problema de la ruta base

En GitHub Pages el sitio no vive en la raíz del dominio, sino en una subcarpeta con el nombre del repositorio: `https://artyomcaffeine.github.io/LabCatatumboProject/`. En la app, en cambio, vive en `/`. El mismo código tiene que funcionar en los dos casos.

Astro lo resuelve con `base`. En `astro.config.mjs`:

```js
const pages = process.env.PUBLIC_DEPLOY_TARGET === 'pages';
const [owner = 'owner', repo = 'catatumbo-web'] = (process.env.GITHUB_REPOSITORY ?? '').split('/').filter(Boolean);

export default defineConfig({
  output: 'static',
  site: pages ? `https://${owner.toLowerCase()}.github.io` : undefined,
  base: pages ? `/${repo}` : '/',
  // …
});
```

- GitHub Actions define `GITHUB_REPOSITORY` (`"usuario/Repo"`), así que no hay nombres escritos a mano.
- Solo el build de Pages pone `PUBLIC_DEPLOY_TARGET=pages`. Sin la variable, la base es `/` (la app y un hosting propio).
- Como todos los enlaces pasan por `getRelativeLocaleUrl` y `asset()` (capítulo 3), la base se añade sola en todas partes.
- Ese build también añade `<meta name="robots" content="noindex">` (`Base.astro`): es una vista previa y no debe salir en los buscadores.

## 5.2 · El workflow

`.github/workflows/deploy.yml`, resumido:

```yaml
on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: withastro/action@v6
        with:
          node-version: 24
        env:
          PUBLIC_DEPLOY_TARGET: 'pages'
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v5
```

`withastro/action` instala, compila y sube `dist/`; `deploy-pages` lo publica.

## 5.3 · Activar Pages (una sola vez)

En GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**. La app de GitHub para móvil no tiene este ajuste; desde el teléfono, ábrelo en el navegador (con "Versión de escritorio" si hace falta). Si el repositorio es privado, Pages necesita un plan de pago.

## Errores que nos pasaron de verdad

1. **"Ensure GitHub Pages has been enabled" (404 al desplegar).** El build salía bien, pero el paso `deploy` fallaba: Pages no estaba activado. Solución: el paso 5.3, y volver a lanzar el workflow (botón **Re-run jobs** en la pestaña Actions).
2. **La página cargaba sin estilos y todos los enlaces daban 404.** La configuración pasaba el nombre del repo a minúsculas (`/labcatatumboproject/`), pero GitHub publica en `/LabCatatumboProject/` y **la ruta distingue mayúsculas**. Solución: solo el usuario va en minúsculas (el dominio), el nombre del repo se deja tal cual. Lección: después de publicar, comprueba la web de verdad (estilos, fotos, enlaces), no solo que el workflow salga en verde.

## Ejercicio

Sube tu proyecto a GitHub, añade el workflow y activa Pages.

**Comprobación:** en la pestaña Actions, los jobs `build` y `deploy` salen en verde; en la web publicada, la pestaña Red del navegador no muestra ningún 404, y el código fuente de la página incluye `noindex`. Cambia un texto, haz push a `main` y comprueba que la web se actualiza sola en uno o dos minutos.
