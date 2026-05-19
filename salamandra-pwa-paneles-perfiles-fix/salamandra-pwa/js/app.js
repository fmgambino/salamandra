/* Salamandra IoT PWA - Refactor perfiles jerárquicos */
const SUPABASE_URL='https://bcjctccylignmhoavcqb.supabase.co';
const SUPABASE_ANON_KEY='sb_publishable_NCzKOpQ9J3SrvlFDNIfscg_26DTrMPz';
const db=window.supabase?.createClient?.(SUPABASE_URL,SUPABASE_ANON_KEY);
const $=(s,r=document)=>r.querySelector(s);const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const defaultCfg={logoLight:'https://i.ibb.co/fzt4pJhL/logo-Salamandra-Ligth.png',logoDark:'https://i.ibb.co/1f0VBNpF/logo-Salamandra-Dark01.png',favicon:'https://i.ibb.co/67mjNJ3R/icon-Circulo-Salamandra-dark.png',installIcon:'https://i.ibb.co/67pSLYmV/icon-Circulo-Salamandra-ligth.png'};
let state=JSON.parse(localStorage.salamandra||'{}');
state={theme:'dark',role:'SuperAdmin',loggedIn:false,user:null,settings:defaultCfg,places:['Casa','Oficina','Edificio'],selectedPlace:'Casa',selectedDevice:'ESP12345',users:[],devices:[],sensors:[],actuators:[],tickets:[],inventory:[],subscriptions:[],charges:[],broker:{status:'Online',host:'broker.salamandra.local',latency:'38 ms'},...state};
let adminStatsChart=null,usersPage=1,usersPerPage=10,usersQuery='',usersRole='Todos';
const save=()=>localStorage.salamandra=JSON.stringify(state);const safe=s=>String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const toast=(title,icon='success')=>Swal.fire({toast:true,position:'top-end',timer:2200,showConfirmButton:false,icon,title});
const confirmAction=(o={})=>Swal.fire({title:o.title||'Confirmar',text:o.text||'¿Deseás continuar?',icon:o.icon||'question',showCancelButton:true,confirmButtonText:o.confirmButtonText||'Confirmar',cancelButtonText:'Cancelar',confirmButtonColor:'#00d977',cancelButtonColor:'#64748b',reverseButtons:true}).then(r=>r.isConfirmed);
const svg=(n,cls='svg-icon')=>{const p={dashboard:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',users:'<path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="9.5" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/>',shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-5"/>',plans:'<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 10h18"/>',plug:'<path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/><path d="M7 8h10v4a5 5 0 0 1-10 0V8Z"/>',support:'<path d="M4 12a8 8 0 0 1 16 0"/><path d="M4 12v4a2 2 0 0 0 2 2h2v-6H4Z"/><path d="M20 12v4a2 2 0 0 1-2 2h-2v-6h4Z"/>',inventory:'<path d="M21 8 12 3 3 8l9 5 9-5Z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/>',user:'<circle cx="12" cy="8" r="4"/><path d="M4 22a8 8 0 0 1 16 0"/>',cloud:'<path d="M17.5 19H7a5 5 0 1 1 1-9.9A7 7 0 0 1 21 12.5 3.5 3.5 0 0 1 17.5 19Z"/>',settings:'<path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6V20a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1-.51 1.7 1.7 0 0 0-1.88.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1H4a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 .51-1 1.7 1.7 0 0 0-.34-1.88l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6V4a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 .51 1.7 1.7 0 0 0 1.88-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9c.14.32.34.61.6 1H20a2 2 0 1 1 0 4h-.09c-.26.39-.46.68-.51 1Z"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>',moon:'<path d="M21 12.8A8.5 8.5 0 1 1 11.2 3 6.7 6.7 0 0 0 21 12.8Z"/>',fullscreen:'<path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3"/>',bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',logout:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/>',info:'<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',chart:'<path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 5-7"/>',eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',edit:'<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z"/>',trash:'<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/>',wifi:'<path d="M5 13a10 10 0 0 1 14 0"/><path d="M8.5 16.5a5 5 0 0 1 7 0"/><path d="M12 20h.01"/>',plus:'<path d="M12 5v14M5 12h14"/>',download:'<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/>',upload:'<path d="M12 21V9"/><path d="m7 14 5-5 5 5"/><path d="M5 3h14"/>',temperature:'<path d="M14 14.8V5a2 2 0 1 0-4 0v9.8a4 4 0 1 0 4 0Z"/>',ph:'<path d="m10 2 4 4-8 12a3 3 0 0 0 4 4l12-8-4-4"/>',gas:'<rect x="6" y="7" width="12" height="14" rx="2"/><path d="M7 3h10v4H7z"/>',electric:'<path d="M13 2 4 14h7l-1 8 10-13h-7l0-7Z"/>',humidity:'<path d="M12 2s7 7.2 7 12a7 7 0 0 1-14 0c0-4.8 7-12 7-12Z"/>',history:'<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 3v6h6"/><path d="M12 7v5l3 2"/>',reset:'<path d="M21 12a9 9 0 1 1-2.64-6.36"/><path d="M21 3v6h-6"/>'};return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${p[n]||p.info}</svg>`};
const roleCode=r=>String(r||'').toLowerCase().replace('administrador','admin');
const canCreateRole=(creator,target)=>{creator=roleCode(creator);target=roleCode(target);return creator==='superadmin'||(creator==='admin'&&['emprendedor','business'].includes(target))||(creator==='business'&&target==='emprendedor')||(creator==='emprendedor'&&target==='cliente')};
function initData(){
 if(!state.users.length)state.users=[
  {id:1,name:'Demo SuperAdmin',email:'superadmin@salamandra.local',role:'SuperAdmin',status:'Activo',parentId:null,plan:'Sistema',clientsLimit:0,entrepreneursLimit:0,deviceLimit:999,extraDeviceCost:9.99,extraEntrepreneurCost:19.99},
  {id:2,name:'Demo Admin',email:'admin@salamandra.local',role:'Admin',status:'Activo',parentId:1,plan:'Administración'},
  {id:3,name:'Demo Emprendedor',email:'emprendedor@salamandra.local',role:'Emprendedor',status:'Activo',parentId:2,plan:'Emprendedor',clientsLimit:3,devicePerClientLimit:1,extraDeviceCost:7.99},
  {id:4,name:'Demo Business',email:'business@salamandra.local',role:'Business',status:'Activo',parentId:2,plan:'Business',entrepreneursLimit:5,clientsPerEntrepreneurLimit:5,devicePerClientLimit:1,extraDeviceCost:6.99,extraEntrepreneurCost:14.99},
  {id:5,name:'Cliente Norte',email:'cliente1@salamandra.local',role:'Cliente',status:'Activo',parentId:3,plan:'Cliente'},
  {id:6,name:'Cliente Sur',email:'cliente2@salamandra.local',role:'Cliente',status:'Activo',parentId:3,plan:'Cliente'},
  {id:7,name:'Emprendedor Business A',email:'emp.a@salamandra.local',role:'Emprendedor',status:'Activo',parentId:4,plan:'Emprendedor'},
  {id:8,name:'Cliente Business A1',email:'client.ba1@salamandra.local',role:'Cliente',status:'Activo',parentId:7,plan:'Cliente'}
 ];
 if(!state.devices.length)state.devices=[{place:'Casa',name:'ESP Casa',id:'ESP12345',serie:'EG123456',cat:'Casa',address:'San Miguel de Tucumán, Argentina',ownerId:5,online:true,wifi:92,createdAt:'2026-05-18 02:30'},{place:'Oficina',name:'ESP Oficina',id:'ESP12346',serie:'EG123457',cat:'Oficina',address:'Yerba Buena, Tucumán, Argentina',ownerId:8,online:true,wifi:84,createdAt:'2026-05-18 15:40'},{place:'Campo',name:'ESP Campo',id:'ESP12347',serie:'EG123458',cat:'Campo',address:'Tafí Viejo, Tucumán, Argentina',ownerId:6,online:false,wifi:0,createdAt:'2026-05-19 09:22'}];
 state.devices.forEach((d,i)=>{d.ssid=d.ssid||'Salamandra_IoT_2.4G';d.network=d.network||'Salamandra IoT';d.rssi=d.rssi||((d.wifi||0)>80?'-48 dBm':(d.wifi||0)>0?'-67 dBm':'Sin señal');d.ip=d.ip||('192.168.1.'+(45+i));d.brokerStatus=d.brokerStatus||(d.online?'Conectado':'Desconectado')});
 if(!state.sensors.length)state.sensors=[{id:1,name:'DHT22',type:'DHT22',icon:'temperature',temp:25.8,hum:54},{id:2,name:'MQ135',type:'MQ135',icon:'gas',co2:450,metano:15.5,butano:5.2,propano:0.8},{id:3,name:'pH',type:'pH',icon:'ph',ph:6.8},{id:4,name:'EC',type:'EC',icon:'electric',ec:780},{id:5,name:'Nivel H₂O',type:'Nivel',icon:'humidity',nivel:72},{id:6,name:'Hum. Suelo 1',type:'Hum Suelo',icon:'humidity',soil:55}];
 if(!state.actuators.length)state.actuators=['Grupo Electrógeno','Lámpara','Ventilador','Válvula'].map((name,i)=>({id:i+1,name,on:i===1,events:[{at:new Date().toLocaleString('es-AR'),state:i===1?'ON':'OFF',by:'Sistema'}]}));
 if(!state.tickets.length)state.tickets=[{id:1,title:'Configurar ESP32 Oficina',user:'Demo Emprendedor',status:'Abierto',priority:'Alta',createdAt:'2026-05-18 10:30'},{id:2,title:'MQTT sin conexión intermitente',user:'Demo Business',status:'En proceso',priority:'Media',createdAt:'2026-05-18 12:12'}];
 if(!state.inventory.length)state.inventory=[{id:1,item:'Kit Salamandra ESP32',sku:'SAL-KIT-001',stock:18,min:5,status:'Disponible',createdAt:'2026-05-18 09:10'},{id:2,item:'Sensor DHT22',sku:'SNS-DHT22',stock:32,min:10,status:'Disponible',createdAt:'2026-05-18 09:20'},{id:3,item:'Sensor MQ135',sku:'SNS-MQ135',stock:8,min:10,status:'Stock bajo',createdAt:'2026-05-19 09:20'}];
 if(!state.subscriptions.length)state.subscriptions=[{userId:3,plan:'Emprendedor',amount:9.99},{userId:4,plan:'Business',amount:29.99}];
 // Migración segura para zips anteriores.
 const mustHave=[
  {name:'Demo SuperAdmin',email:'superadmin@salamandra.local',role:'SuperAdmin',parentId:null,plan:'Sistema'},
  {name:'Demo Admin',email:'admin@salamandra.local',role:'Admin',parentId:1,plan:'Administración'},
  {name:'Demo Emprendedor',email:'emprendedor@salamandra.local',role:'Emprendedor',parentId:2,plan:'Emprendedor',clientsLimit:3,devicePerClientLimit:1,extraDeviceCost:7.99},
  {name:'Demo Business',email:'business@salamandra.local',role:'Business',parentId:2,plan:'Business',entrepreneursLimit:5,clientsPerEntrepreneurLimit:5,devicePerClientLimit:1,extraDeviceCost:6.99,extraEntrepreneurCost:14.99},
  {name:'Demo Cliente Final',email:'cliente@salamandra.local',role:'Cliente',parentId:3,plan:'Cliente'}
 ];
 mustHave.forEach((u,i)=>{if(!state.users.some(x=>String(x.email).toLowerCase()===u.email)){state.users.push({id:9000+i,status:'Activo',...u})}});
 if(!state.devices.some(d=>d.ownerId===(state.users.find(u=>u.email==='cliente@salamandra.local')?.id))){
  const ownerId=state.users.find(u=>u.email==='cliente@salamandra.local')?.id||9004;
  state.devices.push({place:'Casa',name:'ESP Cliente Final',id:'ESPCLIENTE1',serie:'EGCL0001',cat:'Casa',address:'San Miguel de Tucumán, Argentina',ownerId,online:true,wifi:88,ssid:'Salamandra_IoT_2.4G',network:'Salamandra IoT',rssi:'-49 dBm',ip:'192.168.1.88',brokerStatus:'Conectado',createdAt:new Date().toLocaleString('es-AR')});
 }
 state.users.forEach((u,i)=>{u.id=u.id||i+1;u.status=u.status||'Activo';u.plan=u.plan||u.role;u.planCycle=u.planCycle||((u.role==='Business')?'Anual':'Mensual');});
 state.devices.forEach((d,i)=>{d.ssid=d.ssid||'Salamandra_IoT_2.4G';d.network=d.network||'Salamandra IoT';d.rssi=d.rssi||((d.wifi||0)>80?'-48 dBm':(d.wifi||0)>0?'-67 dBm':'Sin señal');d.ip=d.ip||('192.168.1.'+(45+i));d.brokerStatus=d.brokerStatus||(d.online?'Conectado':'Desconectado')});
 save();
}
function applyTheme(){
 document.body.dataset.theme=state.theme;
 document.body.classList.toggle('dark',state.theme==='dark');
 document.documentElement.style.colorScheme=state.theme==='dark'?'dark':'light';
 $('#themeIcon')&&($('#themeIcon').innerHTML=svg(state.theme==='dark'?'sun':'moon'));
 const logo=state.theme==='dark'?state.settings.logoDark:state.settings.logoLight;
 ['authLogo','headerLogo'].forEach(id=>{const el=$('#'+id);if(el)el.src=logo});
}
function fillHeader(){
 const r=roleCode(state.role), isClient=r==='cliente';
 const place=$('#placeSelect'),dev=$('#deviceSelect');
 if(place&&dev){
  place.classList.toggle('hidden',!isClient);
  dev.classList.toggle('hidden',!isClient);
  place.innerHTML=state.places.map(p=>`<option ${p===state.selectedPlace?'selected':''}>${p}</option>`).join('');
  const visible=state.devices.filter(d=>isClient?(d.ownerId===state.user?.id||d.ownerId===5):true);
  dev.innerHTML=visible.map(d=>`<option value="${safe(d.id)}" ${d.id===state.selectedDevice?'selected':''}>${safe(d.id)}</option>`).join('');
 }
 let plan=$('#planBadge');
 if(!plan){plan=document.createElement('span');plan.id='planBadge';plan.className='plan-badge';$('#deviceSelect')?.after(plan)}
 const u=state.users.find(x=>x.id===state.user?.id)||{};
 if(['business','emprendedor','cliente'].includes(r)){plan.classList.remove('hidden');plan.textContent=`Plan: ${u.plan||state.role} · ${u.planCycle||'Mensual'}`;}else plan.classList.add('hidden');
 $('#avatar')&&($('#avatar').src=state.user?.avatar||'https://api.dicebear.com/8.x/bottts/svg?seed=Salamandra');
}
function setupRoleUi(){
 const r=roleCode(state.role);
 const isClientPanel=r==='cliente';
 document.body.classList.toggle('client-panel',isClientPanel);
 document.body.classList.toggle('admin-panel',!isClientPanel);
 document.body.classList.toggle('role-superadmin',r==='superadmin');
 document.body.classList.toggle('role-admin',r==='admin');
 document.body.classList.toggle('role-business',r==='business');
 document.body.classList.toggle('role-emprendedor',r==='emprendedor');
 document.body.classList.toggle('role-cliente',r==='cliente');

 // Selects de ubicación/dispositivo: solo cliente final.
 $$('#placeSelect,#deviceSelect').forEach(e=>e.classList.toggle('hidden',!isClientPanel));

 // Dashboard IoT: solo cliente final. El resto ve gestión/administración.
 const toolbar=$('.toolbar'), sensors=$('.grid.sensors'), actuators=$('#actuators'), actTitle=$('#dashboard > h3');
 [toolbar,sensors,actuators,actTitle].forEach(e=>e&&e.classList.toggle('hidden',!isClientPanel));

 // Menú por perfil.
 const allowedByRole={
  superadmin:['dashboard','users','roles','plans','devices','support','inventory','profile','mqtt','settings'],
  admin:['dashboard','users','plans','devices','support','inventory','profile','mqtt','settings'],
  business:['dashboard','users','devices','support','inventory','profile','mqtt'],
  emprendedor:['dashboard','users','devices','support','inventory','profile','mqtt'],
  cliente:['dashboard','devices','support','profile']
 };
 $$('.nav').forEach(btn=>{
  const show=(allowedByRole[r]||allowedByRole.cliente).includes(btn.dataset.view);
  btn.classList.toggle('hidden',!show);
 });
 const active=$('.nav.active');
 if(active&&active.classList.contains('hidden')){
  setActiveView('dashboard');
 }
}
function visibleUsers(){const r=roleCode(state.role),me=state.user?.id;if(r==='superadmin')return state.users;if(r==='admin')return state.users.filter(u=>['Emprendedor','Business','Cliente'].includes(u.role));if(r==='business'){const emps=state.users.filter(u=>u.parentId===me&&u.role==='Emprendedor').map(u=>u.id);return state.users.filter(u=>u.parentId===me||emps.includes(u.parentId));}if(r==='emprendedor')return state.users.filter(u=>u.parentId===me||u.id===me);return state.users.filter(u=>u.id===me);}
function roleLimitsCard(){return `<div class="card"><h3>Reglas de perfiles</h3><p><b>SuperAdmin:</b> control total.</p><p><b>Admin:</b> crea y administra Emprendedor y Business.</p><p><b>Emprendedor:</b> hasta 3 clientes, 1 device por cliente.</p><p><b>Business:</b> hasta 5 emprendedores; cada emprendedor hasta 5 clientes, 1 device por cliente.</p><p><b>Extras:</b> device adicional o nuevo emprendedor genera costo extra configurable.</p></div>`;}
function currentDevice(){const r=roleCode(state.role);const pool=r==='cliente'?state.devices.filter(d=>d.ownerId===state.user?.id||d.ownerId===5):state.devices;return pool.find(d=>d.id===state.selectedDevice)||pool[0]||state.devices[0];}
function renderDashboard(){
 const dash=$('#superAdminDashboard');if(!dash)return;
 const r=roleCode(state.role), isClient=r==='cliente';
 const h2=$('#dashboard h2');
 const users=visibleUsers(); const scopedIds=users.map(u=>u.id);
 const scopedDevices=r==='superadmin'||r==='admin'?state.devices:state.devices.filter(d=>scopedIds.includes(d.ownerId)||d.ownerId===state.user?.id);
 const dev=currentDevice();
 const subs=state.subscriptions.filter(s=>r==='superadmin'||r==='admin'||scopedIds.includes(s.userId)).length;
 const income=state.subscriptions.filter(s=>r==='superadmin'||r==='admin'||scopedIds.includes(s.userId)).reduce((a,b)=>a+(+b.amount||0),0)+state.charges.reduce((a,b)=>a+(+b.amount||0),0);
 const online=scopedDevices.filter(d=>d.online).length;
 const wifi=scopedDevices.length?Math.round(scopedDevices.reduce((a,d)=>a+(d.wifi||0),0)/scopedDevices.length):0;
 if(isClient){
  h2.innerHTML='Dashboard — <span id="dashPlace">'+safe(state.selectedPlace||dev?.place||'Cliente')+'</span>';
  $('#superKpis').innerHTML=[['Dispositivos',scopedDevices.length,'plug'],['Online',online+'/'+scopedDevices.length,'wifi'],['Broker',dev?.brokerStatus||state.broker.status,'cloud'],['WiFi',`${dev?.wifi||wifi}%`,'wifi'],['Tickets',state.tickets.filter(t=>t.user===state.user?.name).length,'support']].map(k=>`<div class="card kpi">${svg(k[2])}<span>${k[0]}</span><b>${k[1]}</b></div>`).join('');
  $('#brokerWifiPanel').innerHTML=`<div class="device-status"><h4>Dispositivo seleccionado: ${safe(dev?.name||'-')}</h4><p><b>Broker MQTT:</b> <span class="${dev?.online?'state-on':'state-off'}">${dev?.online?'Conectado':'Desconectado'}</span></p><p><b>Host:</b> ${safe(state.broker.host)}</p><p><b>Latencia:</b> ${safe(state.broker.latency)}</p><p><b>WiFi Estado:</b> <span class="${(dev?.wifi||0)>0?'state-on':'state-off'}">${(dev?.wifi||0)>0?'Conectado':'Sin señal'}</span></p><p><b>Red:</b> ${safe(dev?.network||'Salamandra-IoT')}</p><p><b>SSID:</b> ${safe(dev?.ssid||'Salamandra_IoT_2.4G')}</p><p><b>Señal:</b> ${dev?.wifi||0}% (${safe(dev?.rssi||'-52 dBm')})</p><p><b>IP:</b> ${safe(dev?.ip||'192.168.1.45')}</p></div>`;
  $('#ticketTicker').innerHTML=state.tickets.filter(t=>t.user===state.user?.name).slice(0,5).map(t=>`<div class="ticker-row"><b>#${t.id}</b> ${safe(t.title)} <span>${safe(t.status)}</span></div>`).join('')||'<p>Sin tickets abiertos.</p>';
 } else {
  h2.innerHTML=r==='business'?'Dashboard — Gestión Business':r==='emprendedor'?'Dashboard — Gestión Emprendedor':r==='admin'?'Dashboard — Gestión Admin':'Dashboard — Resumen Administrativo';
  $('#superKpis').innerHTML=[['Usuarios',users.length,'users'],['Clientes',users.filter(u=>u.role==='Cliente').length,'user'],['Emprendedores',users.filter(u=>u.role==='Emprendedor').length,'users'],['Ingresos','$ '+income.toFixed(2)+' USD','plans'],['Dispositivos Online',online+'/'+scopedDevices.length,'plug'],['Broker',state.broker.status,'cloud'],['WiFi Promedio',wifi+'%','wifi']].map(k=>`<div class="card kpi">${svg(k[2])}<span>${k[0]}</span><b>${k[1]}</b></div>`).join('');
  $('#brokerWifiPanel').innerHTML=`<p><b>Broker MQTT:</b> <span class="state-on">${state.broker.status}</span></p><p><b>Host:</b> ${state.broker.host}</p><p><b>Latencia:</b> ${state.broker.latency}</p>`+scopedDevices.map(d=>`<p>${svg('wifi')} <b>${safe(d.id)}</b>: ${d.online?'Online':'Offline'} · ${d.wifi}% señal</p>`).join('');
  $('#ticketTicker').innerHTML=state.tickets.slice(0,5).map(t=>`<div class="ticker-row"><b>#${t.id}</b> ${safe(t.title)} <span>${safe(t.status)}</span></div>`).join('');
 }
 let canvas=$('#adminStatsChart');
 if(canvas){if(adminStatsChart)adminStatsChart.destroy();adminStatsChart=new Chart(canvas,{type:'bar',data:{labels:isClient?['Dispositivos','Online','Tickets','Sensores','Actuadores']:['Usuarios','Clientes','Emprendedores','Online','Tickets','Inventario'],datasets:[{label:'Resumen',data:isClient?[scopedDevices.length,online,state.tickets.length,state.sensors.length,state.actuators.length]:[users.length,users.filter(u=>u.role==='Cliente').length,users.filter(u=>u.role==='Emprendedor').length,online,state.tickets.length,state.inventory.length]}]},options:{responsive:true,plugins:{legend:{display:false}},scales:{y:{beginAtZero:true}}}})}
 let extra=$('#adminExtraPanels');if(!extra){dash.insertAdjacentHTML('beforeend','<div id="adminExtraPanels" class="admin-panels"></div>');extra=$('#adminExtraPanels')}
 extra.innerHTML=isClient
  ? `<div class="card"><h3>Mis dispositivos</h3>${scopedDevices.map(d=>`<p><b>${safe(d.id)}</b> · ${safe(d.name)}<br><small>${d.online?'Online':'Offline'} · WiFi ${d.wifi}% · ${safe(d.ssid||'Salamandra_IoT_2.4G')}</small></p>`).join('')||'<p>Sin dispositivos.</p>'}</div><div class="card"><h3>Mis tickets</h3>${state.tickets.filter(t=>t.user===state.user?.name).map(t=>`<p><b>#${t.id}</b> ${safe(t.title)}<br><small>${safe(t.status)}</small></p>`).join('')||'<p>Sin tickets abiertos.</p>'}</div>`
  : `<div class="card"><h3>Últimos tickets</h3>${state.tickets.map(t=>`<p><b>#${t.id}</b> ${safe(t.title)}<br><small>${safe(t.createdAt)} · ${safe(t.status)}</small></p>`).join('')}</div><div class="card"><h3>Últimos dispositivos en inventario</h3>${state.inventory.map(i=>`<p><b>${safe(i.item)}</b> · ${safe(i.sku)}<br><small>Stock ${i.stock} · ${safe(i.status)}</small></p>`).join('')}</div><div class="card"><h3>Últimos dispositivos dados de alta</h3>${scopedDevices.slice(-5).reverse().map(d=>`<p><b>${safe(d.id)}</b> · ${safe(d.name)}<br><small>${safe(d.createdAt)} · ${safe(state.users.find(u=>u.id===d.ownerId)?.name||'-')}</small></p>`).join('')}</div>${roleLimitsCard()}`;
}
const userRows=()=>visibleUsers().filter(u=>(usersRole==='Todos'||u.role===usersRole)&&(`${u.name} ${u.email} ${u.dni||''}`.toLowerCase().includes(usersQuery.toLowerCase())));
function usersPager(rows){const pages=Math.max(1,Math.ceil(rows.length/usersPerPage));usersPage=Math.min(usersPage,pages);return `<div class="pager"><label>Listar <select onchange="usersPerPage=+this.value;usersPage=1;renderUsers()">${[5,10,25,50,100,500].map(n=>`<option ${n===usersPerPage?'selected':''}>${n}</option>`).join('')}</select></label><button class="secondary" onclick="usersPage=Math.max(1,usersPage-1);renderUsers()">Atrás</button><b>Página ${usersPage} / ${pages}</b><button class="secondary" onclick="usersPage=Math.min(${pages},usersPage+1);renderUsers()">Siguiente</button></div>`}
function renderUsers(){const root=$('#usersGrid');if(!root)return;const rows=userRows();const pageRows=rows.slice((usersPage-1)*usersPerPage,usersPage*usersPerPage);const roles=['Todos','SuperAdmin','Admin','Business','Emprendedor','Cliente'];root.className='users-module';root.innerHTML=`<div class="card users-card"><div class="users-head"><div><h3>Usuarios registrados</h3><p>ABM con jerarquía, límites y costos extra.</p></div><div><button class="secondary" onclick="importUsers()">${svg('upload')} Importar CSV</button><button class="secondary" onclick="exportUsersCSV()">${svg('download')} CSV</button><button class="secondary" onclick="exportUsersPDF()">PDF</button><button class="primary" onclick="editUser()">Nuevo usuario</button></div></div><input class="search" placeholder="Buscar por nombre, email o DNI" value="${safe(usersQuery)}" oninput="usersQuery=this.value;usersPage=1;renderUsers()"><select class="search" onchange="usersRole=this.value;usersPage=1;renderUsers()">${roles.map(r=>`<option ${r===usersRole?'selected':''}>${r}</option>`).join('')}</select>${usersPager(rows)}<div class="table-wrap"><table class="users-table"><thead><tr><th>Nombre</th><th>Rol</th><th>Email</th><th>Superior</th><th>Límites</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>${pageRows.map(u=>`<tr><td><b>${safe(u.name)}</b></td><td>${safe(u.role)}</td><td>${safe(u.email)}</td><td>${safe(state.users.find(x=>x.id===u.parentId)?.name||'-')}</td><td>${limitsText(u)}</td><td><span class="badge">${safe(u.status)}</span></td><td><button class="icon-btn" onclick="viewUser(${u.id})">${svg('eye')}</button><button class="icon-btn" onclick="userDashboard(${u.id})">${svg('info')}</button><button class="icon-btn" onclick="editUser(${u.id})">${svg('edit')}</button><button class="icon-btn" onclick="deleteUser(${u.id})">${svg('trash')}</button></td></tr>`).join('')}</tbody></table></div>${usersPager(rows)}</div>`;}
function limitsText(u){if(u.role==='Emprendedor')return `${u.clientsLimit||3} clientes · ${u.devicePerClientLimit||1} device/cliente`;if(u.role==='Business')return `${u.entrepreneursLimit||5} emprendedores · ${u.clientsPerEntrepreneurLimit||5} clientes/emp.`;return '-'}
window.viewUser=id=>{const u=state.users.find(x=>x.id===id);Swal.fire({title:'Detalle de usuario',width:760,html:`<div class="user-detail"><h3>${safe(u.name)}</h3><p>${safe(u.email)} · ${safe(u.role)} · ${safe(u.status)}</p><p><b>Superior:</b> ${safe(state.users.find(x=>x.id===u.parentId)?.name||'-')}</p><p><b>Plan:</b> ${safe(u.plan||'-')}</p><p><b>Límites:</b> ${limitsText(u)}</p><p><b>Costo extra device:</b> USD ${u.extraDeviceCost||0} · <b>Costo extra emprendedor:</b> USD ${u.extraEntrepreneurCost||0}</p></div>`})};
window.userDashboard=id=>{const u=state.users.find(x=>x.id===id);const devs=state.devices.filter(d=>d.ownerId===id);Swal.fire({title:`Dashboard de ${u.name}`,width:900,html:`<div class="mini-dashboard"><div class="kpi-grid"><div class="card kpi">${svg('user')}<span>Rol</span><b>${safe(u.role)}</b></div><div class="card kpi">${svg('plug')}<span>Dispositivos</span><b>${devs.length}</b></div><div class="card kpi">${svg('wifi')}<span>Online</span><b>${devs.filter(d=>d.online).length}</b></div></div><h3>Ubicaciones y dispositivos</h3>${devs.map(d=>`<div class="card"><b>${safe(d.place)}</b> · ${safe(d.id)} · ${d.online?'Online':'Offline'} · WiFi ${d.wifi}%<br>Sensores: DHT22, MQ135, pH, EC · Actuadores: Lámpara, Válvula</div>`).join('')||'<p>Sin dispositivos asignados.</p>'}</div>`})};
window.editUser=async id=>{const idx=state.users.findIndex(x=>x.id===id),u=idx>=0?state.users[idx]:{};const allowed=['Admin','Business','Emprendedor','Cliente'].filter(r=>canCreateRole(state.role,r)||idx>=0||roleCode(state.role)==='superadmin');const html=`<input id="euName" class="swal2-input" placeholder="Nombre" value="${safe(u.name||'')}"><input id="euEmail" class="swal2-input" placeholder="Email" value="${safe(u.email||'')}"><select id="euRole" class="swal2-select">${allowed.map(r=>`<option ${u.role===r?'selected':''}>${r}</option>`).join('')}</select><select id="euParent" class="swal2-select"><option value="">Sin superior</option>${state.users.filter(x=>x.id!==id&&['SuperAdmin','Admin','Business','Emprendedor'].includes(x.role)).map(x=>`<option value="${x.id}" ${u.parentId===x.id?'selected':''}>${safe(x.name)} (${safe(x.role)})</option>`).join('')}</select><input id="euExtraDevice" class="swal2-input" type="number" step="0.01" placeholder="Costo extra device" value="${u.extraDeviceCost??7.99}"><input id="euExtraEmp" class="swal2-input" type="number" step="0.01" placeholder="Costo extra emprendedor" value="${u.extraEntrepreneurCost??14.99}">`;const r=await Swal.fire({title:id?'Editar usuario':'Nuevo usuario',html,showCancelButton:true,confirmButtonText:'Guardar',preConfirm:()=>({name:$('#euName').value,email:$('#euEmail').value,role:$('#euRole').value,parentId:+$('#euParent').value||null,status:'Activo',extraDeviceCost:+$('#euExtraDevice').value||0,extraEntrepreneurCost:+$('#euExtraEmp').value||0})});if(r.isConfirmed){idx>=0?state.users[idx]={...u,...r.value}:state.users.push({id:Date.now(),...r.value,createdAt:new Date().toLocaleString('es-AR')});save();renderAll();toast('Usuario guardado')}};
window.deleteUser=async id=>{const i=state.users.findIndex(x=>x.id===id);if(i>=0&&await confirmAction({title:'Eliminar usuario',text:`¿Eliminar ${state.users[i].name}?`,icon:'warning',confirmButtonText:'Eliminar'})){state.users.splice(i,1);save();renderAll();toast('Usuario eliminado')}};
window.exportUsersCSV=()=>{const rows=[['Nombre','Rol','Email','Superior','Estado'],...userRows().map(u=>[u.name,u.role,u.email,state.users.find(x=>x.id===u.parentId)?.name||'',u.status])];const csv=rows.map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download='usuarios-salamandra.csv';a.click()};
window.exportUsersPDF=()=>{const w=window.open('','_blank');w.document.write(`<html><body><h1>Usuarios Salamandra</h1><table border="1" cellspacing="0" cellpadding="6"><tr><th>Nombre</th><th>Rol</th><th>Email</th><th>Estado</th></tr>${userRows().map(u=>`<tr><td>${safe(u.name)}</td><td>${safe(u.role)}</td><td>${safe(u.email)}</td><td>${safe(u.status)}</td></tr>`).join('')}</table><script>print()</script></body></html>`);w.document.close()};
window.importUsers=async()=>{const{value:text}=await Swal.fire({title:'Importar CSV',input:'textarea',inputPlaceholder:'nombre,email,rol,parentId',showCancelButton:true});if(text){text.split(/\n/).slice(1).filter(Boolean).forEach(l=>{const[name,email,role,parentId]=l.split(',').map(x=>x.trim());if(name&&email)state.users.push({id:Date.now()+Math.random(),name,email,role:role||'Cliente',parentId:+parentId||null,status:'Activo'})});save();renderAll();toast('CSV importado')}};
function sensorText(s){if(s.type==='DHT22')return `<p>Temp: <b>${s.temp} °C</b></p><p>Humedad: <b>${s.hum} %</b></p>`;if(s.type==='MQ135')return `<p>CO₂: ${s.co2} ppm</p><p>Metano: ${s.metano} ppm</p><p>Butano: ${s.butano} ppm</p><p>Propano: ${s.propano} ppm</p>`;if(s.type==='pH')return `<p>${s.ph} pH</p>`;if(s.type==='EC')return `<p>${s.ec} µS/cm</p>`;if(s.type==='Nivel')return `<p>${s.nivel} %</p>`;return `<p>${s.soil||s.value||0} %</p>`}
function renderSensors(){const grid=$('.grid.sensors');if(!grid)return;grid.innerHTML=`<button class="add-card"><span class="add-content">${svg('plus')}Añadir Sensor</span></button>`+state.sensors.map(s=>`<div class="card sensor-card"><h3>${svg(s.icon)} ${safe(s.name)} <button class="sensor-chart-btn">${svg('chart')}</button></h3><div class="sensor-values">${sensorText(s)}</div><div class="card-actions"><button class="icon-btn">${svg('edit')}</button><button class="icon-btn">${svg('trash')}</button></div></div>`).join('')}
function renderActuators(){const el=$('#actuators');if(!el)return;el.innerHTML=state.actuators.map((a,i)=>`<div class="card actuator-card"><div class="card-title">${svg('plug')} <b>${safe(a.name)}</b></div><p>Estado: <b>${a.on?'ON':'OFF'}</b></p><div class="card-actions"><button class="icon-btn">${svg('edit')}</button><button class="icon-btn" onclick="showActuatorHistory(${i})">${svg('info')}</button><button class="switch ${a.on?'on':''}" onclick="toggleActuator(${i})"><i></i></button></div></div>`).join('')}
window.toggleActuator=async i=>{const a=state.actuators[i],next=!a.on;if(await confirmAction({title:'Cambiar estado',text:`¿Cambiar ${a.name} a ${next?'ON':'OFF'}?` })){a.on=next;a.events=a.events||[];a.events.unshift({at:new Date().toLocaleString('es-AR'),state:next?'ON':'OFF',by:state.user?.name||'Sistema'});save();renderActuators();toast('Estado actualizado')}};
window.showActuatorHistory=i=>{const a=state.actuators[i];Swal.fire({title:`Historial de ${a.name}`,width:700,html:`<table class="users-table"><tr><th>Fecha y hora</th><th>Estado</th><th>Usuario</th></tr>${(a.events||[]).map(e=>`<tr><td>${safe(e.at)}</td><td>${safe(e.state)}</td><td>${safe(e.by)}</td></tr>`).join('')}</table>`})};
function renderDevices(){
 const el=$('#devicesGrid');if(!el)return;
 const r=roleCode(state.role), ids=visibleUsers().map(u=>u.id);
 const devs=r==='superadmin'||r==='admin'?state.devices:state.devices.filter(d=>ids.includes(d.ownerId)||d.ownerId===state.user?.id);
 $('#lastDeviceInfo').textContent=(devs.at(-1)?.createdAt||'—')+' — ID: '+(devs.at(-1)?.id||'—');
 el.innerHTML=devs.map((d,i)=>`<div class="card device-card"><h3>${svg('plug')} ${safe(d.name)}</h3><p><b>ID:</b> ${safe(d.id)}<br><b>Serie:</b> ${safe(d.serie)}<br><b>Dueño:</b> ${safe(state.users.find(u=>u.id===d.ownerId)?.name||'-')}<br><b>Estado:</b> ${d.online?'Online':'Offline'} · WiFi ${d.wifi}%<br><b>SSID:</b> ${safe(d.ssid||'Salamandra_IoT_2.4G')}</p><iframe class="device-map" src="https://maps.google.com/maps?q=${encodeURIComponent(d.address)}&output=embed"></iframe><div class="card-actions device-actions"><button class="icon-btn" onclick="deviceInfo('${safe(d.id)}')">${svg('info')}</button><button class="icon-btn" onclick="editDevice('${safe(d.id)}')">${svg('edit')}</button><button class="icon-btn" onclick="deleteDevice('${safe(d.id)}')">${svg('trash')}</button></div></div>`).join('');
}
window.deviceInfo=id=>{const d=state.devices.find(x=>x.id===id);if(!d)return;Swal.fire({title:`Dispositivo ${safe(d.id)}`,html:`<p><b>Nombre:</b> ${safe(d.name)}</p><p><b>Serie:</b> ${safe(d.serie)}</p><p><b>Estado:</b> ${d.online?'Online':'Offline'}</p><p><b>WiFi:</b> ${d.wifi}% · SSID ${safe(d.ssid||'Salamandra_IoT_2.4G')}</p><p><b>IP:</b> ${safe(d.ip||'192.168.1.45')}</p>`})};
window.editDevice=async id=>{const d=state.devices.find(x=>x.id===id);if(!d)return;const html=`<input id="edName" class="swal2-input" value="${safe(d.name)}" placeholder="Nombre"><input id="edSerie" class="swal2-input" value="${safe(d.serie)}" placeholder="Serie"><input id="edAddress" class="swal2-input" value="${safe(d.address)}" placeholder="Domicilio"><input id="edWifi" class="swal2-input" type="number" value="${d.wifi||0}" placeholder="WiFi %"><input id="edSsid" class="swal2-input" value="${safe(d.ssid||'Salamandra_IoT_2.4G')}" placeholder="SSID">`;const r=await Swal.fire({title:'Editar dispositivo',html,showCancelButton:true,confirmButtonText:'Guardar'});if(r.isConfirmed){d.name=$('#edName').value;d.serie=$('#edSerie').value;d.address=$('#edAddress').value;d.wifi=+$('#edWifi').value||0;d.ssid=$('#edSsid').value;save();renderAll();toast('Dispositivo actualizado')}};
window.deleteDevice=async id=>{if(await confirmAction({title:'Eliminar dispositivo',text:`¿Eliminar ${id}?`,icon:'warning',confirmButtonText:'Eliminar'})){state.devices=state.devices.filter(d=>d.id!==id);save();renderAll();toast('Dispositivo eliminado')}};
function renderSimple(){const roles=$('#rolesGrid');if(roles)roles.innerHTML=['SuperAdmin','Admin','Emprendedor','Business','Cliente'].map(r=>`<div class="card"><h3>${r}</h3><p>${r==='Emprendedor'?'3 clientes incluidos · 1 device por cliente':r==='Business'?'5 emprendedores incluidos · 5 clientes por emprendedor':'Permisos configurables'}</p></div>`).join('');$('#plansGrid')&&($('#plansGrid').innerHTML=['Emprendedor: 3 clientes','Business: 5 emprendedores','Extra device','Extra emprendedor'].map(p=>`<div class="card"><h3>${p}</h3><p>Tarifa configurable desde Supabase.</p></div>`).join(''));$('#supportGrid')&&($('#supportGrid').innerHTML=state.tickets.map(t=>`<div class="card"><h3>#${t.id} ${safe(t.title)}</h3><p>${safe(t.user)} · ${safe(t.status)}</p></div>`).join(''));$('#inventoryGrid')&&($('#inventoryGrid').innerHTML=state.inventory.map(i=>`<div class="card"><h3>${safe(i.item)}</h3><p>SKU ${safe(i.sku)} · Stock ${i.stock}</p></div>`).join(''))}
function setActiveView(v){$$('.nav').forEach(x=>x.classList.toggle('active',x.dataset.view===v));$$('.view').forEach(x=>x.classList.toggle('active',x.id===v))}
function renderAll(){applyTheme();fillHeader();setupRoleUi();renderDashboard();renderUsers();renderSensors();renderActuators();renderDevices();renderSimple();$('#lastReset')&&($('#lastReset').textContent=state.lastReset||'2026-05-18 04:45:52');$('#notifPanel')&&($('#notifPanel').innerHTML='<b>Notificaciones</b><p>Broker MQTT online.</p><p>Ticket abierto.</p>')}
function setupUi(){
 $$('[data-icon]').forEach(el=>{if(!el.dataset.iconReady){el.innerHTML=svg(el.dataset.icon)+el.innerHTML;el.dataset.iconReady='1'}});
 $$('.add-svg-holder').forEach(el=>el.innerHTML=svg(el.dataset.icon));
 $$('.nav').forEach(b=>b.onclick=()=>setActiveView(b.dataset.view));
 $('#headerLogo').onclick=()=>$('#sidebar').classList.toggle('collapsed');
 $('#themeBtn').onclick=()=>{state.theme=state.theme==='dark'?'light':'dark';save();applyTheme();renderDashboard()};
 $('#fullscreenBtn').onclick=()=>document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen();
 $('#placeSelect')?.addEventListener('change',e=>{state.selectedPlace=e.target.value;save();renderAll()});
 $('#deviceSelect')?.addEventListener('change',e=>{state.selectedDevice=e.target.value;save();renderAll()});
 $('#logoutBtn').onclick=async()=>{if(await confirmAction({title:'Cerrar sesión',text:'¿Deseás salir?'})){try{await window.SalamandraAuth?.signOut?.()}catch(e){}state.loggedIn=false;state.user=null;save();$('#app').classList.add('hidden');$('#auth').classList.remove('hidden')}};
 $('#remoteResetBtn')?.addEventListener('click',async()=>{if(await confirmAction({title:'Reset remoto',text:'¿Enviar reinicio remoto al ESP32?',icon:'warning'})){state.lastReset=new Date().toLocaleString('es-AR');save();renderAll();toast('Reset enviado')}});
 $('#addDevice')?.addEventListener('click',()=>openDeviceDialog());
 $('#deviceForm')?.addEventListener('submit',async e=>{e.preventDefault();if(await confirmAction({title:'Guardar dispositivo',text:'¿Confirmás guardar el dispositivo?'})){const ownerId=state.user?.id||5;state.devices.push({place:$('#devPlace').value,name:$('#devName').value,id:$('#devId').value,serie:$('#devSerie').value,cat:$('#devCat').value,address:$('#devAddress').value,ownerId,online:true,wifi:88,ssid:'Salamandra_IoT_2.4G',network:'Salamandra IoT',rssi:'-49 dBm',ip:'192.168.1.'+(50+state.devices.length),brokerStatus:'Conectado',createdAt:new Date().toLocaleString('es-AR')});state.selectedDevice=$('#devId').value;save();$('#deviceDialog').close();renderAll();toast('Dispositivo guardado')}});
}
function openDeviceDialog(){
 const cats=['🔧 Genérico','🏠 Casa','🚗 Vehículo','🏢 Edificio','🧊 Frigorífico','📡 Antena','💡 Lámpara','🏢 Oficina','🚪 Puerta','🌡️ Termostato','📷 Cámara','🚿 Baño','🌳 Jardín','🍳 Cocina','🛏️ Dormitorio','📦 Depósito'];
 $('#devPlace').innerHTML=state.places.map(p=>`<option>${safe(p)}</option>`).join('');
 $('#devCat').innerHTML=cats.map(c=>`<option>${safe(c)}</option>`).join('');
 $('#devName').value='';$('#devId').value='ESP'+Math.floor(10000+Math.random()*89999);$('#devSerie').value='EG'+Math.floor(100000+Math.random()*899999);$('#devAddress').value='San Miguel de Tucumán, Argentina';
 $('#deviceDialog').showModal();
}

function setupAuth(){const demo='<div class="demo-logins"><b>Usuarios demo</b><button type="button" data-demo="superadmin@salamandra.local">SuperAdmin</button><button type="button" data-demo="admin@salamandra.local">Admin</button><button type="button" data-demo="emprendedor@salamandra.local">Emprendedor</button><button type="button" data-demo="business@salamandra.local">Business</button><button type="button" data-demo="cliente@salamandra.local">Cliente Final</button><small>Contraseña demo: 123456</small></div>';if(!$('.demo-logins'))$('#loginForm').insertAdjacentHTML('beforeend',demo);window.loginOK=u=>{const found=state.users.find(x=>x.email.toLowerCase()===(u?.email||'').toLowerCase())||state.users[0];state.user={id:found.id,name:found.name,email:found.email,avatar:found.avatar};state.role=found.role;state.loggedIn=true;save();$('#auth').classList.add('hidden');$('#app').classList.remove('hidden');renderAll()};if(state.loggedIn&&state.user)loginOK(state.user);$$('#auth a').forEach(a=>a.onclick=()=>{$$('.auth-form').forEach(f=>f.classList.remove('active'));$('#'+a.dataset.auth+'Form').classList.add('active')});$('#loginForm').onsubmit=e=>{e.preventDefault();const email=$('#loginEmail').value||'superadmin@salamandra.local';const user=state.users.find(u=>u.email.toLowerCase()===email.toLowerCase())||state.users[0];loginOK(user)};$$('.demo-logins [data-demo]').forEach(b=>b.onclick=()=>{$('#loginEmail').value=b.dataset.demo;$('#loginPassword').value='123456';$('#loginForm').requestSubmit()})}
function startRealtimeSimulator(){setInterval(()=>{state.sensors.forEach(s=>{if(s.type==='DHT22'){s.temp=+(22+Math.random()*8).toFixed(1);s.hum=Math.round(45+Math.random()*20)}if(s.type==='MQ135'){s.co2=Math.round(420+Math.random()*80);s.metano=+(10+Math.random()*8).toFixed(1);s.butano=+(4+Math.random()*3).toFixed(1);s.propano=+(0.5+Math.random()).toFixed(1)}if(s.type==='pH')s.ph=+(6.2+Math.random()*1.1).toFixed(2);if(s.type==='EC')s.ec=Math.round(740+Math.random()*140);if(s.type==='Nivel')s.nivel=Math.round(60+Math.random()*20);if(s.type==='Hum Suelo')s.soil=Math.round(45+Math.random()*20)});save();if(roleCode(state.role)==='cliente')renderSensors()},4000)}
function boot(){initData();applyTheme();setupUi();setupAuth();renderAll();startRealtimeSimulator()}
document.addEventListener('DOMContentLoaded',boot);

/* === Refactor solicitado: panel cliente, popups, CPU histórico, cámara IP y sidebar === */
const cameraIconSvg=()=>`<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h3l2-3h6l2 3h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z"/><circle cx="12" cy="13" r="4"/></svg>`;
const timelineIconSvg=()=>`<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5v14"/><path d="M20 5v14"/><path d="M4 8h16"/><path d="M4 16h16"/><circle cx="8" cy="8" r="1.6"/><circle cx="16" cy="16" r="1.6"/></svg>`;
const statusPill=(ok,txt)=>`<span class="status-pill ${ok?'ok':'bad'}">${safe(txt)}</span>`;
function deviceSignalStatus(d){return (d?.online && (d?.wifi||0)>0)}
function cpuHistory(){
 const now=Date.now();
 if(!state.cpuHistory||state.cpuHistory.length<40){
  state.cpuHistory=Array.from({length:80},(_,i)=>{const t=now-(79-i)*60000;return {at:new Date(t).toISOString(),value:+(43+Math.sin(i/5)*5+Math.random()*3).toFixed(1)}});
 }
 const last=state.cpuHistory[state.cpuHistory.length-1]?.value||48;
 state.cpuHistory.push({at:new Date().toISOString(),value:+(last+(Math.random()*2-1)).toFixed(1)});
 state.cpuHistory=state.cpuHistory.slice(-600);
 save();
 return state.cpuHistory;
}
function ensureChartScroll(){
 const canvas=$('#cpuChart'); if(!canvas||canvas.parentElement?.classList.contains('chart-scroll'))return;
 const wrap=document.createElement('div');wrap.className='chart-scroll';canvas.parentNode.insertBefore(wrap,canvas);wrap.appendChild(canvas);
 canvas.width=1250; canvas.height=360;
}
let cpuLineChart=null;
window.openCpuChart=function(){
 ensureChartScroll();
 const data=cpuHistory();
 const now=new Date(); const from=new Date(now.getTime()-6*60*60*1000);
 $('#chartTitle').textContent='Historial Temperatura CPU ESP32';
 $('#chartHelp').textContent='Gráfico de línea con datos simulados en tiempo real. El historial se desplaza de derecha a izquierda; usá el scroll horizontal para ver registros anteriores.';
 $('#chartFrom').value=from.toISOString().slice(0,16); $('#chartTo').value=now.toISOString().slice(0,16);
 $('#refreshChartBtn').onclick=renderCpuChart;
 $('#chartDialog').showModal();
 renderCpuChart();
 setTimeout(()=>{const s=$('.chart-scroll'); if(s) s.scrollLeft=s.scrollWidth;},80);
};
window.renderCpuChart=function(){
 ensureChartScroll();
 const from=new Date($('#chartFrom').value||0).getTime(); const to=new Date($('#chartTo').value||Date.now()).getTime();
 const rows=cpuHistory().filter(r=>{const t=new Date(r.at).getTime();return (!from||t>=from)&&(!to||t<=to)});
 const ctx=$('#cpuChart'); if(!ctx)return;
 if(cpuLineChart)cpuLineChart.destroy();
 cpuLineChart=new Chart(ctx,{type:'line',data:{labels:rows.map(r=>new Date(r.at).toLocaleString('es-AR')),datasets:[{label:'CPU ESP32 (°C)',data:rows.map(r=>r.value),borderColor:'#ff7043',backgroundColor:'rgba(255,112,67,.16)',pointRadius:2,tension:.32,fill:true}]},options:{responsive:false,maintainAspectRatio:false,animation:false,plugins:{legend:{labels:{color:getComputedStyle(document.body).getPropertyValue('--text')}}},scales:{x:{ticks:{color:getComputedStyle(document.body).getPropertyValue('--muted'),maxRotation:55,minRotation:35},grid:{color:'rgba(120,120,120,.15)'}},y:{ticks:{color:getComputedStyle(document.body).getPropertyValue('--muted')},grid:{color:'rgba(120,120,120,.15)'}}}}});
};
window.closeChartDialog=function(){try{$('#chartDialog').close()}catch(e){}};
window.showRestartHistory=function(){
 const rows=state.restartHistory||[{at:'2026-05-19 16:39',reason:'Mantenimiento'},{at:'2026-05-18 04:45',reason:'Reset remoto'},{at:'2026-05-17 09:05',reason:'Caída de red'}];
 Swal.fire({title:'Historial de registros del dispositivo',html:`<div class="history-table-wrap"><table class="history-table"><thead><tr><th>Fecha y hora</th><th>Evento</th><th>Estado</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${safe(r.at)}</td><td>${safe(r.reason)}</td><td>${statusPill(!/caída|error|offline/i.test(r.reason),'Registrado')}</td></tr>`).join('')}</tbody></table></div>`,confirmButtonText:'OK'});
};
window.showCurrentDeviceInfo=function(){const d=currentDevice(); if(!d)return;deviceInfo(d.id)};
window.openCameraPopup=function(id){
 const d=id?state.devices.find(x=>x.id===id):currentDevice(); if(!d)return;
 Swal.fire({title:'Cámara IP',html:`<div class="camera-box"><label>URL de transmisión en vivo<input id="camUrlInput" value="${safe(d.cameraUrl||'')}" placeholder="https://.../stream o http://IP:PUERTO/video"></label><button class="primary" type="button" onclick="saveCameraUrl('${safe(d.id)}')">Guardar URL</button><div class="camera-preview">${d.cameraUrl?`<iframe src="${safe(d.cameraUrl)}" allowfullscreen></iframe>`:'<p>Agregá la URL de la cámara para visualizar la transmisión.</p>'}</div></div>`,width:760,showConfirmButton:true,confirmButtonText:'Cerrar'});
};
window.saveCameraUrl=function(id){const d=state.devices.find(x=>x.id===id);if(!d)return;d.cameraUrl=$('#camUrlInput')?.value||'';save();toast('URL de cámara guardada');openCameraPopup(id)};
window.deviceInfo=function(id){const d=state.devices.find(x=>x.id===id);if(!d)return;Swal.fire({title:`Dispositivo ${safe(d.id)}`,html:`<div class="device-info-popup"><p><b>Nombre:</b> ${safe(d.name)}</p><p><b>Ubicación:</b> ${safe(d.place)}</p><p><b>Serie:</b> ${safe(d.serie)}</p><p><b>Estado:</b> ${statusPill(d.online,d.online?'Online':'Offline')}</p><p><b>Broker MQTT:</b> ${statusPill(d.online,d.online?'Conectado':'Desconectado')}</p><p><b>Red WiFi:</b> ${statusPill(deviceSignalStatus(d),deviceSignalStatus(d)?'Conectado':'Desconectado')}</p><p><b>Red:</b> ${safe(d.network||'-')}</p><p><b>SSID:</b> ${safe(d.ssid||'-')}</p><p><b>Señal:</b> ${safe(String(d.wifi||0))}% (${safe(d.rssi||'Sin señal')})</p><p><b>IP:</b> ${safe(d.ip||'-')}</p><p><b>Último visto:</b> ${safe(d.lastSeen||new Date().toLocaleString('es-AR'))}</p></div>`,confirmButtonText:'OK'});};
const oldRenderDashboard=renderDashboard;
renderDashboard=function(){
 oldRenderDashboard();
 const r=roleCode(state.role); if(r!=='cliente')return;
 const dev=currentDevice(); const online=dev?.online; const wifiOk=deviceSignalStatus(dev);
 $$('#superKpis .kpi').forEach(card=>{const label=card.querySelector('span')?.textContent||''; const b=card.querySelector('b'); if(!b)return; if(/Broker/i.test(label)){b.classList.toggle('state-on',online); b.classList.toggle('state-off',!online); b.textContent=online?'Conectado':'Desconectado'} if(/^WiFi$/i.test(label)){b.classList.toggle('state-on',wifiOk); b.classList.toggle('state-off',!wifiOk); b.textContent=wifiOk?`${dev.wifi}%`:'Desconectado'} if(/^Online$/i.test(label)){b.classList.toggle('state-on',online); b.classList.toggle('state-off',!online)}});
 $('#brokerWifiPanel').innerHTML=`<div class="device-status"><h4>Dispositivo seleccionado: ${safe(dev?.name||'-')}</h4><p><b>Broker MQTT:</b> ${statusPill(online,online?'Conectado':'Desconectado')}</p><p><b>Host:</b> ${safe(state.broker.host)}</p><p><b>Latencia:</b> ${safe(state.broker.latency)}</p><p><b>WiFi Estado:</b> ${statusPill(wifiOk,wifiOk?'Conectado':'Desconectado')}</p><p><b>Red:</b> ${safe(dev?.network||'-')}</p><p><b>SSID:</b> ${safe(dev?.ssid||'-')}</p><p><b>Señal:</b> ${safe(String(dev?.wifi||0))}% (${safe(dev?.rssi||'Sin señal')})</p><p><b>IP:</b> ${safe(dev?.ip||'-')}</p></div>`;
};
const oldRenderDevices=renderDevices;
renderDevices=function(){
 oldRenderDevices();
 $$('.device-card').forEach(card=>{
  const idTxt=[...card.querySelectorAll('p b')].find(b=>b.textContent.replace(':','')==='ID')?.nextSibling?.textContent?.trim();
  const title=card.querySelector('h3')?.textContent||''; const d=state.devices.find(x=>title.includes(x.name)); if(!d)return;
  const actions=card.querySelector('.device-actions'); if(actions && !actions.querySelector('.camera-action')) actions.insertAdjacentHTML('afterbegin',`<button class="icon-btn camera-action" onclick="openCameraPopup('${safe(d.id)}')" title="Cámara IP">${cameraIconSvg()}</button><button class="icon-btn" onclick="showRestartHistory()" title="Historial de registros">${timelineIconSvg()}</button>`);
 });
};
const oldSetupUi=setupUi;
setupUi=function(){
 oldSetupUi();
 const sidebar=$('#sidebar');
 const sync=()=>{document.body.classList.toggle('sidebar-collapsed',sidebar?.classList.contains('collapsed'));document.body.classList.toggle('sidebar-expanded',!sidebar?.classList.contains('collapsed'))};
 $('#headerLogo').onclick=()=>{sidebar.classList.toggle('collapsed');sync();};sync();
 $('#cpuChartBtn')&&($('#cpuChartBtn').onclick=openCpuChart);
 $('#infoBtn')&&($('#infoBtn').onclick=showCurrentDeviceInfo);
 $('#restartHistoryBtn')&&($('#restartHistoryBtn').onclick=showRestartHistory);
};

/* === FIX 2026-05-19: Panel Cliente - acciones, gráficos realtime, estados ON/OFF === */
(function(){
  const SENSOR_UNITS={DHT22:['°C','%'],MQ135:['ppm'],pH:['pH'],EC:['µS/cm'],Nivel:['%'],'Hum Suelo':['%']};
  let liveChart=null, liveChartKind=null, liveChartSensorId=null, liveChartTimer=null, cpuLiveTimer=null;
  const nowLabel=()=>new Date().toLocaleString('es-AR');
  const getSensorById=id=>state.sensors.find(s=>String(s.id)===String(id));
  function pushSensorHistory(s){
    if(!s.history) s.history=[];
    const at=new Date().toISOString();
    if(s.type==='DHT22') s.history.push({at,temp:+s.temp,hum:+s.hum});
    else if(s.type==='MQ135') s.history.push({at,co2:+s.co2,metano:+s.metano,butano:+s.butano,propano:+s.propano});
    else if(s.type==='pH') s.history.push({at,ph:+s.ph});
    else if(s.type==='EC') s.history.push({at,ec:+s.ec});
    else if(s.type==='Nivel') s.history.push({at,nivel:+s.nivel});
    else s.history.push({at,soil:+(s.soil||s.value||0)});
    s.history=s.history.slice(-720);
  }
  function seedSensorHistory(){
    state.sensors.forEach(s=>{
      if(s.history && s.history.length>30) return;
      s.history=[];
      for(let i=119;i>=0;i--){
        const old={...s};
        const t=Date.now()-i*60000;
        if(s.type==='DHT22'){s.temp=+(22+Math.sin(i/8)*3+Math.random()*2).toFixed(1);s.hum=Math.round(48+Math.cos(i/9)*9+Math.random()*7)}
        if(s.type==='MQ135'){s.co2=Math.round(430+Math.sin(i/7)*35+Math.random()*40);s.metano=+(11+Math.random()*7).toFixed(1);s.butano=+(4+Math.random()*4).toFixed(1);s.propano=+(0.4+Math.random()*1.2).toFixed(1)}
        if(s.type==='pH')s.ph=+(6.3+Math.sin(i/10)*.3+Math.random()*.35).toFixed(2);
        if(s.type==='EC')s.ec=Math.round(760+Math.sin(i/10)*80+Math.random()*70);
        if(s.type==='Nivel')s.nivel=Math.round(60+Math.sin(i/11)*12+Math.random()*10);
        if(s.type==='Hum Suelo')s.soil=Math.round(48+Math.cos(i/9)*10+Math.random()*8);
        pushSensorHistory(s); s.history[s.history.length-1].at=new Date(t).toISOString();
        Object.assign(s,old);
      }
    });
    save();
  }
  function simulateTick(){
    state.sensors.forEach(s=>{
      if(s.type==='DHT22'){s.temp=+(22+Math.random()*8).toFixed(1);s.hum=Math.round(45+Math.random()*22)}
      else if(s.type==='MQ135'){s.co2=Math.round(420+Math.random()*90);s.metano=+(10+Math.random()*9).toFixed(1);s.butano=+(4+Math.random()*4).toFixed(1);s.propano=+(0.4+Math.random()*1.4).toFixed(1)}
      else if(s.type==='pH')s.ph=+(6.2+Math.random()*1.1).toFixed(2);
      else if(s.type==='EC')s.ec=Math.round(720+Math.random()*180);
      else if(s.type==='Nivel')s.nivel=Math.round(55+Math.random()*28);
      else if(s.type==='Hum Suelo')s.soil=Math.round(42+Math.random()*28);
      pushSensorHistory(s);
    });
    cpuHistory();
    save();
    if(roleCode(state.role)==='cliente') renderSensors();
    if(liveChartKind==='sensor' && liveChartSensorId) renderSensorChart(liveChartSensorId);
    if(liveChartKind==='cpu') renderCpuChart();
  }
  window.sensorText=function(s){
    if(s.type==='DHT22')return `<p>Temp: <b>${s.temp} °C</b></p><p>Humedad: <b>${s.hum} %</b></p>`;
    if(s.type==='MQ135')return `<p>CO₂: <b>${s.co2} ppm</b></p><p>Metano: <b>${s.metano} ppm</b></p><p>Butano: <b>${s.butano} ppm</b></p><p>Propano: <b>${s.propano} ppm</b></p>`;
    if(s.type==='pH')return `<p><b>${s.ph} pH</b></p>`;
    if(s.type==='EC')return `<p><b>${s.ec} µS/cm</b></p>`;
    if(s.type==='Nivel')return `<p><b>${s.nivel} %</b></p>`;
    return `<p><b>${s.soil||s.value||0} %</b></p>`;
  };
  window.renderSensors=function(){
    const grid=$('.grid.sensors'); if(!grid) return;
    grid.innerHTML=`<button class="add-card" onclick="openSensorDialog?.()"><span class="add-content">${svg('plus')}Añadir Sensor</span></button>`+
      state.sensors.map(s=>`<div class="card sensor-card" data-sensor-id="${safe(s.id)}"><h3>${svg(s.icon||'info')} <span>${safe(s.name)}</span> <button class="icon-btn sensor-chart-btn" onclick="openSensorChart('${safe(s.id)}')" title="Historial gráfico">${svg('chart')}</button></h3><div class="sensor-values">${sensorText(s)}</div><div class="card-actions"><button class="icon-btn" onclick="showSensorInfo('${safe(s.id)}')" title="Info">${svg('info')}</button><button class="icon-btn" onclick="editSensor('${safe(s.id)}')" title="Editar">${svg('edit')}</button><button class="icon-btn" onclick="deleteSensor('${safe(s.id)}')" title="Eliminar">${svg('trash')}</button></div></div>`).join('');
  };
  window.showSensorInfo=function(id){const s=getSensorById(id); if(!s)return; Swal.fire({title:`Sensor ${safe(s.name)}`,html:`<div class="device-info-popup"><p><b>Tipo:</b> ${safe(s.type)}</p><p><b>Unidad:</b> ${safe((SENSOR_UNITS[s.type]||['%']).join(' / '))}</p><p><b>GPIO:</b> ${safe(s.gpio||'-')}</p><p><b>Variable ESP32:</b> ${safe(s.esp_variable||s.espVar||'-')}</p><hr><div>${sensorText(s)}</div><p><b>Última lectura:</b> ${nowLabel()}</p></div>`,confirmButtonText:'OK'});};
  window.editSensor=async function(id){const s=getSensorById(id); if(!s)return; const r=await Swal.fire({title:'Editar sensor',html:`<input id="swSensorName" class="swal2-input" value="${safe(s.name)}" placeholder="Nombre"><input id="swSensorGpio" class="swal2-input" value="${safe(s.gpio||'')}" placeholder="GPIO"><input id="swSensorVar" class="swal2-input" value="${safe(s.esp_variable||s.espVar||'')}" placeholder="Variable ESP32">`,showCancelButton:true,confirmButtonText:'Guardar'}); if(r.isConfirmed){s.name=$('#swSensorName').value||s.name;s.gpio=$('#swSensorGpio').value;s.esp_variable=$('#swSensorVar').value;save();renderSensors();toast('Sensor actualizado')}};
  window.deleteSensor=async function(id){const s=getSensorById(id); if(!s)return; if(await confirmAction({title:'Eliminar sensor',text:`¿Eliminar ${s.name}?`,icon:'warning',confirmButtonText:'Eliminar'})){state.sensors=state.sensors.filter(x=>String(x.id)!==String(id));save();renderSensors();toast('Sensor eliminado')}};
  window.openSensorChart=function(id){seedSensorHistory(); liveChartKind='sensor'; liveChartSensorId=id; const s=getSensorById(id); if(!s)return; ensureChartScroll(); const now=new Date(), from=new Date(now.getTime()-6*60*60*1000); $('#chartTitle').textContent=`Historial de ${s.name}`; $('#chartHelp').textContent='Datos simulados en tiempo real. El gráfico se desplaza de derecha a izquierda; usá el scroll horizontal para consultar registros anteriores.'; $('#chartFrom').value=from.toISOString().slice(0,16); $('#chartTo').value=now.toISOString().slice(0,16); $('#refreshChartBtn').onclick=()=>renderSensorChart(id); $('#chartDialog').showModal(); renderSensorChart(id); clearInterval(liveChartTimer); liveChartTimer=setInterval(()=>renderSensorChart(id),3000); setTimeout(()=>{const sc=$('.chart-scroll'); if(sc)sc.scrollLeft=sc.scrollWidth;},100)};
  window.renderSensorChart=function(id){const s=getSensorById(id); if(!s)return; ensureChartScroll(); const from=new Date($('#chartFrom').value||0).getTime(); const to=new Date($('#chartTo').value||Date.now()).getTime(); const rows=(s.history||[]).filter(r=>{const t=new Date(r.at).getTime();return(!from||t>=from)&&(!to||t<=to)}); const labels=rows.map(r=>new Date(r.at).toLocaleString('es-AR')); const colorText=getComputedStyle(document.body).getPropertyValue('--text'); const colorMuted=getComputedStyle(document.body).getPropertyValue('--muted'); let datasets=[]; if(s.type==='DHT22'){datasets=[{label:'Temperatura (°C)',data:rows.map(r=>r.temp),borderColor:'#ff7043',backgroundColor:'rgba(255,112,67,.14)',tension:.32,pointRadius:2,fill:false},{label:'Humedad (%)',data:rows.map(r=>r.hum),borderColor:'#29b6f6',backgroundColor:'rgba(41,182,246,.12)',tension:.32,pointRadius:2,fill:false}]} else if(s.type==='MQ135'){datasets=['co2','metano','butano','propano'].map((m,i)=>({label:m.toUpperCase()+' (ppm)',data:rows.map(r=>r[m]),borderColor:['#29b6f6','#66bb6a','#ffa726','#ab47bc'][i],tension:.3,pointRadius:2,fill:false}))} else {const key=s.type==='pH'?'ph':s.type==='EC'?'ec':s.type==='Nivel'?'nivel':'soil'; const unit=s.type==='pH'?'pH':s.type==='EC'?'µS/cm':'%'; datasets=[{label:`${s.name} (${unit})`,data:rows.map(r=>r[key]),borderColor:'#00e676',backgroundColor:'rgba(0,230,118,.12)',tension:.32,pointRadius:2,fill:false}]}
    const ctx=$('#cpuChart'); if(liveChart) liveChart.destroy(); liveChart=new Chart(ctx,{type:'line',data:{labels,datasets},options:{responsive:false,maintainAspectRatio:false,animation:false,plugins:{legend:{labels:{color:colorText}}},scales:{x:{ticks:{color:colorMuted,maxRotation:55,minRotation:35},grid:{color:'rgba(120,120,120,.15)'}},y:{ticks:{color:colorMuted},grid:{color:'rgba(120,120,120,.15)'}}}}}); const sc=$('.chart-scroll'); if(sc)sc.scrollLeft=sc.scrollWidth; };
  const _closeChart=window.closeChartDialog;
  window.closeChartDialog=function(){clearInterval(liveChartTimer); liveChartTimer=null; liveChartKind=null; liveChartSensorId=null; try{if(liveChart){liveChart.destroy();liveChart=null}}catch(e){} try{if(cpuLineChart){cpuLineChart.destroy();cpuLineChart=null}}catch(e){} try{$('#chartDialog').close()}catch(e){_closeChart?.()}};
  window.renderActuators=function(){const el=$('#actuators');if(!el)return;el.innerHTML=state.actuators.map((a,i)=>`<div class="card actuator-card"><div class="card-title">${svg('plug')} <b>${safe(a.name)}</b></div><p>Estado: <b class="${a.on?'state-on':'state-off'}">${a.on?'ON':'OFF'}</b></p><div class="card-actions"><button class="icon-btn" onclick="editActuator(${i})" title="Editar">${svg('edit')}</button><button class="icon-btn" onclick="showActuatorHistory(${i})" title="Historial">${svg('info')}</button><button class="switch ${a.on?'on':''}" onclick="toggleActuator(${i})" title="Cambiar estado"><i></i></button></div></div>`).join('')};
  window.editActuator=async function(i){const a=state.actuators[i]; if(!a)return; const r=await Swal.fire({title:'Editar actuador',input:'text',inputValue:a.name,showCancelButton:true,confirmButtonText:'Guardar'}); if(r.isConfirmed&&r.value){a.name=r.value;save();renderActuators();toast('Actuador actualizado')}};
  window.showActuatorHistory=function(i){const a=state.actuators[i]; if(!a)return; Swal.fire({title:`Historial de ${safe(a.name)}`,width:760,html:`<div class="history-table-wrap"><table class="users-table"><thead><tr><th>Fecha y hora</th><th>Estado</th><th>Usuario</th></tr></thead><tbody>${(a.events||[]).map(e=>`<tr><td>${safe(e.at)}</td><td><b class="${e.state==='ON'?'state-on':'state-off'}">${safe(e.state)}</b></td><td>${safe(e.by||'Sistema')}</td></tr>`).join('')}</tbody></table></div>`,confirmButtonText:'OK'})};
  const oldToggle=window.toggleActuator;
  window.toggleActuator=async function(i){const a=state.actuators[i],next=!a.on;if(await confirmAction({title:'Cambiar estado',text:`¿Cambiar ${a.name} a ${next?'ON':'OFF'}?`,icon:'question',confirmButtonText:next?'Encender':'Apagar'})){a.on=next;a.events=a.events||[];a.events.unshift({at:nowLabel(),state:next?'ON':'OFF',by:state.user?.name||'Sistema'});save();renderActuators();toast(`Actuador ${next?'encendido':'apagado'}`)}};
  const oldOpenCpu=window.openCpuChart;
  window.openCpuChart=function(){liveChartKind='cpu'; oldOpenCpu?.(); clearInterval(cpuLiveTimer); cpuLiveTimer=setInterval(()=>{if(liveChartKind==='cpu')renderCpuChart()},3000)};
  const oldRenderCpu=window.renderCpuChart;
  window.renderCpuChart=function(){oldRenderCpu?.(); const sc=$('.chart-scroll'); if(sc)sc.scrollLeft=sc.scrollWidth;};
  const oldSetup=window.setupUi||setupUi;
  window.addEventListener('DOMContentLoaded',()=>{seedSensorHistory(); clearInterval(window.__salamandraLiveTick); window.__salamandraLiveTick=setInterval(simulateTick,4000);});
})();

/* === FIX v02 - Formularios Sensor/Actuador + acciones robustas === */
(function(){
  const sensorTypes=[
    {value:'DHT22',label:'DHT22 (Temp + Hum)',name:'DHT22',icon:'temperature'},
    {value:'DHT11',label:'DHT11 (Temp + Hum)',name:'DHT11',icon:'temperature'},
    {value:'MQ135',label:'MQ135 (4 gases)',name:'MQ135',icon:'gas'},
    {value:'Hum Suelo',label:'Humedad de Suelo',name:'Hum. Suelo',icon:'humidity'},
    {value:'pH',label:'pH',name:'pH',icon:'ph'},
    {value:'EC',label:'Conductividad (EC)',name:'EC',icon:'electric'},
    {value:'Nivel',label:'Nivel',name:'Nivel H₂O',icon:'humidity'},
    {value:'Nafta',label:'Combustible / Nafta',name:'Nafta',icon:'gas'},
    {value:'Aceite',label:'Aceite',name:'Aceite',icon:'gas'},
    {value:'LDR',label:'Luz / LDR',name:'LDR',icon:'sun'},
    {value:'Voltaje',label:'Voltaje',name:'Voltaje [V]',icon:'electric'},
    {value:'Generico',label:'Genérico',name:'Sensor',icon:'info'}
  ];
  const iconOptions=[
    ['temperature','🌡️ Temperatura'],['humidity','💧 Humedad'],['ph','🧪 pH'],['gas','⛽ Gases'],['wifi','🌬️ Viento'],['electric','⚡ Eléctrico'],['sun','💡 Luz'],['info','❔ Genérico']
  ];
  const gpios=['GPIO 2','GPIO 4','GPIO 5','GPIO 12','GPIO 13','GPIO 14','GPIO 15','GPIO 16','GPIO 17','GPIO 18','GPIO 19','GPIO 21','GPIO 22','GPIO 23','GPIO 25','GPIO 26','GPIO 27','GPIO 32','GPIO 33','GPIO 34','GPIO 35','GPIO 36','GPIO 39','D1','D2','D3','D4','D5','D6','D7','D8'];
  let editingSensorId=null;
  const byId=id=>state.sensors.find(s=>String(s.id)===String(id));
  const nextSensorId=()=>Math.max(0,...state.sensors.map(s=>Number(s.id)||0))+1;
  const ensureHistory=s=>{ if(!s.history) s.history=[]; };
  function setSensorDefaults(s,type){
    const meta=sensorTypes.find(x=>x.value===type)||sensorTypes.at(-1);
    s.type=meta.value; s.icon=meta.icon;
    if(!s.name) s.name=meta.name;
    if(meta.value==='DHT22'||meta.value==='DHT11'){s.temp=s.temp??+(22+Math.random()*6).toFixed(1);s.hum=s.hum??Math.round(45+Math.random()*20)}
    else if(meta.value==='MQ135'){s.co2=s.co2??450;s.metano=s.metano??12;s.butano=s.butano??5;s.propano=s.propano??0.8}
    else if(meta.value==='pH'){s.ph=s.ph??6.8}
    else if(meta.value==='EC'){s.ec=s.ec??780}
    else if(meta.value==='Nivel'){s.nivel=s.nivel??70}
    else if(meta.value==='Hum Suelo'){s.soil=s.soil??55}
    else {s.value=s.value??0; s.unit=s.unit||'%'}
    return s;
  }
  window.openSensorDialog=function(id=null){
    editingSensorId=id;
    const dlg=$('#sensorDialog'), form=$('#sensorForm'); if(!dlg||!form) return;
    const s=id?byId(id):null;
    $('#sensorTitle').textContent=s?'Editar Sensor':'Añadir Sensor';
    $('#sensorType').innerHTML='<option value="">— Selecciona —</option>'+sensorTypes.map(t=>`<option value="${safe(t.value)}">${safe(t.label)}</option>`).join('');
    $('#sensorPort').innerHTML='<option value="">— Selecciona GPIO —</option>'+gpios.map(g=>`<option>${safe(g)}</option>`).join('');
    $('#sensorIcon').innerHTML=iconOptions.map(([v,l])=>`<option value="${safe(v)}">${safe(l)}</option>`).join('');
    $('#sensorType').value=s?.type||'';
    $('#sensorName').value=s?.name||'';
    $('#sensorPort').value=s?.gpio||'';
    $('#sensorVar').value=s?.esp_variable||s?.espVar||'';
    $('#sensorIcon').value=s?.icon||'info';
    $('#sensorType').onchange=()=>{ const meta=sensorTypes.find(t=>t.value===$('#sensorType').value); if(meta){ if(!$('#sensorName').value) $('#sensorName').value=meta.name; $('#sensorIcon').value=meta.icon; }};
    try{dlg.showModal()}catch(e){dlg.setAttribute('open','open')}
  };
  window.editSensor=id=>window.openSensorDialog(id);
  window.closeSensorDialog=function(){try{$('#sensorDialog').close()}catch(e){$('#sensorDialog')?.removeAttribute('open')}};
  function bindSensorForm(){
    const form=$('#sensorForm'); if(!form||form.dataset.boundV02) return; form.dataset.boundV02='1';
    form.addEventListener('submit',async e=>{
      e.preventDefault(); e.stopPropagation();
      const type=$('#sensorType').value||'Generico';
      const isEdit=editingSensorId!==null&&editingSensorId!==undefined;
      const s=isEdit?byId(editingSensorId):{id:nextSensorId()};
      if(!s) return;
      s.name=$('#sensorName').value.trim() || (sensorTypes.find(t=>t.value===type)?.name||'Sensor');
      s.gpio=$('#sensorPort').value;
      s.esp_variable=$('#sensorVar').value.trim();
      s.icon=$('#sensorIcon').value||'info';
      setSensorDefaults(s,type); ensureHistory(s);
      if(await confirmAction({title:isEdit?'Guardar cambios':'Añadir sensor',text:isEdit?'¿Actualizar la información del sensor?':'¿Confirmás agregar este sensor?',confirmButtonText:'Guardar'})){
        if(!isEdit) state.sensors.push(s);
        save(); closeSensorDialog(); renderSensors(); toast(isEdit?'Sensor actualizado':'Sensor agregado'); editingSensorId=null;
      }
    });
  }
  const _sensorText=window.sensorText;
  window.sensorText=function(s){
    if(!s) return '';
    if(s.type==='DHT22'||s.type==='DHT11')return `<p>Temp: <b>${s.temp??'—'} °C</b></p><p>Humedad: <b>${s.hum??'—'} %</b></p>`;
    if(s.type==='MQ135')return `<p>CO₂: <b>${s.co2??'—'} ppm</b></p><p>Metano: <b>${s.metano??'—'} ppm</b></p><p>Butano: <b>${s.butano??'—'} ppm</b></p><p>Propano: <b>${s.propano??'—'} ppm</b></p>`;
    if(s.type==='pH')return `<p><b>${s.ph??'—'} pH</b></p>`;
    if(s.type==='EC')return `<p><b>${s.ec??'—'} µS/cm</b></p>`;
    if(s.type==='Nivel')return `<p><b>${s.nivel??'—'} %</b></p>`;
    if(s.type==='Hum Suelo')return `<p><b>${s.soil??'—'} %</b></p>`;
    return _sensorText?_sensorText(s):`<p><b>${s.value??'—'} ${s.unit||''}</b></p>`;
  };
  renderSensors=function(){
    const grid=$('.grid.sensors'); if(!grid)return;
    grid.innerHTML=`<button id="addSensor" class="add-card" type="button" onclick="openSensorDialog()"><span class="add-content">${svg('plus')}Añadir Sensor</span></button>`+
      state.sensors.map(s=>`<div class="card sensor-card" data-sensor-id="${safe(s.id)}"><h3>${svg(s.icon||'info')} <span>${safe(s.name)}</span> <button class="icon-btn sensor-chart-btn" onclick="openSensorChart('${safe(s.id)}')" title="Historial gráfico">${svg('chart')}</button></h3><div class="sensor-values">${sensorText(s)}</div><div class="card-actions"><button class="icon-btn" onclick="showSensorInfo('${safe(s.id)}')" title="Información">${svg('info')}</button><button class="icon-btn" onclick="openSensorDialog('${safe(s.id)}')" title="Editar">${svg('edit')}</button><button class="icon-btn" onclick="deleteSensor('${safe(s.id)}')" title="Eliminar">${svg('trash')}</button></div></div>`).join('');
  };
  window.renderSensors=renderSensors;
  window.showSensorInfo=function(id){const s=byId(id);if(!s)return;Swal.fire({title:`Sensor ${safe(s.name)}`,html:`<div class="device-info-popup"><p><b>Tipo:</b> ${safe(s.type)}</p><p><b>Puerto:</b> ${safe(s.gpio||'-')}</p><p><b>Variable ESP32:</b> ${safe(s.esp_variable||'-')}</p><hr>${sensorText(s)}<p><b>Última lectura:</b> ${new Date().toLocaleString('es-AR')}</p></div>`,confirmButtonText:'OK'})};
  window.deleteSensor=async function(id){const s=byId(id);if(!s)return;if(await confirmAction({title:'Eliminar sensor',text:`¿Eliminar ${s.name}?`,icon:'warning',confirmButtonText:'Eliminar'})){state.sensors=state.sensors.filter(x=>String(x.id)!==String(id));save();renderSensors();toast('Sensor eliminado')}};

  window.openActuatorDialog=async function(i=null){
    const a=i!==null?state.actuators[i]:null;
    const html=`<input id="actName" class="swal2-input" value="${safe(a?.name||'')}" placeholder="Nombre del actuador"><input id="actGpio" class="swal2-input" value="${safe(a?.gpio||'')}" placeholder="GPIO / Puerto"><select id="actIcon" class="swal2-select"><option value="plug">🔌 Genérico</option><option value="electric">⚡ Eléctrico</option><option value="sun">💡 Luz</option><option value="settings">⚙️ Motor</option></select>`;
    const r=await Swal.fire({title:a?'Editar Actuador':'Añadir Actuador',html,showCancelButton:true,confirmButtonText:'Guardar',focusConfirm:false,preConfirm:()=>({name:$('#actName').value.trim(),gpio:$('#actGpio').value.trim(),icon:$('#actIcon').value})});
    if(!r.isConfirmed||!r.value?.name)return;
    if(a){a.name=r.value.name;a.gpio=r.value.gpio;a.icon=r.value.icon||'plug';}
    else state.actuators.push({id:Date.now(),name:r.value.name,gpio:r.value.gpio,icon:r.value.icon||'plug',on:false,events:[{at:new Date().toLocaleString('es-AR'),state:'OFF',by:state.user?.name||'Sistema'}]});
    save();renderActuators();toast(a?'Actuador actualizado':'Actuador agregado');
  };
  window.editActuator=i=>window.openActuatorDialog(i);
  renderActuators=function(){
    const el=$('#actuators');if(!el)return;
    el.innerHTML=`<button class="add-card actuator-add" type="button" onclick="openActuatorDialog()"><span class="add-content">${svg('plus')}Añadir Actuador</span></button>`+
      state.actuators.map((a,i)=>`<div class="card actuator-card"><div class="card-title">${svg(a.icon||'plug')} <b>${safe(a.name)}</b></div><p>Estado: <b class="${a.on?'state-on':'state-off'}">${a.on?'ON':'OFF'}</b></p><div class="card-actions"><button class="icon-btn" onclick="openActuatorDialog(${i})" title="Editar">${svg('edit')}</button><button class="icon-btn" onclick="showActuatorHistory(${i})" title="Historial">${svg('info')}</button><button class="switch ${a.on?'on':''}" onclick="toggleActuator(${i})" title="Cambiar estado"><i></i></button></div></div>`).join('');
  };
  window.renderActuators=renderActuators;
  const _toggle=window.toggleActuator;
  window.toggleActuator=async function(i){const a=state.actuators[i],next=!a.on;if(!a)return;if(await confirmAction({title:'Cambiar estado',text:`¿Cambiar ${a.name} a ${next?'ON':'OFF'}?`,icon:'question',confirmButtonText:next?'Encender':'Apagar'})){a.on=next;a.events=a.events||[];a.events.unshift({at:new Date().toLocaleString('es-AR'),state:next?'ON':'OFF',by:state.user?.name||'Sistema'});save();renderActuators();toast(`Actuador ${next?'encendido':'apagado'}`)}};
  const _setup=setupUi;
  setupUi=function(){ _setup(); bindSensorForm(); };
  document.addEventListener('DOMContentLoaded',()=>{bindSensorForm(); setTimeout(()=>{try{renderSensors();renderActuators()}catch(e){console.error(e)}},120)});
})();

/* === Fix v03: solapamiento de SweetAlert/dialog, gráficos variables y formularios === */
(()=>{
  const $=s=>document.querySelector(s);
  const safe=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const nowLabel=()=>new Date().toLocaleString('es-AR');
  const closeNativeDialog=(id)=>{const d=$(id); if(d?.open){try{d.close()}catch(e){d.removeAttribute('open')}}};
  const openNativeDialog=(id)=>{const d=$(id); if(d){try{d.showModal()}catch(e){d.setAttribute('open','open')}}};
  const confirmFront=(opts)=>Swal.fire({icon:'question',showCancelButton:true,confirmButtonText:'Guardar',cancelButtonText:'Cancelar',...opts});

  function selectedSensor(){return state?.sensors?.find(s=>String(s.id)===String(window.__chartSensorId));}
  function pushSensorSample(s){
    if(!s) return; s.history=s.history||[]; const last=s.history[s.history.length-1]||{}; const jitter=(base,amp,min,max)=>Math.max(min,Math.min(max,+(base+(Math.random()-.5)*amp).toFixed(1)));
    const row={at:new Date().toISOString()};
    if(s.type==='DHT22'||s.type==='DHT11'){row.temp=jitter(last.temp??s.temp??25,1.2,10,55);row.hum=jitter(last.hum??s.hum??60,4,15,95);s.temp=row.temp;s.hum=row.hum;}
    else if(s.type==='MQ135'){['co2','metano','butano','propano'].forEach((k,i)=>{const base=last[k]??s[k]??[450,14,5,1][i];row[k]=jitter(base,[25,1.8,1,.35][i],0,1200);s[k]=row[k];});}
    else if(s.type==='pH'){row.ph=jitter(last.ph??s.ph??6.8,.18,0,14);s.ph=row.ph;}
    else if(s.type==='EC'){row.ec=Math.round(jitter(last.ec??s.ec??800,55,0,3000));s.ec=row.ec;}
    else if(s.type==='Nivel'){row.nivel=Math.round(jitter(last.nivel??s.nivel??65,5,0,100));s.nivel=row.nivel;}
    else {row.soil=Math.round(jitter(last.soil??s.soil??55,6,0,100));s.soil=row.soil;}
    s.history.push(row); if(s.history.length>360)s.history=s.history.slice(-360);
    try{save()}catch(e){}
  }
  function metricDefs(s){
    if(!s) return [];
    if(s.type==='DHT22'||s.type==='DHT11') return [{key:'temp',label:'Temperatura (°C)',color:'#ff7043'},{key:'hum',label:'Humedad (%)',color:'#29b6f6'}];
    if(s.type==='MQ135') return [{key:'co2',label:'CO₂ (ppm)',color:'#29b6f6'},{key:'metano',label:'Metano (ppm)',color:'#66bb6a'},{key:'butano',label:'Butano (ppm)',color:'#ffa726'},{key:'propano',label:'Propano (ppm)',color:'#ab47bc'}];
    if(s.type==='pH') return [{key:'ph',label:'pH',color:'#00e676'}];
    if(s.type==='EC') return [{key:'ec',label:'EC (µS/cm)',color:'#00e676'}];
    if(s.type==='Nivel') return [{key:'nivel',label:'Nivel (%)',color:'#00e676'}];
    return [{key:'soil',label:(s.name||'Sensor')+' (%)',color:'#00e676'}];
  }
  function ensureChartToggles(s){
    const modal=$('#chartDialog .chart-modal'); if(!modal) return;
    let box=$('#chartToggles');
    if(!box){box=document.createElement('div');box.id='chartToggles';box.className='chart-toggles';const help=$('#chartHelp');help?.parentNode?.insertBefore(box,help.nextSibling);} 
    const defs=metricDefs(s); box.innerHTML=defs.map(d=>`<label class="chart-toggle"><input type="checkbox" data-metric="${safe(d.key)}" checked> ${safe(d.label)}</label>`).join('');
    box.querySelectorAll('input').forEach(i=>i.addEventListener('change',()=>window.renderSensorChart?.(s.id,false)));
  }
  function ensureScroll(){
    const canvas=$('#cpuChart'); if(!canvas) return; let wrap=canvas.closest('.chart-scroll');
    if(!wrap){wrap=document.createElement('div');wrap.className='chart-scroll';canvas.parentNode.insertBefore(wrap,canvas);wrap.appendChild(canvas);} 
  }

  window.openSensorChart=function(id){
    const s=state.sensors.find(x=>String(x.id)===String(id)); if(!s) return;
    window.__chartSensorId=id; window.liveChartKind='sensor'; window.liveChartSensorId=id;
    for(let i=0;i<20;i++) pushSensorSample(s);
    ensureScroll(); ensureChartToggles(s);
    const now=new Date(), from=new Date(now.getTime()-6*60*60*1000);
    $('#chartTitle').textContent=`Historial de ${s.name}`;
    $('#chartHelp').textContent='Datos simulados en tiempo real. Activá/desactivá variables. El gráfico se desplaza de derecha a izquierda; usá el scroll horizontal para ver registros anteriores.';
    $('#chartFrom').value=from.toISOString().slice(0,16); $('#chartTo').value=now.toISOString().slice(0,16);
    $('#refreshChartBtn').onclick=()=>window.renderSensorChart(id,true);
    openNativeDialog('#chartDialog'); window.renderSensorChart(id,true);
    clearInterval(window.__sensorChartTimer); window.__sensorChartTimer=setInterval(()=>{pushSensorSample(s); window.renderSensorChart(id,false); try{renderSensors()}catch(e){}},2500);
  };
  window.renderSensorChart=function(id,keepEnd=true){
    const s=state.sensors.find(x=>String(x.id)===String(id)); if(!s) return; ensureScroll();
    const from=new Date($('#chartFrom').value||0).getTime(), to=new Date($('#chartTo').value||Date.now()).getTime();
    let rows=(s.history||[]).filter(r=>{const t=new Date(r.at).getTime();return(!from||t>=from)&&(!to||t<=to)}); if(!rows.length){pushSensorSample(s);rows=s.history||[];}
    const enabled=[...document.querySelectorAll('#chartToggles input:checked')].map(i=>i.dataset.metric); const defs=metricDefs(s).filter(d=>enabled.includes(d.key));
    const labels=rows.map(r=>new Date(r.at).toLocaleString('es-AR'));
    const text=getComputedStyle(document.body).getPropertyValue('--text')||'#fff', muted=getComputedStyle(document.body).getPropertyValue('--muted')||'#aaa';
    const datasets=defs.map(d=>({label:d.label,data:rows.map(r=>r[d.key]),borderColor:d.color,backgroundColor:d.color+'22',tension:.32,pointRadius:2,fill:false}));
    const ctx=$('#cpuChart'); try{if(window.liveChart){window.liveChart.destroy();}}catch(e){}
    window.liveChart=new Chart(ctx,{type:'line',data:{labels,datasets},options:{responsive:false,maintainAspectRatio:false,animation:false,interaction:{mode:'index',intersect:false},plugins:{legend:{labels:{color:text}}},scales:{x:{ticks:{color:muted,maxRotation:55,minRotation:35},grid:{color:'rgba(120,120,120,.15)'}},y:{ticks:{color:muted},grid:{color:'rgba(120,120,120,.15)'}}}}});
    const sc=$('.chart-scroll'); if(sc&&keepEnd)sc.scrollLeft=sc.scrollWidth;
  };
  const oldCloseChart=window.closeChartDialog;
  window.closeChartDialog=function(){clearInterval(window.__sensorChartTimer);window.__sensorChartTimer=null;try{if(window.liveChart){window.liveChart.destroy();window.liveChart=null}}catch(e){}; oldCloseChart?oldCloseChart():closeNativeDialog('#chartDialog');};

  function collectSensor(){return {type:$('#sensorType')?.value||'Generico',name:$('#sensorName')?.value?.trim()||'Sensor',gpio:$('#sensorPort')?.value||'',esp_variable:$('#sensorVar')?.value?.trim()||'',icon:$('#sensorIcon')?.value||'info'};}
  function applyDefaults(s,type){
    s.type=type; s.unit=s.unit||''; if(type==='DHT22'||type==='DHT11'){s.temp=s.temp??25;s.hum=s.hum??60;s.unit='°C/%'}
    else if(type==='MQ135'){s.co2=s.co2??450;s.metano=s.metano??12;s.butano=s.butano??5;s.propano=s.propano??1;s.unit='ppm'}
    else if(type==='pH'){s.ph=s.ph??6.8;s.unit='pH'} else if(type==='EC'){s.ec=s.ec??800;s.unit='µS/cm'} else if(type==='Nivel'){s.nivel=s.nivel??60;s.unit='%'} else {s.soil=s.soil??55;s.unit='%'}
    s.history=s.history||[]; for(let i=0;i<20;i++)pushSensorSample(s); return s;
  }
  document.addEventListener('submit',async e=>{
    if(e.target?.id==='sensorForm'){
      e.preventDefault(); e.stopImmediatePropagation();
      const data=collectSensor(); const isEdit=window.editingSensorId!==null&&window.editingSensorId!==undefined; let s=isEdit?state.sensors.find(x=>String(x.id)===String(window.editingSensorId)):{id:Date.now()}; if(!s)return;
      Object.assign(s,data); applyDefaults(s,data.type); closeNativeDialog('#sensorDialog');
      const r=await confirmFront({title:isEdit?'Guardar cambios':'Añadir sensor',text:isEdit?'¿Actualizar la información del sensor?':'¿Confirmás agregar este sensor?',confirmButtonText:'Guardar'});
      if(r.isConfirmed){if(!isEdit)state.sensors.push(s); try{save()}catch(e){}; try{renderSensors()}catch(e){}; Swal.fire({toast:true,position:'top-end',timer:1800,showConfirmButton:false,icon:'success',title:isEdit?'Sensor actualizado':'Sensor agregado'}); window.editingSensorId=null;}
      else openNativeDialog('#sensorDialog');
    }
    if(e.target?.id==='deviceForm'){
      e.preventDefault(); e.stopImmediatePropagation();
      const d={place:$('#devPlace')?.value||'Casa',name:$('#devName')?.value||'Dispositivo',id:$('#devId')?.value||('ESP'+Math.floor(Math.random()*900000+100000)),serie:$('#devSerie')?.value||('EG'+Math.floor(Math.random()*900000+100000)),cat:$('#devCat')?.value||'plug',address:$('#devAddress')?.value||'',ownerId:state.user?.id||5,online:true,wifi:88,ssid:'Salamandra_IoT_2.4G',network:'Salamandra IoT',rssi:'-49 dBm',ip:'192.168.1.'+(50+(state.devices?.length||0)),brokerStatus:'Conectado',createdAt:nowLabel()};
      closeNativeDialog('#deviceDialog'); const r=await confirmFront({title:'Guardar dispositivo',text:'¿Confirmás guardar el dispositivo?',confirmButtonText:'Guardar'});
      if(r.isConfirmed){state.devices=state.devices||[]; state.devices.push(d); state.selectedDevice=d.id; try{save()}catch(e){}; try{renderAll()}catch(e){}; Swal.fire({toast:true,position:'top-end',timer:1800,showConfirmButton:false,icon:'success',title:'Dispositivo guardado'});} else openNativeDialog('#deviceDialog');
    }
  },true);
})();


/* === FIX v04: Supabase real, edición correcta, gráficos nítidos y perfil/avatar === */
(()=>{
  const $ = (q,r=document)=>r.querySelector(q);
  const $$ = (q,r=document)=>[...r.querySelectorAll(q)];
  const safe = v => String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const hasDb = () => !!(window.SalamandraAuth?.client?.() || window.db || window.supabaseClient);
  window.salDb = () => window.SalamandraAuth?.client?.() || window.db || window.supabaseClient || null;

  // Un solo origen de verdad para saber si se está editando o creando.
  window.editingSensorId = null;
  const baseOpenSensorDialog = window.openSensorDialog;
  window.openSensorDialog = function(id=null){
    window.editingSensorId = id == null ? null : String(id);
    if(typeof baseOpenSensorDialog === 'function') baseOpenSensorDialog(id);
    const title = $('#sensorTitle'); if(title) title.textContent = id ? 'Editar Sensor' : 'Añadir Sensor';
    const btn = $('#sensorForm .primary'); if(btn) btn.textContent = id ? 'Actualizar' : 'Guardar';
  };
  window.editSensor = id => window.openSensorDialog(id);

  async function upsertSensorSupabase(sensor){
    const db = window.salDb(); if(!db) return {offline:true};
    const payload = {
      name: sensor.name, type: sensor.type || 'Generico', gpio: sensor.gpio || null,
      esp_variable: sensor.esp_variable || null, icon: sensor.icon || 'info', unit: sensor.unit || null,
      updated_at: new Date().toISOString()
    };
    if(sensor.remote_id || /^[0-9a-f-]{36}$/i.test(String(sensor.id||''))) payload.id = sensor.remote_id || sensor.id;
    const {data,error} = await db.from('sensors').upsert(payload).select().single();
    if(error) throw error;
    if(data?.id){sensor.remote_id=data.id; sensor.id = sensor.id || data.id;}
    return data;
  }
  async function insertSensorReadingSupabase(s,row){
    const db=window.salDb(); if(!db || !row) return;
    const sensor_id = sensor.remote_id || (/^[0-9a-f-]{36}$/i.test(String(sensor.id||'')) ? sensor.id : null);
    const rows=[];
    const push=(metric,value,unit)=>{ if(value!==undefined && value!==null && Number.isFinite(Number(value))) rows.push({sensor_id,device_id:null,metric,value:Number(value),unit,created_at:row.at||new Date().toISOString()}); };
    push('temperature',row.temp,'°C'); push('humidity',row.hum,'%'); push('co2',row.co2,'ppm'); push('methane',row.metano,'ppm'); push('butane',row.butano,'ppm'); push('propane',row.propano,'ppm'); push('ph',row.ph,'pH'); push('ec',row.ec,'µS/cm'); push('level',row.nivel,'%'); push('soil_humidity',row.soil,'%');
    if(rows.length) await db.from('sensor_readings').insert(rows);
  }

  function collectSensorV04(){
    return {
      type: $('#sensorType')?.value || 'Generico',
      name: $('#sensorName')?.value?.trim() || 'Sensor',
      gpio: $('#sensorPort')?.value || '',
      esp_variable: $('#sensorVar')?.value?.trim() || '',
      icon: $('#sensorIcon')?.value || 'info'
    };
  }
  function defaultsV04(s){
    if(s.type==='DHT22'||s.type==='DHT11'){s.temp=s.temp??24;s.hum=s.hum??60;s.unit='°C/%'}
    else if(s.type==='MQ135'){s.co2=s.co2??450;s.metano=s.metano??13;s.butano=s.butano??5;s.propano=s.propano??1;s.unit='ppm'}
    else if(s.type==='pH'){s.ph=s.ph??6.8;s.unit='pH'}
    else if(s.type==='EC'){s.ec=s.ec??800;s.unit='µS/cm'}
    else if(s.type==='Nivel'){s.nivel=s.nivel??65;s.unit='%'}
    else {s.soil=s.soil??55;s.unit='%'}
    s.history=s.history||[]; return s;
  }
  function closeDlg(sel){const d=$(sel); if(d?.open){try{d.close()}catch(e){d.removeAttribute('open')}}}
  function openDlg(sel){const d=$(sel); if(d){try{d.showModal()}catch(e){d.setAttribute('open','open')}}}

  // Captura primero el submit y evita que el handler viejo dispare "Añadir sensor" al editar.
  document.addEventListener('submit', async (e)=>{
    if(e.target?.id !== 'sensorForm') return;
    e.preventDefault(); e.stopImmediatePropagation();
    const isEdit = window.editingSensorId !== null && window.editingSensorId !== undefined && window.editingSensorId !== '';
    const data = collectSensorV04();
    let sensor = isEdit ? state.sensors.find(x=>String(x.id)===String(window.editingSensorId) || String(x.remote_id)===String(window.editingSensorId)) : {id: Date.now()};
    if(!sensor) sensor = {id: Date.now()};
    Object.assign(sensor,data); defaultsV04(sensor);
    closeDlg('#sensorDialog');
    const ok = await Swal.fire({title:isEdit?'Guardar cambios':'Añadir sensor',text:isEdit?'Se actualizará la información del sensor.':'¿Confirmás agregar este sensor?',icon:'question',showCancelButton:true,confirmButtonText:isEdit?'Actualizar':'Guardar',cancelButtonText:'Cancelar',confirmButtonColor:'#00d977',cancelButtonColor:'#64748b',reverseButtons:true});
    if(!ok.isConfirmed){ openDlg('#sensorDialog'); return; }
    try{ await upsertSensorSupabase(sensor); }catch(err){ console.warn('Supabase sensor upsert:',err); Swal.fire({toast:true,position:'top-end',timer:2600,showConfirmButton:false,icon:'warning',title:'Guardado local. Revisá Supabase.'}); }
    if(!isEdit && !state.sensors.some(x=>String(x.id)===String(sensor.id))) state.sensors.push(sensor);
    try{ save(); renderSensors(); }catch(err){ console.error(err); }
    window.editingSensorId = null;
    Swal.fire({toast:true,position:'top-end',timer:1800,showConfirmButton:false,icon:'success',title:isEdit?'Sensor actualizado':'Sensor agregado'});
  }, true);

  function metricDefsV04(s){
    if(!s) return [];
    if(s.type==='DHT22'||s.type==='DHT11') return [{key:'temp',label:'Temperatura (°C)',color:'#ff7043',unit:'°C'},{key:'hum',label:'Humedad (%)',color:'#29b6f6',unit:'%'}];
    if(s.type==='MQ135') return [{key:'co2',label:'CO₂ (ppm)',color:'#29b6f6',unit:'ppm'},{key:'metano',label:'Metano (ppm)',color:'#66bb6a',unit:'ppm'},{key:'butano',label:'Butano (ppm)',color:'#ffa726',unit:'ppm'},{key:'propano',label:'Propano (ppm)',color:'#ab47bc',unit:'ppm'}];
    if(s.type==='pH') return [{key:'ph',label:'pH',color:'#00e676',unit:'pH'}];
    if(s.type==='EC') return [{key:'ec',label:'EC (µS/cm)',color:'#00e676',unit:'µS/cm'}];
    if(s.type==='Nivel') return [{key:'nivel',label:'Nivel (%)',color:'#00e676',unit:'%'}];
    return [{key:'soil',label:(s.name||'Sensor')+' (%)',color:'#00e676',unit:'%'}];
  }
  function sampleV04(s){
    s.history=s.history||[]; const last=s.history.at(-1)||{}; const n=(v,d,min,max,dec=1)=>Math.max(min,Math.min(max,+(Number(v??d)+(Math.random()-.5)*d/18).toFixed(dec))); const row={at:new Date().toISOString()};
    if(s.type==='DHT22'||s.type==='DHT11'){row.temp=n(last.temp,s.temp??24,10,55,1); row.hum=n(last.hum,s.hum??60,15,98,0); s.temp=row.temp; s.hum=row.hum;}
    else if(s.type==='MQ135'){row.co2=n(last.co2,s.co2??450,0,1800,0); row.metano=n(last.metano,s.metano??13,0,100,1); row.butano=n(last.butano,s.butano??5,0,60,1); row.propano=n(last.propano,s.propano??1,0,20,1); Object.assign(s,row);}
    else if(s.type==='pH'){row.ph=n(last.ph,s.ph??6.8,0,14,2); s.ph=row.ph;}
    else if(s.type==='EC'){row.ec=n(last.ec,s.ec??800,0,4000,0); s.ec=row.ec;}
    else if(s.type==='Nivel'){row.nivel=n(last.nivel,s.nivel??65,0,100,0); s.nivel=row.nivel;}
    else {row.soil=n(last.soil,s.soil??55,0,100,0); s.soil=row.soil;}
    s.history.push(row); if(s.history.length>720) s.history=s.history.slice(-720); insertSensorReadingSupabase(s,row).catch(()=>{}); return row;
  }
  function ensureWideCanvas(){
    const canvas=$('#cpuChart'); if(!canvas) return null;
    let wrap=canvas.closest('.chart-scroll');
    if(!wrap){wrap=document.createElement('div'); wrap.className='chart-scroll'; canvas.parentNode.insertBefore(wrap,canvas); wrap.appendChild(canvas);}
    canvas.width=1600; canvas.height=420; canvas.style.width='1600px'; canvas.style.height='420px';
    return wrap;
  }
  function setToggles(s){
    let box=$('#chartToggles');
    if(!box){box=document.createElement('div'); box.id='chartToggles'; box.className='chart-toggles'; $('#chartHelp')?.after(box);}
    box.innerHTML=metricDefsV04(s).map(d=>`<label class="chart-toggle"><input type="checkbox" data-metric="${safe(d.key)}" checked> ${safe(d.label)}</label>`).join('');
    box.onchange=()=>window.renderSensorChart(s.id,false);
  }
  window.openSensorChart=function(id){
    const s=state.sensors.find(x=>String(x.id)===String(id)||String(x.remote_id)===String(id)); if(!s) return;
    window.__chartSensorId=s.id; window.liveChartKind='sensor';
    for(let i=0;i<80;i++) sampleV04(s);
    const now=new Date(), from=new Date(now.getTime()-6*60*60*1000);
    $('#chartTitle').textContent=`Historial de ${s.name}`; $('#chartHelp').textContent='Datos simulados en tiempo real. Activá/desactivá variables desde las opciones. El gráfico se desplaza de derecha a izquierda y permite scroll horizontal para registros anteriores.';
    $('#chartFrom').value=from.toISOString().slice(0,16); $('#chartTo').value=now.toISOString().slice(0,16); $('#refreshChartBtn').onclick=()=>window.renderSensorChart(s.id,true);
    ensureWideCanvas(); setToggles(s); openDlg('#chartDialog'); window.renderSensorChart(s.id,true);
    clearInterval(window.__sensorChartTimer); window.__sensorChartTimer=setInterval(()=>{sampleV04(s); window.renderSensorChart(s.id,false); try{renderSensors()}catch(e){}},2500);
  };
  window.renderSensorChart=function(id,scrollEnd=true){
    const s=state.sensors.find(x=>String(x.id)===String(id)||String(x.remote_id)===String(id)); if(!s) return; const wrap=ensureWideCanvas();
    const from=new Date($('#chartFrom')?.value||0).getTime(), to=new Date($('#chartTo')?.value||Date.now()).getTime();
    let rows=(s.history||[]).filter(r=>{const t=new Date(r.at).getTime(); return (!from||t>=from)&&(!to||t<=to)}); if(rows.length<2){for(let i=0;i<40;i++) sampleV04(s); rows=s.history||[];}
    const enabled=$$('#chartToggles input:checked').map(i=>i.dataset.metric); const defs=metricDefsV04(s).filter(d=>enabled.includes(d.key));
    const labels=rows.map(r=>new Date(r.at).toLocaleString('es-AR'));
    const text=getComputedStyle(document.body).getPropertyValue('--text')||'#fff'; const muted=getComputedStyle(document.body).getPropertyValue('--muted')||'#9ca3af';
    const ctx=$('#cpuChart').getContext('2d'); try{window.liveChart?.destroy?.()}catch(e){}
    window.liveChart=new Chart(ctx,{type:'line',data:{labels,datasets:defs.map(d=>({label:d.label,data:rows.map(r=>r[d.key]),borderColor:d.color,backgroundColor:'transparent',borderWidth:2.5,tension:.28,pointRadius:0,pointHoverRadius:4,spanGaps:true}))},options:{responsive:false,maintainAspectRatio:false,animation:false,normalized:true,interaction:{mode:'index',intersect:false},plugins:{legend:{position:'top',labels:{color:text,usePointStyle:true,boxWidth:14,font:{size:13,weight:'700'}}},tooltip:{enabled:true}},scales:{x:{ticks:{color:muted,maxRotation:45,minRotation:30,autoSkip:true,maxTicksLimit:24},grid:{color:'rgba(148,163,184,.12)'}},y:{ticks:{color:muted},grid:{color:'rgba(148,163,184,.12)'}}}}});
    if(wrap&&scrollEnd) wrap.scrollLeft=wrap.scrollWidth;
  };
  const oldClose=window.closeChartDialog;
  window.closeChartDialog=function(){clearInterval(window.__sensorChartTimer); window.__sensorChartTimer=null; try{window.liveChart?.destroy?.(); window.liveChart=null;}catch(e){} if(oldClose) oldClose(); else closeDlg('#chartDialog');};

  // Perfil: cambiar imagen al hacer clic y guardar en Supabase Storage/profile.avatar_url.
  async function uploadAvatar(file){
    const db=window.salDb(); if(!db) throw new Error('Supabase no configurado');
    const {data:{user}} = await db.auth.getUser(); if(!user) throw new Error('Sesión no iniciada');
    const ext=(file.name.split('.').pop()||'png').toLowerCase(); const path=`${user.id}/avatar-${Date.now()}.${ext}`;
    const {error:upErr}=await db.storage.from('avatars').upload(path,file,{cacheControl:'3600',upsert:true}); if(upErr) throw upErr;
    const {data:pub}=db.storage.from('avatars').getPublicUrl(path); const url=pub.publicUrl;
    await db.from('profiles').upsert({id:user.id,email:user.email,avatar_url:url,updated_at:new Date().toISOString()});
    state.user=state.user||{}; state.user.avatar=url; state.user.avatar_url=url; save(); const av=$('#avatar'); if(av) av.src=url; return url;
  }
  document.addEventListener('click',e=>{
    if(e.target?.id==='avatar'){
      const input=document.createElement('input'); input.type='file'; input.accept='image/*'; input.onchange=async()=>{const file=input.files?.[0]; if(!file) return; try{await uploadAvatar(file); Swal.fire({toast:true,position:'top-end',timer:1800,showConfirmButton:false,icon:'success',title:'Imagen de perfil actualizada'});}catch(err){console.warn(err); Swal.fire('No se pudo guardar en Supabase',String(err.message||err),'warning');}}; input.click();
    }
  },true);
})();


/* === v05 final: toggles por círculos, CPU sin opciones falsas, Supabase-safe chart UX === */
(function(){
  const $ = window.$ || (s=>document.querySelector(s));
  const $$ = window.$$ || (s=>Array.from(document.querySelectorAll(s)));
  const metricColor = m => ({temp:'#ff7043',hum:'#29b6f6',co2:'#29b6f6',metano:'#66bb6a',butano:'#ffa726',propano:'#ab47bc',ph:'#00e676',ec:'#00e676',nivel:'#00e676',soil:'#00e676',cpu:'#ff7043'}[m]||'#00d977');
  function defs(s){
    if(!s) return [];
    if(s.type==='DHT22'||s.type==='DHT11') return [{key:'temp',label:'Temperatura (°C)'},{key:'hum',label:'Humedad (%)'}];
    if(s.type==='MQ135') return [{key:'co2',label:'CO₂ (ppm)'},{key:'metano',label:'Metano (ppm)'},{key:'butano',label:'Butano (ppm)'},{key:'propano',label:'Propano (ppm)'}];
    if(s.type==='pH') return [{key:'ph',label:'pH'}];
    if(s.type==='EC') return [{key:'ec',label:'EC (µS/cm)'}];
    if(s.type==='Nivel') return [{key:'nivel',label:'Nivel (%)'}];
    return [{key:'soil',label:(s.name||'Sensor')+' (%)'}];
  }
  function ensureChartBox(){
    const canvas=$('#cpuChart'); if(!canvas) return null;
    let wrap=canvas.closest('.chart-scroll');
    if(!wrap){wrap=document.createElement('div');wrap.className='chart-scroll';canvas.parentNode.insertBefore(wrap,canvas);wrap.appendChild(canvas)}
    canvas.width=1700;canvas.height=430;canvas.style.width='1700px';canvas.style.height='430px';
    return wrap;
  }
  function buildToggles(s){
    let box=$('#chartToggles');
    if(!box){box=document.createElement('div');box.id='chartToggles';box.className='chart-toggles';($('#chartHelp')||$('#chartTitle'))?.after(box)}
    const list=defs(s);
    box.innerHTML=list.map(d=>`<label class="chart-toggle" style="--metric-color:${metricColor(d.key)}"><input type="checkbox" data-metric="${d.key}" checked><span>${d.label}</span></label>`).join('');
    box.onclick=(e)=>{const label=e.target.closest('.chart-toggle'); if(!label) return; const input=label.querySelector('input'); if(e.target!==input){input.checked=!input.checked; e.preventDefault()} window.renderSensorChart?.(s.id,false)};
  }
  function sampleRow(s){
    if(typeof sampleV04==='function') return sampleV04(s);
    s.history=s.history||[]; const row={at:new Date().toISOString()};
    const n=(base,spread,min,max,dec=1)=>Math.max(min,Math.min(max,+(Number(base||0)+(Math.random()-.5)*spread).toFixed(dec)));
    if(s.type==='DHT22'||s.type==='DHT11'){row.temp=n(s.temp||24,1.2,10,55,1); row.hum=n(s.hum||60,4,15,98,0); s.temp=row.temp; s.hum=row.hum}
    else if(s.type==='MQ135'){row.co2=n(s.co2||450,65,0,1800,0); row.metano=n(s.metano||14,3,0,100,1); row.butano=n(s.butano||5,1.5,0,60,1); row.propano=n(s.propano||1,.5,0,20,1); Object.assign(s,row)}
    else if(s.type==='pH'){row.ph=n(s.ph||6.8,.16,0,14,2); s.ph=row.ph}
    else if(s.type==='EC'){row.ec=n(s.ec||800,50,0,4000,0); s.ec=row.ec}
    else if(s.type==='Nivel'){row.nivel=n(s.nivel||65,3,0,100,0); s.nivel=row.nivel}
    else {row.soil=n(s.soil||55,4,0,100,0); s.soil=row.soil}
    s.history.push(row); if(s.history.length>720) s.history=s.history.slice(-720); return row;
  }
  function sensorById(id){return (window.state?.sensors||[]).find(x=>String(x.id)===String(id)||String(x.remote_id)===String(id))}
  window.openSensorChart=function(id){
    const s=sensorById(id); if(!s) return;
    window.__chartSensorId=s.id; window.liveChartKind='sensor';
    for(let i=(s.history?.length||0); i<120; i++) sampleRow(s);
    const now=new Date(), from=new Date(now.getTime()-6*60*60*1000);
    $('#chartTitle').textContent=`Historial de ${s.name}`;
    $('#chartHelp').textContent='Datos simulados en tiempo real. Tocá los círculos de color para mostrar u ocultar variables. El gráfico se desplaza de derecha a izquierda y permite scroll horizontal para registros anteriores.';
    $('#chartFrom').value=from.toISOString().slice(0,16); $('#chartTo').value=now.toISOString().slice(0,16);
    $('#refreshChartBtn').onclick=()=>window.renderSensorChart(s.id,true);
    ensureChartBox(); buildToggles(s);
    try{$('#chartDialog').showModal()}catch(e){$('#chartDialog')?.setAttribute('open','open')}
    window.renderSensorChart(s.id,true);
    clearInterval(window.__sensorChartTimer);
    window.__sensorChartTimer=setInterval(()=>{sampleRow(s); window.renderSensorChart(s.id,false); try{window.renderSensors?.()}catch(e){}},2500);
  };
  window.renderSensorChart=function(id,scrollEnd=true){
    const s=sensorById(id); if(!s) return; const wrap=ensureChartBox();
    const from=new Date($('#chartFrom')?.value||0).getTime(), to=new Date($('#chartTo')?.value||Date.now()).getTime();
    let rows=(s.history||[]).filter(r=>{const t=new Date(r.at).getTime();return(!from||t>=from)&&(!to||t<=to)});
    if(rows.length<2){for(let i=0;i<80;i++) sampleRow(s); rows=s.history||[]}
    const enabled=$$('#chartToggles input:checked').map(i=>i.dataset.metric);
    const datasets=defs(s).filter(d=>enabled.includes(d.key)).map(d=>({label:d.label,data:rows.map(r=>r[d.key]),borderColor:metricColor(d.key),backgroundColor:'transparent',borderWidth:2.5,tension:.28,pointRadius:0,pointHoverRadius:4,spanGaps:true}));
    const ctx=$('#cpuChart')?.getContext('2d'); if(!ctx) return; try{window.liveChart?.destroy?.()}catch(e){}
    const cs=getComputedStyle(document.body), text=cs.getPropertyValue('--text')||'#fff', muted=cs.getPropertyValue('--muted')||'#9ca3af';
    window.liveChart=new Chart(ctx,{type:'line',data:{labels:rows.map(r=>new Date(r.at).toLocaleString('es-AR')),datasets},options:{responsive:false,maintainAspectRatio:false,animation:false,interaction:{mode:'index',intersect:false},plugins:{legend:{position:'top',labels:{color:text,usePointStyle:true,boxWidth:14,font:{size:13,weight:'700'}}}},scales:{x:{ticks:{color:muted,maxRotation:45,minRotation:30,autoSkip:true,maxTicksLimit:28},grid:{color:'rgba(148,163,184,.12)'}},y:{ticks:{color:muted},grid:{color:'rgba(148,163,184,.12)'}}}}});
    if(wrap&&scrollEnd) wrap.scrollLeft=wrap.scrollWidth;
  };
  const prevCpu=window.openCpuChart;
  window.openCpuChart=function(){
    let box=$('#chartToggles'); if(box) box.innerHTML='';
    if(prevCpu) prevCpu();
    box=$('#chartToggles'); if(box) box.innerHTML='';
    $('#chartHelp').textContent='Gráfico de línea con datos simulados en tiempo real. El historial se desplaza de derecha a izquierda; usá el scroll horizontal para ver registros anteriores.';
  };
  const prevClose=window.closeChartDialog;
  window.closeChartDialog=function(){clearInterval(window.__sensorChartTimer); window.__sensorChartTimer=null; try{window.liveChart?.destroy?.()}catch(e){} if(prevClose) prevClose(); else {try{$('#chartDialog').close()}catch(e){}}};
})();

/* === FIX v06: cancelar formularios, confirmaciones correctas, charts por sensor y Supabase compatible === */
(()=>{
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const nowISO=()=>new Date().toISOString();
  const uid=()=> (crypto?.randomUUID?.() || ('local-'+Date.now()+'-'+Math.random().toString(16).slice(2)));
  const alertTop=(opts)=>Swal.fire({heightAuto:false,allowOutsideClick:false,returnFocus:false,confirmButtonColor:'#00d977',cancelButtonColor:'#64748b',reverseButtons:true,...opts});
  window.SalamandraConfirm=(opts={})=>alertTop({icon:opts.icon||'question',title:opts.title||'Confirmar operación',text:opts.text||'¿Deseás continuar?',showCancelButton:true,confirmButtonText:opts.confirmButtonText||'Sí, confirmar',cancelButtonText:opts.cancelButtonText||'Cancelar'}).then(r=>!!r.isConfirmed);
  window.SalamandraToast=(title,icon='success')=>Swal.fire({toast:true,position:'top-end',timer:1900,showConfirmButton:false,icon,title,heightAuto:false});

  function openDialog(sel){const d=$(sel); if(!d)return; try{d.showModal()}catch(e){d.setAttribute('open','open')} d.classList.add('modal-open');}
  function closeDialog(sel){const d=$(sel); if(!d)return; d.classList.remove('modal-open'); try{d.close()}catch(e){d.removeAttribute('open')}}
  window.closeSensorDialog=()=>closeDialog('#sensorDialog');
  window.closeDeviceDialog=()=>closeDialog('#deviceDialog');

  function sensorOptions(){return [
    ['DHT11','DHT11 (Temp + Hum)'],['DHT22','DHT22 (Temp + Hum)'],['MQ135','MQ135 (4 gases)'],['Hum Suelo','Hum. Suelo'],['pH','pH'],['EC','Conductividad (EC)'],['Nivel','Nivel H₂O'],['Generico','Genérico']
  ];}
  function iconOptions(){return [['temperature','🌡️ Temperatura'],['humidity','💧 Humedad'],['ph','🧪 pH'],['gas','⛽ Gases'],['electric','⚡ Eléctrico'],['info','❔ Genérico']];}
  function gpioOptions(){return ['GPIO 2','GPIO 4','GPIO 5','GPIO 12','GPIO 13','GPIO 14','GPIO 15','GPIO 16','GPIO 17','GPIO 18','GPIO 19','GPIO 21','GPIO 22','GPIO 23','GPIO 25','GPIO 26','GPIO 27','GPIO 32','GPIO 33','GPIO 34','GPIO 35'];}
  function findSensor(id){return state.sensors.find(x=>String(x.id)===String(id)||String(x.remote_id||'')===String(id));}
  function normalizeSensor(s){
    if(!s.id) s.id=uid();
    const t=s.type||'Generico';
    if(['DHT11','DHT22'].includes(t)){s.temp=s.temp??+(22+Math.random()*6).toFixed(1);s.hum=s.hum??Math.round(45+Math.random()*25);s.unit='°C/%';}
    else if(t==='MQ135'){s.co2=s.co2??Math.round(420+Math.random()*100);s.metano=s.metano??+(10+Math.random()*8).toFixed(1);s.butano=s.butano??+(4+Math.random()*4).toFixed(1);s.propano=s.propano??+(0.5+Math.random()*1.2).toFixed(1);s.unit='ppm';}
    else if(t==='pH'){s.ph=s.ph??+(6.2+Math.random()*1.1).toFixed(2);s.unit='pH';}
    else if(t==='EC'){s.ec=s.ec??Math.round(700+Math.random()*220);s.unit='µS/cm';}
    else if(t==='Nivel'){s.nivel=s.nivel??Math.round(45+Math.random()*45);s.unit='%';}
    else {s.soil=s.soil??Math.round(40+Math.random()*40);s.unit='%';}
    s.history=s.history||[]; return s;
  }
  function sample(s){
    normalizeSensor(s);
    const row={at:nowISO()};
    if(['DHT11','DHT22'].includes(s.type)){s.temp=+(s.temp+(Math.random()-.5)*.8).toFixed(1);s.hum=Math.max(0,Math.min(100,Math.round(s.hum+(Math.random()-.5)*4)));row.temp=s.temp;row.hum=s.hum;}
    else if(s.type==='MQ135'){s.co2=Math.max(300,Math.round(s.co2+(Math.random()-.5)*24));s.metano=+(Math.max(0,s.metano+(Math.random()-.5)*1.4)).toFixed(1);s.butano=+(Math.max(0,s.butano+(Math.random()-.5)*.8)).toFixed(1);s.propano=+(Math.max(0,s.propano+(Math.random()-.5)*.25)).toFixed(1);Object.assign(row,{co2:s.co2,metano:s.metano,butano:s.butano,propano:s.propano});}
    else if(s.type==='pH'){s.ph=+(Math.max(0,Math.min(14,s.ph+(Math.random()-.5)*.08))).toFixed(2);row.ph=s.ph;}
    else if(s.type==='EC'){s.ec=Math.max(0,Math.round(s.ec+(Math.random()-.5)*30));row.ec=s.ec;}
    else if(s.type==='Nivel'){s.nivel=Math.max(0,Math.min(100,Math.round(s.nivel+(Math.random()-.5)*3)));row.nivel=s.nivel;}
    else {s.soil=Math.max(0,Math.min(100,Math.round(s.soil+(Math.random()-.5)*4)));row.soil=s.soil;}
    s.history.push(row); s.history=s.history.slice(-900); return row;
  }
  function metricDefs(s){
    if(['DHT11','DHT22'].includes(s.type)) return [{key:'temp',label:'Temperatura (°C)',color:'#ff7043'},{key:'hum',label:'Humedad (%)',color:'#29b6f6'}];
    if(s.type==='MQ135') return [{key:'co2',label:'CO₂ (ppm)',color:'#29b6f6'},{key:'metano',label:'Metano (ppm)',color:'#66bb6a'},{key:'butano',label:'Butano (ppm)',color:'#ffa726'},{key:'propano',label:'Propano (ppm)',color:'#ab47bc'}];
    if(s.type==='pH') return [{key:'ph',label:'pH',color:'#00e676'}];
    if(s.type==='EC') return [{key:'ec',label:'EC (µS/cm)',color:'#00e676'}];
    if(s.type==='Nivel') return [{key:'nivel',label:'Nivel (%)',color:'#29b6f6'}];
    return [{key:'soil',label:(s.name||'Sensor')+' (%)',color:'#66bb6a'}];
  }

  function fillSensorForm(s=null){
    $('#sensorType').innerHTML='<option value="">— Selecciona —</option>'+sensorOptions().map(([v,l])=>`<option value="${esc(v)}">${esc(l)}</option>`).join('');
    $('#sensorPort').innerHTML='<option value="">— Selecciona GPIO —</option>'+gpioOptions().map(g=>`<option>${esc(g)}</option>`).join('');
    $('#sensorIcon').innerHTML=iconOptions().map(([v,l])=>`<option value="${esc(v)}">${esc(l)}</option>`).join('');
    $('#sensorType').value=s?.type||''; $('#sensorName').value=s?.name||''; $('#sensorPort').value=s?.gpio||''; $('#sensorVar').value=s?.esp_variable||''; $('#sensorIcon').value=s?.icon||'info';
    $('#sensorTitle').textContent=s?'Editar Sensor':'Añadir Sensor'; $('#sensorForm .primary').textContent=s?'Actualizar':'Guardar';
  }
  window.openSensorDialog=function(id=null){window.editingSensorId=id?String(id):null; fillSensorForm(id?findSensor(id):null); openDialog('#sensorDialog'); setTimeout(()=>$('#sensorType')?.focus(),80);};
  window.editSensor=id=>window.openSensorDialog(id);
  window.cancelSensorForm=async()=>{if(await window.SalamandraConfirm({title:'Cancelar',text:'¿Deseás cerrar sin guardar cambios?',confirmButtonText:'Sí, cerrar'})) closeDialog('#sensorDialog');};
  function renderSensorText(s){
    if(['DHT11','DHT22'].includes(s.type))return `<p><b>Temp:</b> ${s.temp} °C</p><p><b>Humedad:</b> ${s.hum} %</p>`;
    if(s.type==='MQ135')return `<p><b>CO₂:</b> ${s.co2} ppm</p><p><b>Metano:</b> ${s.metano} ppm</p><p><b>Butano:</b> ${s.butano} ppm</p><p><b>Propano:</b> ${s.propano} ppm</p>`;
    if(s.type==='pH')return `<p>${s.ph} pH</p>`; if(s.type==='EC')return `<p>${s.ec} µS/cm</p>`; if(s.type==='Nivel')return `<p>${s.nivel} %</p>`; return `<p>${s.soil} %</p>`;
  }
  window.renderSensors=function(){
    const grid=$('.grid.sensors'); if(!grid)return; state.sensors.forEach(normalizeSensor);
    grid.innerHTML=`<button id="addSensor" class="add-card" type="button"><span class="add-content">${svg('plus')}Añadir Sensor</span></button>`+
      state.sensors.map(s=>`<div class="card sensor-card" data-sensor-id="${esc(s.id)}"><h3>${svg(s.icon||'info')} <span>${esc(s.name)}</span><button type="button" class="icon-btn sensor-chart-btn" data-sensor-chart="${esc(s.id)}" title="Historial gráfico">${svg('chart')}</button></h3><div class="sensor-values">${renderSensorText(s)}</div><div class="card-actions"><button type="button" class="icon-btn" data-sensor-info="${esc(s.id)}">${svg('info')}</button><button type="button" class="icon-btn" data-sensor-edit="${esc(s.id)}">${svg('edit')}</button><button type="button" class="icon-btn" data-sensor-delete="${esc(s.id)}">${svg('trash')}</button></div></div>`).join('');
  };
  window.showSensorInfo=id=>{const s=findSensor(id); if(!s)return; Swal.fire({title:`Sensor ${esc(s.name)}`,html:`<p><b>Tipo:</b> ${esc(s.type)}</p><p><b>GPIO:</b> ${esc(s.gpio||'-')}</p><p><b>Variable ESP32:</b> ${esc(s.esp_variable||'-')}</p><p><b>Unidad:</b> ${esc(s.unit||'-')}</p>`,confirmButtonText:'OK',heightAuto:false});};
  window.deleteSensor=async id=>{const s=findSensor(id); if(!s)return; if(await window.SalamandraConfirm({title:'Eliminar sensor',text:`¿Eliminar ${s.name}?`,icon:'warning',confirmButtonText:'Eliminar'})){state.sensors=state.sensors.filter(x=>String(x.id)!==String(id)); save(); renderSensors(); window.SalamandraToast('Sensor eliminado');}};

  async function saveSensorToSupabase(s){
    const client=window.SalamandraAuth?.client?.() || window.db || db; if(!client) return;
    const device = (state.devices||[]).find(d=>d.id===state.selectedDevice) || state.devices?.[0];
    const payload={device_id:device?.uuid||null,type:s.type,name:s.name,gpio:s.gpio||null,esp_variable:s.esp_variable||null,icon:s.icon||'info',unit:s.unit||null,updated_at:nowISO()};
    const q=s.remote_id?client.from('sensors').update(payload).eq('id',s.remote_id).select().single():client.from('sensors').insert(payload).select().single();
    const {data,error}=await q; if(error) console.warn('Supabase sensor:',error.message); if(data?.id)s.remote_id=data.id;
  }

  document.addEventListener('click',e=>{
    const add=e.target.closest('#addSensor,.add-card'); if(add && add.id==='addSensor'){e.preventDefault(); window.openSensorDialog(); return;}
    const chart=e.target.closest('[data-sensor-chart]'); if(chart){e.preventDefault(); window.openSensorChart(chart.dataset.sensorChart); return;}
    const info=e.target.closest('[data-sensor-info]'); if(info){e.preventDefault(); window.showSensorInfo(info.dataset.sensorInfo); return;}
    const edit=e.target.closest('[data-sensor-edit]'); if(edit){e.preventDefault(); window.openSensorDialog(edit.dataset.sensorEdit); return;}
    const del=e.target.closest('[data-sensor-delete]'); if(del){e.preventDefault(); window.deleteSensor(del.dataset.sensorDelete); return;}
  },true);

  const form=$('#sensorForm');
  if(form){
    form.setAttribute('novalidate','novalidate');
    form.querySelector('.x')?.setAttribute('type','button'); form.querySelector('.x')?.addEventListener('click',e=>{e.preventDefault(); window.cancelSensorForm();});
    form.onsubmit=async e=>{
      e.preventDefault(); e.stopPropagation();
      const name=$('#sensorName').value.trim(); const type=$('#sensorType').value;
      if(!type||!name){Swal.fire({icon:'warning',title:'Datos incompletos',text:'Completá Tipo de sensor y Nombre.',heightAuto:false});return;}
      const isEdit=!!window.editingSensorId; const s=isEdit?findSensor(window.editingSensorId):{id:uid(),history:[]}; if(!s)return;
      Object.assign(s,{type,name,gpio:$('#sensorPort').value,esp_variable:$('#sensorVar').value.trim(),icon:$('#sensorIcon').value||'info'}); normalizeSensor(s);
      const ok=await window.SalamandraConfirm({title:isEdit?'Actualizar sensor':'Añadir sensor',text:isEdit?'¿Confirmás actualizar los datos del sensor?':'¿Confirmás agregar este nuevo sensor?',confirmButtonText:isEdit?'Actualizar':'Guardar'});
      if(!ok) return;
      if(!isEdit) state.sensors.push(s);
      await saveSensorToSupabase(s).catch(()=>{}); save(); closeDialog('#sensorDialog'); renderSensors(); window.SalamandraToast(isEdit?'Sensor actualizado':'Sensor agregado'); window.editingSensorId=null;
    };
  }

  function ensureChartBox(){
    const canvas=$('#cpuChart'); if(!canvas)return null; let wrap=canvas.closest('.chart-scroll');
    if(!wrap){wrap=document.createElement('div');wrap.className='chart-scroll';canvas.parentNode.insertBefore(wrap,canvas);wrap.appendChild(canvas);} 
    canvas.width=1500; canvas.height=390; return wrap;
  }
  function setMetricToggles(s){
    let box=$('#chartToggles'); if(!box){box=document.createElement('div');box.id='chartToggles';box.className='chart-toggles color-only';$('#chartHelp')?.after(box);} 
    box.innerHTML=metricDefs(s).map(d=>`<button type="button" class="metric-dot active" data-metric="${esc(d.key)}" style="--dot:${d.color}" title="${esc(d.label)}"><span></span>${esc(d.label)}</button>`).join('');
    box.querySelectorAll('.metric-dot').forEach(b=>b.onclick=()=>{b.classList.toggle('active'); window.renderSensorChart(window.__activeSensorChart,false);});
  }
  window.openSensorChart=function(id){
    const s=findSensor(id); if(!s)return; window.__activeSensorChart=String(s.id); normalizeSensor(s); while(s.history.length<80) sample(s);
    const now=new Date(), from=new Date(now.getTime()-6*60*60*1000);
    $('#chartTitle').textContent=`Historial de ${s.name}`; $('#chartFrom').value=from.toISOString().slice(0,16); $('#chartTo').value=now.toISOString().slice(0,16); $('#chartHelp').textContent='Datos en tiempo real. Tocá los círculos de colores para mostrar u ocultar variables. Scroll horizontal para registros anteriores.';
    setMetricToggles(s); ensureChartBox(); $('#refreshChartBtn').onclick=()=>window.renderSensorChart(s.id,true); openDialog('#chartDialog'); window.renderSensorChart(s.id,true);
    clearInterval(window.__sensorChartTimer); window.__sensorChartTimer=setInterval(()=>{sample(s); window.renderSensorChart(s.id,false); renderSensors(); save();},2500);
  };
  window.renderSensorChart=function(id,moveEnd=true){
    const s=findSensor(id); if(!s)return; const wrap=ensureChartBox();
    const from=new Date($('#chartFrom').value||0).getTime(), to=new Date($('#chartTo').value||Date.now()).getTime();
    let rows=(s.history||[]).filter(r=>{const t=new Date(r.at).getTime();return(!from||t>=from)&&(!to||t<=to)}); if(rows.length<2){sample(s);rows=s.history||[];}
    const active=$$('#chartToggles .metric-dot.active').map(b=>b.dataset.metric); const defs=metricDefs(s).filter(d=>active.includes(d.key));
    const ctx=$('#cpuChart'); try{window.liveChart?.destroy?.()}catch(e){}
    const text=getComputedStyle(document.body).getPropertyValue('--text')||'#fff', muted=getComputedStyle(document.body).getPropertyValue('--muted')||'#aaa';
    window.liveChart=new Chart(ctx,{type:'line',data:{labels:rows.map(r=>new Date(r.at).toLocaleString('es-AR')),datasets:defs.map(d=>({label:d.label,data:rows.map(r=>r[d.key]),borderColor:d.color,backgroundColor:d.color+'24',pointRadius:0,borderWidth:2.5,tension:.28,fill:false}))},options:{responsive:false,maintainAspectRatio:false,animation:false,interaction:{mode:'index',intersect:false},plugins:{legend:{labels:{color:text,usePointStyle:true,boxWidth:10}}},scales:{x:{ticks:{color:muted,maxRotation:45,minRotation:35,autoSkip:true,maxTicksLimit:28},grid:{color:'rgba(160,160,160,.12)'}},y:{ticks:{color:muted},grid:{color:'rgba(160,160,160,.12)'}}}}});
    if(wrap&&moveEnd)wrap.scrollLeft=wrap.scrollWidth;
  };
  window.closeChartDialog=()=>{clearInterval(window.__sensorChartTimer); window.__sensorChartTimer=null; try{window.liveChart?.destroy?.()}catch(e){} closeDialog('#chartDialog');};

  // Botón cancelar para device form y confirmación siempre por encima.
  const devForm=$('#deviceForm'); if(devForm){devForm.setAttribute('novalidate','novalidate'); const x=devForm.querySelector('.x'); x?.setAttribute('type','button'); x?.addEventListener('click',async e=>{e.preventDefault(); if(await window.SalamandraConfirm({title:'Cancelar',text:'¿Cerrar sin guardar el dispositivo?',confirmButtonText:'Sí, cerrar'})) closeDialog('#deviceDialog');});}

  const oldSim=window.__v06sim; if(oldSim)clearInterval(oldSim);
  window.__v06sim=setInterval(()=>{state.sensors.forEach(sample); save(); try{renderSensors()}catch(e){} if(window.__activeSensorChart)window.renderSensorChart(window.__activeSensorChart,false);},5000);

  setTimeout(()=>{try{renderSensors()}catch(e){}},100);
})();

/* === v07 FINAL: Supabase seeds, camera embed, device modal close, clean chart selectors, live map === */
(()=>{
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const esc=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const sleep=t=>new Promise(r=>setTimeout(r,t));
  const rnd=(a,b,d=0)=>+(a+Math.random()*(b-a)).toFixed(d);
  const hasOpenDialog=()=>$$('dialog').some(d=>d.open);
  function showDialog(sel){const d=$(sel); if(!d)return; $$('dialog').forEach(o=>{if(o!==d&&o.open){try{o.close()}catch(e){o.removeAttribute('open')}}}); try{d.showModal()}catch(e){d.setAttribute('open','open')} }
  function hideDialog(sel){const d=$(sel); if(!d)return; try{d.close()}catch(e){d.removeAttribute('open')}}
  async function ask(opts={}){return (await Swal.fire({heightAuto:false,allowOutsideClick:false,returnFocus:false,icon:opts.icon||'question',title:opts.title||'Confirmar',text:opts.text||'¿Deseás continuar?',showCancelButton:true,confirmButtonText:opts.confirmButtonText||'Confirmar',cancelButtonText:opts.cancelButtonText||'Cancelar',confirmButtonColor:'#00d977',cancelButtonColor:'#64748b',reverseButtons:true})).isConfirmed}
  window.SalamandraConfirm=ask;
  function toast(title,icon='success'){Swal.fire({toast:true,position:'top-end',timer:1800,showConfirmButton:false,icon,title,heightAuto:false})}
  function mapUrl(address){const q=encodeURIComponent(address||'San Miguel de Tucumán, Argentina');return `https://www.google.com/maps?q=${q}&output=embed`;}
  function youtubeEmbed(url){try{const u=new URL(url);let id='';if(u.hostname.includes('youtu.be'))id=u.pathname.replace('/','');else if(u.hostname.includes('youtube.com'))id=u.searchParams.get('v')||u.pathname.split('/').filter(Boolean).pop();if(id)return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1`;return url}catch(e){return url}}
  function validCamUrl(url){return /^https?:\/\//i.test(String(url||''));}

  // Device form: live map, close/cancel without stacked popups, confirm always on top.
  function ensureDeviceMap(){const f=$('#deviceForm'); if(!f)return; let box=$('#devMapPreview'); if(!box){box=document.createElement('iframe');box.id='devMapPreview';box.loading='lazy';box.referrerPolicy='no-referrer-when-downgrade'; const addr=$('#devAddress')?.closest('label'); (addr||f.querySelector('.primary'))?.after(box);} return box;}
  function updateDeviceMap(){const box=ensureDeviceMap(); if(box) box.src=mapUrl($('#devAddress')?.value||'San Miguel de Tucumán, Argentina');}
  const oldOpenDevice=window.openDeviceDialog;
  window.openDeviceDialog=function(id=null){
    if(oldOpenDevice) oldOpenDevice(id); else showDialog('#deviceDialog');
    const f=$('#deviceForm'); if(f) f.dataset.mode=id?'edit':'new';
    ensureDeviceMap(); updateDeviceMap();
    $('#devAddress')?.removeEventListener('input',updateDeviceMap); $('#devAddress')?.addEventListener('input',updateDeviceMap);
    $('#devAddress')?.removeEventListener('change',updateDeviceMap); $('#devAddress')?.addEventListener('change',updateDeviceMap);
  };
  window.closeDeviceDialog=async()=>{if(await ask({title:'Cancelar',text:'¿Cerrar sin guardar el dispositivo?',confirmButtonText:'Sí, cerrar'}))hideDialog('#deviceDialog')};
  $('#deviceForm .x')?.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();window.closeDeviceDialog()},true);
  const devForm=$('#deviceForm'); if(devForm){devForm.setAttribute('novalidate','novalidate'); devForm.addEventListener('submit',async e=>{
    e.preventDefault(); e.stopImmediatePropagation();
    const name=$('#devName')?.value?.trim(), esp=$('#devId')?.value?.trim(), serie=$('#devSerie')?.value?.trim();
    if(!name||!esp||!serie){toast('Completá Nombre, ID y Serie','warning');return;}
    const d={place:$('#devPlace')?.value||'Casa',name,id:esp,serie,cat:$('#devCat')?.value||'🔧 Genérico',address:$('#devAddress')?.value||'',ownerId:state.user?.id||5,online:true,wifi:88,ssid:'Salamandra_IoT_2.4G',network:'Salamandra IoT',rssi:'-49 dBm',ip:'192.168.1.'+(50+(state.devices?.length||0)),brokerStatus:'Conectado',cameraUrl:'',createdAt:new Date().toLocaleString('es-AR')};
    hideDialog('#deviceDialog');
    const ok=await ask({title:'Guardar dispositivo',text:'¿Confirmás guardar este dispositivo?',confirmButtonText:'Guardar'});
    if(!ok){showDialog('#deviceDialog');return;}
    state.devices=state.devices||[]; const ix=state.devices.findIndex(x=>x.id===d.id); ix>=0?state.devices[ix]={...state.devices[ix],...d}:state.devices.push(d); state.selectedDevice=d.id; save(); renderAll(); toast('Dispositivo guardado');
  },true)}

  // Camera IP: convert YouTube watch URLs to embed and show friendly message for unsupported providers.
  window.openCameraPopup=function(id){
    const d=(state.devices||[]).find(x=>String(x.id)===String(id)); if(!d)return;
    const src=d.cameraUrl?youtubeEmbed(d.cameraUrl):'';
    Swal.fire({title:'Cámara IP',width:820,heightAuto:false,html:`<div class="camera-box"><label>URL de transmisión en vivo<input id="camUrlInput" value="${esc(d.cameraUrl||'')}" placeholder="https://.../stream, RTSP gateway HTTP o YouTube"></label><button class="primary" type="button" id="saveCamBtn">Guardar URL</button><div class="camera-preview">${src?`<iframe src="${esc(src)}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`:'<p>Agregá la URL de la cámara para visualizar la transmisión.</p>'}</div><p class="muted">Para YouTube se convierte automáticamente a formato embed. Para cámaras IP, usar URL HTTP/HTTPS compatible con navegador.</p></div>`,confirmButtonText:'Cerrar',didOpen:()=>{$('#saveCamBtn')?.addEventListener('click',()=>{const url=$('#camUrlInput')?.value?.trim()||''; if(url&&!validCamUrl(url)){toast('URL inválida','warning');return;} d.cameraUrl=url; save(); toast('URL de cámara guardada'); setTimeout(()=>window.openCameraPopup(id),200);});}});
  };
  window.saveCameraUrl=function(id){const d=(state.devices||[]).find(x=>String(x.id)===String(id)); if(!d)return; const url=$('#camUrlInput')?.value?.trim()||''; if(url&&!validCamUrl(url)){toast('URL inválida','warning');return;} d.cameraUrl=url; save(); toast('URL de cámara guardada'); window.openCameraPopup(id)};

  // Chart metric selectors: only colored circles, no labels/buttons visible. Labels stay in Chart.js legend.
  function sensorById(id){return (state.sensors||[]).find(x=>String(x.id)===String(id)||String(x.remote_id)===String(id));}
  function metricDefs(s){
    if(['DHT11','DHT22'].includes(s.type))return[{key:'temp',label:'Temperatura (°C)',color:'#ff7043'},{key:'hum',label:'Humedad (%)',color:'#29b6f6'}];
    if(s.type==='MQ135')return[{key:'co2',label:'CO₂ (ppm)',color:'#29b6f6'},{key:'metano',label:'Metano (ppm)',color:'#66bb6a'},{key:'butano',label:'Butano (ppm)',color:'#ffa726'},{key:'propano',label:'Propano (ppm)',color:'#ab47bc'}];
    if(s.type==='pH')return[{key:'ph',label:'pH',color:'#00e676'}]; if(s.type==='EC')return[{key:'ec',label:'EC (µS/cm)',color:'#00e676'}]; if(s.type==='Nivel')return[{key:'nivel',label:'Nivel (%)',color:'#29b6f6'}]; return[{key:'soil',label:(s.name||'Sensor')+' (%)',color:'#66bb6a'}];
  }
  function normSensor(s){s.history=s.history||[]; if(['DHT11','DHT22'].includes(s.type)){s.temp=s.temp??rnd(22,30,1);s.hum=s.hum??Math.round(rnd(45,70));}else if(s.type==='MQ135'){s.co2=s.co2??Math.round(rnd(410,520));s.metano=s.metano??rnd(10,18,1);s.butano=s.butano??rnd(4,8,1);s.propano=s.propano??rnd(.5,1.8,1)}else if(s.type==='pH'){s.ph=s.ph??rnd(6.2,7.2,2)}else if(s.type==='EC'){s.ec=s.ec??Math.round(rnd(720,880))}else if(s.type==='Nivel'){s.nivel=s.nivel??Math.round(rnd(55,85))}else{s.soil=s.soil??Math.round(rnd(45,70))}return s}
  function sample(s){normSensor(s);const row={at:new Date().toISOString()}; if(['DHT11','DHT22'].includes(s.type)){s.temp=+(s.temp+(Math.random()-.5)*.7).toFixed(1);s.hum=Math.max(0,Math.min(100,Math.round(s.hum+(Math.random()-.5)*3)));row.temp=s.temp;row.hum=s.hum}else if(s.type==='MQ135'){s.co2=Math.max(0,Math.round(s.co2+(Math.random()-.5)*22));s.metano=+(Math.max(0,s.metano+(Math.random()-.5)*1.1)).toFixed(1);s.butano=+(Math.max(0,s.butano+(Math.random()-.5)*.7)).toFixed(1);s.propano=+(Math.max(0,s.propano+(Math.random()-.5)*.25)).toFixed(1);Object.assign(row,{co2:s.co2,metano:s.metano,butano:s.butano,propano:s.propano})}else if(s.type==='pH'){s.ph=+(Math.max(0,Math.min(14,s.ph+(Math.random()-.5)*.08))).toFixed(2);row.ph=s.ph}else if(s.type==='EC'){s.ec=Math.max(0,Math.round(s.ec+(Math.random()-.5)*28));row.ec=s.ec}else if(s.type==='Nivel'){s.nivel=Math.max(0,Math.min(100,Math.round(s.nivel+(Math.random()-.5)*3)));row.nivel=s.nivel}else{s.soil=Math.max(0,Math.min(100,Math.round(s.soil+(Math.random()-.5)*3)));row.soil=s.soil} s.history.push(row);s.history=s.history.slice(-1000);return row}
  function ensureCanvas(){const c=$('#cpuChart'); if(!c)return null; let w=c.closest('.chart-scroll'); if(!w){w=document.createElement('div');w.className='chart-scroll';c.parentNode.insertBefore(w,c);w.appendChild(c)} c.width=1700;c.height=430;c.style.width='1700px';c.style.height='430px';return w}
  function setDots(s){let box=$('#chartToggles'); if(!box){box=document.createElement('div');box.id='chartToggles';box.className='chart-toggles color-only';$('#chartHelp')?.after(box)} box.className='chart-toggles color-only'; box.innerHTML=metricDefs(s).map(d=>`<button type="button" class="metric-dot active" data-metric="${esc(d.key)}" aria-label="${esc(d.label)}" title="${esc(d.label)}" style="--dot:${d.color}"><span></span></button>`).join(''); box.querySelectorAll('.metric-dot').forEach(b=>b.onclick=()=>{b.classList.toggle('active'); window.renderSensorChart(window.__activeSensorChart,false)});}
  window.openSensorChart=function(id){const s=sensorById(id); if(!s)return; window.__activeSensorChart=String(s.id); normSensor(s); while(s.history.length<120)sample(s); const now=new Date(),from=new Date(now.getTime()-6*3600000); $('#chartTitle').textContent=`Historial de ${s.name}`; $('#chartHelp').textContent='Datos en tiempo real. Tocá los círculos de colores para mostrar u ocultar variables. Scroll horizontal para registros anteriores.'; $('#chartFrom').value=from.toISOString().slice(0,16); $('#chartTo').value=now.toISOString().slice(0,16); $('#refreshChartBtn').onclick=()=>window.renderSensorChart(s.id,true); setDots(s); ensureCanvas(); showDialog('#chartDialog'); window.renderSensorChart(s.id,true); clearInterval(window.__sensorChartTimer); window.__sensorChartTimer=setInterval(()=>{sample(s); window.renderSensorChart(s.id,false); try{renderSensors()}catch(e){}; save()},2500)};
  window.renderSensorChart=function(id,moveEnd=true){const s=sensorById(id); if(!s)return; const wrap=ensureCanvas(); const from=new Date($('#chartFrom')?.value||0).getTime(),to=new Date($('#chartTo')?.value||Date.now()).getTime(); let rows=(s.history||[]).filter(r=>{const t=new Date(r.at).getTime();return(!from||t>=from)&&(!to||t<=to)}); if(rows.length<3){for(let i=0;i<80;i++)sample(s);rows=s.history||[]} const active=$$('#chartToggles .metric-dot.active').map(b=>b.dataset.metric); const defs=metricDefs(s).filter(d=>active.includes(d.key)); const ctx=$('#cpuChart'); try{window.liveChart?.destroy?.()}catch(e){} const text=getComputedStyle(document.body).getPropertyValue('--text')||'#fff',muted=getComputedStyle(document.body).getPropertyValue('--muted')||'#aaa'; window.liveChart=new Chart(ctx,{type:'line',data:{labels:rows.map(r=>new Date(r.at).toLocaleString('es-AR')),datasets:defs.map(d=>({label:d.label,data:rows.map(r=>r[d.key]),borderColor:d.color,backgroundColor:'transparent',pointRadius:0,borderWidth:2.4,tension:.25,fill:false,spanGaps:true}))},options:{responsive:false,maintainAspectRatio:false,animation:false,interaction:{mode:'index',intersect:false},plugins:{legend:{position:'top',labels:{color:text,usePointStyle:true,boxWidth:10,font:{size:13,weight:'700'}}}},scales:{x:{ticks:{color:muted,maxRotation:45,minRotation:30,autoSkip:true,maxTicksLimit:30},grid:{color:'rgba(148,163,184,.12)'}},y:{ticks:{color:muted},grid:{color:'rgba(148,163,184,.12)'}}}}}); if(wrap&&moveEnd)wrap.scrollLeft=wrap.scrollWidth};
  window.closeChartDialog=function(){clearInterval(window.__sensorChartTimer); window.__sensorChartTimer=null; try{window.liveChart?.destroy?.();window.liveChart=null}catch(e){} hideDialog('#chartDialog')};

  // Sensor form: cancel always available, confirm before operations, no browser validation trap.
  const sf=$('#sensorForm'); if(sf){sf.setAttribute('novalidate','novalidate'); $('#sensorForm .x')?.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();window.cancelSensorForm?.()},true); sf.addEventListener('submit',async e=>{e.preventDefault();e.stopImmediatePropagation(); const isEdit=!!window.editingSensorId; const type=$('#sensorType')?.value||'Generico', name=$('#sensorName')?.value?.trim(); if(!name){toast('Ingresá el nombre del sensor','warning');return;} const s=isEdit?sensorById(window.editingSensorId):{id:(crypto.randomUUID?.()||Date.now()),history:[]}; Object.assign(s,{type,name,gpio:$('#sensorPort')?.value||'',esp_variable:$('#sensorVar')?.value?.trim()||'',icon:$('#sensorIcon')?.value||'info'}); normSensor(s); const ok=await ask({title:isEdit?'Actualizar sensor':'Añadir sensor',text:isEdit?'¿Confirmás actualizar este sensor?':'¿Confirmás agregar este nuevo sensor?',confirmButtonText:isEdit?'Actualizar':'Guardar'}); if(!ok)return; if(!isEdit)state.sensors.push(s); await (window.salDb?.()?.from?.('sensors')?.upsert?.({id: /^[0-9a-f-]{36}$/i.test(String(s.id))?s.id:undefined,type:s.type,name:s.name,gpio:s.gpio||null,esp_variable:s.esp_variable||null,icon:s.icon,unit:s.unit||null,updated_at:new Date().toISOString()}).catch?.(()=>{})||Promise.resolve()); save(); hideDialog('#sensorDialog'); renderSensors(); window.editingSensorId=null; toast(isEdit?'Sensor actualizado':'Sensor agregado')},true)}

})();

/* === v07.1 HARDEN: clone forms to remove legacy handlers and bind clean handlers === */
window.addEventListener('DOMContentLoaded',()=>setTimeout(()=>{
  const $=(s,r=document)=>r.querySelector(s); const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  function hide(sel){const d=$(sel); if(!d)return; try{d.close()}catch(e){d.removeAttribute('open')}}
  function show(sel){const d=$(sel); if(!d)return; $$('dialog').forEach(o=>{if(o!==d&&o.open){try{o.close()}catch(e){o.removeAttribute('open')}}}); try{d.showModal()}catch(e){d.setAttribute('open','open')}}
  async function ask(opts={}){return (await Swal.fire({heightAuto:false,allowOutsideClick:false,returnFocus:false,icon:opts.icon||'question',title:opts.title||'Confirmar',text:opts.text||'¿Deseás continuar?',showCancelButton:true,confirmButtonText:opts.confirmButtonText||'Confirmar',cancelButtonText:'Cancelar',confirmButtonColor:'#00d977',cancelButtonColor:'#64748b',reverseButtons:true})).isConfirmed}
  const toast=(title,icon='success')=>Swal.fire({toast:true,position:'top-end',timer:1800,showConfirmButton:false,icon,title,heightAuto:false});
  const mapUrl=a=>`https://www.google.com/maps?q=${encodeURIComponent(a||'San Miguel de Tucumán, Argentina')}&output=embed`;
  const sensorById=id=>(state.sensors||[]).find(x=>String(x.id)===String(id)||String(x.remote_id)===String(id));
  function norm(s){s.history=s.history||[];if(['DHT11','DHT22'].includes(s.type)){s.temp=s.temp??25;s.hum=s.hum??60;s.unit='°C/%'}else if(s.type==='MQ135'){s.co2=s.co2??450;s.metano=s.metano??14;s.butano=s.butano??5;s.propano=s.propano??1;s.unit='ppm'}else if(s.type==='pH'){s.ph=s.ph??6.8;s.unit='pH'}else if(s.type==='EC'){s.ec=s.ec??800;s.unit='µS/cm'}else if(s.type==='Nivel'){s.nivel=s.nivel??65;s.unit='%'}else{s.soil=s.soil??55;s.unit='%'}return s}
  // Clone sensor form
  const sfOld=$('#sensorForm'); if(sfOld){const sf=sfOld.cloneNode(true); sfOld.replaceWith(sf); sf.setAttribute('novalidate','novalidate'); sf.querySelector('.x').onclick=async e=>{e.preventDefault(); if(await ask({title:'Cancelar',text:'¿Cerrar sin guardar el sensor?',confirmButtonText:'Sí, cerrar'})) hide('#sensorDialog')}; sf.onsubmit=async e=>{e.preventDefault(); const isEdit=!!window.editingSensorId; const name=$('#sensorName').value.trim(); if(!name){toast('Ingresá el nombre del sensor','warning');return} const s=isEdit?sensorById(window.editingSensorId):{id:(crypto.randomUUID?.()||Date.now()),history:[]}; if(!s){toast('Sensor no encontrado','error');return} Object.assign(s,{type:$('#sensorType').value||'Generico',name,gpio:$('#sensorPort').value||'',esp_variable:$('#sensorVar').value.trim(),icon:$('#sensorIcon').value||'info'}); norm(s); if(!await ask({title:isEdit?'Actualizar sensor':'Añadir sensor',text:isEdit?'¿Confirmás actualizar este sensor?':'¿Confirmás agregar este nuevo sensor?',confirmButtonText:isEdit?'Actualizar':'Guardar'}))return; if(!isEdit)state.sensors.push(s); try{save()}catch(e){} hide('#sensorDialog'); try{renderSensors()}catch(e){} window.editingSensorId=null; toast(isEdit?'Sensor actualizado':'Sensor agregado')}; }
  // Clone device form
  const dfOld=$('#deviceForm'); if(dfOld){const df=dfOld.cloneNode(true); dfOld.replaceWith(df); df.setAttribute('novalidate','novalidate'); function ensureMap(){let m=$('#devMapPreview'); if(!m){m=document.createElement('iframe');m.id='devMapPreview';m.loading='lazy';m.referrerPolicy='no-referrer-when-downgrade';$('#devAddress')?.closest('label')?.after(m)} return m} function upd(){const m=ensureMap(); if(m)m.src=mapUrl($('#devAddress')?.value)} df.querySelector('.x').onclick=async e=>{e.preventDefault(); if(await ask({title:'Cancelar',text:'¿Cerrar sin guardar el dispositivo?',confirmButtonText:'Sí, cerrar'})) hide('#deviceDialog')}; $('#devAddress')?.addEventListener('input',upd); $('#devAddress')?.addEventListener('change',upd); df.onsubmit=async e=>{e.preventDefault(); const name=$('#devName').value.trim(), id=$('#devId').value.trim(), serie=$('#devSerie').value.trim(); if(!name||!id||!serie){toast('Completá Nombre, ID y Serie','warning');return} const d={place:$('#devPlace').value||'Casa',name,id,serie,cat:$('#devCat').value||'🔧 Genérico',address:$('#devAddress').value||'',ownerId:state.user?.id||5,online:true,wifi:88,ssid:'Salamandra_IoT_2.4G',network:'Salamandra IoT',rssi:'-49 dBm',ip:'192.168.1.'+(50+(state.devices?.length||0)),brokerStatus:'Conectado',cameraUrl:'',createdAt:new Date().toLocaleString('es-AR')}; hide('#deviceDialog'); if(!await ask({title:'Guardar dispositivo',text:'¿Confirmás guardar este dispositivo?',confirmButtonText:'Guardar'})){show('#deviceDialog');return} state.devices=state.devices||[]; const ix=state.devices.findIndex(x=>x.id===id); ix>=0?state.devices[ix]={...state.devices[ix],...d}:state.devices.push(d); state.selectedDevice=id; save(); renderAll(); toast('Dispositivo guardado')}; const oldOpen=window.openDeviceDialog; window.openDeviceDialog=function(id=null){if(oldOpen)oldOpen(id); show('#deviceDialog'); setTimeout(upd,50)}; }
},300));

/* === v08 FINAL: device modal stacking fix, live map, chart cleanup, reliable handlers === */
(function(){
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const esc=s=>String(s??'').replace(/[&<>'"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m]));
  const saveState=()=>{try{save()}catch(e){try{localStorage.setItem('salamandra-state',JSON.stringify(state))}catch(_){}}};
  const showDialog=sel=>{const d=$(sel); if(!d)return; try{if(!d.open)d.showModal()}catch(e){d.setAttribute('open','')}};
  const closeDialog=sel=>{const d=$(sel); if(!d)return; try{if(d.open)d.close()}catch(e){d.removeAttribute('open')}};
  const toast=(title,icon='success')=>Swal.fire({toast:true,position:'top-end',timer:1800,showConfirmButton:false,icon,title,heightAuto:false});
  const ask=async(opts={})=>(await Swal.fire({heightAuto:false,allowOutsideClick:false,returnFocus:false,icon:opts.icon||'question',title:opts.title||'Confirmar',text:opts.text||'¿Deseás continuar?',showCancelButton:true,confirmButtonText:opts.confirmButtonText||'Confirmar',cancelButtonText:opts.cancelButtonText||'Cancelar',confirmButtonColor:'#00d977',cancelButtonColor:'#64748b',reverseButtons:true})).isConfirmed;
  const mapSrc=addr=>'https://www.google.com/maps?q='+encodeURIComponent(addr||'San Miguel de Tucumán, Argentina')+'&output=embed';
  const genId=()=> 'ESP'+Math.floor(100000+Math.random()*899999);
  const genSerie=()=> 'EG'+Math.floor(100000+Math.random()*899999);
  function currentDev(){return (state.devices||[]).find(d=>String(d.id)===String(state.selectedDevice))||(state.devices||[])[0];}

  // Global dialog z-index + prevent stale stacked Swal backdrops.
  const st=document.createElement('style');
  st.textContent=`
    dialog{z-index:1000}.swal2-container{z-index:300000!important}.modal-form{max-height:min(88vh,900px);overflow:auto}
    #devMapPreview{width:100%;height:210px;border:0;border-radius:12px;margin:10px 0;background:#e5e7eb}
    #chartToggles{display:none!important}.chart-modal{width:min(1000px,92vw)}.chart-scroll{overflow-x:auto;overflow-y:hidden;padding-bottom:10px}.chart-scroll canvas{display:block;min-width:1500px!important;height:420px!important}
  `;
  document.head.appendChild(st);

  // Chart popups: remove custom selector buttons. Chart.js legend remains clickable to show/hide datasets.
  function sensorById(id){return (state.sensors||[]).find(x=>String(x.id)===String(id)||String(x.remote_id)===String(id));}
  function rnd(a,b,d=1){return +(a+Math.random()*(b-a)).toFixed(d)}
  function defs(s){
    const t=String(s?.type||s?.name||'').toLowerCase();
    if(t.includes('dht')) return [{k:'temp',l:'Temperatura (°C)',c:'#ff7043'},{k:'hum',l:'Humedad (%)',c:'#29b6f6'}];
    if(t.includes('mq135')||t.includes('gas')) return [{k:'co2',l:'CO₂ (ppm)',c:'#29b6f6'},{k:'metano',l:'Metano (ppm)',c:'#66bb6a'},{k:'butano',l:'Butano (ppm)',c:'#ffa726'},{k:'propano',l:'Propano (ppm)',c:'#ab47bc'}];
    if(t.includes('ph')) return [{k:'ph',l:'pH',c:'#00e676'}];
    if(t.includes('ec')||t.includes('conduct')) return [{k:'ec',l:'EC (µS/cm)',c:'#00e676'}];
    if(t.includes('nivel')) return [{k:'nivel',l:'Nivel (%)',c:'#29b6f6'}];
    return [{k:'value',l:(s?.name||'Sensor')+(s?.unit?' ('+s.unit+')':''),c:'#66bb6a'}];
  }
  function sample(s){
    s.history=s.history||[]; const row={at:new Date().toISOString()};
    defs(s).forEach(d=>{let last=s.history.length?s.history[s.history.length-1][d.k]:undefined; if(last==null){
      if(d.k==='temp')last=rnd(22,31); else if(d.k==='hum'||d.k==='nivel'||d.k==='value')last=rnd(45,75,0); else if(d.k==='co2')last=rnd(400,520,0); else if(d.k==='metano')last=rnd(10,18); else if(d.k==='butano')last=rnd(4,8); else if(d.k==='propano')last=rnd(.5,2); else if(d.k==='ph')last=rnd(6.2,7.2,2); else if(d.k==='ec')last=rnd(720,900,0); else last=rnd(10,90);
    }
    const delta=(d.k==='co2'||d.k==='ec')?rnd(-20,20,0):(d.k==='ph'?rnd(-.06,.06,2):rnd(-1.2,1.2));
    let v=+(Number(last)+delta).toFixed(d.k==='ph'?2:1); if(['hum','nivel','value'].includes(d.k))v=Math.max(0,Math.min(100,Math.round(v))); if(d.k==='ph')v=Math.max(0,Math.min(14,v)); row[d.k]=v; s[d.k]=v;});
    s.history.push(row); s.history=s.history.slice(-1200); return row;
  }
  function ensureCanvas(){const c=$('#cpuChart'); if(!c)return null; let w=c.closest('.chart-scroll'); if(!w){w=document.createElement('div');w.className='chart-scroll';c.parentNode.insertBefore(w,c);w.appendChild(c)} c.width=1600;c.height=420;c.style.width='1600px';c.style.height='420px';return w;}
  window.openSensorChart=function(id){const s=sensorById(id); if(!s){toast('Sensor no encontrado','error');return;} s.history=s.history||[]; while(s.history.length<160)sample(s); const now=new Date(), from=new Date(now.getTime()-6*3600000); $('#chartTitle').textContent='Historial de '+(s.name||'Sensor'); $('#chartHelp').textContent='Datos simulados en tiempo real. Usá la leyenda del gráfico para mostrar u ocultar variables. Scroll horizontal para registros anteriores.'; const tg=$('#chartToggles'); if(tg)tg.innerHTML=''; $('#chartFrom').value=from.toISOString().slice(0,16); $('#chartTo').value=now.toISOString().slice(0,16); $('#refreshChartBtn').onclick=()=>window.renderSensorChart(id,true); ensureCanvas(); showDialog('#chartDialog'); window.renderSensorChart(id,true); clearInterval(window.__sensorChartTimer); window.__sensorChartTimer=setInterval(()=>{sample(s); window.renderSensorChart(id,false); try{window.renderSensors?.()}catch(e){} saveState();},2500);};
  window.renderSensorChart=function(id,moveEnd=true){const s=sensorById(id); if(!s)return; const wrap=ensureCanvas(); const from=new Date($('#chartFrom')?.value||0).getTime(), to=new Date($('#chartTo')?.value||Date.now()).getTime(); let rows=(s.history||[]).filter(r=>{const t=new Date(r.at).getTime(); return (!from||t>=from)&&(!to||t<=to)}); if(rows.length<10){for(let i=0;i<120;i++)sample(s); rows=s.history||[]} try{window.liveChart?.destroy?.()}catch(e){} const text=getComputedStyle(document.body).getPropertyValue('--text')||'#fff', muted=getComputedStyle(document.body).getPropertyValue('--muted')||'#9ca3af'; window.liveChart=new Chart($('#cpuChart'),{type:'line',data:{labels:rows.map(r=>new Date(r.at).toLocaleString('es-AR')),datasets:defs(s).map(d=>({label:d.l,data:rows.map(r=>r[d.k]),borderColor:d.c,backgroundColor:'transparent',pointRadius:0,borderWidth:2.4,tension:.25,fill:false,spanGaps:true}))},options:{responsive:false,maintainAspectRatio:false,animation:false,interaction:{mode:'index',intersect:false},plugins:{legend:{display:true,position:'top',labels:{color:text,usePointStyle:true,boxWidth:12,font:{size:13,weight:'700'}}}},scales:{x:{ticks:{color:muted,maxRotation:45,minRotation:30,autoSkip:true,maxTicksLimit:28},grid:{color:'rgba(148,163,184,.12)'}},y:{ticks:{color:muted},grid:{color:'rgba(148,163,184,.12)'}}}}}); if(wrap&&moveEnd)wrap.scrollLeft=wrap.scrollWidth;};
  window.closeChartDialog=function(){clearInterval(window.__sensorChartTimer); window.__sensorChartTimer=null; try{window.liveChart?.destroy?.();window.liveChart=null}catch(e){} closeDialog('#chartDialog')};

  // Sensor cards: force chart/info/edit/delete click handlers after every render.
  const prevRenderSensors=window.renderSensors;
  window.renderSensors=function(){try{prevRenderSensors?.()}catch(e){} $$('.sensor-card').forEach(card=>{const id=card.dataset.sensorId||card.getAttribute('data-sensor-id'); const chart=card.querySelector('.sensor-chart-btn,[data-sensor-chart]'); if(chart){chart.onclick=(ev)=>{ev.preventDefault();ev.stopPropagation();window.openSensorChart(id||chart.dataset.sensorChart)}}});};

  // Sensor form: allow close/cancel and ask before save without browser validation traps.
  const oldSF=$('#sensorForm');
  if(oldSF){
    const sf=oldSF.cloneNode(true); oldSF.replaceWith(sf); sf.setAttribute('novalidate','novalidate');
    window.openSensorDialog=function(id=null){window.editingSensorId=id||null; const s=id?sensorById(id):null; $('#sensorTitle').textContent=s?'Editar Sensor':'Añadir Sensor'; $('#sensorType').value=s?.type||''; $('#sensorName').value=s?.name||''; $('#sensorPort').value=s?.gpio||''; $('#sensorVar').value=s?.esp_variable||s?.espVariable||''; $('#sensorIcon').value=s?.icon||'info'; showDialog('#sensorDialog')};
    window.cancelSensorForm=async()=>{closeDialog('#sensorDialog'); const ok=await ask({title:'Cancelar',text:'¿Cerrar sin guardar el sensor?',confirmButtonText:'Sí, cerrar'}); if(!ok)showDialog('#sensorDialog');};
    sf.querySelector('.x')?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();window.cancelSensorForm();});
    sf.addEventListener('submit',async e=>{e.preventDefault();e.stopPropagation(); const isEdit=!!window.editingSensorId; const name=$('#sensorName').value.trim(); if(!name){toast('Ingresá el nombre del sensor','warning'); return;} const s=isEdit?sensorById(window.editingSensorId):{id:(crypto.randomUUID?.()||Date.now()),history:[]}; if(!s){toast('Sensor no encontrado','error');return;} Object.assign(s,{type:$('#sensorType').value||'Generico',name,gpio:$('#sensorPort').value||'',esp_variable:$('#sensorVar').value.trim(),icon:$('#sensorIcon').value||'info'}); closeDialog('#sensorDialog'); const ok=await ask({title:isEdit?'Actualizar sensor':'Añadir sensor',text:isEdit?'¿Confirmás actualizar este sensor?':'¿Confirmás agregar este nuevo sensor?',confirmButtonText:isEdit?'Actualizar':'Guardar'}); if(!ok){showDialog('#sensorDialog');return;} if(!isEdit)(state.sensors=state.sensors||[]).push(s); saveState(); try{window.renderSensors()}catch(e){} window.editingSensorId=null; toast(isEdit?'Sensor actualizado':'Sensor agregado'); },{capture:true});
  }

  // Device form: replicate requested form, live map while typing, close/confirm never behind native dialog.
  const oldDF=$('#deviceForm');
  if(oldDF){
    const df=oldDF.cloneNode(true); oldDF.replaceWith(df); df.setAttribute('novalidate','novalidate');
    function ensureMap(){let m=$('#devMapPreview'); if(!m){m=document.createElement('iframe');m.id='devMapPreview';m.loading='lazy';m.referrerPolicy='no-referrer-when-downgrade'; $('#devAddress')?.closest('label')?.after(m);} return m;}
    function updateMap(){const m=ensureMap(); if(m)m.src=mapSrc($('#devAddress')?.value||'San Miguel de Tucumán, Argentina');}
    function fillDev(d){$('#devPlace').value=d?.place||'Casa'; $('#devName').value=d?.name||''; $('#devId').value=d?.id||genId(); $('#devSerie').value=d?.serie||genSerie(); $('#devCat').value=d?.cat||'🔧 Genérico'; $('#devAddress').value=d?.address||'San Miguel de Tucumán, Argentina'; updateMap();}
    window.openDeviceDialog=function(id=null){window.editingDeviceId=id||null; const d=id?(state.devices||[]).find(x=>String(x.id)===String(id)):null; $('#deviceForm h2').textContent=d?'Editar Dispositivo':'Nuevo Dispositivo'; fillDev(d); showDialog('#deviceDialog'); setTimeout(updateMap,80);};
    window.closeDeviceDialog=async()=>{closeDialog('#deviceDialog'); const ok=await ask({title:'Cancelar',text:'¿Cerrar sin guardar el dispositivo?',confirmButtonText:'Sí, cerrar'}); if(!ok)showDialog('#deviceDialog');};
    df.querySelector('.x')?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();window.closeDeviceDialog();});
    $('#devAddress')?.addEventListener('input',updateMap); $('#devAddress')?.addEventListener('change',updateMap);
    df.addEventListener('submit',async e=>{e.preventDefault();e.stopPropagation(); const name=$('#devName').value.trim(), id=$('#devId').value.trim(), serie=$('#devSerie').value.trim(); if(!name||!id||!serie){toast('Completá Nombre, ID y Serie','warning');return;} const old=(state.devices||[]).find(x=>String(x.id)===String(window.editingDeviceId||id)); const d={...(old||{}),place:$('#devPlace').value||'Casa',name,id,serie,cat:$('#devCat').value||'🔧 Genérico',address:$('#devAddress').value||'',ownerId:old?.ownerId||state.user?.id||5,online:old?.online??true,wifi:old?.wifi??88,ssid:old?.ssid||'Salamandra_IoT_2.4G',network:old?.network||'Salamandra IoT',rssi:old?.rssi||'-49 dBm',ip:old?.ip||('192.168.1.'+(50+(state.devices?.length||0))),brokerStatus:old?.brokerStatus||'Conectado',cameraUrl:old?.cameraUrl||'',createdAt:old?.createdAt||new Date().toLocaleString('es-AR')}; closeDialog('#deviceDialog'); const ok=await ask({title:old?'Actualizar dispositivo':'Guardar dispositivo',text:old?'¿Confirmás actualizar este dispositivo?':'¿Confirmás guardar este dispositivo?',confirmButtonText:old?'Actualizar':'Guardar'}); if(!ok){showDialog('#deviceDialog');return;} state.devices=state.devices||[]; const ix=state.devices.findIndex(x=>String(x.id)===String(old?.id||id)); ix>=0?state.devices[ix]=d:state.devices.push(d); state.selectedDevice=id; saveState(); try{renderAll()}catch(e){try{renderDevices()}catch(_){}} toast(old?'Dispositivo actualizado':'Dispositivo guardado'); window.editingDeviceId=null; },{capture:true});
  }

  // Init/final rerender.
  setTimeout(()=>{try{window.renderSensors?.()}catch(e){}},300);
})();
