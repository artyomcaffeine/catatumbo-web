/* Las páginas de la guía: un archivo por página e idioma, en src/content/pages/<lang>/.
   El nombre del archivo es la URL de la página (es/relampago.md → /es/relampago/).
   `key` es igual en todos los idiomas y vincula las traducciones de una página. */
import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { GROUPS } from './lib/groups';

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: ({ image }) => z.object({
    key: z.enum([
      'lightning', 'history', 'seasons', 'responsible',
      'tours', 'photography',
      'park', 'villages', 'itinerary', 'lodging',
      'getting-there', 'packing', 'safety', 'today',
      'privacy',
    ]),
    title: z.string(),
    description: z.string(),
    /* Grupo del menú al que pertenece (lib/groups.ts). Obligatorio en las páginas del menú. */
    group: z.enum(GROUPS).optional(),
    /* Posición dentro de su grupo, en el menú y en la página de inicio. */
    order: z.number(),
    /* false: la página no sale en el menú ni en la portada, solo se enlaza a mano (la de privacidad, desde el pie). */
    menu: z.boolean().default(true),
    /* Foto opcional que se muestra bajo el banner de la página. */
    photo: image().optional(),
    photoAlt: z.string().optional(),
    /* Crédito de esa foto si no es de Fernando Flores (el crédito por defecto, components/PhotoCredit.astro). */
    photoCredit: z.object({ text: z.string(), url: z.url() }).optional(),
    /* true mientras una traducción espera la revisión de un hablante nativo. */
    draft_translation: z.boolean().optional(),
  }).refine((d) => !d.menu || d.group, { message: 'Las páginas del menú necesitan `group`.', path: ['group'] }),
});

/* Operadores de tours de la zona: una lista para los 5 idiomas, en src/content/tours.yaml.
   Se muestra al final de la página con key 'tours' (components/TourList.astro). */
const tours = defineCollection({
  loader: file('./src/content/tours.yaml'),
  schema: z.object({
    name: z.string(),
    url: z.url(),
    /* Ciudad o pueblo desde donde sale la excursión. */
    base: z.string(),
    /* Idiomas del guía, como códigos ISO: [es, en]. */
    langs: z.array(z.string()),
    /* Última vez que alguien comprobó el enlace y los datos. */
    reviewed: z.coerce.date(),
    /* Nota corta opcional por idioma; si falta en un idioma, no se muestra. */
    note: z.object({ es: z.string(), en: z.string(), de: z.string(), fr: z.string(), it: z.string() }).partial().optional(),
  }),
});

/* Hoteles y posadas cerca del embarcadero: una lista para los 5 idiomas, en src/content/hotels.yaml.
   Se muestra al final de la página con key 'lodging' (components/HotelList.astro). */
const hotels = defineCollection({
  loader: file('./src/content/hotels.yaml'),
  schema: z.object({
    name: z.string(),
    /* Pueblo o ciudad donde está. */
    town: z.string(),
    address: z.string(),
    /* Teléfono venezolano tal como se marca en el país: 0414-1234567. */
    phone: z.string().optional(),
    /* Precio medio por habitación y noche, en dólares. */
    priceUsd: z.number().optional(),
    /* reopening: abre poco a poco y puede no tener todas sus habitaciones. */
    status: z.enum(['open', 'reopening']).default('open'),
  }),
});

export const collections = { pages, tours, hotels };
