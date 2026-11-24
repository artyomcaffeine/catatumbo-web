# Catatumbo · Guía del relámpago

Sitio web estático. Hecho con [Astro](https://astro.build).

> Los textos en alemán, francés e italiano son borradores. Antes de publicarlos, un hablante nativo debe revisarlos. Están marcados con `draft_translation: true`.

## Despliegue y previsualización

Necesita Node 22.12 o más reciente.

```sh
npm install
npm run dev       # Servidor de desarrollo en http://localhost:4321
npm run build     # Construye la web terminada en dist/
npm run preview   # Crea `dist/` para verla tal como quedará una vez publicada
npm run check     # Busca errores de tipos
```

## Editar el contenido

- **Texto de las páginas:** archivos Markdown en `src/content/pages/<idioma>/`. El nombre del archivo es la URL (`es/como-llegar.md` → `/es/como-llegar/`).
- **Mapa del sitio:** como el de kyoto.travel, el menú tiene cuatro grupos: Descubre, Qué hacer, Lugares y Consejos de viaje (`src/lib/groups.ts`). Cada página elige el suyo con `group` en su frontmatter, y su posición dentro de él con `order`. El menú, el pie y la página de inicio se arman solos a partir de eso.
- **Nombres de los grupos, botones y página de inicio:** `src/i18n/ui.ts`.

## Vista previa para el cliente en GitHub Pages

1. Sube esta carpeta a un repositorio de GitHub.
2. En GitHub, ve a **Settings → Pages → Source** y elige **GitHub Actions**.
3. Añade un workflow de GitHub Actions que ejecute `npm run build` y publique `dist/` (la documentación de Astro trae uno para GitHub Pages). Desde entonces, cada push a `main` publica `https://<usuario>.github.io/<repo>/`.

La vista previa está marcada como `noindex`, así que los buscadores no la indexan. Para el hosting final, ejecuta `npm run build` y sube `dist/` a cualquier hosting estático.

## Créditos

Fotografías: Fernando Flores, Yinette Bracho Padilla, Yoser Linares y Juan Pablo Bottaro, en Wikimedia Commons (CC BY 3.0, CC BY-SA 2.0 y CC BY-SA 4.0); retratos y bandera de dominio público. Cada foto lleva su crédito. Iconos: Lucide (ISC). Tipografías: Fraunces, DM Sans, DM Mono (SIL OFL).
