# CLAUDE.md

Sitio Astro estático y multilingüe para turistas que visitan el Lago de Maracaibo para ver el Relámpago del Catatumbo. Idiomas: es (por defecto), en, de, fr. El diseño viene del sistema de diseño Catatumbo Field Guide (copiado del proyecto anterior `ClaudeCatatumboAstro`).

En esta fase el mismo sitio se empaqueta además como app para Android e iOS.

## Alcance del proyecto (fase actual: app)

- Un mismo código y un mismo contenido sirven para la web y para la app. La web sigue siendo un sitio Astro estático (`output: 'static'`, sin SSR ni adaptadores) y se sigue publicando en GitHub Pages. Ningún cambio hecho para la app puede romper la web.
- La app empaqueta el build estático (`dist/`) con **Capacitor 8**, que usa `dist/` tal cual como `webDir`.
- Idiomas: es, en, de, fr, con el enrutado i18n que trae Astro. Cada idioma tiene su prefijo (`/es/`, `/en/`, …).
- El contenido está en Markdown, en `src/content/pages/<lang>/`.
- **Entra en esta fase:** empaquetar la app para Android e iOS; que la app funcione sin internet, con todo el contenido, las fuentes y las imágenes dentro de la app (la web no necesita service worker); iconos, pantalla de inicio (splash) y preparación para las tiendas.
- **También entra (Fase 3 de `PLAN.md`):** widgets de tiempo, de rayos y un mapa con la ubicación, en la página "Tiempo y localización" (`key: today`). Cada widget pide sus datos desde el navegador al abrir la página y, sin conexión, muestra lo último guardado (el pronóstico) o una versión simplificada que va dentro del sitio (el mapa). Nunca bloquean el resto de la guía. La ubicación se usa solo en el teléfono: ni se guarda ni se envía.
- **No entra (fases futuras, no las prepares):** base de datos, CMS, cuentas/login, reservas, notificaciones. El único mapa es el de "Tiempo y localización".
- Dependencias: se pueden añadir las que hagan falta, incluidos frameworks de UI. Explica en el cambio por qué se añade cada una.
- Nada de embeds de terceros esenciales (iframes de mapas, vídeos, widgets de otros sitios): la app tiene que funcionar sin internet. Los widgets propios piden datos a servicios públicos (Open-Meteo, OpenFreeMap) desde código que va en el sitio (npm), sin cargar scripts de fuera.
- Prefiere pocos archivos. Explica cada cambio en lenguaje sencillo antes de hacerlo. Trabaja en pasos pequeños.
- `PLAN.md` es el plan de trabajo vivo: pasos pendientes, decisiones abiertas y registro de decisiones. Actualízalo al terminar cada paso.
- `docs/guia/` es una guía para juniors que explica el proyecto paso a paso con extractos del código. Si cambias la arquitectura, un comando o una regla, actualiza el capítulo que lo explica. La guía trata solo de la tecnología y el diseño: no menciona el contenido de las páginas ni la temática del sitio (usa ejemplos neutros, como `es/ejemplo.md`).

## Comandos

```sh
npm run dev       # http://localhost:4321
npm run build     # sitio estático en dist/
npm run preview   # sirve dist/
npm run check     # revisa los tipos de .astro y .ts

npm run app:build   # build de la app (astro build --mode app) y copia a android/ e ios/ (cap sync)
npm run app:android # abre el proyecto en Android Studio (compilar, emulador, firmar)
npm run app:ios     # abre el proyecto en Xcode (solo en macOS)
npm run app:assets  # regenera iconos y splash desde assets/*.svg
```

No hay tests. Para verificar: `npm run check` y un build. Mira el resultado en un navegador.
- Mantén `typescript` en `^6`, porque `@astrojs/check` 0.9.x no es compatible con TS 7.
- Cuando los lanza un agente, `astro dev` / `astro preview` quedan en segundo plano. Se detienen con `npx astro dev stop` / `npx astro preview stop`.

## La app (notas técnicas)

