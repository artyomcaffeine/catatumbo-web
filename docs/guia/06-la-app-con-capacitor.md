# 6 · La app con Capacitor

## Qué es Capacitor y por qué lo usamos

Capacitor crea un proyecto de Android y otro de iOS que muestran tu web dentro de un WebView (un navegador sin barra) y sirven los archivos desde el propio teléfono. Usa `dist/` tal cual: no hay que reescribir nada. Por eso la app funciona sin internet: todo va dentro.

## 6.1 · Instalar y crear los proyectos nativos

```sh
npm i @capacitor/core @capacitor/android @capacitor/ios
npm i -D @capacitor/cli @capacitor/assets
```

- `@capacitor/core`: el puente entre la web y la app nativa.
- `@capacitor/android`, `@capacitor/ios`: generan las carpetas `android/` e `ios/`.
- `@capacitor/cli`: el comando `cap`.
- `@capacitor/assets`: genera el icono y el splash en todos los tamaños.

Un `capacitor.config.ts` mínimo:

```ts
const config: CapacitorConfig = {
  appId: 'com.tuempresa.tuapp',   // identificador único; NO se puede cambiar tras publicar
  appName: 'Mi app',
  webDir: 'dist',
  backgroundColor: '#142d31',     // el color de fondo mientras carga la web
};
```

Después:

```sh
npm run build
npx cap add android
npx cap add ios
```

Las carpetas `android/` e `ios/` se versionan en Git. La copia de `dist/` que llevan dentro la ignora Git y la crea `cap sync`. Excluye `android` e `ios` en `tsconfig.json` para que la revisión de tipos no entre en ellas.

## 6.2 · La trampa de las rutas (importante)

El servidor interno de Capacitor (en Android y en iOS) trata las rutas sin extensión como una SPA: si pides `/es/ejemplo/`, **devuelve el `index.html` de la raíz**. Con un sitio de varias páginas eso es un desastre: cada enlace abre la raíz, y nuestra raíz redirige a `/es/`… que vuelve a ser la raíz. La app se queda en un bucle.

Lo descubrimos leyendo el código de Capacitor (`WebViewLocalServer.java` en Android, `CapacitorRouter` en iOS). La solución del ejemplo: en el build de la app, los enlaces internos apuntan al archivo, `/es/ejemplo/index.html`, que sí tiene extensión. En `src/lib/pages.ts`:

```ts
const app = import.meta.env.MODE === 'app';
const toFile = (url: string) => (app ? url.replace(/\/?$/, '/index.html') : url);

export const homeUrl = (lang: Lang) => toFile(getRelativeLocaleUrl(lang));
export const pageUrl = (page: Page) => toFile(getRelativeLocaleUrl(langOf(page), slugOf(page)));
```

El build de la app se lanza con `astro build --mode app`. La web sigue con sus URLs normales. Aquí se ve por qué la regla "nunca escribas una URL interna a mano" es tan importante: un solo enlace escrito a mano rompería la app.

Scripts de `package.json`:

```json
"app:build": "astro build --mode app && cap sync",
"app:android": "cap open android",
"app:ios": "cap open ios",
"app:assets": "capacitor-assets generate --ios --android"
```

Se usa `--mode app` y no una variable de entorno porque así el script funciona también en Windows.

## 6.3 · Enlaces externos

Capacitor abre los enlaces a otras webs en el navegador del sistema, en Android y en iOS, sin plugins. Por eso el ejemplo no instala `@capacitor/browser`. Antes de añadir un plugin, comprueba si Capacitor ya lo hace.

Cuando sí hace falta uno (en el ejemplo, `@capacitor/geolocation`, para pedir la ubicación con el permiso nativo del teléfono):

1. Instálalo con `npm i` y ejecuta `npm run app:build`: `cap sync` lo registra en `android/` e `ios/`. Versiona esos cambios.
2. Declara sus permisos: en `android/app/src/main/AndroidManifest.xml` (pide el mínimo; por ejemplo, ubicación aproximada) y los textos `NS…UsageDescription` en `ios/App/App/Info.plist`, que el teléfono muestra al pedir el permiso.
3. Pide el permiso solo cuando el usuario lo necesita (al pulsar un botón), no al abrir la app, y ten preparado el mensaje para cuando lo deniega.

En la web, el mismo plugin usa la API del navegador, así que el código es uno solo.

## 6.4 · Icono y pantalla de inicio

Los dibujos fuente están en `assets/` como SVG (`icon-only.svg`, `icon-foreground.svg`, `icon-background.svg`, `splash.svg`). `npm run app:assets` genera todos los PNG de Android e iOS: no los edites a mano. Consejos:

- Sin texto en el icono: a ese tamaño no se lee y el teléfono ya muestra el nombre debajo.
- El primer plano del icono adaptativo de Android tiene que caber en la zona segura (el sistema lo recorta en círculo, gota…).
- Android 12 o más nuevo dibuja su propio splash: su color de fondo es `windowSplashScreenBackground` en `android/app/src/main/res/values/styles.xml`.

## 6.5 · Compilar y probar sin conexión

```sh
npm run app:build        # después de cada cambio en contenido o código
npm run app:android      # abre Android Studio: ▶ para el emulador o un teléfono por USB
```

Sin Android Studio abierto también se puede generar un APK de prueba:

```sh
cd android && ./gradlew assembleDebug    # → android/app/build/outputs/apk/debug/app-debug.apk
```

Prueba sin conexión en un teléfono real:

1. Instala la app y ábrela una vez.
2. Ciérrala del todo y activa el **modo avión** (con el Wi-Fi apagado).
3. Ábrela y recorre todas las páginas en todos los idiomas: textos, fotos, fuentes, selector de idioma, botón "atrás".
4. Un enlace externo debe abrir el navegador del teléfono (que dirá que no hay conexión: es lo esperado).
5. Mira que la barra superior no quede debajo de la hora y que el pie no choque con la barra de gestos.

iOS necesita un Mac con Xcode (`npm run app:ios`).

## Errores comunes

- Compilar la app con `npm run build` a secas: los enlaces no llevan `index.html` y la app entra en bucle. Usa siempre `npm run app:build`.
- Olvidar `cap sync` tras un cambio: la app sigue mostrando la versión anterior.
- Elegir el `appId` a la ligera: una vez publicado en las tiendas no se puede cambiar.

## Ejercicio

Empaqueta tu proyecto para Android y pruébalo en modo avión.

**Comprobación:** todas las páginas abren sin conexión, los enlaces internos no vuelven a la portada, y el idioma elegido se recuerda tras cerrar y abrir la app.
