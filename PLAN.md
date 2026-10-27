# PLAN.md

Plan de trabajo vivo del proyecto. `CLAUDE.md` dice qué es el proyecto y qué entra en la fase actual. Este archivo dice qué falta por hacer y en qué orden.

## Cómo usar este archivo

- Marca cada paso como hecho (`[x]`) cuando esté en `main`.
- Cuando se tome una decisión, quítala de "Decisiones pendientes" y anótala con fecha en "Registro de decisiones".
- Si un paso cambia el alcance (por ejemplo, la Fase 3), actualiza también `CLAUDE.md`.
- Pasos pequeños: cada casilla debería caber en un cambio.

## Punto de partida

- El sitio ya funciona sin internet una vez descargado: las fuentes están en `src/assets/fonts/`, las fotos en `src/assets/img/` (optimizadas con `astro:assets`) y los iconos en `public/icons/`. No se carga nada de otros servidores.
- Lo único externo son enlaces: los créditos CC BY-SA de las fotos (`Hero.astro`, `Footer.astro`, `[...slug].astro`) y las fuentes al final de los Markdown.
- El único JavaScript de cliente es la redirección de idioma de `src/pages/index.astro` (usa `localStorage`, clave `ct.lang`).
- Las URLs tienen forma de carpeta (`trailingSlash: 'always'`): `/es/relampago/` es `es/relampago/index.html`.

---

## Fase 1 · App sin conexión (fase actual)

Objetivo: el mismo build estático (`dist/`) empaquetado como app de Android e iOS, con todo el contenido dentro. La web no cambia y no necesita service worker.

- [x] **1. Capacitor 8** instalado: `@capacitor/core`, `@capacitor/android`, `@capacitor/ios` y `@capacitor/cli`. `capacitor.config.ts` con `webDir: 'dist'`. Proyectos nativos `android/` e `ios/` creados (iOS con Swift Package Manager, sin CocoaPods).
- [x] **2. Scripts npm**: `app:build` (`astro build --mode app && cap sync`), `app:android`, `app:ios`, `app:assets`. Se usa `--mode app` en vez de una variable de entorno para que funcione también en Windows.
- [x] **3. Navegación en el WebView.** Confirmado en el código de Capacitor (Android `WebViewLocalServer`, iOS `CapacitorRouter`): toda ruta sin extensión devuelve el `index.html` de la raíz. Con el build web la app se quedaba en un bucle de redirecciones. Solución: opción B. En modo `app`, `homeUrl()`/`pageUrl()` terminan en `index.html`. La web no cambia.
- [ ] **4. Prueba sin conexión en teléfonos reales.** Hecha en simulación: un servidor con la misma regla de rutas que Capacitor y Chromium sin acceso a internet. Las 20 páginas, los 4 idiomas, las fuentes y las fotos cargan, la raíz lleva al idioma del teléfono y se recuerda el idioma elegido. **Falta:** repetirla en Android y en iOS, en modo avión.
- [x] **5. Enlaces externos**: Capacitor ya los abre en el navegador del sistema en Android y en iOS, así que no hace falta `@capacitor/browser`. Sin conexión, el navegador del sistema muestra su propio aviso.
- [x] **6. Configuración**: `android` e `ios` excluidos en `tsconfig.json`.
- [x] **7. Icono y splash**: fuentes en `assets/*.svg` (el dibujo de `public/icons/catatumbo.svg` sin el texto, que no se lee en un icono), generados con `@capacitor/assets` (`npm run app:assets`). Fondo `#142d31`, también para el splash del sistema en Android 12+.
  - [x] Barra de estado: `viewport-fit=cover` y márgenes `env(safe-area-inset-*)` en `site.css`. El hueco bajo la barra de estado toma el color de la barra superior, en modo claro y oscuro. En horizontal, `body` se aparta `env(safe-area-inset-left/right)`: el contenido no queda bajo la muesca y los fondos de las franjas se detienen ahí, como en Safari sin `viewport-fit=cover` (probado simulando 47 px). El menú ☰ del teléfono se limita al alto de la pantalla y se desplaza por dentro: en horizontal no cabía y los últimos enlaces quedaban fuera (arreglado el 2026-10-27). **Falta:** mirarlo en un iPhone con muesca y en un Android reciente, en vertical y en horizontal.
