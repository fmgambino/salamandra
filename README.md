# Salamandra IoT PWA

Proyecto estático Mobile First listo para GitHub Pages con HTML, CSS, JavaScript, Supabase Auth, SweetAlert2, Chart.js y Service Worker.

## Publicar en GitHub Pages
1. Subí todos los archivos de esta carpeta a un repositorio.
2. En GitHub: Settings → Pages → Deploy from branch → main / root.
3. Abrí la URL generada por GitHub Pages.

## Conectar Supabase
En `js/app.js` reemplazá:
```js
const SUPABASE_URL = 'https://REEMPLAZAR.supabase.co';
const SUPABASE_ANON_KEY = 'REEMPLAZAR_ANON_KEY';
```
por los datos reales del proyecto Supabase.

Luego ejecutá `supabase-schema.sql` en SQL Editor para crear tablas base.

## Notas
- Si no configurás Supabase, el login funciona en modo demo con `localStorage`.
- La app permite alta/edición/baja visual de sensores, dispositivos, planes y actuadores.
- Los mapas usan iframe de Google Maps con la dirección cargada.

## Actualización: datos simulados en tiempo real
- Todos los sensores generan lecturas simuladas cada 3 segundos.
- Las tarjetas se actualizan automáticamente sin recargar la página.
- El historial Chart.js usa las lecturas simuladas recientes y se refresca en vivo mientras el popup está abierto.
- El código está preparado para reemplazar el simulador por lecturas reales desde ESP32/Supabase.
