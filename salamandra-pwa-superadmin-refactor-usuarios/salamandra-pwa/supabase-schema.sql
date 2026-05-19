-- Salamandra IoT - Base de datos completa para Supabase
create extension if not exists pgcrypto;

create table if not exists public.user_profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid references auth.users(id) on delete cascade,
  full_name text not null,
  email text unique not null,
  whatsapp text,
  dni text,
  avatar_url text,
  role text not null check (role in ('SuperAdmin','Administrador','Emprendedor','Business')) default 'Emprendedor',
  status text not null check (status in ('Activo','Pendiente','Bloqueado')) default 'Activo',
  birth_date date,
  course text,
  division text,
  title_certificates text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  max_devices int not null default 1,
  monthly_usd numeric(10,2) not null default 9.99,
  annual_usd numeric(10,2) not null default 9.99,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.user_profiles(id) on delete cascade,
  plan_id uuid references public.plans(id),
  status text not null default 'Activa',
  amount_usd numeric(10,2) not null default 0,
  billing_period text check (billing_period in ('Mensual','Anual')) default 'Mensual',
  started_at timestamptz not null default now(),
  expires_at timestamptz
);

create table if not exists public.locations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.user_profiles(id) on delete cascade,
  name text not null,
  address text,
  lat numeric(10,7),
  lng numeric(10,7),
  created_at timestamptz not null default now()
);

create table if not exists public.devices (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.user_profiles(id) on delete set null,
  location_id uuid references public.locations(id) on delete set null,
  name text not null,
  esp_id text unique not null,
  serial_number text unique not null,
  category text default 'Genérico',
  address text,
  online boolean not null default false,
  wifi_signal int default 0,
  broker_status text default 'Offline',
  last_reset_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sensors (
  id uuid primary key default gen_random_uuid(),
  device_id uuid references public.devices(id) on delete cascade,
  type text not null,
  name text not null,
  gpio text,
  variable text,
  icon text default 'generic',
  unit text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.sensor_readings (
  id bigserial primary key,
  sensor_id uuid references public.sensors(id) on delete cascade,
  metric text not null,
  value numeric(12,4) not null,
  unit text,
  read_at timestamptz not null default now()
);

create table if not exists public.actuators (
  id uuid primary key default gen_random_uuid(),
  device_id uuid references public.devices(id) on delete cascade,
  name text not null,
  gpio text,
  variable text,
  state boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.actuator_events (
  id bigserial primary key,
  actuator_id uuid references public.actuators(id) on delete cascade,
  state boolean not null,
  changed_by uuid references public.user_profiles(id),
  changed_at timestamptz not null default now(),
  source text default 'PWA'
);

create table if not exists public.support_tickets (
  id bigserial primary key,
  user_id uuid references public.user_profiles(id) on delete set null,
  subject text not null,
  description text,
  status text not null check (status in ('Abierto','En proceso','Cerrado')) default 'Abierto',
  priority text not null check (priority in ('Alta','Media','Baja')) default 'Media',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.inventory_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sku text unique not null,
  category text,
  stock int not null default 0,
  min_stock int not null default 0,
  status text default 'Disponible',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id bigserial primary key,
  user_id uuid references public.user_profiles(id) on delete cascade,
  title text not null,
  body text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.user_profiles enable row level security;
alter table public.plans enable row level security;
alter table public.subscriptions enable row level security;
alter table public.locations enable row level security;
alter table public.devices enable row level security;
alter table public.sensors enable row level security;
alter table public.sensor_readings enable row level security;
alter table public.actuators enable row level security;
alter table public.actuator_events enable row level security;
alter table public.support_tickets enable row level security;
alter table public.inventory_items enable row level security;
alter table public.notifications enable row level security;

-- Políticas iniciales para desarrollo. Endurecer antes de producción.
create policy if not exists "read authenticated profiles" on public.user_profiles for select to authenticated using (true);
create policy if not exists "manage own profile" on public.user_profiles for update to authenticated using (auth.uid() = auth_user_id);
create policy if not exists "read authenticated plans" on public.plans for select to authenticated using (true);
create policy if not exists "read authenticated subscriptions" on public.subscriptions for select to authenticated using (true);
create policy if not exists "read authenticated locations" on public.locations for select to authenticated using (true);
create policy if not exists "read authenticated devices" on public.devices for select to authenticated using (true);
create policy if not exists "read authenticated sensors" on public.sensors for select to authenticated using (true);
create policy if not exists "read authenticated readings" on public.sensor_readings for select to authenticated using (true);
create policy if not exists "read authenticated actuators" on public.actuators for select to authenticated using (true);
create policy if not exists "read authenticated actuator events" on public.actuator_events for select to authenticated using (true);
create policy if not exists "read authenticated tickets" on public.support_tickets for select to authenticated using (true);
create policy if not exists "read authenticated inventory" on public.inventory_items for select to authenticated using (true);
create policy if not exists "read own notifications" on public.notifications for select to authenticated using (auth.uid() = user_id);
