/* Finding pages and building their URLs. Every internal link goes through these helpers
   (getRelativeLocaleUrl adds the base path and language prefix), so never hand-write '/es/…'. */
import { getCollection, type CollectionEntry } from 'astro:content';
import { getRelativeLocaleUrl } from 'astro:i18n';
import { LANGS, type Lang } from '../i18n/ui';

export type Page = CollectionEntry<'pages'>;
export type PageKey = Page['data']['key'];

/* An entry id is '<lang>/<slug>', from its path under src/content/pages. */
export const langOf = (page: Page) => page.id.split('/')[0] as Lang;
export const slugOf = (page: Page) => page.id.split('/').slice(1).join('/');

export const homeUrl = (lang: Lang) => getRelativeLocaleUrl(lang);
export const pageUrl = (page: Page) => getRelativeLocaleUrl(langOf(page), slugOf(page));

/* The pages of one language, in menu order. */
export async function pagesIn(lang: Lang) {
  const all = await getCollection('pages', (p) => langOf(p) === lang);
  return all.sort((a, b) => a.data.order - b.data.order);
}

/* The URL of a page in one language, found by its key. */
export async function urlOf(key: PageKey, lang: Lang) {
  const page = (await pagesIn(lang)).find((p) => p.data.key === key);
  return page ? pageUrl(page) : homeUrl(lang);
}

/* The same page in every language, for the language switch and hreflang links.
   Without a key (the home page) every language links to its home. */
export async function alternates(key?: PageKey) {
  return Promise.all(LANGS.map(async (lang) => ({ lang, href: key ? await urlOf(key, lang) : homeUrl(lang) })));
}

/* A file in public/, under the base path: asset('img/venezuela.svg'). */
export const asset = (path: string) => import.meta.env.BASE_URL.replace(/\/?$/, '/') + path;
