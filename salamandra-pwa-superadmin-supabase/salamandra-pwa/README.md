# Salamandra IoT PWA

Proyecto HTML/CSS/JS listo para GitHub Pages, con Supabase, SweetAlert2 y Chart.js.

## Actualización incluida

- Panel SuperAdmin en Dashboard con KPIs: usuarios, suscriptores, ingresos, dispositivos online, broker MQTT, WiFi de dispositivos, gráficos estadísticos y ticker de soporte.
- Nuevo módulo **Soporte Ticket**.
- Nuevo módulo **Inventario**.
- ABM de Usuarios con alta, edición, vista y eliminación.
- `js/auth.js` separado para enlazar autenticación con Supabase.
- `supabase-schema.sql` completo con tablas, roles, RLS, planes, dispositivos, sensores, lecturas, actuadores, tickets e inventario.

## Conectar con Supabase

1. Crear un proyecto en Supabase.
2. Ir a **SQL Editor** y ejecutar `supabase-schema.sql`.
3. Ir a **Authentication > Providers** y activar Email.
4. Ir a **Authentication > URL Configuration**:
   - Site URL: URL de tu GitHub Pages.
   - Redirect URLs: agregar la URL de tu `index.html`.
5. Copiar Project URL y anon public key.
6. En `js/app.js`, reemplazar:
   - `https://REEMPLAZAR.supabase.co`
   - `REEMPLAZAR_ANON_KEY`
7. Subir todo el proyecto a GitHub Pages.

## Estructura

- `index.html`
- `css/styles.css`
- `js/app.js`
- `js/auth.js`
- `manifest.webmanifest`
- `sw.js`
- `supabase-schema.sql`
