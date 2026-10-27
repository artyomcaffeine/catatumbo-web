# 3 · Idiomas y contenido

Este es el corazón del proyecto. Al terminar tendrás páginas Markdown en varios idiomas, un menú que se construye solo y un selector de idioma que lleva a la misma página en el otro idioma.

## 3.1 · Los idiomas en Astro

En `astro.config.mjs`:

```js
i18n: {
  defaultLocale: 'es',
  locales: ['es', 'en', 'de', 'fr'],
  routing: { prefixDefaultLocale: true },
},
```

`prefixDefaultLocale: true` hace que también el español lleve prefijo (`/es/`). Así todos los idiomas se tratan igual y la raíz `/` queda libre para elegir idioma.

## 3.2 · El contenido: una colección con esquema

El contenido vive en `src/content/pages/<idioma>/`, un archivo por página e idioma. El nombre del archivo es la URL: `es/ejemplo.md` → `/es/ejemplo/`.

El esquema (`src/content.config.ts`) dice qué campos lleva cada archivo:

```ts
const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: ({ image }) => z.object({
    key: z.enum(['example', 'privacy' /* , … una por página */]),
    title: z.string(),
    description: z.string(),
    order: z.number(),
    menu: z.boolean().default(true),        // false: no sale en el menú (se enlaza a mano, p. ej. desde el pie)
    photo: image().optional(),
    photoAlt: z.string().optional(),
    draft_translation: z.boolean().optional(),
  }),
});
```

La pieza clave es **`key`**: es igual en todos los idiomas (`es/ejemplo.md` y `en/example.md` tienen `key: example`). Así se sabe que son la misma página aunque la URL cambie de idioma a idioma. Que `key` sea un `z.enum` hace que un error al escribirla rompa el build en vez de crear una página huérfana.

Un archivo de contenido empieza así (`src/content/pages/es/ejemplo.md`):

```markdown
---
key: example
title: Ejemplo
description: Una frase que resume la página (sale en el menú, en las tarjetas y en la meta description).
order: 2
---

## El primer título de la página.
```

Los datos que son iguales en todos los idiomas no se repiten en cuatro Markdown: van en un archivo de datos. En el ejemplo hay una así: un archivo YAML en `src/content/`, cargado con el loader `file()` en `content.config.ts` y mostrado por un componente de `src/components/`.

## 3.3 · Una plantilla para todas las páginas

`src/pages/[lang]/[...slug].astro` genera todas las páginas Markdown:

```astro
export async function getStaticPaths() {
  const pages = await getCollection('pages');
  return pages.map((page) => ({ params: { lang: langOf(page), slug: slugOf(page) }, props: { page } }));
}
```

`getStaticPaths` le dice a Astro qué páginas existen; en un sitio estático todas se generan al compilar. La página de inicio de cada idioma es `src/pages/[lang]/index.astro`.

## 3.4 · Los enlaces: siempre con funciones

`src/lib/pages.ts` reúne todo lo relativo a URLs:

```ts
export const homeUrl = (lang: Lang) => toFile(getRelativeLocaleUrl(lang));
export const pageUrl = (page: Page) => toFile(getRelativeLocaleUrl(langOf(page), slugOf(page)));
export async function urlOf(key: PageKey, lang: Lang) { … }      // la página `key` en el idioma `lang`
export async function alternates(key?: PageKey) { … }           // la misma página en todos los idiomas
export const asset = (path: string) => import.meta.env.BASE_URL.replace(/\/?$/, '/') + path;  // archivos de public/
```

`getRelativeLocaleUrl` añade la ruta base y el prefijo del idioma. `toFile` es el ajuste para la app (capítulo 6). `alternates` alimenta el selector de idioma de `Topbar.astro` y los `<link rel="alternate" hreflang>` de `Base.astro`.

El selector es un desplegable nativo, `<details>` con `<summary>`: muestra el código del idioma actual y, al pulsarlo, la lista de todos los idiomas de `LANGS`. Así un idioma nuevo aparece solo, sin tocar el selector, y el desplegable se abre también sin JavaScript. El script de `Topbar.astro` solo lo cierra al pulsar fuera o con Escape.

**Regla:** nunca escribas `href="/es/ejemplo/"`. Usa `pageUrl(page)`, `urlOf('example', lang)` o `homeUrl(lang)`. Los archivos de `public/` se enlazan con `asset('img/…')`.

## 3.5 · Los textos de la interfaz, tipados

Menú, botones y portada no están en Markdown: están en `src/i18n/ui.ts`.

```ts
export const LANGS = ['es', 'en', 'de', 'fr'] as const;
export type Lang = (typeof LANGS)[number];

const es = { 'nav.lang': 'Idioma', /* … */ };
type UI = Record<keyof typeof es, string>;
const en: UI = { 'nav.lang': 'Language', /* … */ };

export function useTranslations(lang: Lang) {
  return (key: UIKey) => UI_TEXT[lang][key];
}
```

El español es la referencia: cada otro idioma se tipa como `UI`, así que **si falta una clave, `npm run check` falla**. En un componente: `const t = useTranslations(lang);` y luego `{t('nav.lang')}`.

## 3.6 · La raíz del sitio

`src/pages/index.astro` no tiene contenido: un script corto manda al visitante al último idioma que eligió (`localStorage`, clave `ct.lang`) o, si no hay, al idioma del navegador; y si nada coincide, al español. Sin JavaScript muestra una lista de idiomas. `Topbar.astro` guarda la elección cuando se pulsa un idioma.

## Errores comunes

- **Una traducción con `key` distinta.** La página sale, pero el selector de idioma no la encuentra y lleva al inicio. El `z.enum` evita los errores de escritura; revisa que cada idioma tenga todas las `key`.
- **Traducir a máquina y publicar.** En el ejemplo, de y fr llevan `draft_translation: true` hasta que los revise un hablante nativo.
- **Repetir datos en cada idioma.** Si un dato (una URL, una fecha) es igual en todos los idiomas, va en un archivo de datos, no en cuatro Markdown.

## Ejercicio

Con dos idiomas (es, en): crea dos páginas por idioma con `key`, un menú en `Base.astro` construido con las páginas del idioma (ordenadas por `order`) y un selector que lleve a la misma página en el otro idioma.

**Comprobación:** `npm run check` sin errores. En `/es/<página>/`, el selector "EN" lleva a la página equivalente en inglés, no al inicio. Borra una clave de `en` en `ui.ts`: `npm run check` tiene que fallar.
