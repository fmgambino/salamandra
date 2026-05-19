-- Salamandra IoT v04 - SQL EJECUTABLE para Supabase
-- Ejecutar completo en SQL Editor. No usa CREATE POLICY IF NOT EXISTS porque PostgreSQL no lo soporta.

create extension if not exists pgcrypto;

-- Limpieza opcional de políticas para re-ejecutar sin errores
DO $$
DECLARE r record;
BEGIN
  FOR r IN SELECT schemaname, tablename, policyname FROM pg_policies WHERE schemaname='public' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
  END LOOP;
END $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  avatar_url text,
  role text not null default 'cliente' check (role in ('superadmin','admin','business','emprendedor','cliente')),
  parent_id uuid references public.profiles(id) on delete set null,
  email text,
  phone text,
  dni text,
  birth_date date,
  status text not null default 'active' check (status in ('active','inactive','suspended')),
  plan_type text default 'mensual' check (plan_type in ('mensual','anual','sistema')),
  clients_limit int default 0,
  entrepreneurs_limit int default 0,
  clients_per_entrepreneur_limit int default 0,
  device_per_client_limit int default 1,
  extra_device_cost numeric(10,2) default 0,
  extra_entrepreneur_cost numeric(10,2) default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.places (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  address text,
  lat numeric,
  lng numeric,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text not null unique,
  monthly_price numeric(10,2) default 0,
  annual_price numeric(10,2) default 0,
  max_devices integer default 1,
  max_clients integer default 0,
  max_entrepreneurs integer default 0,
  extra_device_cost numeric(10,2) default 0,
  extra_entrepreneur_cost numeric(10,2) default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  plan_id uuid references public.plans(id),
  status text default 'active' check (status in ('active','trialing','past_due','canceled','inactive')),
  billing_period text default 'mensual' check (billing_period in ('mensual','anual')),
  amount numeric(10,2) default 0,
  currency text default 'USD',
  starts_at timestamptz default now(),
  ends_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.devices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  owner_profile_id uuid references public.profiles(id) on delete set null,
  place_id uuid references public.places(id) on delete set null,
  esp_id text not null unique,
  name text not null,
  serial text not null,
  category text default 'plug',
  address text,
  lat numeric,
  lng numeric,
  broker_status text default 'offline',
  wifi_status text default 'desconectado',
  wifi_network text,
  wifi_ssid text,
  wifi_signal integer default 0,
  wifi_rssi text,
  ip_address inet,
  camera_url text,
  is_online boolean default false,
  last_reset timestamptz,
  last_seen timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.sensors (
  id uuid primary key default gen_random_uuid(),
  device_id uuid references public.devices(id) on delete cascade,
  type text not null,
  name text not null,
  gpio text,
  esp_variable text,
  icon text default 'info',
  unit text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

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
create index if not exists idx_actuator_events_actuator_time on public.actuator_events(actuator_id, created_at desc);

create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  device_id uuid references public.devices(id) on delete set null,
  subject text not null,
  description text,
  priority text default 'media' check (priority in ('baja','media','alta','urgente')),
  status text default 'abierto' check (status in ('abierto','en_proceso','cerrado')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.inventory_items (
  id uuid primary key default gen_random_uuid(),
  sku text unique,
  name text not null,
  category text,
  stock integer default 0,
  min_stock integer default 0,
  status text default 'disponible' check (status in ('disponible','reservado','agotado','baja','stock_bajo')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  body text,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- Función para crear/actualizar perfil desde Auth
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles(id,email,name,role)
  values(new.id,new.email,coalesce(new.raw_user_meta_data->>'name', split_part(new.email,'@',1)), coalesce(new.raw_user_meta_data->>'role','cliente'))
  on conflict(id) do update set email=excluded.email, updated_at=now();
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- Vistas Dashboard
drop view if exists public.v_superadmin_dashboard cascade;
create view public.v_superadmin_dashboard as
select
 (select count(*) from public.profiles) as total_users,
 (select count(*) from public.profiles where role='cliente') as total_clients,
 (select count(*) from public.profiles where role='emprendedor') as total_entrepreneurs,
 (select count(*) from public.subscriptions where status in ('active','trialing')) as total_subscribers,
 (select coalesce(sum(amount),0) from public.subscriptions where status in ('active','trialing')) as total_income,
 (select count(*) from public.devices where is_online) as online_devices,
 (select count(*) from public.devices) as total_devices,
 (select coalesce(round(avg(wifi_signal)),0) from public.devices) as avg_wifi_signal,
 (select count(*) from public.support_tickets where status <> 'cerrado') as open_tickets,
 (select count(*) from public.inventory_items) as inventory_items;

-- Storage para avatars
insert into storage.buckets (id, name, public)
values ('avatars','avatars',true)
on conflict (id) do update set public=true;

alter table public.profiles enable row level security;
alter table public.places enable row level security;
alter table public.plans enable row level security;
alter table public.subscriptions enable row level security;
alter table public.devices enable row level security;
alter table public.sensors enable row level security;
alter table public.sensor_readings enable row level security;
alter table public.actuators enable row level security;
alter table public.actuator_events enable row level security;
alter table public.support_tickets enable row level security;
alter table public.inventory_items enable row level security;
alter table public.notifications enable row level security;

-- Políticas iniciales de desarrollo: autenticado puede leer; dueño gestiona sus datos; admin/superadmin gestiona todo.
create policy profiles_read on public.profiles for select to authenticated using (true);
create policy profiles_update_self on public.profiles for update to authenticated using (auth.uid()=id) with check (auth.uid()=id);
create policy profiles_admin_all on public.profiles for all to authenticated using (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role in ('superadmin','admin'))) with check (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role in ('superadmin','admin')));

create policy plans_read on public.plans for select to authenticated using (true);
create policy subscriptions_read on public.subscriptions for select to authenticated using (true);

create policy places_owner_all on public.places for all to authenticated using (user_id=auth.uid() or exists(select 1 from public.profiles p where p.id=auth.uid() and p.role in ('superadmin','admin'))) with check (user_id=auth.uid() or exists(select 1 from public.profiles p where p.id=auth.uid() and p.role in ('superadmin','admin')));
create policy devices_owner_all on public.devices for all to authenticated using (user_id=auth.uid() or owner_profile_id=auth.uid() or exists(select 1 from public.profiles p where p.id=auth.uid() and p.role in ('superadmin','admin','business','emprendedor'))) with check (user_id=auth.uid() or owner_profile_id=auth.uid() or exists(select 1 from public.profiles p where p.id=auth.uid() and p.role in ('superadmin','admin','business','emprendedor')));
create policy sensors_device_read on public.sensors for select to authenticated using (true);
create policy sensors_device_write on public.sensors for all to authenticated using (true) with check (true);
create policy readings_read on public.sensor_readings for select to authenticated using (true);
create policy readings_insert on public.sensor_readings for insert to authenticated with check (true);
create policy actuators_read on public.actuators for select to authenticated using (true);
create policy actuators_write on public.actuators for all to authenticated using (true) with check (true);
create policy actuator_events_read on public.actuator_events for select to authenticated using (true);
create policy actuator_events_insert on public.actuator_events for insert to authenticated with check (true);
create policy tickets_all on public.support_tickets for all to authenticated using (user_id=auth.uid() or exists(select 1 from public.profiles p where p.id=auth.uid() and p.role in ('superadmin','admin','business','emprendedor'))) with check (user_id=auth.uid() or exists(select 1 from public.profiles p where p.id=auth.uid() and p.role in ('superadmin','admin','business','emprendedor')));
create policy inventory_read on public.inventory_items for select to authenticated using (true);
create policy inventory_admin on public.inventory_items for all to authenticated using (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role in ('superadmin','admin'))) with check (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role in ('superadmin','admin')));
create policy notifications_owner on public.notifications for all to authenticated using (user_id=auth.uid()) with check (user_id=auth.uid());

-- Storage policies
create policy avatars_read on storage.objects for select to public using (bucket_id='avatars');
create policy avatars_insert on storage.objects for insert to authenticated with check (bucket_id='avatars' and (storage.foldername(name))[1]=auth.uid()::text);
create policy avatars_update on storage.objects for update to authenticated using (bucket_id='avatars' and (storage.foldername(name))[1]=auth.uid()::text) with check (bucket_id='avatars' and (storage.foldername(name))[1]=auth.uid()::text);

-- Datos base
insert into public.plans(name,code,monthly_price,annual_price,max_devices,max_clients,max_entrepreneurs,extra_device_cost,extra_entrepreneur_cost) values
('Cliente','cliente',0,0,1,1,0,9.99,0),
('Emprendedor','emprendedor',9.99,99.99,3,3,0,7.99,0),
('Business','business',29.99,299.99,25,25,5,6.99,14.99)
on conflict(code) do update set monthly_price=excluded.monthly_price, annual_price=excluded.annual_price, updated_at=now();
