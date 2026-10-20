/* The guide's pages: one Markdown file per page and language, in src/content/pages/<lang>/.
   The file name is the page's URL (es/relampago.md → /es/relampago/).
   `key` is the same in every language and links the translations of one page. */
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: ({ image }) => z.object({
    key: z.enum(['lightning', 'visit', 'places', 'history']),
    title: z.string(),
    description: z.string(),
    /* Position in the menu and on the home page. */
    order: z.number(),
    /* Optional photo shown under the page banner. */
    photo: image().optional(),
    photoAlt: z.string().optional(),
    /* True while a translation waits for review by a native speaker. */
    draft_translation: z.boolean().optional(),
  }),
});

export const collections = { pages };
