/* auth.js - Salamandra IoT + Supabase */
(function(){
  const cfg = window.SALAMANDRA_SUPABASE_CONFIG || {};
  const fallbackUrl = window.SUPABASE_URL || 'https://bcjctccylignmhoavcqb.supabase.co';
  const fallbackKey = window.SUPABASE_ANON_KEY || 'sb_publishable_NCzKOpQ9J3SrvlFDNIfscg_26DTrMPz';
  let client = null;
  function getClient(){
    if(client) return client;
    if(window.supabase && (cfg.url || fallbackUrl) && (cfg.anonKey || fallbackKey)){
      client = window.supabase.createClient(cfg.url || fallbackUrl, cfg.anonKey || fallbackKey);
      window.supabaseClient = client;
    }
    return client;
  }
  async function upsertProfile(user, extra={}){
    const db=getClient(); if(!db || !user) return null;
    const payload={id:user.id,email:user.email,name:extra.name || user.user_metadata?.name || user.email?.split('@')[0],role:extra.role || user.user_metadata?.role || 'cliente',updated_at:new Date().toISOString()};
    const {data,error}=await db.from('profiles').upsert(payload).select().single();
    if(error) console.warn('profiles upsert', error);
    return data;
  }
  window.SalamandraAuth = {
    client:getClient,
    async signIn(email,password){const db=getClient(); if(!db) throw new Error('Configura Supabase URL y ANON KEY.'); const {data,error}=await db.auth.signInWithPassword({email,password}); if(error) throw error; await upsertProfile(data.user); return data;},
    async signUp(email,password,metadata={}){const db=getClient(); if(!db) throw new Error('Configura Supabase URL y ANON KEY.'); const {data,error}=await db.auth.signUp({email,password,options:{data:metadata,emailRedirectTo:location.origin+location.pathname}}); if(error) throw error; await upsertProfile(data.user,metadata); return data;},
    async resetPassword(email){const db=getClient(); if(!db) throw new Error('Configura Supabase URL y ANON KEY.'); const {data,error}=await db.auth.resetPasswordForEmail(email,{redirectTo:location.origin+location.pathname}); if(error) throw error; return data;},
    async signOut(){const db=getClient(); if(db) await db.auth.signOut(); localStorage.removeItem('salamandra_session');},
    async getSession(){const db=getClient(); if(!db) return null; const {data}=await db.auth.getSession(); return data.session;},
    async saveAvatar(file){const db=getClient(); if(!db) throw new Error('Supabase no configurado'); const {data:{user}}=await db.auth.getUser(); if(!user) throw new Error('Sesión no iniciada'); const ext=(file.name.split('.').pop()||'png').toLowerCase(); const path=`${user.id}/avatar-${Date.now()}.${ext}`; const {error}=await db.storage.from('avatars').upload(path,file,{cacheControl:'3600',upsert:true}); if(error) throw error; const {data:pub}=db.storage.from('avatars').getPublicUrl(path); await db.from('profiles').upsert({id:user.id,email:user.email,avatar_url:pub.publicUrl,updated_at:new Date().toISOString()}); return pub.publicUrl;}
  };
})();
