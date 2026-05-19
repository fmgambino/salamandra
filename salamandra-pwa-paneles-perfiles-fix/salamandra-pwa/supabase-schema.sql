-- ============================================================
-- SALAMANDRA IOT - PATCH v07 SUPABASE
-- Compatible con el esquema actual del proyecto.
-- Incluye: columnas opcionales, vistas, policies seguras y usuarios demo.
-- ============================================================

create extension if not exists pgcrypto;

-- ---------- Columnas opcionales compatibles ----------
alter table public.profiles add column if not exists parent_id uuid references public.profiles(id) on delete set null;
alter table public.profiles add column if not exists plan text;
alter table public.profiles add column if not exists billing_cycle text default 'mensual';
alter table public.profiles add column if not exists clients_limit integer default 0;
alter table public.profiles add column if not exists entrepreneurs_limit integer default 0;
alter table public.profiles add column if not exists device_limit integer default 1;
alter table public.profiles add column if not exists extra_device_cost numeric default 0;
alter table public.profiles add column if not exists extra_entrepreneur_cost numeric default 0;

alter table public.devices add column if not exists camera_url text;
alter table public.devices add column if not exists ssid text;
alter table public.devices add column if not exists network text;
alter table public.devices add column if not exists rssi text;
alter table public.devices add column if not exists ip text;

alter table public.sensors add column if not exists remote_key text;
alter table public.actuators add column if not exists remote_key text;

-- ---------- updated_at trigger ----------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

do $$
begin
  if not exists (select 1 from pg_trigger where tgname='trg_profiles_updated_at') then
    create trigger trg_profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
  end if;
  if not exists (select 1 from pg_trigger where tgname='trg_devices_updated_at') then
    create trigger trg_devices_updated_at before update on public.devices for each row execute function public.set_updated_at();
  end if;
  if not exists (select 1 from pg_trigger where tgname='trg_sensors_updated_at') then
    create trigger trg_sensors_updated_at before update on public.sensors for each row execute function public.set_updated_at();
  end if;
  if not exists (select 1 from pg_trigger where tgname='trg_actuators_updated_at') then
    create trigger trg_actuators_updated_at before update on public.actuators for each row execute function public.set_updated_at();
  end if;
end $$;

-- ---------- Plans ----------
alter table public.plans add column if not exists max_clients integer default 0;
alter table public.plans add column if not exists max_entrepreneurs integer default 0;
alter table public.plans add column if not exists extra_device_cost numeric default 0;
alter table public.plans add column if not exists extra_entrepreneur_cost numeric default 0;

insert into public.plans (name, code, monthly_price, annual_price, max_devices, max_clients, max_entrepreneurs, extra_device_cost, extra_entrepreneur_cost, is_active)
values
('Cliente', 'cliente', 0, 0, 1, 1, 0, 9.99, 0, true),
('Emprendedor', 'emprendedor', 9.99, 99.99, 3, 3, 0, 7.99, 0, true),
('Business', 'business', 29.99, 299.99, 25, 25, 5, 6.99, 14.99, true)
on conflict (code) do update set
  monthly_price=excluded.monthly_price,
  annual_price=excluded.annual_price,
  max_devices=excluded.max_devices,
  max_clients=excluded.max_clients,
  max_entrepreneurs=excluded.max_entrepreneurs,
  extra_device_cost=excluded.extra_device_cost,
  extra_entrepreneur_cost=excluded.extra_entrepreneur_cost,
  is_active=true,
  updated_at=now();

-- ---------- Usuarios demo en Auth + Profiles ----------
-- Clave demo para todos: 123456
-- Si tu proyecto bloquea inserción directa en auth.users, crealos desde Authentication > Add user
-- y luego ejecutá únicamente el bloque de profiles de abajo.
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'superadmin@salamandra.local', crypt('123456', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"name":"Demo SuperAdmin"}'),
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'admin@salamandra.local', crypt('123456', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"name":"Demo Admin"}'),
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'emprendedor@salamandra.local', crypt('123456', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"name":"Demo Emprendedor"}'),
('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'business@salamandra.local', crypt('123456', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"name":"Demo Business"}'),
('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'cliente@salamandra.local', crypt('123456', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"name":"Demo Cliente"}')
on conflict (id) do update set email=excluded.email, updated_at=now();

