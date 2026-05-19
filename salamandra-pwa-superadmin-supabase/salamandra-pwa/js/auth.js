/* auth.js - Enlace de autenticación Salamandra PWA con Supabase.
   1) Reemplazar SUPABASE_URL y SUPABASE_ANON_KEY en app.js o definir window.SALAMANDRA_SUPABASE_CONFIG antes de cargar este archivo.
   2) Activar Authentication > Providers > Email en Supabase.
   3) Configurar Site URL con la URL de GitHub Pages y Redirect URLs con /index.html.
*/
(function(){
  window.SalamandraAuth = {
    client(){
      if(window.db) return window.db;
      const cfg = window.SALAMANDRA_SUPABASE_CONFIG || {};
      if(window.supabase && cfg.url && cfg.anonKey) return window.supabase.createClient(cfg.url, cfg.anonKey);
      return null;
    },
    async signIn(email,password){
      const client=this.client();
      if(!client) throw new Error('Configura Supabase URL y ANON KEY.');
      const {data,error}=await client.auth.signInWithPassword({email,password});
      if(error) throw error;
      return data;
    },
    async signUp(email,password,metadata={}){
      const client=this.client();
      if(!client) throw new Error('Configura Supabase URL y ANON KEY.');
      const {data,error}=await client.auth.signUp({email,password,options:{data:metadata}});
      if(error) throw error;
      return data;
    },
    async resetPassword(email){
      const client=this.client();
      if(!client) throw new Error('Configura Supabase URL y ANON KEY.');
      const redirectTo = location.origin + location.pathname;
      const {data,error}=await client.auth.resetPasswordForEmail(email,{redirectTo});
      if(error) throw error;
      return data;
    },
    async signOut(){
      const client=this.client();
      if(client) await client.auth.signOut();
    },
    async getSession(){
      const client=this.client();
      if(!client) return null;
      const {data}=await client.auth.getSession();
      return data.session;
    }
  };
})();
