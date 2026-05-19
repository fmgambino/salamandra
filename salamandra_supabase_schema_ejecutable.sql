-- Salamandra IoT - Supabase SQL ejecutable, corregido y optimizado
-- Compatible con el esquema existente del usuario: profiles, places, devices, sensors, actuator_events.
-- Ejecutar completo en Supabase SQL Editor.

create extension if not exists pgcrypto;

-- =========================
-- Helpers
-- =========================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.is_superadmin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and lower(coalesce(p.role, '')) = 'superadmin'
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and lower(coalesce(p.role, '')) in ('superadmin','administrador','admin')
  );
$$;

-- =========================
-- Tablas base existentes / normalizadas
-- =========================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text,
  phone text,
  dni text,
  birth_date date,
  course text,
  division text,
  title_certificates text,
  avatar_url text,
  role text not null default 'emprendedor' check (role in ('superadmin','administrador','emprendedor','business')),
  status text not null default 'active' check (status in ('active','inactive','blocked','pending')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists phone text;
alter table public.profiles add column if not exists dni text;
alter table public.profiles add column if not exists birth_date date;
alter table public.profiles add column if not exists course text;
alter table public.profiles add column if not exists division text;
alter table public.profiles add column if not exists title_certificates text;
alter table public.profiles add column if not exists status text not null default 'active';
alter table public.profiles add column if not exists updated_at timestamptz default now();

do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'trg_profiles_updated_at') then
    create trigger trg_profiles_updated_at before update on public.profiles
    for each row execute function public.set_updated_at();
  end if;
end $$;

create table if not exists public.places (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  address text,
  lat numeric(10,7),
  lng numeric(10,7),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.places add column if not exists address text;
alter table public.places add column if not exists lat numeric(10,7);
alter table public.places add column if not exists lng numeric(10,7);
alter table public.places add column if not exists updated_at timestamptz default now();

do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'trg_places_updated_at') then
    create trigger trg_places_updated_at before update on public.places
    for each row execute function public.set_updated_at();
  end if;
end $$;

create table if not exists public.devices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  place_id uuid references public.places(id) on delete set null,
  esp_id text not null unique,
  name text not null,
  serial text not null,
  category text default 'generico',
  address text,
  lat numeric(10,7),
  lng numeric(10,7),
  broker_status text default 'offline' check (broker_status in ('online','offline','warning')),
  wifi_signal int default 0 check (wifi_signal between 0 and 100),
  is_online boolean default false,
  last_seen timestamptz,
  last_reset timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.devices add column if not exists lat numeric(10,7);
alter table public.devices add column if not exists lng numeric(10,7);
alter table public.devices add column if not exists broker_status text default 'offline';
alter table public.devices add column if not exists wifi_signal int default 0;
alter table public.devices add column if not exists is_online boolean default false;
alter table public.devices add column if not exists last_seen timestamptz;
alter table public.devices add column if not exists updated_at timestamptz default now();

do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'trg_devices_updated_at') then
    create trigger trg_devices_updated_at before update on public.devices
    for each row execute function public.set_updated_at();
  end if;
end $$;

create table if not exists public.sensors (
  id uuid primary key default gen_random_uuid(),
  device_id uuid references public.devices(id) on delete cascade,
  type text not null,
  name text not null,
  gpio text,
  esp_variable text,
  icon text default 'generic',
  unit text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.sensors add column if not exists unit text;
alter table public.sensors add column if not exists updated_at timestamptz default now();

do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'trg_sensors_updated_at') then
    create trigger trg_sensors_updated_at before update on public.sensors
    for each row execute function public.set_updated_at();
  end if;
end $$;

create table if not exists public.sensor_readings (
  id bigint generated always as identity primary key,
  sensor_id uuid references public.sensors(id) on delete cascade,
  device_id uuid references public.devices(id) on delete cascade,
  metric text not null,
  value numeric not null,
  unit text,
  created_at timestamptz default now()
);

create index if not exists idx_sensor_readings_sensor_time on public.sensor_readings(sensor_id, created_at desc);
create index if not exists idx_sensor_readings_device_time on public.sensor_readings(device_id, created_at desc);

create table if not exists public.actuators (
  id uuid primary key default gen_random_uuid(),
  device_id uuid references public.devices(id) on delete cascade,
  name text not null,
  gpio text,
  icon text default 'plug',
  state boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'trg_actuators_updated_at') then
    create trigger trg_actuators_updated_at before update on public.actuators
    for each row execute function public.set_updated_at();
  end if;
end $$;

create table if not exists public.actuator_events (
  id bigint generated always as identity primary key,
  device_id uuid references public.devices(id) on delete cascade,
  actuator_id uuid references public.actuators(id) on delete set null,
  actuator_name text,
  state boolean,
  source text default 'web',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now()
);

alter table public.actuator_events add column if not exists actuator_id uuid references public.actuators(id) on delete set null;
alter table public.actuator_events add column if not exists source text default 'web';
alter table public.actuator_events add column if not exists created_by uuid references auth.users(id) on delete set null;

