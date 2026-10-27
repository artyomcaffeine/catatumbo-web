# Catatumbo · Guía del relámpago

Sitio web estático. Hecho con [Astro](https://astro.build).

> Los textos en alemán y francés son borradores. Antes de publicarlos, un hablante nativo debe revisarlos. Están marcados con `draft_translation: true`.

## Despliegue y previsualización

Necesita Node 22.12 o más reciente.

```sh
npm install
npm run dev       # despliega en http://localhost:4321
npm run build     # sitio estático en dist/
npm run preview   # previsualiza dist/ en local
npm run check     # revisa los tipos
```

## App para Android e iOS

La app empaqueta el mismo sitio con [Capacitor](https://capacitorjs.com) y funciona sin internet.

```sh
npm run app:build     # compila el sitio para la app y lo copia a android/ e ios/
npm run app:android   # abre Android Studio (necesita el Android SDK)
npm run app:ios       # abre Xcode (solo en macOS)
npm run app:assets    # regenera iconos y splash desde assets/*.svg
```

Repite `npm run app:build` después de cada cambio en el contenido o en el código, antes de compilar la app.

## Editar el contenido

- **Texto de las páginas:** archivos Markdown en `src/content/pages/<idioma>/`. El nombre del archivo es la URL (`es/visitar.md` → `/es/visitar/`).
- **Menú, botones y página de inicio:** `src/i18n/ui.ts`.

## Vista previa para el cliente en GitHub Pages

1. Sube esta carpeta a un repositorio de GitHub.
2. En GitHub, ve a **Settings → Pages → Source** y elige **GitHub Actions**.
3. Cada push a `main` compila y publica `https://<usuario>.github.io/<repo>/`. El workflow está en `.github/workflows/deploy.yml`.

La vista previa está marcada como `noindex`, así que los buscadores no la indexan. Para el hosting final, ejecuta `npm run build` y sube `dist/` a cualquier hosting estático.

## Guía para aprender a hacer un proyecto así

En [`docs/guia/`](docs/guia/README.md) hay una guía paso a paso, para alguien junior, que usa este proyecto como ejemplo: sitio Astro multilingüe, GitHub Pages y app sin conexión con Capacitor.

## Créditos

Fotografías: Fernando Flores, Wikimedia Commons, CC BY-SA 2.0. Iconos: Lucide (ISC). Tipografías: Fraunces, DM Sans, DM Mono (SIL OFL).
