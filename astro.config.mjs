import { defineConfig } from 'astro/config';

/* PUBLIC_DEPLOY_TARGET=pages compila la vista previa de GitHub Pages, desplegada en
   https://<owner>.github.io/<repo>/. GitHub Actions define GITHUB_REPOSITORY ("owner/repo"),
   así que no hay que editar nada aquí. Sin la variable, el sitio se compila para la raíz (/),
   que es lo que necesitan el hosting final y la app. */
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
