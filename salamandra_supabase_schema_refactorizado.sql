-- Salamandra IoT - Supabase SQL Schema Refactorizado
-- Ejecutar completo en Supabase SQL Editor.
-- Incluye tablas, índices, triggers, RLS, políticas sin usar CREATE POLICY IF NOT EXISTS.

create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";

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
    select 1 from public.user_profiles
    where auth_user_id = auth.uid()
      and role_code = 'superadmin'
      and status = 'active'
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
    select 1 from public.user_profiles
    where auth_user_id = auth.uid()
      and role_code in ('superadmin','admin')
      and status = 'active'
  );
$$;

-- =========================
-- Catálogos
-- =========================
create table if not exists public.roles (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  description text,
  is_system boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.permissions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  module text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.role_permissions (
  role_id uuid not null references public.roles(id) on delete cascade,
  permission_id uuid not null references public.permissions(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (role_id, permission_id)
);

create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  description text,
  max_devices int not null default 1,
  monthly_price numeric(12,2) not null default 0,
  annual_price numeric(12,2) not null default 0,
  currency text not null default 'USD',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================
-- Usuarios / Suscripciones
-- =========================
create table if not exists public.user_profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete set null,
  full_name text not null,
  email text not null unique,
  phone text,
  dni text,
  birth_date date,
  avatar_url text,
  role_code text not null references public.roles(code) default 'emprendedor',
  status text not null default 'active' check (status in ('active','inactive','blocked','pending')),
  business_name text,
  tax_id text,
  address text,
  city text,
  province text,
  country text default 'Argentina',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  plan_id uuid not null references public.plans(id),
  status text not null default 'active' check (status in ('active','trialing','past_due','cancelled','expired')),
  billing_period text not null default 'monthly' check (billing_period in ('monthly','annual')),
  amount numeric(12,2) not null default 0,
  currency text not null default 'USD',
  started_at timestamptz not null default now(),
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================
-- IoT
-- =========================
create table if not exists public.locations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  name text not null,
  address text,
  lat numeric(10,7),
  lng numeric(10,7),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.devices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  location_id uuid references public.locations(id) on delete set null,
  device_uid text not null unique,
  serial_number text not null unique,
  name text not null,
  category text not null default 'Generico',
  icon text,
  mac_address text,
  firmware_version text,
  ip_address inet,
  mqtt_topic text,
  is_online boolean not null default false,
  wifi_signal int default 0 check (wifi_signal between 0 and 100),
  last_seen_at timestamptz,
  last_reset_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sensor_types (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  default_unit text,
  icon_key text,
  fields jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.sensors (
  id uuid primary key default gen_random_uuid(),
  device_id uuid not null references public.devices(id) on delete cascade,
  sensor_type_id uuid references public.sensor_types(id),
  name text not null,
  gpio text,
  esp_variable text,
  icon_key text,
  unit text,
  config jsonb not null default '{}'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sensor_readings (
  id bigint generated by default as identity primary key,
  sensor_id uuid not null references public.sensors(id) on delete cascade,
  device_id uuid not null references public.devices(id) on delete cascade,
  field_key text not null default 'value',
  value numeric(14,4) not null,
  unit text,
  recorded_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.actuators (
  id uuid primary key default gen_random_uuid(),
  device_id uuid not null references public.devices(id) on delete cascade,
  name text not null,
  gpio text,
  esp_variable text,
  icon_key text,
  state boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.actuator_events (
  id bigint generated by default as identity primary key,
  actuator_id uuid not null references public.actuators(id) on delete cascade,
  device_id uuid not null references public.devices(id) on delete cascade,
  user_id uuid references public.user_profiles(id) on delete set null,
  previous_state boolean,
  new_state boolean not null,
  source text not null default 'pwa' check (source in ('pwa','esp32','automation','system')),
  note text,
  recorded_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.device_events (
  id bigint generated by default as identity primary key,
  device_id uuid not null references public.devices(id) on delete cascade,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  recorded_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- =========================
-- Soporte / Inventario / Notificaciones
-- =========================
create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.user_profiles(id) on delete set null,
  device_id uuid references public.devices(id) on delete set null,
  subject text not null,
  description text,
  status text not null default 'open' check (status in ('open','in_progress','closed','cancelled')),
  priority text not null default 'medium' check (priority in ('low','medium','high','urgent')),
  assigned_to uuid references public.user_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.inventory_items (
  id uuid primary key default gen_random_uuid(),
  sku text not null unique,
  name text not null,
  category text,
  description text,
  stock int not null default 0,
  min_stock int not null default 0,
  unit_cost numeric(12,2) default 0,
  currency text not null default 'USD',
  status text not null default 'available' check (status in ('available','reserved','sold','maintenance','inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.user_profiles(id) on delete cascade,
  title text not null,
  body text,
  type text default 'info',
  read_at timestamptz,
  created_at timestamptz not null default now()
);

-- =========================
-- Índices
-- =========================
create index if not exists idx_user_profiles_role on public.user_profiles(role_code);
create index if not exists idx_user_profiles_email on public.user_profiles(email);
create index if not exists idx_subscriptions_user on public.subscriptions(user_id);
create index if not exists idx_locations_user on public.locations(user_id);
create index if not exists idx_devices_user on public.devices(user_id);
create index if not exists idx_devices_location on public.devices(location_id);
create index if not exists idx_sensor_readings_sensor_time on public.sensor_readings(sensor_id, recorded_at desc);
create index if not exists idx_sensor_readings_device_time on public.sensor_readings(device_id, recorded_at desc);
create index if not exists idx_actuator_events_actuator_time on public.actuator_events(actuator_id, recorded_at desc);
create index if not exists idx_device_events_device_time on public.device_events(device_id, recorded_at desc);
create index if not exists idx_support_tickets_user on public.support_tickets(user_id);
create index if not exists idx_support_tickets_status on public.support_tickets(status);

-- =========================
-- Triggers updated_at
-- =========================
do $$
declare t text;
begin
  foreach t in array array[
    'roles','plans','user_profiles','subscriptions','locations','devices',
    'sensors','actuators','support_tickets','inventory_items'
  ] loop
    execute format('drop trigger if exists trg_%I_updated_at on public.%I', t, t);
    execute format('create trigger trg_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()', t, t);
  end loop;
end $$;

-- =========================
-- Seeds básicos
-- =========================
insert into public.roles (code, name, description, is_system) values
('superadmin','SuperAdmin','Control total de la plataforma', true),
('admin','Administrador','Administración operativa', true),
('emprendedor','Emprendedor','Cliente plan emprendedor', true),
('business','Business','Cliente plan business', true)
on conflict (code) do update set name = excluded.name, description = excluded.description, is_system = excluded.is_system;

insert into public.plans (code, name, description, max_devices, monthly_price, annual_price, currency) values
('emprendedor','Plan Emprendedor','Un dispositivo Salamandra IoT basado en ESP32',1,9.99,99.99,'USD'),
('business','Plan Business','Hasta 5 dispositivos Salamandra IoT basados en ESP32',5,19.99,199.99,'USD')
on conflict (code) do update set name=excluded.name, description=excluded.description, max_devices=excluded.max_devices, monthly_price=excluded.monthly_price, annual_price=excluded.annual_price;

insert into public.sensor_types (code, name, default_unit, icon_key, fields) values
('dht11','DHT11','°C/%','thermometer','[{"key":"temperature","label":"Temp","unit":"°C"},{"key":"humidity","label":"Hum","unit":"%"}]'),
('dht22','DHT22','°C/%','thermometer','[{"key":"temperature","label":"Temp","unit":"°C"},{"key":"humidity","label":"Hum","unit":"%"}]'),
('mq135','MQ135','ppm','gas','[{"key":"co2","label":"CO₂","unit":"ppm"},{"key":"methane","label":"Metano","unit":"ppm"},{"key":"butane","label":"Butano","unit":"ppm"},{"key":"propane","label":"Propano","unit":"ppm"}]'),
('ph','pH','pH','ph','[{"key":"ph","label":"pH","unit":"pH"}]'),
('ec','Conductividad EC','µS/cm','bolt','[{"key":"ec","label":"EC","unit":"µS/cm"}]'),
('level','Nivel','%','droplet','[{"key":"level","label":"Nivel","unit":"%"}]'),
('soil_humidity','Hum. Suelo','%','sprout','[{"key":"humidity","label":"Humedad","unit":"%"}]'),
('generic','Genérico','','circle','[{"key":"value","label":"Valor","unit":""}]')
on conflict (code) do update set name=excluded.name, default_unit=excluded.default_unit, icon_key=excluded.icon_key, fields=excluded.fields;

insert into public.inventory_items (sku, name, category, stock, min_stock, unit_cost) values
('ACT-RELAY4','Relé 4 canales','Actuadores',14,3,8.50),
('SNS-MQ135','Sensor MQ135','Sensores',22,5,6.20),
('SNS-DHT22','Sensor DHT22','Sensores',18,5,4.90),
('KIT-ESP32-SAL','Kit Salamandra ESP32','Kits',7,2,24.00)
on conflict (sku) do update set name=excluded.name, category=excluded.category, stock=excluded.stock, min_stock=excluded.min_stock, unit_cost=excluded.unit_cost;

-- Usuarios demo para la PWA en modo simulado.
-- Para vincularlos a Auth real: crear usuarios en Supabase Auth y actualizar auth_user_id.
insert into public.user_profiles (full_name,email,role_code,status,phone,dni,business_name) values
('Super Admin Demo','superadmin@salamandra.local','superadmin','active','3810000001','10000001','Salamandra IoT'),
('Admin Demo','admin@salamandra.local','admin','active','3810000002','10000002','Salamandra IoT'),
('Emprendedor Demo','emprendedor@salamandra.local','emprendedor','active','3810000003','10000003','Huerta Norte'),
('Business Demo','business@salamandra.local','business','active','3810000004','10000004','Green Business')
on conflict (email) do update set full_name=excluded.full_name, role_code=excluded.role_code, status=excluded.status, business_name=excluded.business_name;

-- =========================
-- RLS
-- =========================
alter table public.roles enable row level security;
alter table public.permissions enable row level security;
alter table public.role_permissions enable row level security;
alter table public.plans enable row level security;
alter table public.user_profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.locations enable row level security;
alter table public.devices enable row level security;
alter table public.sensor_types enable row level security;
alter table public.sensors enable row level security;
alter table public.sensor_readings enable row level security;
alter table public.actuators enable row level security;
alter table public.actuator_events enable row level security;
alter table public.device_events enable row level security;
alter table public.support_tickets enable row level security;
alter table public.inventory_items enable row level security;
alter table public.notifications enable row level security;

-- Quitar políticas anteriores para evitar conflictos
DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN (
        'roles','permissions','role_permissions','plans','user_profiles','subscriptions','locations','devices',
        'sensor_types','sensors','sensor_readings','actuators','actuator_events','device_events',
        'support_tickets','inventory_items','notifications'
      )
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
  END LOOP;
END $$;

-- Lectura catálogos para autenticados
create policy roles_select_auth on public.roles for select to authenticated using (true);
create policy permissions_select_admin on public.permissions for select to authenticated using (public.is_admin());
create policy role_permissions_select_admin on public.role_permissions for select to authenticated using (public.is_admin());
create policy plans_select_auth on public.plans for select to authenticated using (true);
create policy sensor_types_select_auth on public.sensor_types for select to authenticated using (true);

-- Gestión catálogos solo SuperAdmin
create policy roles_all_superadmin on public.roles for all to authenticated using (public.is_superadmin()) with check (public.is_superadmin());
create policy permissions_all_superadmin on public.permissions for all to authenticated using (public.is_superadmin()) with check (public.is_superadmin());
create policy role_permissions_all_superadmin on public.role_permissions for all to authenticated using (public.is_superadmin()) with check (public.is_superadmin());
create policy plans_all_superadmin on public.plans for all to authenticated using (public.is_superadmin()) with check (public.is_superadmin());
create policy sensor_types_all_admin on public.sensor_types for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Perfiles
create policy profiles_select_own_or_admin on public.user_profiles
for select to authenticated
using (public.is_admin() or auth_user_id = auth.uid());

create policy profiles_update_own_or_admin on public.user_profiles
for update to authenticated
using (public.is_admin() or auth_user_id = auth.uid())
with check (public.is_admin() or auth_user_id = auth.uid());

create policy profiles_insert_admin on public.user_profiles
for insert to authenticated
with check (public.is_admin());

create policy profiles_delete_superadmin on public.user_profiles
for delete to authenticated
using (public.is_superadmin());

-- Suscripciones
create policy subscriptions_select_own_or_admin on public.subscriptions
for select to authenticated
using (public.is_admin() or user_id in (select id from public.user_profiles where auth_user_id = auth.uid()));
create policy subscriptions_all_admin on public.subscriptions
for all to authenticated
using (public.is_admin()) with check (public.is_admin());

-- Locations
create policy locations_select_own_or_admin on public.locations
for select to authenticated
using (public.is_admin() or user_id in (select id from public.user_profiles where auth_user_id = auth.uid()));
create policy locations_all_own_or_admin on public.locations
for all to authenticated
using (public.is_admin() or user_id in (select id from public.user_profiles where auth_user_id = auth.uid()))
with check (public.is_admin() or user_id in (select id from public.user_profiles where auth_user_id = auth.uid()));

-- Devices
create policy devices_select_own_or_admin on public.devices
for select to authenticated
using (public.is_admin() or user_id in (select id from public.user_profiles where auth_user_id = auth.uid()));
create policy devices_all_own_or_admin on public.devices
for all to authenticated
using (public.is_admin() or user_id in (select id from public.user_profiles where auth_user_id = auth.uid()))
with check (public.is_admin() or user_id in (select id from public.user_profiles where auth_user_id = auth.uid()));

-- Sensors / Readings / Actuators por device del usuario
create policy sensors_select_own_or_admin on public.sensors
for select to authenticated
using (public.is_admin() or device_id in (select id from public.devices where user_id in (select id from public.user_profiles where auth_user_id = auth.uid())));
create policy sensors_all_own_or_admin on public.sensors
for all to authenticated
using (public.is_admin() or device_id in (select id from public.devices where user_id in (select id from public.user_profiles where auth_user_id = auth.uid())))
with check (public.is_admin() or device_id in (select id from public.devices where user_id in (select id from public.user_profiles where auth_user_id = auth.uid())));

create policy readings_select_own_or_admin on public.sensor_readings
for select to authenticated
using (public.is_admin() or device_id in (select id from public.devices where user_id in (select id from public.user_profiles where auth_user_id = auth.uid())));
create policy readings_insert_own_or_admin on public.sensor_readings
for insert to authenticated
with check (public.is_admin() or device_id in (select id from public.devices where user_id in (select id from public.user_profiles where auth_user_id = auth.uid())));

create policy actuators_select_own_or_admin on public.actuators
for select to authenticated
using (public.is_admin() or device_id in (select id from public.devices where user_id in (select id from public.user_profiles where auth_user_id = auth.uid())));
create policy actuators_all_own_or_admin on public.actuators
for all to authenticated
using (public.is_admin() or device_id in (select id from public.devices where user_id in (select id from public.user_profiles where auth_user_id = auth.uid())))
with check (public.is_admin() or device_id in (select id from public.devices where user_id in (select id from public.user_profiles where auth_user_id = auth.uid())));

create policy actuator_events_select_own_or_admin on public.actuator_events
for select to authenticated
using (public.is_admin() or device_id in (select id from public.devices where user_id in (select id from public.user_profiles where auth_user_id = auth.uid())));
create policy actuator_events_insert_own_or_admin on public.actuator_events
for insert to authenticated
with check (public.is_admin() or device_id in (select id from public.devices where user_id in (select id from public.user_profiles where auth_user_id = auth.uid())));

create policy device_events_select_own_or_admin on public.device_events
for select to authenticated
using (public.is_admin() or device_id in (select id from public.devices where user_id in (select id from public.user_profiles where auth_user_id = auth.uid())));
create policy device_events_insert_own_or_admin on public.device_events
for insert to authenticated
with check (public.is_admin() or device_id in (select id from public.devices where user_id in (select id from public.user_profiles where auth_user_id = auth.uid())));

-- Soporte
create policy tickets_select_own_or_admin on public.support_tickets
for select to authenticated
using (public.is_admin() or user_id in (select id from public.user_profiles where auth_user_id = auth.uid()));
create policy tickets_all_own_or_admin on public.support_tickets
for all to authenticated
using (public.is_admin() or user_id in (select id from public.user_profiles where auth_user_id = auth.uid()))
with check (public.is_admin() or user_id in (select id from public.user_profiles where auth_user_id = auth.uid()));

-- Inventario solo admin/superadmin
create policy inventory_select_admin on public.inventory_items for select to authenticated using (public.is_admin());
create policy inventory_all_admin on public.inventory_items for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Notificaciones
create policy notifications_select_own_or_admin on public.notifications
for select to authenticated
using (public.is_admin() or user_id in (select id from public.user_profiles where auth_user_id = auth.uid()));
create policy notifications_all_own_or_admin on public.notifications
for all to authenticated
using (public.is_admin() or user_id in (select id from public.user_profiles where auth_user_id = auth.uid()))
with check (public.is_admin() or user_id in (select id from public.user_profiles where auth_user_id = auth.uid()));

-- =========================
-- Vistas Dashboard SuperAdmin
-- =========================
create or replace view public.v_superadmin_dashboard as
select
  (select count(*) from public.user_profiles) as total_users,
  (select count(*) from public.subscriptions where status in ('active','trialing')) as total_subscribers,
  (select coalesce(sum(amount),0) from public.subscriptions where status in ('active','trialing')) as total_income,
  (select count(*) from public.devices where is_online) as online_devices,
  (select count(*) from public.devices) as total_devices,
  (select round(coalesce(avg(wifi_signal),0),0) from public.devices) as avg_wifi_signal,
  (select count(*) from public.support_tickets where status <> 'closed') as open_tickets,
  (select count(*) from public.inventory_items) as inventory_items;