- [ ] **8. Preparación para las tiendas**:
  - Cuentas: Google Play Console (pago único) y Apple Developer Program (anual).
  - Android: keystore de firma fuera del repo, con copia de seguridad. Versión (`versionCode`/`versionName`) en `android/app/build.gradle`.
  - iOS: hace falta macOS con Xcode para compilar y subir.
  - Capturas de pantalla por idioma, textos de la ficha en es/en/de/fr (de y fr revisados por hablantes nativos antes de publicar).
  - [x] Política de privacidad: página en los 4 idiomas (`es/privacidad.md`, `en/privacy.md`, `de/datenschutz.md`, `fr/confidentialite.md`; de y fr en borrador), enlazada desde el pie. No sale en el menú ni en la portada (`menu: false`). Dice lo que hay hoy: ningún dato personal, solo el idioma elegido guardado en el dispositivo, la app sin permisos ni servidor, la web en GitHub Pages. Su URL pública es la que se pone en las fichas de las tiendas.
  - Falta en la política: un correo de contacto (ver decisiones pendientes). Si cambia el alojamiento de la web, cambiar el apartado "La web".
  - Formularios de privacidad de Apple y "Seguridad de los datos" de Google: con la app de hoy, la respuesta es "no se recogen datos".
  - Ojo: Apple puede rechazar apps que solo envuelven una web (guía 4.2). El funcionamiento sin conexión ayuda; los widgets de la Fase 3 ayudarían más.
- [x] **9. Documentado** en `CLAUDE.md` (notas técnicas de la app) y en `README.md` (comandos).
- [x] **10. La web sigue igual**: `npm run check` sin errores; con `npm run build` los enlaces siguen siendo `/es/relampago/` y la barra superior mide lo mismo (70 px / 60 px). El APK de depuración de Android compila (`./gradlew assembleDebug`). iOS no se ha compilado (necesita macOS).

---

## Fase 2 · Enlaces a tours de la zona

Encaja en la fase actual: son enlaces, no embeds de terceros.

- [x] Página "Tours y guías" en los 4 idiomas (`es/tours.md`, `en/tours.md`, `de/touren.md`, `fr/excursions.md`), en el menú después de "Visitar". Explica cómo es la excursión, qué preguntar antes de reservar y por qué elegir servicios locales. Tarjeta en la portada (verde, icono de barco); con 5 tarjetas, la última ocupa toda la fila. de y fr, en borrador.
- [x] Lista de operadores como colección de datos (`src/content/tours.yaml`): un solo archivo para los 4 idiomas, así cada URL se escribe una vez. Campos: `name`, `url`, `base` (de dónde sale), `langs` (idiomas del guía), `reviewed` (fecha de revisión) y `note` opcional por idioma. La muestra `TourList.astro`; si está vacía, dice que la lista está en revisión.
- [x] Aviso en cada idioma bajo la lista: es orientativa, no avalamos a ningún operador, confirmar precios y condiciones con el operador. Cada operador muestra su fecha de revisión.
- [x] En la app los enlaces se abren en el navegador del sistema. Sin conexión la lista se ve, pero los sitios de los operadores no.
- [ ] **Lista inicial de operadores: por definir** (decisión del 2026-10-26). Mientras tanto, `tours.yaml` sigue vacío. Candidatos encontrados en artículos antiguos, **sin verificar**: no los he publicado porque sus webs no respondían (error 503, octubre de 2026) y las fuentes son de 2015–2018.
  - Alan Highton / Catatumbo Tour (`cocolight.com`, `catatumbotour.com`): tours de 2–3 días desde Mérida (Rough Guides 2018, The Guardian 2015).
  - Saiga Tours (`saigatours.com`): agencia internacional con un viaje a Venezuela que incluye una noche viendo el relámpago (fin de año 2026–27).
  - Agencias de Mérida y posadas de los palafitos (Ologá, Congo Mirador): buscar contacto directo.
