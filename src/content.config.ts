/* Las páginas de la guía: un archivo por página e idioma, en src/content/pages/<lang>/.
   El nombre del archivo es la URL de la página (es/relampago.md → /es/relampago/).
   `key` es igual en todos los idiomas y vincula las traducciones de una página. */
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: ({ image }) => z.object({
    key: z.enum(['lightning', 'visit', 'places', 'history']),
    title: z.string(),
    description: z.string(),
    /* Posición en el menú y en la página de inicio. */
    order: z.number(),
    /* Foto opcional que se muestra bajo el banner de la página. */
    photo: image().optional(),
    photoAlt: z.string().optional(),
    /* true mientras una traducción espera la revisión de un hablante nativo. */
    draft_translation: z.boolean().optional(),
  }),
});

export const collections = { pages };
