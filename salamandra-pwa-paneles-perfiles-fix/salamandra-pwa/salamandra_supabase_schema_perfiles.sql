-- Salamandra IoT - Schema ejecutable refactor perfiles jerárquicos
-- Ejecutar completo en Supabase SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  parent_id uuid references public.profiles(id) on delete set null,
  name text not null,
  email text,
  avatar_url text,
  role text not null default 'emprendedor' check (role in ('superadmin','admin','business','emprendedor','cliente')),
  status text not null default 'active' check (status in ('active','pending','blocked','inactive')),
  phone text,
  dni text,
  plan_code text,
  clients_limit int default 0,
  entrepreneurs_limit int default 0,
  clients_per_entrepreneur_limit int default 0,
  devices_per_client_limit int default 1,
  extra_device_cost numeric(10,2) default 0,
  extra_entrepreneur_cost numeric(10,2) default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  monthly_price numeric(10,2) default 0,
  annual_price numeric(10,2) default 0,
  role_target text check (role_target in ('business','emprendedor')),
  clients_limit int default 0,
  entrepreneurs_limit int default 0,
  clients_per_entrepreneur_limit int default 0,
  devices_per_client_limit int default 1,
  extra_device_cost numeric(10,2) default 0,
  extra_entrepreneur_cost numeric(10,2) default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  plan_id uuid references public.plans(id),
  status text default 'active' check (status in ('active','trialing','past_due','canceled','inactive')),
  amount numeric(10,2) default 0,
  currency text default 'USD',
  starts_at timestamptz default now(),
  ends_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.places (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  name text not null,
  address text,
  lat numeric,
  lng numeric,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.devices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  place_id uuid references public.places(id) on delete set null,
  esp_id text unique not null,
  name text not null,
  serial text not null,
  category text default 'device',
  address text,
  lat numeric,
  lng numeric,
  last_reset timestamptz,
  broker_status text default 'offline',
  wifi_signal int default 0,
  is_online boolean default false,
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
  icon text default 'sensor',
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
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now()
);

create table if not exists public.extra_charges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  charged_by uuid references public.profiles(id) on delete set null,
  charge_type text not null check (charge_type in ('extra_device','extra_entrepreneur','extra_client')),
  reference_id uuid,
  description text,
  amount numeric(10,2) not null default 0,
  currency text default 'USD',
  status text default 'pending' check (status in ('pending','paid','canceled')),
  created_at timestamptz default now()
);

create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
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
  stock int default 0,
  min_stock int default 0,
  status text default 'disponible' check (status in ('disponible','reservado','agotado','baja')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  body text,
  is_read boolean default false,
  created_at timestamptz default now()
);

create or replace function public.is_superadmin() returns boolean language sql stable as $$
  select exists(select 1 from public.profiles where id = auth.uid() and role = 'superadmin');
$$;
create or replace function public.is_admin() returns boolean language sql stable as $$
  select exists(select 1 from public.profiles where id = auth.uid() and role in ('superadmin','admin'));
$$;

drop view if exists public.v_superadmin_dashboard cascade;
create view public.v_superadmin_dashboard as
select
  (select count(*) from public.profiles) total_users,
  (select count(*) from public.subscriptions where status in ('active','trialing')) total_subscribers,
  (select coalesce(sum(amount),0) from public.subscriptions where status in ('active','trialing')) +
  (select coalesce(sum(amount),0) from public.extra_charges where status in ('paid','pending')) total_income,
  (select count(*) from public.devices where is_online) online_devices,
  (select count(*) from public.devices) total_devices,
  (select round(coalesce(avg(wifi_signal),0)) from public.devices) avg_wifi_signal,
  (select count(*) from public.support_tickets where status <> 'cerrado') open_tickets,
  (select count(*) from public.inventory_items) inventory_items;

insert into public.plans(code,name,monthly_price,annual_price,role_target,clients_limit,entrepreneurs_limit,clients_per_entrepreneur_limit,devices_per_client_limit,extra_device_cost,extra_entrepreneur_cost)
values
 ('emprendedor','Plan Emprendedor',9.99,99.99,'emprendedor',3,0,0,1,7.99,0),
 ('business','Plan Business',29.99,299.99,'business',0,5,5,1,6.99,14.99)
