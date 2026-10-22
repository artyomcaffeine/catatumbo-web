/* Buscar páginas y construir sus URLs. Todos los enlaces internos pasan por estas funciones
   (getRelativeLocaleUrl añade la ruta base y el prefijo del idioma), así que nunca escribas '/es/…' a mano. */
import { getCollection, type CollectionEntry } from 'astro:content';
import { getRelativeLocaleUrl } from 'astro:i18n';
import { LANGS, type Lang } from '../i18n/ui';

export type Page = CollectionEntry<'pages'>;
export type PageKey = Page['data']['key'];

/* El id de una entrada es '<lang>/<slug>', según su ruta dentro de src/content/pages. */
export const langOf = (page: Page) => page.id.split('/')[0] as Lang;
export const slugOf = (page: Page) => page.id.split('/').slice(1).join('/');

export const homeUrl = (lang: Lang) => getRelativeLocaleUrl(lang);
export const pageUrl = (page: Page) => getRelativeLocaleUrl(langOf(page), slugOf(page));

/* Las páginas de un idioma, en el orden del menú. */
export async function pagesIn(lang: Lang) {
  const all = await getCollection('pages', (p) => langOf(p) === lang);
  return all.sort((a, b) => a.data.order - b.data.order);
}

/* La URL de una página en un idioma, buscada por su key. */
export async function urlOf(key: PageKey, lang: Lang) {
  const page = (await pagesIn(lang)).find((p) => p.data.key === key);
  return page ? pageUrl(page) : homeUrl(lang);
}

/* La misma página en todos los idiomas, para el selector de idioma y los enlaces hreflang.
   Sin key (la página de inicio), cada idioma enlaza a su inicio. */
export async function alternates(key?: PageKey) {
  return Promise.all(LANGS.map(async (lang) => ({ lang, href: key ? await urlOf(key, lang) : homeUrl(lang) })));
}

/* Un archivo de public/, bajo la ruta base: asset('img/venezuela.svg'). */
export const asset = (path: string) => import.meta.env.BASE_URL.replace(/\/?$/, '/') + path;
