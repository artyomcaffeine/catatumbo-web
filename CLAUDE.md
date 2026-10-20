# CLAUDE.md

A static, multilingual Astro site for tourists visiting Lake Maracaibo to see the Catatumbo Lightning. Languages: es (default), en, de, fr. The look comes from the Catatumbo Field Guide design system (copied from the earlier `ClaudeCatatumboAstro` project).

## Project scope (current phase)

- Static Astro site, `output: 'static'`. No SSR, no adapters.
- Languages: es, en, de, fr, with Astro's built-in i18n routing. Every language has a prefix (`/es/`, `/en/`, …).
- Content lives in Markdown under `src/content/pages/<lang>/`.
- No database, CMS, auth, bookings, weather, GPS, maps, service worker or app/offline features. Those are future phases; don't prepare for them.
- No UI frameworks (React/Vue/etc.) and no new dependencies without asking first. Today the only dependency is `astro`.
- Keep the site fully static with no essential third-party embeds (maps, videos, widgets), so it can later become a PWA or Capacitor app.
- Prefer fewer files. Explain any change in plain language before making it. Work in small steps.

## Commands

```sh
npm run dev       # http://localhost:4321
npm run build     # static site in dist/
npm run preview   # serve dist/
npm run check     # type-check .astro and .ts
```

There are no tests. `npm run check` plus a build are the verification steps. Look at the result in a browser.
- Keep `typescript` at `^6`, because `@astrojs/check` 0.9.x does not support TS 7.
- When run from an agent, `astro dev` / `astro preview` detach. Stop them with `npx astro dev stop` / `npx astro preview stop`.

## How it fits together

- `src/content.config.ts` defines the `pages` collection. Each Markdown file has `key` (the same in every language; it links translations), `title`, `description`, `order` (menu position), and optionally `photo`/`photoAlt` and `draft_translation`. The file name is the URL: `es/relampago.md` → `/es/relampago/`.
- `src/pages/[lang]/[...slug].astro` renders every Markdown page. `src/pages/[lang]/index.astro` is the home page. `src/pages/index.astro` (the site root) redirects to the visitor's language and shows a language picker without JavaScript.
- `src/i18n/ui.ts` holds the interface text (menu, buttons, home page) and the list of languages (`LANGS`). Each language is typed against `es`, so a missing key is a type error. Keep every language in sync.
- `src/lib/pages.ts` holds the helpers for finding pages and building URLs.
- `src/layouts/Base.astro` holds the `<head>`, top bar and footer. `src/components/` holds the parts.

## Links and the base path

The same code builds for the GitHub Pages preview (served under `/<repo>/`) and for the root (`/`, the final host or an app). So:
- Link to pages with `pageUrl()`, `urlOf()` and `homeUrl()` from `src/lib/pages.ts`. These use `getRelativeLocaleUrl`. Never hand-write `/es/…`.
- Link to files in `public/` with `asset('img/…')`.
- `PUBLIC_DEPLOY_TARGET=pages` (set by `.github/workflows/deploy.yml`) switches `site`/`base` in `astro.config.mjs` and adds `noindex`.

## Adding things

- **A page:** add one Markdown file per language with the same `key`, and add the key to the `z.enum` in `content.config.ts`. Then give it a card colour and icon in `src/pages/[lang]/index.astro` (`CARD`).
- **A language:** add it to `LANGS`/`LANG_NAMES` in `ui.ts` and to `locales` in `astro.config.mjs`, add its `ui.ts` block, and add a folder of Markdown pages.
- de and fr are draft translations (`draft_translation: true`) until a native speaker reviews them.

## Styling

Styles load in this order: `tokens.css`, then `bundle.css`, then `site.css`.
- `tokens.css` holds the design tokens and type classes (`display-*`, `copy-*`, `mono-*`). Don't hand-edit it.
- `bundle.css` holds the design system's `ct-*` component styles. Keep it unchanged.
- `site.css` is the page layer. All site-specific CSS goes here, including the `.prose` styles for Markdown.
- Square corners everywhere are part of the design. Dark bands use `data-theme="night"`.
