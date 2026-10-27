# 7 · Forma de trabajar

El código es la mitad del proyecto. La otra mitad es cómo se decide, se comprueba y se deja escrito. Así se trabajó en este repositorio.

## 7.1 · Dos documentos que mandan

- **`CLAUDE.md`: las reglas.** Qué es el proyecto, qué entra en la fase actual y qué no, los comandos, cómo encaja todo y cómo añadir cosas (una página, un idioma). Lo leen las personas y también los asistentes de IA que trabajan en el repo. Si una regla cambia, se cambia aquí.
- **`PLAN.md`: el plan vivo.** Las fases con casillas (`[ ]` / `[x]`), las **decisiones pendientes** y un **registro de decisiones** con fecha y motivo. Cuando alguien pregunta "¿por qué se hizo así?", la respuesta está en el registro.

Ejemplo real del registro:

| Fecha | Decisión | Motivo |
|---|---|---|
| 2026-10-25 | En la app, los enlaces internos terminan en `index.html`. | Capacitor sirve el `index.html` de la raíz para rutas sin extensión. Es el arreglo más pequeño y no toca la web. |
| 2026-10-25 | Los enlaces externos se abren en el navegador del sistema, sin `@capacitor/browser`. | Capacitor ya lo hace solo en Android e iOS: una dependencia menos. |

## 7.2 · Pasos pequeños

- Un cambio = una idea. Antes de hacerlo, explícalo en una frase sencilla.
- Commits pequeños con un mensaje que diga **qué** y **por qué**. Si añades una dependencia, explica en el commit por qué hace falta.
- Lo que no entra en la fase actual no se "deja preparado": se anota en `PLAN.md`.
- Lo que no puedes verificar no se publica. Ejemplo: si un dato no se puede comprobar o descargar, la página muestra un aviso en vez de una cifra inventada.

## 7.3 · Verificar antes de dar algo por hecho

No hay tests automáticos en este proyecto, así que la verificación es un hábito:

1. `npm run check`: 0 errores.
2. `npm run build`: la web compila. Mira los avisos.
3. Abre el resultado (`npm run preview`) y míralo de verdad: escritorio y móvil, modo claro y oscuro, los 4 idiomas.
4. Si el cambio toca la app: `npm run app:build` y prueba en modo avión.
5. Si el cambio toca a la web y a la app (enlaces, `<head>`, CSS de la barra), comprueba las dos.
6. Después de publicar, abre la web publicada. Un workflow en verde no garantiza que la web esté bien (capítulo 5).

Cuando no puedas probar algo (por ejemplo, iOS sin Mac), dilo y anótalo como pendiente. "Debería funcionar" no es una verificación.

## 7.4 · Leer el código de las herramientas

Dos de los problemas más serios del proyecto se resolvieron leyendo código ajeno, no adivinando:

- El bucle de la app: leyendo cómo sirve Capacitor las rutas (`node_modules/@capacitor/android/…/WebViewLocalServer.java`).
- Los enlaces externos: leyendo cómo los trata Capacitor, se vio que no hacía falta ningún plugin.

Cuando una herramienta se comporta raro, busca su código en `node_modules/` antes de añadir parches.

## 7.5 · Lista final para un proyecto como este

- [ ] Astro estático (`output: 'static'`, `trailingSlash: 'always'`), `npm run check` limpio.
- [ ] Idiomas en `astro.config.mjs` y en `ui.ts`, con prefijo para todos.
- [ ] Contenido en una colección con esquema y `key` común entre idiomas.
- [ ] Textos de interfaz tipados contra el idioma principal.
- [ ] Todos los enlaces internos con funciones; archivos de `public/` con `asset()`.
- [ ] Fuentes e imágenes locales; ningún recurso de otra web.
- [ ] Workflow de GitHub Pages, Pages activado, ruta base correcta (¡mayúsculas!), `noindex` en la vista previa.
- [ ] Capacitor con `webDir: 'dist'`, build de app con `--mode app`, enlaces a `index.html`.
- [ ] Icono y splash generados desde SVG; márgenes `safe-area` para la muesca.
- [ ] Probado en modo avión en un teléfono real.
- [ ] `CLAUDE.md` y `PLAN.md` al día, con las decisiones registradas.

## Ejercicio final

Añade un idioma nuevo (por ejemplo, italiano) a tu proyecto siguiendo la sección "Añadir cosas" de `CLAUDE.md`, y registra la decisión en `PLAN.md`.

**Comprobación:** `npm run check` sin errores, el selector de idioma muestra "IT", todas las páginas existen en `/it/…`, la web publicada y la app sin conexión las muestran, y el registro de decisiones tiene una línea nueva con fecha y motivo.
