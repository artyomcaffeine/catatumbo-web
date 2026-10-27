# 1 · Qué vamos a construir

## La idea en una frase

Un solo código que produce una carpeta de archivos estáticos (`dist/`). Esa carpeta se publica como web en GitHub Pages y, sin cambios de fondo, se mete dentro de una app de Android e iOS.

```text
 Markdown + componentes ──astro build──▶ dist/ ──▶ GitHub Pages (la web)
                                           │
                                           └──cap sync──▶ android/, ios/ (la app, sin internet)
```

## Las características y por qué

| Característica | Cómo se consigue | Por qué |
|---|---|---|
| Sitio estático | Astro con `output: 'static'` | Sin servidor que mantener, rápido, barato de publicar. Y una app puede llevar dentro unos archivos estáticos, pero no un servidor. |
| Varios idiomas | El enrutado i18n de Astro, con prefijo por idioma (`/es/`, `/en/`) | Cada idioma tiene su URL, se puede enlazar y los buscadores lo entienden. |
| Contenido en Markdown | Colecciones de contenido de Astro, con esquema | Quien escribe no toca código. El esquema avisa si falta un campo. |
| Textos de interfaz tipados | Un objeto por idioma en `ui.ts`, tipado contra el español | Si falta una traducción, el proyecto no compila: no se publica un botón vacío. |
| Publicación automática | GitHub Actions + GitHub Pages | Cada cambio en `main` se publica sin pasos manuales. |
| App sin internet | Capacitor empaqueta `dist/` | Un solo código. Todo (texto, fuentes, fotos) va dentro de la app. |
| Sin dependencias externas en las páginas | Fuentes e imágenes locales, nada de embeds | Si una página necesita algo de internet para dibujarse, la app sin conexión se rompe. |

## Lo que este proyecto decidió no hacer (todavía)

Base de datos, cuentas de usuario o notificaciones. No es que estén mal: cada una añade servidor, coste o permisos. El proyecto avanza por fases y estas quedan para más adelante (ver `PLAN.md`). Aprende a decir "esto no entra en esta fase" y a anotarlo en el plan.

## Las tres reglas que lo sostienen todo

1. **Nunca escribas a mano una URL interna.** Todos los enlaces pasan por funciones (`src/lib/pages.ts`). El mismo código se publica bajo `/LabCatatumboProject/` en GitHub Pages, bajo `/` en la app, y la app además necesita que los enlaces terminen en `index.html`. Solo una función puede adaptarse a los tres casos.
2. **Nada imprescindible puede depender de internet.** Ni fuentes de Google Fonts, ni imágenes de otra web, ni vídeos incrustados. Los enlaces a otras webs sí están permitidos: el usuario decide abrirlos. Un dato en vivo (de una API pública) puede pedirse con `fetch`, pero la página tiene que funcionar igual sin él (capítulo 4).
3. **Un cambio para la app no puede romper la web** (ni al revés). Por eso, tras cada cambio se compilan y se revisan las dos.

## Ejercicio

Abre este repositorio y localiza, sin buscar en esta guía:

1. Los archivos Markdown de una misma página en español y en inglés, y el campo que los une.
2. Dónde está el texto del selector de idioma ("Idioma" / "Language").
3. Qué archivo decide que los idiomas son es, en, de y fr.

**Comprobación:** `src/content/pages/es/…` y `src/content/pages/en/…`, unidos por el mismo `key`; `src/i18n/ui.ts` (`'nav.lang'`); `astro.config.mjs` (`locales`) y `src/i18n/ui.ts` (`LANGS`). Fíjate en que los idiomas están en dos sitios: eso es lo que hay que tocar para añadir uno.