create index if not exists idx_actuator_events_device_time on public.actuator_events(device_id, created_at desc);

-- =========================
-- SuperAdmin: soporte, inventario, planes, suscripciones, notificaciones
-- =========================
create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text not null unique,
  monthly_price numeric(10,2) default 0,
  annual_price numeric(10,2) default 0,
  max_devices int default 1,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'trg_plans_updated_at') then
    create trigger trg_plans_updated_at before update on public.plans
    for each row execute function public.set_updated_at();
  end if;
end $$;

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  plan_id uuid references public.plans(id) on delete set null,
  status text default 'active' check (status in ('active','trialing','past_due','canceled','inactive')),
  amount numeric(10,2) default 0,
  currency text default 'USD',
  starts_at timestamptz default now(),
  ends_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'trg_subscriptions_updated_at') then
    create trigger trg_subscriptions_updated_at before update on public.subscriptions
    for each row execute function public.set_updated_at();
  end if;
end $$;

create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  device_id uuid references public.devices(id) on delete set null,
  subject text not null,
  description text,
  priority text default 'media' check (priority in ('baja','media','alta','urgente')),
  status text default 'abierto' check (status in ('abierto','en_proceso','cerrado')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'trg_support_tickets_updated_at') then
    create trigger trg_support_tickets_updated_at before update on public.support_tickets
    for each row execute function public.set_updated_at();
  end if;
end $$;

create table if not exists public.inventory_items (
  id uuid primary key default gen_random_uuid(),
  sku text unique,
  name text not null,
  category text,
  stock int default 0,
  status text default 'disponible' check (status in ('disponible','reservado','agotado','baja')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'trg_inventory_items_updated_at') then
    create trigger trg_inventory_items_updated_at before update on public.inventory_items
    for each row execute function public.set_updated_at();
  end if;
end $$;

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  body text,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- =========================
-- Trigger perfil automático al crear auth.users
-- =========================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, role, status)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'emprendedor'),
    'active'
  )
  on conflict (id) do update set
    email = excluded.email,
    updated_at = now();
  return new;
end;
$$;

do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'on_auth_user_created') then
    create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user();
  end if;
end $$;

-- =========================
-- Datos iniciales demo no ligados a auth.users
-- =========================
insert into public.plans (name, code, monthly_price, annual_price, max_devices)
values
  ('Plan Emprendedor', 'emprendedor', 9.99, 99.99, 1),
  ('Plan Business', 'business', 29.99, 299.99, 5)
on conflict (code) do update set
  name = excluded.name,
  monthly_price = excluded.monthly_price,
  annual_price = excluded.annual_price,
  max_devices = excluded.max_devices;

insert into public.inventory_items (sku, name, category, stock, status)
values
  ('SNS-DHT22', 'Sensor DHT22', 'Sensores', 20, 'disponible'),
  ('SNS-MQ135', 'Sensor MQ135', 'Sensores', 15, 'disponible'),
  ('ACT-RELAY4', 'Relé 4 canales', 'Actuadores', 14, 'disponible'),
  ('KIT-ESP32-SAL', 'Kit Salamandra IoT ESP32', 'Kits', 8, 'disponible')
on conflict (sku) do update set
  name = excluded.name,
  category = excluded.category,
  stock = excluded.stock,
  status = excluded.status;

-- =========================
-- Vistas Dashboard
-- =========================
drop view if exists public.v_superadmin_dashboard cascade;
create view public.v_superadmin_dashboard as
select
  (select count(*) from public.profiles) as total_users,
  (select count(*) from public.subscriptions where status in ('active','trialing')) as total_subscribers,
  (select coalesce(sum(amount),0) from public.subscriptions where status in ('active','trialing')) as total_income,
  (select count(*) from public.devices where is_online) as online_devices,
  (select count(*) from public.devices) as total_devices,
  (select round(coalesce(avg(wifi_signal),0),0) from public.devices) as avg_wifi_signal,
  (select count(*) from public.support_tickets where status <> 'cerrado') as open_tickets,
  (select count(*) from public.inventory_items) as inventory_items;

create or replace view public.v_latest_support_tickets as
select id, subject, status, priority, created_at
from public.support_tickets
order by created_at desc
limit 10;

create or replace view public.v_latest_inventory_items as
select id, sku, name, category, stock, status, created_at
from public.inventory_items
order by created_at desc
limit 10;

create or replace view public.v_latest_devices as
select id, esp_id, name, serial, is_online, wifi_signal, created_at
from public.devices
order by created_at desc
limit 10;