- Compila la app con `npm run app:build`, nunca con `npm run build` a secas. Usa `--mode app` (sin `PUBLIC_DEPLOY_TARGET`, así la base es `/`). La variable `pages` es solo para la vista previa en GitHub Pages.
- Capacitor responde a toda ruta sin extensión (`/es/relampago/`) con el `index.html` de la raíz, como una SPA. Por eso, en modo `app`, `homeUrl()`/`pageUrl()` (`src/lib/pages.ts`) terminan los enlaces en `index.html` (`/es/relampago/index.html`). En la web los enlaces no cambian. Un enlace interno escrito a mano rompe la app: usa siempre esas funciones.
- La raíz (`src/pages/index.astro`) redirige con JavaScript al idioma guardado en `localStorage` (`ct.lang`) o, si no hay, al del teléfono.
- Los enlaces externos (créditos de las fotos, fuentes) se abren en el navegador del sistema: Capacitor lo hace solo, en Android y en iOS, sin plugins.
- Las fotos son CC BY-SA 2.0: su crédito tiene que seguir visible en la app.
- `viewport-fit=cover`: la página llega bajo la barra de estado y la barra de gestos del teléfono. `site.css` añade `env(safe-area-inset-*)` a la barra superior, al pie y, en horizontal, a los lados del `body`. En la web sin muesca valen 0.
- Archivos de la app:
  - `capacitor.config.ts`: `appId` (provisional, ver `PLAN.md`), nombre y `webDir`.
  - `android/`, `ios/`: proyectos nativos generados por Capacitor. Se versionan. La copia de `dist/` que llevan dentro (`android/app/src/main/assets/public`, `ios/App/App/public`) la ignora git: la crea `cap sync`.
  - `assets/*.svg`: fuente del icono y del splash. Los PNG de `android/…/res` e `ios/…/Assets.xcassets` salen de aquí con `npm run app:assets`; no los edites a mano.
  - Color de fondo del splash de Android 12+: `windowSplashScreenBackground` en `android/app/src/main/res/values/styles.xml`.
  - Plugin `@capacitor/geolocation` (tu posición en el mapa de "Tiempo y localización", con precisión alta). Permisos: `ACCESS_FINE_LOCATION` y `ACCESS_COARSE_LOCATION` en `AndroidManifest.xml` y los textos `NSLocation…UsageDescription` en `ios/App/App/Info.plist`.
  - Mapa: `maplibre-gl` (código abierto), con el estilo por defecto de OpenFreeMap (Liberty), que se descarga al abrir el mapa; los marcadores, la barra de controles y la leyenda son del sistema de diseño. Se carga solo al llegar al mapa. Su worker se compila aparte desde `src/lib/map-worker.ts` (import `?worker&url`) y se pasa con `setWorkerUrl`: Vite no lo detecta solo, en iOS (`capacitor://`) MapLibre no sabría dónde buscarlo y, como `.mjs`, el servidor de la app en iOS no lo serviría como JavaScript. Si Liberty no se puede descargar (sin conexión), dibuja `src/assets/map/lago.json` (Natural Earth, dominio público, recortado a la zona) en los colores de Liberty. Tras añadir o quitar un plugin, `npm run app:build` (hace `cap sync`) y versiona los cambios de `android/` e `ios/`.
- Para compilar Android hace falta el Android SDK (Android Studio); para iOS, macOS con Xcode.

## Cómo encaja todo

- `src/content.config.ts` define la colección `pages`. Cada archivo Markdown tiene `key` (igual en todos los idiomas; vincula las traducciones), `title`, `description`, `order` (posición en el menú) y, opcionalmente, `photo`/`photoAlt`, `draft_translation` y `menu: false` (la página no sale en el menú ni en la portada; así está la de privacidad, enlazada desde el pie). El nombre del archivo es la URL: `es/relampago.md` → `/es/relampago/`.
- La colección `tours` (`src/content/tours.yaml`, una lista para los 4 idiomas) guarda los operadores de tours. `src/components/TourList.astro` la muestra al final de la página con `key: tours`. Mientras la lista está vacía, el build avisa de que la colección está vacía: es normal.
- `src/pages/[lang]/[...slug].astro` renderiza todas las páginas Markdown. `src/pages/[lang]/index.astro` es la página de inicio. `src/pages/index.astro` (la raíz del sitio) redirige al idioma del visitante y, sin JavaScript, muestra un selector de idioma.
- `src/i18n/ui.ts` contiene los textos de la interfaz (menú, botones, página de inicio) y la lista de idiomas (`LANGS`). Cada idioma se tipa contra `es`, así que una clave que falte es un error de tipos. Mantén todos los idiomas sincronizados.
- `src/lib/pages.ts` contiene las funciones para encontrar páginas y construir URLs.
- `src/layouts/Base.astro` contiene el `<head>`, la barra superior y el pie. `src/components/` contiene las piezas.

## Enlaces y ruta base

El mismo código se compila para la vista previa en GitHub Pages (servida bajo `/<repo>/`) y para la raíz (`/`, el hosting final o la app). Por eso:
- Enlaza las páginas con `pageUrl()`, `urlOf()` y `homeUrl()` de `src/lib/pages.ts`. Usan `getRelativeLocaleUrl`. Nunca escribas `/es/…` a mano.
- Enlaza los archivos de `public/` con `asset('img/…')`.
- `PUBLIC_DEPLOY_TARGET=pages` (lo pone `.github/workflows/deploy.yml`) cambia `site`/`base` en `astro.config.mjs` y añade `noindex`.

## Añadir cosas

- **Una página:** añade un archivo Markdown por idioma con la misma `key`, y añade la clave al `z.enum` de `content.config.ts`. Después dale un color de tarjeta y un icono en `src/pages/[lang]/index.astro` (`CARD`).
- **Un operador de tours:** añade una entrada a `src/content/tours.yaml` (hay una plantilla en el archivo), con la fecha de revisión. Antes, comprueba los criterios de `PLAN.md` (Fase 2).
- **Un idioma:** añádelo a `LANGS`/`LANG_NAMES` en `ui.ts` y a `locales` en `astro.config.mjs`, añade su bloque en `ui.ts` y una carpeta con sus páginas Markdown.
- de y fr son traducciones en borrador (`draft_translation: true`) hasta que las revise un hablante nativo.

## Estilos

Los estilos se cargan en este orden: `tokens.css`, después `bundle.css`, después `site.css`.
- `tokens.css` contiene los tokens de diseño y las clases tipográficas (`display-*`, `copy-*`, `mono-*`). No lo edites a mano.
- `bundle.css` contiene los estilos de los componentes `ct-*` del sistema de diseño. No lo cambies.
- `site.css` es la capa de la página. Todo el CSS propio del sitio va aquí, incluidos los estilos `.prose` del Markdown.
- Las esquinas rectas en todas partes son parte del diseño. Las franjas oscuras usan `data-theme="night"`.
