-- SALAMANDRA IOT - PATCH V08 COMPATIBLE CON ESQUEMA ACTUAL
-- Ejecutar en Supabase SQL Editor. No usa owner_profile_id.

create extension if not exists pgcrypto;

-- Campos opcionales para cámara / jerarquía / planes, seguros si ya existen.
alter table public.devices add column if not exists camera_url text;
alter table public.devices add column if not exists ssid text default 'Salamandra_IoT_2.4G';
alter table public.devices add column if not exists network text default 'Salamandra IoT';
alter table public.devices add column if not exists ip text;
alter table public.devices add column if not exists rssi text;
alter table public.profiles add column if not exists parent_id uuid references public.profiles(id);
alter table public.profiles add column if not exists plan_code text;
alter table public.plans add column if not exists max_clients integer default 1;
alter table public.plans add column if not exists max_entrepreneurs integer default 0;
alter table public.plans add column if not exists extra_device_cost numeric default 0;
alter table public.plans add column if not exists extra_entrepreneur_cost numeric default 0;

-- View limpia: se elimina antes para evitar error 42P16 al cambiar columnas.
drop view if exists public.dashboard_stats cascade;
create view public.dashboard_stats as
select
  p.id as profile_id,
  p.name,
  p.email,
  p.avatar_url,
  p.role,
  p.plan_code,
  (select count(*) from public.devices d where d.user_id=p.id) as total_devices,
  (select count(*) from public.devices d where d.user_id=p.id and coalesce(d.is_online,false)=true) as online_devices,
  (select coalesce(avg(d.wifi_signal),0) from public.devices d where d.user_id=p.id) as avg_wifi_signal,
  (select count(*) from public.support_tickets t where t.user_id=p.id and t.status <> 'cerrado') as open_tickets,
  (select count(*) from public.notifications n where n.user_id=p.id and coalesce(n.is_read,false)=false) as unread_notifications
from public.profiles p;

-- Índices.
create index if not exists idx_profiles_parent on public.profiles(parent_id);
create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_devices_user_created on public.devices(user_id, created_at desc);
create index if not exists idx_devices_place on public.devices(place_id);
create index if not exists idx_sensors_device on public.sensors(device_id);
create index if not exists idx_actuators_device on public.actuators(device_id);
create index if not exists idx_sensor_readings_device_metric_created on public.sensor_readings(device_id, metric, created_at desc);

-- Planes base.
insert into public.plans(name,code,monthly_price,annual_price,max_devices,max_clients,max_entrepreneurs,extra_device_cost,extra_entrepreneur_cost)
values
('Cliente','cliente',0,0,1,1,0,9.99,0),
('Emprendedor','emprendedor',9.99,99.99,3,3,0,7.99,0),
('Business','business',29.99,299.99,25,25,5,6.99,14.99)
on conflict(code) do update set
  monthly_price=excluded.monthly_price,
  annual_price=excluded.annual_price,
  max_devices=excluded.max_devices,
  max_clients=excluded.max_clients,
  max_entrepreneurs=excluded.max_entrepreneurs,
  extra_device_cost=excluded.extra_device_cost,
  extra_entrepreneur_cost=excluded.extra_entrepreneur_cost,
  updated_at=now();

-- Nota: los usuarios Auth se crean desde Authentication > Users o desde la app.
-- Luego podés completar public.profiles con el mismo UUID de auth.users.
select 'SALAMANDRA IOT PATCH V08 OK' as status;
