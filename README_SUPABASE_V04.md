# Salamandra IoT v04 - Conexión Supabase

1. En Supabase > SQL Editor ejecutá `salamandra_supabase_schema_v04.sql` completo.
2. En Authentication > Providers activá Email.
3. En Authentication > URL Configuration agregá la URL local y GitHub Pages en Redirect URLs.
4. En `js/app.js` reemplazá `SUPABASE_URL` y `SUPABASE_ANON_KEY` por los datos de tu proyecto si cambian.
5. El bucket `avatars` queda creado para guardar la imagen de perfil al hacer clic sobre el avatar del header.

La app funciona en modo demo/local si no hay sesión activa, pero cuando Supabase está configurado intenta guardar sensores, lecturas e imagen de perfil.
