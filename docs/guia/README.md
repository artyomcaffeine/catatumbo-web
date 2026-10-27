# Guía: una web estática multilingüe que también es app

Esta guía enseña a construir, desde cero, un proyecto con las mismas características que este repositorio, usándolo como ejemplo real. Está pensada para alguien que ya sabe HTML, CSS y algo de JavaScript, y que usa Git y la terminal a nivel básico.

## Qué vas a construir

Un sitio web que:

- es un **sitio web estático** (solo archivos HTML, CSS, JS e imágenes; sin servidor),
- está en **varios idiomas**, cada uno con su dirección (`/es/`, `/en/`, …),
- guarda el **contenido en Markdown**, para que lo edite cualquiera,
- se **publica sola en GitHub Pages** con cada cambio en `main`,
- y se empaqueta como **app de Android e iOS que funciona sin internet**, con el mismo código.

## Cómo usar esta guía

Lee los capítulos en orden. Cada uno tiene la misma estructura: qué se construye y por qué, los pasos, dónde verlo en este proyecto, errores comunes (varios nos pasaron de verdad) y un ejercicio con su comprobación. No pases al siguiente capítulo hasta que la comprobación salga bien.

| # | Capítulo | Resultado al terminar |
|---|---|---|
| 1 | [Qué vamos a construir](01-que-vamos-a-construir.md) | Entiendes la arquitectura y las decisiones. |
| 2 | [El sitio con Astro](02-el-sitio-con-astro.md) | Un sitio estático que compila y se ve en el navegador. |
| 3 | [Idiomas y contenido](03-idiomas-y-contenido.md) | Páginas en Markdown en varios idiomas, con menú y selector de idioma. |
| 4 | [Diseño y sin internet](04-diseno-y-sin-internet.md) | Estilos ordenados y ningún recurso que dependa de internet. |
| 5 | [Publicar en GitHub Pages](05-publicar-en-github-pages.md) | El sitio publicado y actualizado solo con cada push. |
| 6 | [La app con Capacitor](06-la-app-con-capacitor.md) | Una app de Android que abre sin conexión. |
| 7 | [Forma de trabajar](07-forma-de-trabajar.md) | Un método para planificar, verificar y documentar. |

## Lo que necesitas instalado

- Node.js 22.12 o más reciente, y Git.
- Un editor (VS Code o similar).
- Una cuenta de GitHub.
- Para la app de Android: Android Studio. Para iOS: un Mac con Xcode.

## Mapa del proyecto de ejemplo

```text
astro.config.mjs          configuración de Astro: estático, idiomas, ruta base
capacitor.config.ts       configuración de la app
src/
  content.config.ts       qué campos tiene cada página (esquema)
  content/pages/<lang>/   el contenido, en Markdown, un archivo por página e idioma
  content/*.yaml          datos compartidos por todos los idiomas (colecciones con file())
  i18n/ui.ts              textos de la interfaz en cada idioma
  lib/pages.ts            funciones para buscar páginas y construir enlaces
  layouts/Base.astro      <head>, barra superior y pie de todas las páginas
  pages/                  las rutas: raíz, inicio de cada idioma y páginas Markdown
  components/             piezas reutilizables (barra, pie, banner, widgets…)
  styles/                 tokens.css → bundle.css → site.css
  assets/                 fuentes e imágenes que Astro optimiza
public/                   archivos que se copian tal cual (iconos, SVG)
assets/                   dibujos fuente del icono y del splash de la app
android/, ios/            proyectos nativos generados por Capacitor
.github/workflows/        el despliegue automático a GitHub Pages
CLAUDE.md, PLAN.md        reglas del proyecto y plan de trabajo vivo
```

Si cambias la arquitectura del proyecto, actualiza también esta guía.