on conflict (code) do update set
 name=excluded.name, monthly_price=excluded.monthly_price, annual_price=excluded.annual_price,
 clients_limit=excluded.clients_limit, entrepreneurs_limit=excluded.entrepreneurs_limit,
 clients_per_entrepreneur_limit=excluded.clients_per_entrepreneur_limit,
 devices_per_client_limit=excluded.devices_per_client_limit,
 extra_device_cost=excluded.extra_device_cost, extra_entrepreneur_cost=excluded.extra_entrepreneur_cost;

alter table public.profiles enable row level security;
alter table public.plans enable row level security;
alter table public.subscriptions enable row level security;
alter table public.places enable row level security;
alter table public.devices enable row level security;
alter table public.sensors enable row level security;
alter table public.sensor_readings enable row level security;
alter table public.actuators enable row level security;
alter table public.actuator_events enable row level security;
alter table public.extra_charges enable row level security;
alter table public.support_tickets enable row level security;
alter table public.inventory_items enable row level security;
alter table public.notifications enable row level security;

drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles for select to authenticated using (id = auth.uid() or parent_id = auth.uid() or public.is_admin());
drop policy if exists profiles_insert on public.profiles;
create policy profiles_insert on public.profiles for insert to authenticated with check (public.is_admin() or parent_id = auth.uid());
drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles for update to authenticated using (id = auth.uid() or parent_id = auth.uid() or public.is_admin()) with check (id = auth.uid() or parent_id = auth.uid() or public.is_admin());

drop policy if exists read_plans on public.plans;
create policy read_plans on public.plans for select to authenticated using (true);

drop policy if exists own_devices on public.devices;
create policy own_devices on public.devices for all to authenticated using (user_id = auth.uid() or public.is_admin()) with check (user_id = auth.uid() or public.is_admin());

drop policy if exists own_places on public.places;
create policy own_places on public.places for all to authenticated using (user_id = auth.uid() or public.is_admin()) with check (user_id = auth.uid() or public.is_admin());

drop policy if exists read_related_sensors on public.sensors;
create policy read_related_sensors on public.sensors for all to authenticated using (exists(select 1 from public.devices d where d.id=device_id and (d.user_id=auth.uid() or public.is_admin()))) with check (exists(select 1 from public.devices d where d.id=device_id and (d.user_id=auth.uid() or public.is_admin())));

drop policy if exists read_related_readings on public.sensor_readings;
create policy read_related_readings on public.sensor_readings for all to authenticated using (exists(select 1 from public.devices d where d.id=device_id and (d.user_id=auth.uid() or public.is_admin()))) with check (exists(select 1 from public.devices d where d.id=device_id and (d.user_id=auth.uid() or public.is_admin())));

drop policy if exists related_actuators on public.actuators;
create policy related_actuators on public.actuators for all to authenticated using (exists(select 1 from public.devices d where d.id=device_id and (d.user_id=auth.uid() or public.is_admin()))) with check (exists(select 1 from public.devices d where d.id=device_id and (d.user_id=auth.uid() or public.is_admin())));

drop policy if exists related_actuator_events on public.actuator_events;
create policy related_actuator_events on public.actuator_events for all to authenticated using (created_by=auth.uid() or public.is_admin() or exists(select 1 from public.devices d where d.id=device_id and d.user_id=auth.uid())) with check (created_by=auth.uid() or public.is_admin());

drop policy if exists read_subscriptions on public.subscriptions;
create policy read_subscriptions on public.subscriptions for all to authenticated using (user_id=auth.uid() or public.is_admin()) with check (user_id=auth.uid() or public.is_admin());

drop policy if exists read_charges on public.extra_charges;
create policy read_charges on public.extra_charges for all to authenticated using (user_id=auth.uid() or charged_by=auth.uid() or public.is_admin()) with check (charged_by=auth.uid() or public.is_admin());

drop policy if exists ticket_policy on public.support_tickets;
create policy ticket_policy on public.support_tickets for all to authenticated using (user_id=auth.uid() or public.is_admin()) with check (user_id=auth.uid() or public.is_admin());

drop policy if exists inventory_read on public.inventory_items;
create policy inventory_read on public.inventory_items for select to authenticated using (true);
drop policy if exists inventory_admin on public.inventory_items;
create policy inventory_admin on public.inventory_items for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists notif_policy on public.notifications;
create policy notif_policy on public.notifications for all to authenticated using (user_id=auth.uid() or public.is_admin()) with check (user_id=auth.uid() or public.is_admin());
