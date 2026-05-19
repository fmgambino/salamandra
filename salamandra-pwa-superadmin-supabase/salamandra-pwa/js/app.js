/* Salamandra IoT PWA - GitHub Pages ready - SVG minimal icons */
const SUPABASE_URL = 'https://bcjctccylignmhoavcqb.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_NCzKOpQ9J3SrvlFDNIfscg_26DTrMPz';
const db = window.supabase?.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const defaultCfg={logoLight:'https://i.ibb.co/fzt4pJhL/logo-Salamandra-Ligth.png',logoDark:'https://i.ibb.co/1f0VBNpF/logo-Salamandra-Dark01.png',favicon:'https://i.ibb.co/67mjNJ3R/icon-Circulo-Salamandra-dark.png',installIcon:'https://i.ibb.co/67pSLYmV/icon-Circulo-Salamandra-ligth.png'};
let state=JSON.parse(localStorage.salamandra||'{}');
state={theme:'dark',role:'superadmin',user:null,places:['Casa','Edificio'],selectedPlace:'Casa',selectedDevice:'ESP12345',settings:defaultCfg,sensors:[],devices:[],actuators:[],plans:[],...state};
const save=()=>localStorage.salamandra=JSON.stringify(state);
const toast=(t,icon='success')=>Swal.fire({toast:true,position:'top-end',timer:2200,showConfirmButton:false,icon,title:t});
const confirmAction=({title='Confirmar acción',text='¿Deseás continuar?',icon='question',confirmButtonText='Confirmar',cancelButtonText='Cancelar'}={})=>Swal.fire({title,text,icon,showCancelButton:true,confirmButtonText,cancelButtonText,reverseButtons:true,focusCancel:true,confirmButtonColor:'#00b894',cancelButtonColor:'#64748b'}).then(r=>r.isConfirmed);
const safeHtml=s=>String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const svg=(name,cls='svg-icon')=>{const common=`class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"`;const paths={
 dashboard:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
 users:'<path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="9.5" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
 shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-5"/>',
 plans:'<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 10h18"/><path d="M7 15h4"/>',
 plug:'<path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/><path d="M7 8h10v4a5 5 0 0 1-10 0V8Z"/>',
 user:'<circle cx="12" cy="8" r="4"/><path d="M4 22a8 8 0 0 1 16 0"/>',
 cloud:'<path d="M17.5 19H7a5 5 0 1 1 1-9.9A7 7 0 0 1 21 12.5 3.5 3.5 0 0 1 17.5 19Z"/>',
 settings:'<path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6V20a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1-.51 1.7 1.7 0 0 0-1.88.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1H4a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 .51-1 1.7 1.7 0 0 0-.34-1.88l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6V4a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 .51 1.7 1.7 0 0 0 1.88-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9c.14.32.34.61.6 1H20a2 2 0 1 1 0 4h-.09c-.26.39-.46.68-.51 1Z"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>',
 moon:'<path d="M21 12.8A8.5 8.5 0 1 1 11.2 3 6.7 6.7 0 0 0 21 12.8Z"/>',
 fullscreen:'<path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3"/>',
 bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
 logout:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/>',
 info:'<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
 history:'<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 3v6h6"/><path d="M12 7v5l3 2"/>',
 reset:'<path d="M21 12a9 9 0 0 1-15.5 6.2"/><path d="M3 12A9 9 0 0 1 18.5 5.8"/><path d="M21 4v6h-6M3 20v-6h6"/>',
 chart:'<path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 5-7"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 edit:'<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z"/>',
 trash:'<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/>',
 eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
 temperature:'<path d="M14 14.8V5a2 2 0 1 0-4 0v9.8a4 4 0 1 0 4 0Z"/><path d="M12 9v7"/>',
 humidity:'<path d="M12 2s7 7.2 7 12a7 7 0 0 1-14 0c0-4.8 7-12 7-12Z"/>',
 ph:'<path d="m10 2 4 4-8 12a3 3 0 0 0 4 4l12-8-4-4"/><path d="M14 6l4 4"/>',
 gas:'<path d="M7 3h10v4H7z"/><rect x="6" y="7" width="12" height="14" rx="2"/><path d="M9 11h6M9 15h6"/>',
 electric:'<path d="M13 2 4 14h7l-1 8 10-13h-7l0-7Z"/>',
 battery:'<rect x="3" y="7" width="16" height="10" rx="2"/><path d="M21 11v2M7 11v2M11 11v2"/>',
 soil:'<path d="M12 21V10"/><path d="M12 10c-4 0-6-2.5-7-6 4 0 6.5 1.7 7 6Z"/><path d="M12 10c4 0 6-2.5 7-6-4 0-6.5 1.7-7 6Z"/>',
 light:'<path d="M9 18h6"/><path d="M10 22h4"/><path d="M8 14a6 6 0 1 1 8 0c-1 1-1 2-1 4H9c0-2 0-3-1-4Z"/>',
 distance:'<path d="M4 17h16"/><path d="M7 14l-3 3 3 3M17 14l3 3-3 3"/><path d="M8 7h8"/><path d="M8 4v6M16 4v6"/>',
 generic:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 2-2.5 2-2.5 4"/><path d="M12 17h.01"/>',
 home:'<path d="m3 10 9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/>',
 wifi:'<path d="M5 13a10 10 0 0 1 14 0"/><path d="M8.5 16.5a5 5 0 0 1 7 0"/><path d="M12 20h.01"/>',
 support:'<path d="M4 12a8 8 0 0 1 16 0"/><path d="M4 12v4a2 2 0 0 0 2 2h2v-6H4Z"/><path d="M20 12v4a2 2 0 0 1-2 2h-2v-6h4Z"/><path d="M15 20h-3"/>',
 inventory:'<path d="M21 8 12 3 3 8l9 5 9-5Z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/>',
 building:'<path d="M4 21V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16"/><path d="M9 21v-4h6v4M8 7h.01M12 7h.01M16 7h.01M8 11h.01M12 11h.01M16 11h.01"/>'
}; return `<svg ${common}>${paths[name]||paths.generic}</svg>`};
const iconKey=v=>{v=(v||'generic').toString().toLowerCase();if(v.includes('temp')||v.includes('dht'))return'temperature';if(v.includes('hum')||v.includes('nivel')||v.includes('agua'))return'humidity';if(v.includes('ph'))return'ph';if(v.includes('mq')||v.includes('gas'))return'gas';if(v.includes('ec')||v.includes('conduct'))return'electric';if(v.includes('bater'))return'battery';if(v.includes('suelo'))return'soil';if(v.includes('luz')||v.includes('ldr'))return'light';if(v.includes('dist'))return'distance';if(v.includes('casa'))return'home';if(v.includes('edificio'))return'building';if(v.includes('act')||v.includes('plug'))return'plug';return'generic'};
const setThemeIcon=()=>$('#themeIcon').innerHTML=svg(document.body.classList.contains('dark')?'sun':'moon');
function initData(){if(!state.sensors.length)state.sensors=[{id:1,type:'DHT22 (Temp+Hum)',name:'DHT22',port:'GPIO 4',variable:'dht22',icon:'temperature',values:['Temp: — °C','Hum: — %']},{id:2,type:'MQ135',name:'MQ135',port:'GPIO 34',variable:'mq135',icon:'gas',values:['CO₂: — ppm','Metano: — ppm','Butano: — ppm','Propano: — ppm']},{id:3,type:'pH',name:'pH',port:'GPIO 35',variable:'ph',icon:'ph',values:['—']},{id:4,type:'Conductividad (EC)',name:'EC',port:'GPIO 32',variable:'ec',icon:'electric',values:['— µS/cm']},{id:5,type:'Nivel',name:'Nivel H₂O',port:'GPIO 33',variable:'nivel',icon:'humidity',values:['— %']},{id:6,type:'Hum Suelo',name:'Hum. Suelo 1',port:'GPIO 27',variable:'soil1',icon:'soil',values:['—']}];if(!state.devices.length)state.devices=[{place:'Casa',name:'Casa',id:'ESP12345',serie:'EG123456',cat:'home',address:'San Miguel de Tucumán, Argentina',createdAt:'2025-07-28 02:30'}];if(!state.actuators.length)state.actuators=['Grupo Electrógeno','Lámpara','Ventilador','Válvula'].map((n,i)=>({id:i+1,name:n,on:false}));if(!state.plans.length)state.plans=[{name:'Plan Emprendedor',desc:'Solo un Dispositivo SalamandraIoT basado en ESP32',monthly:'$9,99 USD',annual:'$9,99 USD'},{name:'Plan Business',desc:'Hasta 5 Dispositivos SalamandraIoT basados en ESP32',monthly:'$9,99 USD',annual:'$9,99 USD'}];save()}
function applyTheme(){document.body.classList.toggle('dark',state.theme==='dark');document.body.className=document.body.className.replace(/role-\w+/,'')+' role-'+state.role;$('#authLogo').src=state.theme==='dark'?state.settings.logoDark:state.settings.logoLight;$('#headerLogo').src=$('#authLogo').src;$('link[rel="icon"]').href=state.settings.favicon;setThemeIcon()}
function fillSelects(){const p=$('#placeSelect'),d=$('#deviceSelect');p.innerHTML=state.places.map(x=>`<option ${x===state.selectedPlace?'selected':''}>${x}</option>`).join('');const devs=state.devices.filter(x=>x.place===state.selectedPlace);d.innerHTML=devs.map(x=>`<option ${x.id===state.selectedDevice?'selected':''}>${x.id}</option>`).join('');$('#dashPlace').textContent=state.selectedPlace;$('#devPlace').innerHTML=state.places.map(x=>`<option>${x}</option>`).join('')}

