/* Configuración de la app (Capacitor). La app empaqueta el build estático de dist/ tal cual.
   Se compila con `npm run app:build` (`astro build --mode app`, ver src/lib/pages.ts). */
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  /* Provisional: no se puede cambiar después de publicar en las tiendas. Ver PLAN.md. */
  appId: 'com.catatumbodigital.guia',
  appName: 'Catatumbo',
  webDir: 'dist',
  /* Color de fondo mientras carga la página: el mismo que theme-color. */
  backgroundColor: '#142d31',
};

export default config;
