# Catatumbo · Lightning guide

A static website for tourists who want to visit Lake Maracaibo and see the Catatumbo Lightning. It is in Spanish, English, German and French, and built with [Astro](https://astro.build).

> The German and French texts are drafts. Have a native speaker review them before publishing. They are marked with `draft_translation: true`.

## Run it

Needs Node 22.12 or newer.

```sh
npm install
npm run dev       # http://localhost:4321
npm run build     # static site in dist/
npm run preview   # serve dist/ locally
npm run check     # type-check
```

## Edit the content

- **Page text:** Markdown files in `src/content/pages/<language>/`. The file name becomes the URL (`es/visitar.md` → `/es/visitar/`).
- **Menu, buttons and the home page:** `src/i18n/ui.ts`.

## Client preview on GitHub Pages

1. Push this folder to a GitHub repository.
2. On GitHub, go to **Settings → Pages → Source** and choose **GitHub Actions**.
3. Every push to `main` builds and publishes `https://<user>.github.io/<repo>/`. The workflow is in `.github/workflows/deploy.yml`.

The preview is marked `noindex`, so search engines skip it. For the final host, run `npm run build` and upload `dist/` to any static host.

## Credits

Photographs: Fernando Flores, Wikimedia Commons, CC BY-SA 2.0. Icons: Lucide (ISC). Fonts: Fraunces, DM Sans, DM Mono (SIL OFL).