- [x] **Criterios para incluir a un operador** (aprobados el 2026-10-26):
  - Su web o su contacto responde.
  - Sale de la zona (Mérida, Santa Bárbara, Puerto Concha) o trabaja con guías locales.
  - Lleva chalecos salvavidas para todos.
  - Respeta las normas del parque nacional y a las comunidades de los palafitos.
  - Se revisa cada 6 meses (fecha `reviewed` en `tours.yaml`).
- [ ] Revisar la lista periódicamente (enlaces rotos, operadores que cierran).

### Formulario de solicitud de tour (decidido el 2026-10-26, sin empezar)

El cliente rellena un formulario y la solicitud le llega al operador. No es una reserva: no hay pago ni disponibilidad en tiempo real; el operador contesta al cliente. Aun así roza "reservas", que `CLAUDE.md` deja fuera de alcance: al empezar, actualizar el alcance en `CLAUDE.md`.

- [x] **Cómo se envía: opción C, servidor propio** (decidido el 2026-10-26). Opciones que se valoraron:
  - **A. Desde las apps del propio cliente (recomendado para empezar).** El formulario prepara el mensaje y abre el correo (`mailto:`) o WhatsApp (`wa.me`) del cliente, ya dirigido al operador. Sin servidor, sin coste, sin datos guardados por nosotros. Funciona en la web y en la app; sin conexión, el correo queda en la bandeja de salida. Contra: no nos llega copia y no sabemos cuántas solicitudes hay.
  - **B. Servicio de formularios** (Formspree, Web3Forms o similar). Un servidor ajeno recibe el formulario y lo reenvía por correo al operador. Contra: necesita internet al enviar, coste según volumen, un tercero trata datos personales (política de privacidad, ficha de las tiendas) y hace falta protección contra spam.
  - **C. Servidor propio** (una función en la nube). Máximo control, pero rompe la regla de sitio solo estático y es lo que más mantenimiento pide.
- [ ] **Qué implica el servidor propio** (pasos, en este orden):
  1. Actualizar el alcance en `CLAUDE.md`: el sitio y la app siguen siendo estáticos; el formulario es la única pieza con servidor, en su propia carpeta (`server/`), con su propio despliegue. Un fallo del servidor no puede romper la web ni la app.
  2. Elegir dónde se aloja (p. ej. Cloudflare Workers, Netlify Functions o Vercel Functions; todas tienen plan gratuito) y con qué se envía el correo al operador (p. ej. Resend, Postmark o Amazon SES). Anotar el coste esperado.
  3. Un solo punto de entrada (`POST /solicitud`). Valida los campos, busca el correo del operador **en el servidor** (a partir de `tours.yaml`, copiado al desplegar) y envía el correo con copia de confirmación al cliente. El navegador nunca manda la dirección de destino: así nadie puede usar el servidor para enviar correo a cualquiera.
  4. Seguridad: claves solo en los secretos del alojamiento (nunca en el repo), CORS limitado a la web y a la app (`https://localhost` en Android, `capacitor://localhost` en iOS), límite de envíos por IP y un campo trampa contra bots. Evitar captchas que carguen scripts de terceros.
  5. Datos: no guardar las solicitudes en una base de datos (también fuera de alcance); solo registros técnicos mínimos y por poco tiempo.
  6. La URL del servidor llega al sitio con una variable (`PUBLIC_FORM_URL`). Si no está definida, el botón "Solicitar" no aparece: la web y la app siguen funcionando sin servidor.
  7. Sin conexión (o con el servidor caído): guardar el borrador en el teléfono, avisar y reintentar al recuperar la conexión.
