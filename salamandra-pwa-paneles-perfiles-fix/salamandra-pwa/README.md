# Salamandra IoT PWA — SuperAdmin refactor

Proyecto listo para GitHub Pages con HTML, CSS, JS, SweetAlert2, Chart.js y enlace preparado para Supabase.

## Cambios incluidos

- Panel **SuperAdmin** sin select de ubicación/dispositivo en el header.
- Dashboard SuperAdmin exclusivamente administrativo: usuarios, suscriptores, ingresos, dispositivos online, broker, WiFi, gráficos, últimos tickets, últimos dispositivos de inventario y últimos dispositivos dados de alta.
- Módulos nuevos/actualizados: **Soporte Ticket** e **Inventario**.
- Módulo **Usuarios** con ABM, búsqueda, filtro por rol, paginación 5/10/25/50/100/500, botones Atrás/Siguiente arriba y abajo, importar CSV, exportar CSV y exportar PDF/imprimir.
- En cada usuario: ver detalle, abrir dashboard del usuario con ubicaciones, dispositivos, sensores y actuadores, editar y eliminar.

## Conectar a Supabase

1. Crear un proyecto en Supabase.
2. Ir a SQL Editor y ejecutar `supabase-schema.sql`.
3. Ir a Authentication > Providers y activar Email.
4. En Authentication > URL Configuration:
   - Site URL: URL de GitHub Pages.
   - Redirect URLs: agregar la URL de `index.html`.
5. Editar `js/app.js` o definir antes de cargar `auth.js`:

```html
<script>
window.SALAMANDRA_SUPABASE_CONFIG = {
  url: 'https://TU-PROYECTO.supabase.co',
  anonKey: 'TU_ANON_KEY'
};
</script>
```

6. `js/auth.js` contiene las funciones: `signIn`, `signUp`, `resetPassword`, `signOut` y `getSession`.

## Publicar en GitHub Pages

Subir el contenido de la carpeta `salamandra-pwa` al repositorio y activar Pages desde la rama principal.


## Usuarios demo incluidos

Para probar los paneles por perfil desde el login local:

- SuperAdmin: `superadmin@salamandra.local` / `123456`
- Administrador: `admin@salamandra.local` / `123456`
- Emprendedor: `emprendedor@salamandra.local` / `123456`
- Business: `business@salamandra.local` / `123456`

Cambios de esta versión:

- Logout corregido: cierra sesión local y llama a `SalamandraAuth.signOut()` cuando Supabase está configurado.
- Menú lateral corregido: al estar colapsado muestra solamente iconos SVG; al hacer clic en el logo se expande y muestra textos.
- Header SuperAdmin corregido: no muestra selects de ubicación/dispositivo.
- Dashboard SuperAdmin limpio: resumen administrativo sin sensores ni actuadores.
- Usuarios demo para visualizar paneles Administrador, Emprendedor y Business.


## Refactor de perfiles incluido

- **SuperAdmin** y **Admin**: panel administrativo sin selects de ubicación/dispositivo y sin sensores/actuadores en el dashboard.
- **Business**: gestión de sus emprendedores, clientes, dispositivos, tickets e inventario asociado.
- **Emprendedor**: gestión de sus clientes, dispositivos, tickets e inventario asociado.
- **Cliente final**: único perfil con Dashboard IoT: selects de Lugar/Device, sensores, actuadores, Dispositivos, Usuarios, Perfil y Soporte Ticket.
- Usuarios demo:
  - superadmin@salamandra.local
  - admin@salamandra.local
  - business@salamandra.local
  - emprendedor@salamandra.local
  - cliente@salamandra.local
  - Contraseña demo: 123456

El cambio de modo claro/oscuro ahora aplica clase global `body.dark` y variable `color-scheme` para todos los paneles.