insert into public.profiles (id, name, email, role, status, parent_id, plan, billing_cycle, clients_limit, entrepreneurs_limit, device_limit, extra_device_cost, extra_entrepreneur_cost)
values
('00000000-0000-0000-0000-000000000001','Demo SuperAdmin','superadmin@salamandra.local','superadmin','active',null,'Sistema','mensual',0,0,999,0,0),
('00000000-0000-0000-0000-000000000002','Demo Admin','admin@salamandra.local','admin','active','00000000-0000-0000-0000-000000000001','Administración','mensual',0,0,999,0,0),
('00000000-0000-0000-0000-000000000003','Demo Emprendedor','emprendedor@salamandra.local','emprendedor','active','00000000-0000-0000-0000-000000000002','Emprendedor','mensual',3,0,3,7.99,0),
('00000000-0000-0000-0000-000000000004','Demo Business','business@salamandra.local','business','active','00000000-0000-0000-0000-000000000002','Business','mensual',25,5,25,6.99,14.99),
('00000000-0000-0000-0000-000000000005','Demo Cliente','cliente@salamandra.local','cliente','active','00000000-0000-0000-0000-000000000003','Cliente','mensual',1,0,1,9.99,0)
on conflict (id) do update set
  name=excluded.name,email=excluded.email,role=excluded.role,status=excluded.status,parent_id=excluded.parent_id,plan=excluded.plan,billing_cycle=excluded.billing_cycle,
  clients_limit=excluded.clients_limit,entrepreneurs_limit=excluded.entrepreneurs_limit,device_limit=excluded.device_limit,extra_device_cost=excluded.extra_device_cost,
  extra_entrepreneur_cost=excluded.extra_entrepreneur_cost,updated_at=now();

-- ---------- Storage avatars ----------
insert into storage.buckets (id, name, public) values ('avatars','avatars',true) on conflict (id) do nothing;
drop policy if exists avatars_read on storage.objects;
create policy avatars_read on storage.objects for select to public using (bucket_id='avatars');
drop policy if exists avatars_insert on storage.objects;
create policy avatars_insert on storage.objects for insert to authenticated with check (bucket_id='avatars' and (storage.foldername(name))[1]=auth.uid()::text);
drop policy if exists avatars_update on storage.objects;
create policy avatars_update on storage.objects for update to authenticated using (bucket_id='avatars' and (storage.foldername(name))[1]=auth.uid()::text) with check (bucket_id='avatars' and (storage.foldername(name))[1]=auth.uid()::text);
drop policy if exists avatars_delete on storage.objects;
create policy avatars_delete on storage.objects for delete to authenticated using (bucket_id='avatars' and (storage.foldername(name))[1]=auth.uid()::text);

-- ---------- Views sin renombrar columnas existentes ----------
drop view if exists public.dashboard_stats cascade;
create view public.dashboard_stats as
select
  p.id as profile_id,
  p.name,
  p.email,
  p.avatar_url,
  p.role,
  p.parent_id,
  p.plan,
  p.billing_cycle,
  (select count(*) from public.profiles c where c.parent_id=p.id) as total_children,
  (select count(*) from public.profiles c where c.parent_id=p.id and lower(c.role)='cliente') as total_clients,
  (select count(*) from public.profiles c where c.parent_id=p.id and lower(c.role)='emprendedor') as total_entrepreneurs,
  (select count(*) from public.devices d where d.user_id=p.id) as total_devices,
  (select count(*) from public.devices d where d.user_id=p.id and d.is_online=true) as online_devices,
  coalesce((select round(avg(d.wifi_signal)) from public.devices d where d.user_id=p.id),0) as avg_wifi_signal,
  (select count(*) from public.support_tickets st where st.user_id=p.id and st.status<>'cerrado') as open_tickets,
  (select coalesce(sum(s.amount),0) from public.subscriptions s where s.user_id=p.id and s.status in ('active','trialing')) as active_income;