- [ ] Datos de contacto de cada operador para recibir solicitudes: añadir `email` y/o `whatsapp` a `tours.yaml` (y comprobarlos con la revisión de cada 6 meses).
- [ ] Campos del formulario: nombre, forma de contacto (correo o WhatsApp), fecha deseada, número de personas, idioma, punto de salida, mensaje libre y una casilla de consentimiento que enlaza la política de privacidad. Los 4 idiomas en `ui.ts`.
- [ ] Dónde va: un botón "Solicitar" en cada operador de `TourList.astro` que abre el formulario con el operador ya elegido.
- [ ] Privacidad: actualizar la política de privacidad (Fase 1, paso 8) y los formularios de las tiendas. La app recoge datos personales (nombre, contacto) y los envía a nuestro servidor: hay que declararlo en Google Play ("Seguridad de los datos") y en Apple (etiqueta de privacidad).
- [ ] Depende de que haya operadores: no tiene sentido desplegarlo con `tours.yaml` vacío.

---

## Fase 3 · Widgets de tiempo, ubicación y rayos (en curso)

- [x] **Alcance** actualizado en `CLAUDE.md` (2026-10-26): tiempo, ubicación y rayos entran; mapas, notificaciones, cuentas y base de datos siguen fuera.
- [x] **Página "Tiempo y localización"** (`key: today`; `es/hoy.md`, `en/today.md`, `de/heute.md`, `fr/aujourdhui.md`), última del menú, con tarjeta en la portada (icono de luna). de y fr, en borrador. Los widgets están en `src/components/Today.astro`.
- [x] **Tiempo y rayos de la semana**: esta noche y las 6 siguientes en Congo Mirador (tormenta, lluvia, viento, puesta de sol). Una sola llamada a Open-Meteo al abrir la página; el último pronóstico se guarda en `localStorage` (`ct.forecast`) y, sin conexión, se muestra con un aviso y su fecha. Atribución de Open-Meteo (CC BY 4.0) en el panel.
  - "Tormenta" es una estimación, explicada en la página: *probable* si el modelo prevé tormenta (códigos 95–99) o CAPE ≥ 1500 J/kg con lluvia ≥ 50 %; *posible* con CAPE ≥ 500 J/kg y lluvia ≥ 30 %. Los modelos casi nunca dan el código de tormenta en el lago (2 horas en 16 días, en una prueba de octubre de 2026), por eso se usa también el CAPE.
  - La política de privacidad ya dice que la página pide el pronóstico a Open-Meteo (recibe la IP; no la ubicación).
  - En las pruebas, Open-Meteo devolvió "límite diario superado" desde la IP compartida del servidor de pruebas: la página mostró el aviso de sin conexión, como debe. El límite gratuito es por IP (10 000 llamadas/día); cada visita hace una.
