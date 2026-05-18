create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  avatar_url text,
  role text default 'emprendedor',
  created_at timestamptz default now()
);
create table if not exists places (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz default now()
);
create table if not exists devices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  place_id uuid references places(id) on delete cascade,
  esp_id text unique not null,
  name text not null,
  serial text not null,
  category text default '🔧',
  address text,
  last_reset timestamptz,
  created_at timestamptz default now()
);
create table if not exists sensors (
  id uuid primary key default gen_random_uuid(),
  device_id uuid references devices(id) on delete cascade,
  type text not null,
  name text not null,
  gpio text,
  esp_variable text,
  icon text default '❓',
  created_at timestamptz default now()
);
create table if not exists actuator_events (
  id bigint generated always as identity primary key,
  device_id uuid references devices(id) on delete cascade,
  actuator_name text,
  state boolean,
  created_at timestamptz default now()
);
alter table profiles enable row level security;
alter table places enable row level security;
alter table devices enable row level security;
alter table sensors enable row level security;
alter table actuator_events enable row level security;
create policy "own profiles" on profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "own places" on places for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own devices" on devices for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "device sensors" on sensors for all using (exists(select 1 from devices d where d.id=sensors.device_id and d.user_id=auth.uid())) with check (exists(select 1 from devices d where d.id=sensors.device_id and d.user_id=auth.uid()));
create policy "device actuator events" on actuator_events for all using (exists(select 1 from devices d where d.id=actuator_events.device_id and d.user_id=auth.uid())) with check (exists(select 1 from devices d where d.id=actuator_events.device_id and d.user_id=auth.uid()));