function normalizeSensorValues(sensor){
  // Normaliza SIEMPRE por tipo de sensor para evitar datos viejos mezclados en localStorage.
  if(!sensor) return ['Valor: —'];
  const key = sensorMetricKey(sensor);
  const live = formatSensorLive(sensor);
  if(key === 'dht') return live;                 // Temp + Humedad
  if(key === 'gas') return live;                 // CO₂ + gases
  if(key === 'ph') return live;                  // solo pH
  if(key === 'ec') return live;                  // µS/cm
  if(key === 'humidity' || key === 'soil') return live;
  if(key === 'light') return live;
  if(sensor.value !== undefined && sensor.unit) return [`${sensor.value} ${sensor.unit}`];
  if(Array.isArray(sensor.values) && sensor.values.length) return sensor.values.map(v=>String(v));
  return live;
}
function sensorValueHtml(value){
  const txt = String(value ?? '—');
  const parts = txt.split(':');
  if(parts.length > 1){
    const label = parts.shift().trim();
    const val = parts.join(':').trim();
    return `<p><b>${safeHtml(label)}:</b> <span>${safeHtml(val)}</span></p>`;
  }
  return `<p><span>${safeHtml(txt)}</span></p>`;
}

function renderSensors(){const grid=$('.sensors');grid.querySelectorAll('.sensor-card').forEach(e=>e.remove());state.sensors.forEach(s=>{let c=document.createElement('div');c.className='card sensor-card';const values=normalizeSensorValues(s);c.innerHTML=`<h3>${svg(iconKey(s.icon||s.type||s.name))}<span>${safeHtml(s.name)}</span><button class="sensor-chart-btn" title="Ver historial gráfico" onclick="openSensorHistory(${s.id})">${svg('chart','svg-icon mini')}</button></h3><div class="sensor-values">${values.map(v=>sensorValueHtml(v)).join('')}</div><div class="card-actions"><button class="icon-btn" title="Editar" onclick="editSensor(${s.id})">${svg('edit')}</button><button class="icon-btn" title="Eliminar" onclick="delSensor(${s.id})">${svg('trash')}</button></div>`;grid.appendChild(c)})}
function renderActuators(){$('#actuators').innerHTML=state.actuators.map(a=>`<div class="card actuator-card"><b class="card-title">${svg('plug')}<span>${safeHtml(a.name)}</span></b><div class="actuator-state ${a.on?'on':'off'}">Estado: <b>${a.on?'ON':'OFF'}</b></div><div class="card-actions"><button class="icon-btn" title="Renombrar" onclick="renameActuator(${a.id})">${svg('edit')}</button><button class="icon-btn" title="Historial ON/OFF" onclick="showActuatorHistory(${a.id})">${svg('info')}</button><button class="switch ${a.on?'on':''}" title="Cambiar ON/OFF" onclick="toggleAct(${a.id})"><i></i></button></div></div>`).join('')}
function renderDevices(){let last=state.devices.at(-1);$('#lastDeviceInfo').textContent=last?`${last.createdAt} — ID: ${last.id}`:'—';$('#devicesGrid').innerHTML=state.devices.map(x=>`<div class="card device-card"><h3>${svg(iconKey(x.cat||x.name))}<span>${x.name}</span></h3><p><b>ID:</b> ${x.id}<br><b>Serie:</b> ${x.serie}</p><iframe class="device-map" loading="lazy" src="https://maps.google.com/maps?q=${encodeURIComponent(x.address)}&output=embed"></iframe><div class="card-actions"><button class="icon-btn" title="Información" onclick="Swal.fire('${x.name}','${x.address}<br>ID: ${x.id}','info')">${svg('info')}</button><button class="icon-btn" title="Editar" onclick="editDevice('${x.id}')">${svg('edit')}</button><button class="icon-btn" title="Eliminar" onclick="delDevice('${x.id}')">${svg('trash')}</button></div></div>`).join('')}
function renderPlans(){$('#plansGrid').innerHTML=state.plans.map((p,i)=>`<div class="card"><h3>${safeHtml(p.name)}</h3><p>${safeHtml(p.desc)}</p><p>Mensual: <b>${safeHtml(p.monthly)}</b><br>Anual: <b>${safeHtml(p.annual)}</b></p><div class="card-actions"><button class="icon-btn" title="Ver" onclick="Swal.fire({title:safeHtml(state.plans[${i}].name),html:safeHtml(state.plans[${i}].desc),icon:'info'})">${svg('eye')}</button><button class="icon-btn" title="Editar" onclick="editPlan(${i})">${svg('edit')}</button><button class="icon-btn" title="Eliminar" onclick="deletePlan(${i})">${svg('trash')}</button></div></div>`).join('')}
function renderUsers(){let roles=['SuperAdmin','Administradores','Emprendedor','Business'];$('#usersGrid').innerHTML=roles.map(r=>`<div class="card"><h3>${r}</h3><p>Gestión de usuarios del rol ${r}.</p></div>`).join('');$('#rolesGrid').innerHTML=roles.map(r=>`<div class="card"><h3>${r}</h3><label><input type="checkbox" checked> Ver</label><label><input type="checkbox" checked> Editar</label><label><input type="checkbox"> Eliminar</label></div>`).join('')}
function renderAll(){fillSelects();renderSensors();renderActuators();renderDevices();renderPlans();renderUsers();$('#lastReset').textContent=state.lastReset||'2025-07-19 19:10';$('#notifPanel').innerHTML='<b>Notificaciones</b><p>Instalación PWA disponible.</p><p>ESP32 listo para configurar.</p><p>Sin alarmas críticas.</p>';$('#avatar').src=state.user?.avatar||'https://api.dicebear.com/8.x/bottts/svg?seed=Salamandra'}
function loginOK(user){state.user=user||{email:$('#loginEmail').value,name:'Usuario'};save();$('#auth').classList.add('hidden');$('#app').classList.remove('hidden');renderAll();setTimeout(()=>Swal.fire({title:'Instalá Salamandra',text:'Agregá esta PWA a tu dispositivo para acceder más rápido.',icon:'info',confirmButtonText:'Entendido'}),500)}
function setupForms(){['login','register','recover'].forEach(k=>$$(`[data-auth="${k}"]`).forEach(a=>a.onclick=()=>{$$('.auth-form').forEach(f=>f.classList.remove('active'));$(`#${k}Form`).classList.add('active')}));$('#loginForm').onsubmit=async e=>{e.preventDefault();try{if(!SUPABASE_URL.includes('REEMPLAZAR')){let {data,error}=await db.auth.signInWithPassword({email:loginEmail.value,password:loginPassword.value});if(error)throw error;loginOK(data.user)}else loginOK()}catch(err){Swal.fire('Error',err.message,'error')}};$('#registerForm').onsubmit=async e=>{e.preventDefault();try{if(!SUPABASE_URL.includes('REEMPLAZAR')){let {error}=await db.auth.signUp({email:regEmail.value,password:regPassword.value,options:{data:{name:regName.value}}});if(error)throw error}toast('Usuario registrado');loginOK({email:regEmail.value,name:regName.value})}catch(err){Swal.fire('Error',err.message,'error')}};$('#recoverForm').onsubmit=async e=>{e.preventDefault();try{if(!SUPABASE_URL.includes('REEMPLAZAR'))await db.auth.resetPasswordForEmail(recoverEmail.value,{redirectTo:location.href});Swal.fire('Listo','Revisá tu correo','success')}catch(err){Swal.fire('Error',err.message,'error')}}}
function setupUi(){if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js');$$('[data-icon]').forEach(el=>el.insertAdjacentHTML('afterbegin',svg(el.dataset.icon)));$('#headerLogo').onclick=()=>$('#sidebar').classList.toggle('open');$('#themeBtn').onclick=()=>{state.theme=state.theme==='dark'?'light':'dark';save();applyTheme()};$('#fullscreenBtn').onclick=()=>document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen();$('#logoutBtn').onclick=async()=>{if(await confirmAction({title:'Cerrar sesión',text:'¿Deseás salir de Salamandra IoT?',confirmButtonText:'Salir'})){state.user=null;save();location.reload()}};$('#avatar').onclick=async()=>{let {value}=await Swal.fire({title:'URL de imagen de perfil',input:'url',inputValue:state.user?.avatar||'',showCancelButton:true,confirmButtonText:'Guardar',cancelButtonText:'Cancelar'});if(value){state.user.avatar=value;save();renderAll();toast('Imagen actualizada')}};$$('.nav').forEach(b=>b.onclick=()=>{$$('.nav,.view').forEach(x=>x.classList.remove('active'));b.classList.add('active');$('#'+b.dataset.view).classList.add('active');if(innerWidth<760)$('#sidebar').classList.remove('open')});$('#placeSelect').onchange=e=>{state.selectedPlace=e.target.value;state.selectedDevice=(state.devices.find(d=>d.place===state.selectedPlace)||{}).id;save();renderAll()};$('#deviceSelect').onchange=e=>{state.selectedDevice=e.target.value;save()};$('#infoBtn').onclick=()=>Swal.fire('Dispositivo seleccionado',state.selectedDevice||'Sin dispositivo','info');$('#restartHistoryBtn').onclick=()=>Swal.fire('Historial de reinicios',state.lastReset||'Sin registros','info');$('#remoteResetBtn').onclick=async()=>{if(await confirmAction({title:'Reset remoto',text:`¿Enviar comando de reinicio al dispositivo ${state.selectedDevice||'seleccionado'}?`,icon:'warning',confirmButtonText:'Enviar reset'})){state.lastReset=new Date().toLocaleString('es-AR');save();renderAll();toast('Reset remoto enviado')}};$('#cpuChartBtn').onclick=()=>openCpuHistory();$('#addSensor').onclick=()=>openSensor();$('#addDevice').onclick=()=>openDevice();$('#createPlan').onclick=()=>editPlan(-1);$('#saveSettings').onclick=async()=>{if(await confirmAction({title:'Guardar configuración',text:'Se actualizarán logo, favicon e icono de instalación.',confirmButtonText:'Guardar'})){state.settings={logoLight:logoLight.value||defaultCfg.logoLight,logoDark:logoDark.value||defaultCfg.logoDark,favicon:faviconUrl.value||defaultCfg.favicon,installIcon:installIcon.value||defaultCfg.installIcon};save();applyTheme();toast('Configuración guardada')}};$('#saveMqtt').onclick=async()=>{if(await confirmAction({title:'Guardar Broker MQTT',text:'¿Confirmás actualizar los datos del broker?',confirmButtonText:'Guardar'}))toast('Broker MQTT guardado')};$('#saveProfile').onclick=async()=>{if(await confirmAction({title:'Guardar perfil',text:'¿Confirmás los cambios de perfil?',confirmButtonText:'Guardar'})){state.user.name=profileName.value;state.user.avatar=profileAvatar.value;save();renderAll();toast('Perfil guardado')}};}
const sensorTypes=['DHT11','DHT22 (Temp+Hum)','MQ135','Hum Suelo','pH','Conductividad (EC)','Nivel','Agregar otro'];const gpios=[0,2,4,5,12,13,14,15,16,17,18,19,21,22,23,25,26,27,32,33,34,35,36,39].map(x=>'GPIO '+x);const icons=[['generic','Genérico'],['temperature','Temperatura'],['humidity','Humedad / Nivel'],['ph','pH'],['gas','Gases'],['electric','Eléctrico / EC'],['battery','Batería'],['soil','Suelo'],['light','Luz'],['distance','Distancia'],['plug','Actuador']];
function fillModalOptions(){sensorType.innerHTML=sensorTypes.map(x=>`<option>${x}</option>`).join('');sensorPort.innerHTML=gpios.map(x=>`<option>${x}</option>`).join('');sensorIcon.innerHTML=icons.map(([v,n])=>`<option value="${v}">${n}</option>`).join('');devCat.innerHTML=[['home','Casa'],['building','Edificio'],['generic','Genérico'],['custom','Agregar otra']].map(([v,n])=>`<option value="${v}">${n}</option>`).join('')}
let editId=null;function openSensor(s=null){editId=s?.id||null;fillModalOptions();sensorTitle.textContent=s?'Editar Sensor':'Añadir Sensor';sensorName.value=s?.name||'';sensorVar.value=s?.variable||'';sensorIcon.value=iconKey(s?.icon||s?.type||s?.name);sensorDialog.showModal()}window.editSensor=id=>openSensor(state.sensors.find(s=>s.id===id));sensorForm.onsubmit=async e=>{e.preventDefault();if(sensorType.value.includes('Agregar'))return Swal.fire('Nuevo tipo','Podés sumarlo al catálogo o cargarlo desde Supabase.','info');let obj={id:editId||Date.now(),type:sensorType.value,name:sensorName.value,port:sensorPort.value,variable:sensorVar.value,icon:sensorIcon.value,values:['—']}; sensorDialog.close(); if(!(await confirmAction({title:editId?'Actualizar sensor':'Crear sensor',text:`¿Confirmás guardar ${obj.name}?`,confirmButtonText:'Guardar'}))){sensorDialog.showModal();return;} obj.values=formatSensorLive(obj); editId?Object.assign(state.sensors.find(s=>s.id===editId),obj):state.sensors.push(obj);save();renderSensors();toast('Sensor guardado')};window.delSensor=async id=>{let s=state.sensors.find(x=>x.id===id);if(await confirmAction({title:'Eliminar sensor',text:`¿Deseás eliminar ${s?.name||'este sensor'}?`,icon:'warning',confirmButtonText:'Eliminar'})){state.sensors=state.sensors.filter(s=>s.id!==id);save();renderSensors();toast('Sensor eliminado')}};
function openDevice(d=null){fillModalOptions();devName.value=d?.name||'';devId.value=d?.id||'ESP'+Math.floor(1000+Math.random()*8999);devSerie.value=d?.serie||'EG'+Math.random().toString(16).slice(-6).toUpperCase();devAddress.value=d?.address||'';devCat.value=iconKey(d?.cat||d?.name);deviceDialog.showModal()}deviceForm.onsubmit=async e=>{e.preventDefault();let obj={place:devPlace.value,name:devName.value,id:devId.value,serie:devSerie.value,cat:devCat.value,address:devAddress.value,createdAt:new Date().toLocaleString('es-AR')}; deviceDialog.close(); if(!(await confirmAction({title:'Guardar dispositivo',text:`¿Confirmás guardar ${obj.name} (${obj.id})?`,confirmButtonText:'Guardar'}))){deviceDialog.showModal();return;} let i=state.devices.findIndex(d=>d.id===obj.id);i>=0?state.devices[i]=obj:state.devices.push(obj);state.selectedDevice=obj.id;save();renderAll();toast('Dispositivo guardado')};window.editDevice=id=>openDevice(state.devices.find(d=>d.id===id));window.delDevice=async id=>{let d=state.devices.find(x=>x.id===id);if(await confirmAction({title:'Eliminar dispositivo',text:`¿Deseás eliminar ${d?.name||id}?`,icon:'warning',confirmButtonText:'Eliminar'})){state.devices=state.devices.filter(d=>d.id!==id);save();renderAll();toast('Dispositivo eliminado')}};
function ensureActuatorEvents(){state.actuatorEvents=state.actuatorEvents||{};state.actuators.forEach(a=>{const k=String(a.id);if(!state.actuatorEvents[k]){state.actuatorEvents[k]=[{ts:new Date().toISOString(),state:a.on?'ON':'OFF',source:'Estado inicial'}]}})}
function addActuatorEvent(actuator, nextState, source='Usuario'){ensureActuatorEvents();const k=String(actuator.id);state.actuatorEvents[k].push({ts:new Date().toISOString(),state:nextState?'ON':'OFF',source});state.actuatorEvents[k]=state.actuatorEvents[k].slice(-80)}
window.showActuatorHistory=id=>{ensureActuatorEvents();const a=state.actuators.find(x=>x.id===id);const rows=(state.actuatorEvents[String(id)]||[]).slice().reverse();const html=rows.length?`<div class="history-table-wrap"><table class="history-table"><thead><tr><th>Fecha y hora</th><th>Estado</th><th>Origen</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${new Date(r.ts).toLocaleString('es-AR')}</td><td><b class="state-${r.state.toLowerCase()}">${r.state}</b></td><td>${safeHtml(r.source||'Usuario')}</td></tr>`).join('')}</tbody></table></div>`:'Sin eventos registrados';Swal.fire({title:`Historial ON/OFF - ${safeHtml(a?.name||'Actuador')}`,html,width:720,icon:'info',confirmButtonText:'OK'})};
window.toggleAct=async id=>{let a=state.actuators.find(x=>x.id===id);let next=!a.on;if(await confirmAction({title:next?'Encender actuador':'Apagar actuador',text:`¿Confirmás cambiar el estado de ${a.name} a ${next?'ON':'OFF'}?`,icon:'question',confirmButtonText:next?'Encender':'Apagar'})){a.on=next;addActuatorEvent(a,next,'Cambio manual');save();renderActuators();toast(`${a.name}: ${next?'ON':'OFF'}`)}};window.renameActuator=async id=>{let a=state.actuators.find(x=>x.id===id);let {value}=await Swal.fire({title:'Nuevo nombre',input:'text',inputValue:a.name,showCancelButton:true,confirmButtonText:'Guardar',cancelButtonText:'Cancelar'});if(value&&value!==a.name){if(await confirmAction({title:'Confirmar cambio',text:`Renombrar ${a.name} como ${value}`,confirmButtonText:'Actualizar'})){a.name=value;save();renderActuators();toast('Actuador actualizado')}}};window.deletePlan=async i=>{let p=state.plans[i];if(await confirmAction({title:'Eliminar plan',text:`¿Deseás eliminar ${p?.name||'este plan'}?`,icon:'warning',confirmButtonText:'Eliminar'})){state.plans.splice(i,1);save();renderPlans();toast('Plan eliminado')}};window.editPlan=async i=>{let current=state.plans[i]||{name:'Nuevo Plan',desc:'Descripción',monthly:'$9,99 USD',annual:'$9,99 USD'};let {value:form}=await Swal.fire({title:i<0?'Crear Plan':'Editar Plan',html:`<input id="pn" class="swal2-input" value="${safeHtml(current.name)}"><input id="pd" class="swal2-input" value="${safeHtml(current.desc)}"><input id="pm" class="swal2-input" value="${safeHtml(current.monthly)}"><input id="pa" class="swal2-input" value="${safeHtml(current.annual)}">`,showCancelButton:true,confirmButtonText:'Guardar',cancelButtonText:'Cancelar',preConfirm:()=>({name:pn.value,desc:pd.value,monthly:pm.value,annual:pa.value})});if(form&&await confirmAction({title:i<0?'Crear plan':'Guardar cambios',text:'¿Confirmás la actualización del plan?',confirmButtonText:'Confirmar'})){i<0?state.plans.push(form):state.plans[i]=form;save();renderPlans();toast('Plan guardado')}};
let activeChart=null, activeChartContext=null;
const pad=n=>String(n).padStart(2,'0');
const toLocalInput=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
const fromLocalInput=v=>v?new Date(v):new Date();
function sensorUnit(s){let k=sensorMetricKey(s); if(k==='dht')return '°C / %'; if(k==='temperature')return '°C'; if(k==='humidity'||k==='soil')return '%'; if(k==='ph')return 'pH'; if(k==='gas')return 'ppm'; if(k==='ec')return 'µS/cm'; if(k==='light')return 'lx'; return 'valor'}
function simulatedHistory(sensor, from, to){
  const live = typeof telemetryRows === 'function' ? telemetryRows(sensor, from, to) : [];
  if(live.length) return live;
  const points=48, out=[]; const start=from.getTime(), end=to.getTime(), step=Math.max(1,(end-start)/(points-1));
  const isDht=sensorMetricKey(sensor)==='dht';
  for(let i=0;i<points;i++){
    const d=new Date(start+step*i), t=d.getTime();
    out.push({date:d,label:d.toLocaleString('es-AR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit'}),value:isDht?simValue(sensor,'temp',t):simValue(sensor, sensorMetricKey(sensor), t),temp:simValue(sensor,'temp',t),hum:simValue(sensor,'hum',t)});
  }
  return out;
}
function drawHistoryChart(sensor, from, to){
  const rows=simulatedHistory(sensor,from,to), ctx=$('#cpuChart');
  if(activeChart) activeChart.destroy();
  const isDht=sensorMetricKey(sensor)==='dht';
  const datasets=isDht?[
    {label:`${sensor.name} Temperatura (°C)`,data:rows.map(r=>r.temp),tension:.35,fill:false,pointRadius:3,borderColor:'#ff6b35',backgroundColor:'#ff6b35'},
    {label:`${sensor.name} Humedad (%)`,data:rows.map(r=>r.hum),tension:.35,fill:false,pointRadius:3,borderColor:'#2f9bff',backgroundColor:'#2f9bff'}
  ]:[{label:`${sensor.name} (${sensorUnit(sensor)})`,data:rows.map(r=>r.value),tension:.35,fill:false,pointRadius:3}];
  activeChart=new Chart(ctx,{type:'line',data:{labels:rows.map(r=>r.label),datasets},options:{responsive:true,maintainAspectRatio:false,interaction:{mode:'index',intersect:false},plugins:{legend:{display:true},tooltip:{callbacks:{title:items=>rows[items[0].dataIndex].date.toLocaleString('es-AR')}}},scales:{x:{ticks:{maxRotation:45,minRotation:0}},y:{beginAtZero:false}}}});
}
function openHistoryModal(sensor){
  const now=new Date(), from=new Date(now.getTime()-24*60*60*1000);
  chartTitle.textContent=`Historial de ${sensor.name}`;
  chartHelp.textContent='Historial con fecha y hora. Datos simulados y actualizados en tiempo real hasta conectar lecturas reales desde ESP32/Supabase.';
  chartFrom.value=toLocalInput(from); chartTo.value=toLocalInput(now);
  activeChartContext=sensor;
  chartDialog.showModal();
  setTimeout(()=>drawHistoryChart(sensor,fromLocalInput(chartFrom.value),fromLocalInput(chartTo.value)),80);
}
window.openSensorHistory=id=>{const sensor=state.sensors.find(s=>s.id===id); if(sensor) openHistoryModal(sensor)};
function openCpuHistory(){openHistoryModal({id:999,name:'Temperatura CPU ESP32',type:'temperature',icon:'temperature'})}
function drawChart(){openCpuHistory()}
window.closeChartDialog=()=>{if(activeChart){activeChart.destroy();activeChart=null} chartDialog.close()};
$('#refreshChartBtn')?.addEventListener('click',()=>{if(!activeChartContext)return; const from=fromLocalInput(chartFrom.value), to=fromLocalInput(chartTo.value); if(from>=to)return Swal.fire('Rango inválido','La fecha desde debe ser anterior a la fecha hasta.','warning'); drawHistoryChart(activeChartContext,from,to)});

/* ===== Simulador en tiempo real hasta conectar ESP32/Supabase ===== */
state.telemetry = state.telemetry || {};
const RT_INTERVAL_MS = 3000;
let rtTimer = null;
function sensorMetricKey(sensor){
  const raw=String([sensor?.type,sensor?.name,sensor?.variable,sensor?.icon].filter(Boolean).join(' ')).toLowerCase();
  if(raw.includes('dht11') || raw.includes('dht22') || raw.includes('temp+hum')) return 'dht';
  if(raw.includes('mq135') || raw.includes('gas') || raw.includes('co2') || raw.includes('co₂')) return 'gas';
  if(raw.includes('ph')) return 'ph';
  if(raw.includes('conduct') || raw.includes('ec')) return 'ec';
  if(raw.includes('suelo')) return 'soil';
  if(raw.includes('nivel') || raw.includes('agua') || raw.includes('h₂o') || raw.includes('h2o') || raw.includes('hum')) return 'humidity';
  if(raw.includes('ldr') || raw.includes('luz')) return 'light';
  const k=iconKey(sensor?.icon||sensor?.type||sensor?.name);
  if(k==='temperature') return 'temperature';
  if(k==='humidity') return 'humidity';
  if(k==='soil') return 'soil';
  if(k==='ph') return 'ph';
  if(k==='gas') return 'gas';
  if(k==='electric') return 'ec';
  if(k==='light') return 'light';
  return 'generic';
}
function simValue(sensor, metric='main', t=Date.now()){
  const id=Number(sensor?.id||1), key=sensorMetricKey(sensor), phase=(t/1000/12)+(id*1.73)+(metric.length*.41);
  const wave=Math.sin(phase)*0.65+Math.cos(phase/2.7)*0.35;
  const jitter=((Math.floor(t/1000)+id*17+metric.length*11)%9-4)/10;
  let base=50, amp=8, dec=1;
  if(key==='dht' && metric==='temp'){base=24;amp=3.8;dec=1}
  else if(key==='dht' && metric==='hum'){base=58;amp=15;dec=0}
  else if(key==='temperature'){base=42;amp=8;dec=1}
  else if(key==='humidity'){base=63;amp=18;dec=0}
  else if(key==='soil'){base=47;amp=16;dec=0}
  else if(key==='ph'){base=6.85;amp=.55;dec=2}
  else if(key==='gas'){base=metric==='co2'?430:metric==='metano'?18:metric==='butano'?8:5;amp=metric==='co2'?75:8;dec=metric==='co2'?0:1}
  else if(key==='ec'){base=980;amp=210;dec=0}
  else if(key==='light'){base=540;amp=310;dec=0}
  const v=base+(wave*amp)+jitter;
  return Number(Math.max(0,v).toFixed(dec));
}
function formatSensorLive(sensor){
  const key=sensorMetricKey(sensor), now=Date.now();
  if(key==='dht') return [`Temp: ${simValue(sensor,'temp',now)} °C`,`Humedad: ${simValue(sensor,'hum',now)} %`];
  if(key==='gas') return [`CO₂: ${simValue(sensor,'co2',now)} ppm`,`Metano: ${simValue(sensor,'metano',now)} ppm`,`Butano: ${simValue(sensor,'butano',now)} ppm`,`Propano: ${simValue(sensor,'propano',now)} ppm`];
  if(key==='ph') return [`${simValue(sensor,'ph',now)} pH`];
  if(key==='ec') return [`${simValue(sensor,'ec',now)} µS/cm`];
  if(key==='humidity'||key==='soil') return [`${simValue(sensor,key,now)} %`];
  if(key==='light') return [`${simValue(sensor,'light',now)} lx`];
  return [`Valor: ${simValue(sensor,'main',now)} u.`];
}
function pushTelemetry(sensor){
  const key=String(sensor.id), now=new Date(), metric=sensorMetricKey(sensor), t=now.getTime();
  state.telemetry[key]=state.telemetry[key]||[];
  const value = metric==='dht' ? simValue(sensor,'temp',t) : simValue(sensor,metric,t);
  const row={ts:now.toISOString(),value};
  if(metric==='dht'){ row.temp=simValue(sensor,'temp',t); row.hum=simValue(sensor,'hum',t); }
  state.telemetry[key].push(row);
  state.telemetry[key]=state.telemetry[key].slice(-240);
}
function updateRealtimeSensors(){
  state.sensors.forEach(s=>{ s.values=formatSensorLive(s); pushTelemetry(s); });
  renderSensors();
  updateActiveRealtimeChart();
}
function telemetryRows(sensor, from, to){
  const isDht=sensorMetricKey(sensor)==='dht';
  const rows=(state.telemetry[String(sensor.id)]||[])
    .map(r=>({date:new Date(r.ts), value:r.value, temp:r.temp ?? r.value, hum:r.hum ?? simValue(sensor,'hum',new Date(r.ts).getTime())}))
    .filter(r=>r.date>=from && r.date<=to);
  return rows.map(r=>({date:r.date,label:r.date.toLocaleString('es-AR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit'}),value:r.value,temp:isDht?r.temp:undefined,hum:isDht?r.hum:undefined}));
}
function startRealtimeSimulator(){
  if(rtTimer) clearInterval(rtTimer);
  updateRealtimeSensors();
  rtTimer=setInterval(updateRealtimeSensors,RT_INTERVAL_MS);
}
function updateActiveRealtimeChart(){
  if(!activeChart || !activeChartContext || !chartDialog.open) return;
  const sensor=activeChartContext, from=fromLocalInput(chartFrom.value), to=new Date();
  if(to>fromLocalInput(chartTo.value)) chartTo.value=toLocalInput(to);
  const rows=telemetryRows(sensor,from,to);
  if(!rows.length) return;
  activeChart.data.labels=rows.map(r=>r.label);
  if(sensorMetricKey(sensor)==='dht' && activeChart.data.datasets.length>1){
    activeChart.data.datasets[0].data=rows.map(r=>r.temp);
    activeChart.data.datasets[1].data=rows.map(r=>r.hum);
  }else{
    activeChart.data.datasets[0].data=rows.map(r=>r.value);
  }
  activeChart.options.plugins.tooltip.callbacks.title=items=>rows[items[0].dataIndex].date.toLocaleString('es-AR');
  activeChart.update('none');
}

function migrateSensorUnits(){
  state.sensors.forEach(s=>{s.values=formatSensorLive(s);});
  save();
}

/* ===== Panel SuperAdmin, Soporte Ticket, Inventario y ABM avanzado ===== */
let adminStatsChart=null;
function ensureAdminData(){
  state.users = state.users || [
    {id:1,name:'Fernando Gambino',email:'fernando.m.gambino@gmail.com',role:'SuperAdmin',status:'Activo',createdAt:'2026-05-18 09:00'},
    {id:2,name:'Administrador Demo',email:'admin@salamandra.local',role:'Administrador',status:'Activo',createdAt:'2026-05-18 09:12'},
    {id:3,name:'Cliente Emprendedor',email:'emprendedor@salamandra.local',role:'Emprendedor',status:'Activo',createdAt:'2026-05-18 09:25'},
    {id:4,name:'Cuenta Business',email:'business@salamandra.local',role:'Business',status:'Pendiente',createdAt:'2026-05-18 09:40'}
  ];
  state.subscribers = state.subscribers || [
    {id:1,user:'Cliente Emprendedor',plan:'Plan Emprendedor',amount:9.99,status:'Activa'},
    {id:2,user:'Cuenta Business',plan:'Plan Business',amount:29.99,status:'Activa'},
    {id:3,user:'Laboratorio Demo',plan:'Plan Business',amount:29.99,status:'Prueba'}
  ];
  state.tickets = state.tickets || [
    {id:1,title:'Configurar ESP32 Oficina',user:'Administrador Demo',status:'Abierto',priority:'Alta',createdAt:new Date(Date.now()-3600000).toLocaleString('es-AR')},
    {id:2,title:'MQTT sin conexión intermitente',user:'Cuenta Business',status:'En proceso',priority:'Media',createdAt:new Date(Date.now()-7200000).toLocaleString('es-AR')},
    {id:3,title:'Cambio de plan solicitado',user:'Cliente Emprendedor',status:'Cerrado',priority:'Baja',createdAt:new Date(Date.now()-86400000).toLocaleString('es-AR')}
  ];
  state.inventory = state.inventory || [
    {id:1,item:'Kit Salamandra ESP32',sku:'SAL-KIT-001',stock:18,min:5,status:'Disponible'},
    {id:2,item:'Sensor DHT22',sku:'SNS-DHT22',stock:32,min:10,status:'Disponible'},
    {id:3,item:'Sensor MQ135',sku:'SNS-MQ135',stock:8,min:10,status:'Stock bajo'},
    {id:4,item:'Relé 4 canales',sku:'ACT-RELAY4',stock:14,min:6,status:'Disponible'}
  ];
  state.broker = state.broker || {status:'Online',host:'broker.salamandra.local',latency:'38 ms'};
  save();
}
function renderSuperAdminDashboard(){
  const el=$('#superAdminDashboard'); if(!el) return;
  const online = Math.max(1, state.devices.length);
  const income = (state.subscribers||[]).reduce((a,s)=>a+Number(s.amount||0),0);
  $('#superKpis').innerHTML=[
    ['Usuarios', state.users.length, 'users'],
    ['Suscriptores', state.subscribers.length, 'plans'],
    ['Ingresos', '$ '+income.toFixed(2)+' USD', 'plans'],
    ['Dispositivos Online', online+'/'+state.devices.length, 'plug'],
    ['Broker', state.broker.status, 'cloud'],
    ['WiFi Dispositivos', 'Excelente', 'wifi']
  ].map(k=>`<div class="card kpi-card">${svg(k[2])}<div><small>${k[0]}</small><strong>${k[1]}</strong></div></div>`).join('');
  $('#brokerWifiPanel').innerHTML=`<p><b>Broker MQTT:</b> <span class="state-on">${state.broker.status}</span></p><p><b>Host:</b> ${state.broker.host}</p><p><b>Latencia:</b> ${state.broker.latency}</p><div class="wifi-list">${state.devices.map((d,i)=>`<p>${svg('wifi','mini')} <b>${safeHtml(d.id)}:</b> ${92-i*8}% señal · Online</p>`).join('')||'<p>Sin dispositivos cargados.</p>'}</div>`;
  $('#ticketTicker').innerHTML=(state.tickets||[]).slice(0,5).map(t=>`<div class="ticker-item"><b>#${t.id}</b> ${safeHtml(t.title)} <span>${safeHtml(t.status)}</span></div>`).join('');
  const ctx=$('#adminStatsChart'); if(!ctx) return; if(adminStatsChart) adminStatsChart.destroy();
  adminStatsChart=new Chart(ctx,{type:'bar',data:{labels:['Usuarios','Suscriptores','Dispositivos','Tickets','Inventario'],datasets:[{label:'Totales',data:[state.users.length,state.subscribers.length,state.devices.length,state.tickets.length,state.inventory.length]}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{beginAtZero:true,ticks:{precision:0}}}}});
}
function renderUsers(){
  const roles=['SuperAdmin','Administrador','Emprendedor','Business'];
  $('#usersGrid').innerHTML=`<div class="card wide-card"><div class="table-head"><h3>ABM de Usuarios</h3><button class="primary" onclick="editUser(-1)">Agregar Usuario</button></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Nombre</th><th>Email</th><th>Rol</th><th>Estado</th><th>Creado</th><th>Acciones</th></tr></thead><tbody>${state.users.map((u,i)=>`<tr><td>${safeHtml(u.name)}</td><td>${safeHtml(u.email)}</td><td>${safeHtml(u.role)}</td><td>${safeHtml(u.status)}</td><td>${safeHtml(u.createdAt)}</td><td><button class="icon-btn" onclick="viewUser(${i})">${svg('eye')}</button><button class="icon-btn" onclick="editUser(${i})">${svg('edit')}</button><button class="icon-btn" onclick="deleteUser(${i})">${svg('trash')}</button></td></tr>`).join('')}</tbody></table></div></div>`;
  $('#rolesGrid').innerHTML=roles.map(r=>`<div class="card"><h3>${r}</h3><label><input type="checkbox" checked> Ver dashboard</label><label><input type="checkbox" ${r!=='Emprendedor'?'checked':''}> ABM dispositivos</label><label><input type="checkbox" ${r==='SuperAdmin'?'checked':''}> Roles y permisos</label><label><input type="checkbox" ${r==='SuperAdmin'?'checked':''}> Planes e ingresos</label></div>`).join('');
}
window.viewUser=i=>{const u=state.users[i]; Swal.fire({title:u.name,html:`<p><b>Email:</b> ${u.email}</p><p><b>Rol:</b> ${u.role}</p><p><b>Estado:</b> ${u.status}</p>`,icon:'info'})};
window.editUser=async i=>{const u=i<0?{name:'',email:'',role:'Emprendedor',status:'Activo'}:state.users[i];const {value:f}=await Swal.fire({title:i<0?'Nuevo Usuario':'Editar Usuario',html:`<input id="un" class="swal2-input" placeholder="Nombre" value="${safeHtml(u.name)}"><input id="ue" class="swal2-input" placeholder="Email" value="${safeHtml(u.email)}"><select id="ur" class="swal2-select"><option ${u.role==='SuperAdmin'?'selected':''}>SuperAdmin</option><option ${u.role==='Administrador'?'selected':''}>Administrador</option><option ${u.role==='Emprendedor'?'selected':''}>Emprendedor</option><option ${u.role==='Business'?'selected':''}>Business</option></select><select id="us" class="swal2-select"><option ${u.status==='Activo'?'selected':''}>Activo</option><option ${u.status==='Pendiente'?'selected':''}>Pendiente</option><option ${u.status==='Bloqueado'?'selected':''}>Bloqueado</option></select>`,showCancelButton:true,confirmButtonText:'Guardar',cancelButtonText:'Cancelar',preConfirm:()=>({name:un.value,email:ue.value,role:ur.value,status:us.value,createdAt:u.createdAt||new Date().toLocaleString('es-AR')})}); if(f&&await confirmAction({title:'Guardar usuario',text:'¿Confirmás los datos del usuario?',confirmButtonText:'Guardar'})){i<0?state.users.push({...f,id:Date.now()}):state.users[i]={...u,...f};save();renderUsers();renderSuperAdminDashboard();toast('Usuario guardado')}};
window.deleteUser=async i=>{if(await confirmAction({title:'Eliminar usuario',text:`¿Eliminar ${state.users[i].name}?`,icon:'warning',confirmButtonText:'Eliminar'})){state.users.splice(i,1);save();renderUsers();renderSuperAdminDashboard();toast('Usuario eliminado')}};
function renderSupport(){const el=$('#supportGrid'); if(!el) return; el.innerHTML=(state.tickets||[]).map((t,i)=>`<div class="card"><h3>#${t.id} ${safeHtml(t.title)}</h3><p><b>Usuario:</b> ${safeHtml(t.user)}<br><b>Estado:</b> ${safeHtml(t.status)}<br><b>Prioridad:</b> ${safeHtml(t.priority)}<br><b>Fecha:</b> ${safeHtml(t.createdAt)}</p><div class="card-actions"><button class="icon-btn" onclick="editTicket(${i})">${svg('edit')}</button><button class="icon-btn" onclick="deleteTicket(${i})">${svg('trash')}</button></div></div>`).join('')}
window.editTicket=async i=>{const t=i<0?{title:'',user:state.user?.name||'Soporte',status:'Abierto',priority:'Media'}:state.tickets[i];const {value:f}=await Swal.fire({title:i<0?'Nuevo Ticket':'Editar Ticket',html:`<input id="tt" class="swal2-input" placeholder="Asunto" value="${safeHtml(t.title)}"><input id="tu" class="swal2-input" placeholder="Usuario" value="${safeHtml(t.user)}"><select id="ts" class="swal2-select"><option>Abierto</option><option>En proceso</option><option>Cerrado</option></select><select id="tp" class="swal2-select"><option>Alta</option><option>Media</option><option>Baja</option></select>`,showCancelButton:true,confirmButtonText:'Guardar',cancelButtonText:'Cancelar',preConfirm:()=>({title:tt.value,user:tu.value,status:ts.value,priority:tp.value,createdAt:t.createdAt||new Date().toLocaleString('es-AR')})}); if(f){i<0?state.tickets.push({...f,id:Date.now()}):state.tickets[i]={...t,...f};save();renderSupport();renderSuperAdminDashboard();toast('Ticket guardado')}};
window.deleteTicket=async i=>{if(await confirmAction({title:'Eliminar ticket',icon:'warning'})){state.tickets.splice(i,1);save();renderSupport();renderSuperAdminDashboard();toast('Ticket eliminado')}};
function renderInventory(){const el=$('#inventoryGrid'); if(!el) return; el.innerHTML=(state.inventory||[]).map((it,i)=>`<div class="card"><h3>${svg('inventory')} ${safeHtml(it.item)}</h3><p><b>SKU:</b> ${safeHtml(it.sku)}<br><b>Stock:</b> ${it.stock}<br><b>Mínimo:</b> ${it.min}<br><b>Estado:</b> ${safeHtml(it.stock<=it.min?'Stock bajo':it.status)}</p><div class="card-actions"><button class="icon-btn" onclick="editInventory(${i})">${svg('edit')}</button><button class="icon-btn" onclick="deleteInventory(${i})">${svg('trash')}</button></div></div>`).join('')}
window.editInventory=async i=>{const it=i<0?{item:'',sku:'',stock:0,min:0,status:'Disponible'}:state.inventory[i];const {value:f}=await Swal.fire({title:i<0?'Nuevo Item':'Editar Item',html:`<input id="ii" class="swal2-input" placeholder="Item" value="${safeHtml(it.item)}"><input id="is" class="swal2-input" placeholder="SKU" value="${safeHtml(it.sku)}"><input id="ist" type="number" class="swal2-input" placeholder="Stock" value="${it.stock}"><input id="im" type="number" class="swal2-input" placeholder="Mínimo" value="${it.min}">`,showCancelButton:true,confirmButtonText:'Guardar',cancelButtonText:'Cancelar',preConfirm:()=>({item:ii.value,sku:is.value,stock:Number(ist.value||0),min:Number(im.value||0),status:Number(ist.value||0)<=Number(im.value||0)?'Stock bajo':'Disponible'})}); if(f){i<0?state.inventory.push({...f,id:Date.now()}):state.inventory[i]={...it,...f};save();renderInventory();renderSuperAdminDashboard();toast('Inventario guardado')}};
window.deleteInventory=async i=>{if(await confirmAction({title:'Eliminar item',icon:'warning'})){state.inventory.splice(i,1);save();renderInventory();renderSuperAdminDashboard();toast('Item eliminado')}};
function renderAll(){fillSelects();renderSensors();renderActuators();renderDevices();renderPlans();renderUsers();renderSupport();renderInventory();renderSuperAdminDashboard();$('#lastReset').textContent=state.lastReset||'2025-07-19 19:10';$('#notifPanel').innerHTML='<b>Notificaciones</b><p>Instalación PWA disponible.</p><p>ESP32 listo para configurar.</p><p>Ticket de soporte pendiente.</p><p>Broker MQTT online.</p>';$('#avatar').src=state.user?.avatar||'https://api.dicebear.com/8.x/bottts/svg?seed=Salamandra'}
function extraSetup(){ $('#addTicket')?.addEventListener('click',()=>editTicket(-1)); $('#addInventory')?.addEventListener('click',()=>editInventory(-1)); }

function boot(){initData();ensureAdminData();migrateSensorUnits();ensureActuatorEvents();setupForms();setupUi();extraSetup();applyTheme();renderAll();logoLight.value=state.settings.logoLight;logoDark.value=state.settings.logoDark;faviconUrl.value=state.settings.favicon;installIcon.value=state.settings.installIcon;startRealtimeSimulator();if(state.user)loginOK(state.user)}boot();

