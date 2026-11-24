/* Los grupos del menú, como en kyoto.travel: Descubre, Qué hacer, Lugares, Consejos de viaje.
   Cada página del menú dice a cuál pertenece en su frontmatter (`group`). Este orden es el del menú,
   el del pie y el de las secciones de la página de inicio. Los nombres de cada idioma están en i18n/ui.ts. */
export const GROUPS = ['discover', 'do', 'places', 'tips'] as const;
export type Group = (typeof GROUPS)[number];