- [x] **Mapa con tu ubicación** (2026-10-27; sustituye al widget de distancia del 2026-10-26): mapa de la zona con Puerto Concha, Congo Mirador y Ologá, tu posición precisa con su círculo de precisión y, en la leyenda, la distancia en línea recta y la dirección hasta cada lugar.
  - Dependencia nueva: `maplibre-gl` (BSD-3, código abierto). Pesa unos 450 KB comprimidos con su worker: se descarga solo cuando el mapa está a punto de verse, y solo en esta página.
  - Datos: OpenFreeMap (OpenStreetMap; sin clave, sin límites de uso, uso comercial permitido). No se usan los servidores de teselas de OpenStreetMap: su política no encaja con una app.
  - Diseño: el mapa usa Liberty, el estilo por defecto de OpenFreeMap, con los controles por defecto de MapLibre (2026-10-27; antes, colores de los tokens `--map-*`). El marco (`.ct-map`), la barra de controles (`.ct-map-controls`), la leyenda (`.ct-legend`) y los marcadores (`ct-map-dot`, `ct-map-user`) siguen siendo del sistema de diseño. Los marcadores llevan solo el número, porque Liberty ya escribe los nombres; sin conexión, también el nombre.
  - Sin conexión (si el estilo Liberty no se puede descargar): contorno simplificado del lago, la costa, ríos y fronteras (Natural Earth 10m, dominio público: capas `ocean` + `lakes` unidas como agua, `rivers_lake_centerlines` y `admin_0_boundary_lines_land`, recortadas a lon −73,6…−69,6 / lat 7,8…12,6 y simplificadas a 0,004° con shapely: `src/assets/map/lago.json`, 11 KB) en los colores de Liberty, y aviso "mapa simplificado". La ubicación funciona sin internet. Los nombres de ciudades (fuentes de OpenFreeMap) no salen sin conexión; los de los lugares de la guía, sí.
  - El worker de MapLibre se compila aparte (`src/lib/map-worker.ts`) y sale como `.js`: Capacitor en iOS sirve los `.mjs` como `application/octet-stream` (solo conoce `.js`) y el worker no arrancaría. En Android ya funcionaba.
  - Leyenda: cada lugar es un botón que centra el mapa en él (zoom 12) y lo marca; en el teléfono, si el mapa no se ve, la página vuelve a él (2026-10-27).
  - Gestos: dos dedos para mover el mapa en el teléfono (Ctrl/⌘ + rueda en el ordenador), para que la página siga desplazándose con un dedo.
  - Ubicación precisa (`enableHighAccuracy`), seguida mientras la página está abierta (`watchPosition`). Android: `ACCESS_FINE_LOCATION` además de `ACCESS_COARSE_LOCATION`.
  - Privacidad: tu posición no sale del teléfono, pero las teselas que pide el mapa dicen a OpenFreeMap qué zona miras (si el mapa está centrado en ti, aproximadamente dónde estás). Lo dice la política de privacidad. **En las tiendas**, revisarlo al rellenar "Seguridad de los datos" (Google) y la etiqueta de privacidad (Apple).
  - Probado en Chromium: en línea, con ubicación simulada (± 25 m), sin conexión y con el permiso denegado. **Falta:** probarlo en teléfonos reales (WebGL, worker y permisos en Android e iOS).
- [ ] **Rayos del mes y del año** (climatología): bloqueado. El dato bueno es LIS VHRMC de la NASA (0,1°, mensual, 1998–2013, archivo `lis_vhrmc_1998_2013_v01.nc.gz`), pero para descargarlo hace falta una cuenta gratuita de NASA Earthdata. Con el archivo, se resume en un JSON fijo del repo (funciona sin conexión). No inventar cifras: hasta entonces no se muestra.
- [ ] Probar en teléfonos reales: permisos, sin conexión, modo avión.
- [ ] El menú tiene ahora 6 páginas: en alemán, entre 650 y 900 px, los enlaces ocupan dos líneas. Cabe (el selector de idioma desplegable dejó algo más de sitio), pero va justo; mirarlo si se añade otra página.

### Principios para todos los widgets

- El sitio sigue siendo estático (`output: 'static'`). Cada widget es un componente Astro con un `<script>` de cliente que pide los datos al abrir la página. No hace falta un framework de UI.
- Sin conexión: guardar el último dato en `localStorage` con su fecha y mostrar "sin conexión · dato del <fecha>". Nunca bloquear el contenido de la guía.
- Textos de los widgets en `src/i18n/ui.ts`, en los 4 idiomas.
- Atribución visible de cada fuente de datos (como se hace con las fotos).
- Revisar la política de privacidad y la ficha de las tiendas con cada widget.

### Tiempo

