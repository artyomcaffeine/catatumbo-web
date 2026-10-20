import { defineConfig } from 'astro/config';

/* PUBLIC_DEPLOY_TARGET=pages builds the GitHub Pages preview, served at
   https://<owner>.github.io/<repo>/. GitHub Actions sets GITHUB_REPOSITORY ("owner/repo"),
   so nothing needs editing here. Without the variable the site is built for the root (/),
   as the final host and a future app need. */
const pages = process.env.PUBLIC_DEPLOY_TARGET === 'pages';
const [owner = 'owner', repo = 'catatumbo-web'] = (process.env.GITHUB_REPOSITORY ?? '').toLowerCase().split('/').filter(Boolean);

export default defineConfig({
  output: 'static',
  site: pages ? `https://${owner}.github.io` : undefined,
  base: pages ? `/${repo}` : '/',
  trailingSlash: 'always',
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en', 'de', 'fr'],
    routing: { prefixDefaultLocale: true },
  },
});