-- ---------- RLS básicas compatibles ----------
alter table public.profiles enable row level security;
alter table public.devices enable row level security;
alter table public.places enable row level security;
alter table public.sensors enable row level security;
alter table public.actuators enable row level security;
alter table public.sensor_readings enable row level security;
alter table public.actuator_events enable row level security;
alter table public.support_tickets enable row level security;
alter table public.notifications enable row level security;
alter table public.subscriptions enable row level security;

create or replace function public.is_admin_user()
returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from public.profiles p where p.id=auth.uid() and lower(p.role) in ('superadmin','admin'));
$$;

drop policy if exists profiles_read on public.profiles;
create policy profiles_read on public.profiles for select to authenticated using (id=auth.uid() or parent_id=auth.uid() or public.is_admin_user());
drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles for update to authenticated using (id=auth.uid() or public.is_admin_user()) with check (id=auth.uid() or public.is_admin_user());

drop policy if exists devices_owner_admin on public.devices;
create policy devices_owner_admin on public.devices for all to authenticated using (user_id=auth.uid() or public.is_admin_user()) with check (user_id=auth.uid() or public.is_admin_user());

drop policy if exists places_owner_admin on public.places;
create policy places_owner_admin on public.places for all to authenticated using (user_id=auth.uid() or public.is_admin_user()) with check (user_id=auth.uid() or public.is_admin_user());

drop policy if exists sensors_by_device_owner on public.sensors;
create policy sensors_by_device_owner on public.sensors for all to authenticated using (exists(select 1 from public.devices d where d.id=sensors.device_id and (d.user_id=auth.uid() or public.is_admin_user()))) with check (exists(select 1 from public.devices d where d.id=sensors.device_id and (d.user_id=auth.uid() or public.is_admin_user())));

drop policy if exists actuators_by_device_owner on public.actuators;
create policy actuators_by_device_owner on public.actuators for all to authenticated using (exists(select 1 from public.devices d where d.id=actuators.device_id and (d.user_id=auth.uid() or public.is_admin_user()))) with check (exists(select 1 from public.devices d where d.id=actuators.device_id and (d.user_id=auth.uid() or public.is_admin_user())));

drop policy if exists readings_by_device_owner on public.sensor_readings;
create policy readings_by_device_owner on public.sensor_readings for all to authenticated using (exists(select 1 from public.devices d where d.id=sensor_readings.device_id and (d.user_id=auth.uid() or public.is_admin_user()))) with check (exists(select 1 from public.devices d where d.id=sensor_readings.device_id and (d.user_id=auth.uid() or public.is_admin_user())));

drop policy if exists actuator_events_by_device_owner on public.actuator_events;
create policy actuator_events_by_device_owner on public.actuator_events for all to authenticated using (exists(select 1 from public.devices d where d.id=actuator_events.device_id and (d.user_id=auth.uid() or public.is_admin_user()))) with check (exists(select 1 from public.devices d where d.id=actuator_events.device_id and (d.user_id=auth.uid() or public.is_admin_user())));

-- ---------- Realtime: ignora duplicados ----------
do $$ begin
  begin alter publication supabase_realtime add table public.sensor_readings; exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.actuator_events; exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.devices; exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.sensors; exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.actuators; exception when duplicate_object then null; end;
end $$;

-- ---------- Índices ----------
create index if not exists idx_profiles_parent on public.profiles(parent_id);
create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_devices_user on public.devices(user_id);
create index if not exists idx_sensors_device on public.sensors(device_id);
create index if not exists idx_actuators_device on public.actuators(device_id);
create index if not exists idx_sensor_readings_device_created on public.sensor_readings(device_id, created_at desc);
create index if not exists idx_sensor_readings_sensor_created on public.sensor_readings(sensor_id, created_at desc);

select 'SALAMANDRA IOT PATCH v07 OK' as status;