- Fuente propuesta: [Open-Meteo](https://open-meteo.com/): gratis, sin clave, permite llamadas desde el navegador (CORS), licencia CC BY 4.0 (exige atribución). El plan gratuito es para uso no comercial: revisar si la app será de pago o tendrá anuncios.
- Pronóstico para un punto fijo: Congo Mirador. Coordenadas de referencia (OpenStreetMap, por confirmar sobre el terreno): Congo Mirador 9.3859, −71.8005; Ologá 9.4316, −71.8350; Puerto Concha 9.0336, −71.7502.
- Datos útiles: probabilidad de lluvia y de tormenta (códigos 95–99), nubosidad, viento, hora de la puesta de sol.

### Ubicación

- Web: `navigator.geolocation` (requiere HTTPS; GitHub Pages ya lo tiene).
- App: `@capacitor/geolocation` y permisos: `NSLocationWhenInUseUsageDescription` en iOS, `ACCESS_COARSE_LOCATION` en Android.
- Uso propuesto, sin mapas (siguen fuera de alcance): distancia y dirección hasta el embarcadero o la zona de observación, calculadas en el teléfono. Funciona sin conexión.
- No guardar ni enviar la ubicación a ningún sitio, y decirlo en la política de privacidad.

### Rayos: semana, mes, año

Nadie puede saber cuántos rayos *caerán*. Hay tres tipos de dato, y hay que decidir cuál se muestra (ver decisiones pendientes):

| Periodo | Qué se puede mostrar | Fuente | Sin conexión |
|---|---|---|---|
| Próxima semana | Probabilidad de tormenta por noche (no un conteo) | Pronóstico de Open-Meteo (códigos de tormenta, CAPE) | Último dato guardado |
| Mes / año | Promedio histórico de rayos y de noches con tormenta | Climatología de LIS/TRMM (Albrecht et al., BAMS 2016) o GOES‑16 GLM | Sí: es un JSON fijo en el repo |
| Últimos 7 / 30 / 365 días | Conteo real observado | Datos GLM de NOAA, procesados por un trabajo programado | Último dato guardado |

- Para el conteo real: un GitHub Action diario descarga y resume los datos GLM de la zona y publica un JSON pequeño junto a la web. La app lo descarga de la URL de la web (variable `PUBLIC_DATA_URL`), porque el `dist/` empaquetado en la app no se actualiza solo.
- Blitzortung no ofrece una API pública para esto y sus condiciones limitan el uso. Los proveedores comerciales (Vaisala, Earth Networks) son de pago.
- Recomendación inicial: empezar por climatología (mes/año, sin servidor, funciona sin conexión) + probabilidad de tormenta (semana). El conteo real solo si el presupuesto y el mantenimiento lo justifican.

---

## Decisiones pendientes

- [ ] `appId` y nombre de la app en las tiendas. Ahora hay uno provisional, `com.catatumbodigital.guia`, con el nombre "Catatumbo" (en `capacitor.config.ts`, `android/app/build.gradle` e `ios/App/App.xcodeproj`). El `appId` no se puede cambiar después de publicar.
- [ ] Quién tiene las cuentas de desarrollador y el Mac para compilar iOS.
- [ ] Correo de contacto para la política de privacidad y las fichas de las tiendas (las dos tiendas lo piden).
- [ ] Lista inicial de operadores de tours (por definir; candidatos en la Fase 2).
- [ ] Alojamiento del servidor del formulario y servicio de correo (Fase 2, servidor propio).
- [ ] ¿Los operadores pagan por aparecer o por las solicitudes? Si es así, hay que cambiar el aviso de la página de tours.
- [ ] Uso comercial: el plan gratuito de Open-Meteo es para uso no comercial. Si la app va a ser de pago o con anuncios, hace falta su plan de pago.
- [ ] Una cuenta gratuita de NASA Earthdata para descargar la climatología de rayos (Fase 3).
- [ ] Presupuesto para APIs o servidor (si se elige algo que no sea gratis).

## Registro de decisiones

| Fecha | Decisión | Motivo |
|---|---|---|
| 2026-10-25 | Capacitor 8 para la app. | Usa `dist/` tal cual; un solo código para web y app. |
| 2026-10-25 | En la app, los enlaces internos terminan en `index.html` (build con `--mode app`). | Capacitor sirve el `index.html` de la raíz para rutas sin extensión. Es el arreglo más pequeño y no toca la web. |
| 2026-10-25 | Los enlaces externos se abren en el navegador del sistema, sin `@capacitor/browser`. | Capacitor ya lo hace solo en Android e iOS: una dependencia menos. |
| 2026-10-25 | Icono sin el texto "CATATUMBO". | No se lee a tamaño de icono y el teléfono ya muestra el nombre debajo. |
| 2026-10-25 | Operadores en una colección de datos (`tours.yaml`), no en Markdown. | Una sola lista para los 4 idiomas: cada URL y cada fecha se escriben una vez. |
| 2026-10-25 | No publicar operadores sin verificar. | Sus webs no respondían y las fuentes eran antiguas; un enlace roto o un operador cerrado daña la confianza en la guía. |
| 2026-10-26 | Operadores por definir; `tours.yaml` sigue vacío. | Aún no hay operadores elegidos. |
| 2026-10-26 | Se aprueban los criterios para incluir operadores (Fase 2). | Cubren seguridad, trato con las comunidades y vigencia de los datos. |
| 2026-10-26 | Habrá un formulario de solicitud que el cliente rellena y se envía al operador. | El cliente contacta con el operador sin salir de la guía. Falta elegir cómo se envía. |
| 2026-10-26 | Política de privacidad como página Markdown fuera del menú (`menu: false`), enlazada desde el pie. | Las tiendas piden una URL pública; así sirve también dentro de la app y sin conexión. |
| 2026-10-26 | En horizontal, todo el `body` se aparta de la muesca. | Una sola regla CSS en vez de tocar cada franja; es lo mismo que hace Safari por defecto. |
| 2026-10-27 | Selector de idioma como desplegable (`<details>`) en vez de un botón por idioma. | Caben los idiomas que se añadan; funciona sin JavaScript y ocupa menos sitio en la barra superior. |
| 2026-10-27 | El mapa vuelve al diseño por defecto de OpenFreeMap (estilo Liberty y controles por defecto de MapLibre). Marcadores, leyenda y barra de controles siguen en el sistema de diseño. | Pedido del cliente. Sin conexión, el contorno de respaldo usa los colores de Liberty. |
| 2026-10-27 | La página "Hoy en el lago" pasa a llamarse "Tiempo y localización" (en: Weather and location; de: Wetter und Standort; fr: Météo et localisation). Las URLs no cambian (`/es/hoy/`…). | Pedido del cliente. Cambiar la URL rompería enlaces ya compartidos; si se quiere cambiar, hacerlo antes de publicar la app. |
| 2026-10-27 | El widget de distancia se sustituye por un mapa (MapLibre + OpenFreeMap), con la ubicación precisa. Los mapas entran en el alcance solo para esta página. | Pedido del cliente. Código y datos abiertos, sin claves; colores del sistema de diseño; contorno de Natural Earth para verlo sin conexión. |
| 2026-10-26 | Fase 3 empieza: "cantidad de rayos" = estimación de tormenta para la semana + climatología para mes/año. Sin conteo real. | Es la recomendación del plan: sin servidor y con datos que funcionan sin conexión. El conteo real pediría un trabajo programado y mantenimiento. Se puede revisar. |
| 2026-10-26 | Coordenadas de referencia tomadas de OpenStreetMap. | No había otras; se confirman sobre el terreno. |
| 2026-10-26 | El pronóstico es para un solo punto (Congo Mirador). | Una sola llamada por visita; los tres lugares están a menos de 45 km y el modelo no los distingue bien. |
| 2026-10-26 | El formulario se envía con un servidor propio (opción C). | Máximo control sobre el envío y los datos. Implica un servidor pequeño aparte del sitio estático, con su coste y mantenimiento. |