-- =========================
-- RLS corregido: CREATE POLICY no soporta IF NOT EXISTS en Supabase/Postgres
-- =========================
alter table public.profiles enable row level security;
alter table public.places enable row level security;
alter table public.devices enable row level security;
alter table public.sensors enable row level security;
alter table public.sensor_readings enable row level security;
alter table public.actuators enable row level security;
alter table public.actuator_events enable row level security;
alter table public.plans enable row level security;
alter table public.subscriptions enable row level security;
alter table public.support_tickets enable row level security;
alter table public.inventory_items enable row level security;
alter table public.notifications enable row level security;

-- Limpieza segura de políticas para poder re-ejecutar este script
do $$
declare r record;
begin
  for r in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename in ('profiles','places','devices','sensors','sensor_readings','actuators','actuator_events','plans','subscriptions','support_tickets','inventory_items','notifications')
  loop
    execute format('drop policy if exists %I on %I.%I', r.policyname, r.schemaname, r.tablename);
  end loop;
end $$;

-- Profiles
create policy "profiles_select_self_or_admin" on public.profiles
for select to authenticated
using (id = auth.uid() or public.is_admin());

create policy "profiles_update_self_or_admin" on public.profiles
for update to authenticated
using (id = auth.uid() or public.is_admin())
with check (id = auth.uid() or public.is_admin());

create policy "profiles_insert_admin" on public.profiles
for insert to authenticated
with check (public.is_admin() or id = auth.uid());

create policy "profiles_delete_superadmin" on public.profiles
for delete to authenticated
using (public.is_superadmin());

-- Places
create policy "places_crud_owner_or_admin" on public.places
for all to authenticated
using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

-- Devices
create policy "devices_crud_owner_or_admin" on public.devices
for all to authenticated
using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

-- Sensors / readings / actuators: acceso por dueño del device o admin
create policy "sensors_crud_device_owner_or_admin" on public.sensors
for all to authenticated
using (public.is_admin() or exists (select 1 from public.devices d where d.id = sensors.device_id and d.user_id = auth.uid()))
with check (public.is_admin() or exists (select 1 from public.devices d where d.id = sensors.device_id and d.user_id = auth.uid()));

create policy "sensor_readings_select_device_owner_or_admin" on public.sensor_readings
for select to authenticated
using (public.is_admin() or exists (select 1 from public.devices d where d.id = sensor_readings.device_id and d.user_id = auth.uid()));

create policy "sensor_readings_insert_device_owner_or_admin" on public.sensor_readings
for insert to authenticated
with check (public.is_admin() or exists (select 1 from public.devices d where d.id = sensor_readings.device_id and d.user_id = auth.uid()));

create policy "actuators_crud_device_owner_or_admin" on public.actuators
for all to authenticated
using (public.is_admin() or exists (select 1 from public.devices d where d.id = actuators.device_id and d.user_id = auth.uid()))
with check (public.is_admin() or exists (select 1 from public.devices d where d.id = actuators.device_id and d.user_id = auth.uid()));

create policy "actuator_events_crud_device_owner_or_admin" on public.actuator_events
for all to authenticated
using (public.is_admin() or exists (select 1 from public.devices d where d.id = actuator_events.device_id and d.user_id = auth.uid()))
with check (public.is_admin() or exists (select 1 from public.devices d where d.id = actuator_events.device_id and d.user_id = auth.uid()));

-- Plans / inventory: todos leen, admin modifica
create policy "plans_select_authenticated" on public.plans
for select to authenticated using (true);
create policy "plans_write_admin" on public.plans
for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "inventory_select_authenticated" on public.inventory_items
for select to authenticated using (true);
create policy "inventory_write_admin" on public.inventory_items
for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Subscriptions
create policy "subscriptions_select_self_or_admin" on public.subscriptions
for select to authenticated
using (user_id = auth.uid() or public.is_admin());
create policy "subscriptions_write_admin" on public.subscriptions
for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Tickets
create policy "tickets_select_self_or_admin" on public.support_tickets
for select to authenticated
using (user_id = auth.uid() or public.is_admin());
create policy "tickets_insert_self_or_admin" on public.support_tickets
for insert to authenticated
with check (user_id = auth.uid() or public.is_admin());
create policy "tickets_update_self_or_admin" on public.support_tickets
for update to authenticated
using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());
create policy "tickets_delete_admin" on public.support_tickets
for delete to authenticated
using (public.is_admin());

-- Notifications
create policy "notifications_select_self_or_admin" on public.notifications
for select to authenticated
using (user_id = auth.uid() or public.is_admin());
create policy "notifications_update_self_or_admin" on public.notifications
for update to authenticated
using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());
create policy "notifications_insert_admin" on public.notifications
for insert to authenticated
with check (public.is_admin());

-- Permisos para API Supabase
 grant usage on schema public to anon, authenticated;
 grant select on public.v_superadmin_dashboard to authenticated;
 grant select on public.v_latest_support_tickets to authenticated;
 grant select on public.v_latest_inventory_items to authenticated;
 grant select on public.v_latest_devices to authenticated;
 grant all on all tables in schema public to authenticated;
 grant usage, select on all sequences in schema public to authenticated;

-- Fin.
