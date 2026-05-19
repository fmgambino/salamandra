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
