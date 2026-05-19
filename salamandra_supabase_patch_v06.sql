-- Salamandra IoT - Patch v06 compatible con esquema actual
-- Basado en tablas existentes: profiles, places, devices, sensors, sensor_readings,
-- actuators, actuator_events, support_tickets, notifications, subscriptions, plans.

create extension if not exists pgcrypto;

-- updated_at helper
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

do $$
begin
  if exists (select 1 from information_schema.columns where table_schema='public' and table_name='profiles' and column_name='updated_at') then
    drop trigger if exists trg_profiles_updated_at on public.profiles;
    create trigger trg_profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
  end if;
  if exists (select 1 from information_schema.columns where table_schema='public' and table_name='places' and column_name='updated_at') then
    drop trigger if exists trg_places_updated_at on public.places;
    create trigger trg_places_updated_at before update on public.places for each row execute function public.set_updated_at();
  end if;
  if exists (select 1 from information_schema.columns where table_schema='public' and table_name='devices' and column_name='updated_at') then
    drop trigger if exists trg_devices_updated_at on public.devices;
    create trigger trg_devices_updated_at before update on public.devices for each row execute function public.set_updated_at();
  end if;
  if exists (select 1 from information_schema.columns where table_schema='public' and table_name='sensors' and column_name='updated_at') then
    drop trigger if exists trg_sensors_updated_at on public.sensors;
    create trigger trg_sensors_updated_at before update on public.sensors for each row execute function public.set_updated_at();
  end if;
  if exists (select 1 from information_schema.columns where table_schema='public' and table_name='actuators' and column_name='updated_at') then
    drop trigger if exists trg_actuators_updated_at on public.actuators;
    create trigger trg_actuators_updated_at before update on public.actuators for each row execute function public.set_updated_at();
  end if;
  if exists (select 1 from information_schema.columns where table_schema='public' and table_name='subscriptions' and column_name='updated_at') then
    drop trigger if exists trg_subscriptions_updated_at on public.subscriptions;
    create trigger trg_subscriptions_updated_at before update on public.subscriptions for each row execute function public.set_updated_at();
  end if;
  if exists (select 1 from information_schema.columns where table_schema='public' and table_name='inventory_items' and column_name='updated_at') then
    drop trigger if exists trg_inventory_items_updated_at on public.inventory_items;
    create trigger trg_inventory_items_updated_at before update on public.inventory_items for each row execute function public.set_updated_at();
  end if;
  if exists (select 1 from information_schema.columns where table_schema='public' and table_name='support_tickets' and column_name='updated_at') then
    drop trigger if exists trg_support_tickets_updated_at on public.support_tickets;
    create trigger trg_support_tickets_updated_at before update on public.support_tickets for each row execute function public.set_updated_at();
  end if;
end $$;

-- Columnas opcionales seguras para nuevos requerimientos
alter table public.profiles add column if not exists parent_id uuid references public.profiles(id) on delete set null;
alter table public.profiles add column if not exists plan_cycle text default 'monthly';
alter table public.profiles add column if not exists clients_limit integer default 0;
alter table public.profiles add column if not exists entrepreneurs_limit integer default 0;
alter table public.profiles add column if not exists device_limit integer default 1;
alter table public.profiles add column if not exists extra_device_cost numeric default 0;
alter table public.profiles add column if not exists extra_entrepreneur_cost numeric default 0;

alter table public.devices add column if not exists ssid text;
alter table public.devices add column if not exists network text;
alter table public.devices add column if not exists rssi text;
alter table public.devices add column if not exists ip text;
alter table public.devices add column if not exists camera_url text;

alter table public.sensors add column if not exists remote_config jsonb default '{}'::jsonb;
alter table public.actuators add column if not exists remote_config jsonb default '{}'::jsonb;

-- Índices
create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_profiles_parent_id on public.profiles(parent_id);
create index if not exists idx_devices_user_id on public.devices(user_id);
create index if not exists idx_devices_place_id on public.devices(place_id);
create index if not exists idx_sensors_device_id on public.sensors(device_id);
create index if not exists idx_sensor_readings_sensor_created on public.sensor_readings(sensor_id, created_at desc);
create index if not exists idx_sensor_readings_device_created on public.sensor_readings(device_id, created_at desc);
create index if not exists idx_actuators_device_id on public.actuators(device_id);
create index if not exists idx_actuator_events_actuator_created on public.actuator_events(actuator_id, created_at desc);
create index if not exists idx_support_tickets_user_status on public.support_tickets(user_id, status);

-- Vistas: drop antes para evitar error 42P16 por cambio de nombres de columnas
DROP VIEW IF EXISTS public.v_superadmin_dashboard CASCADE;
DROP VIEW IF EXISTS public.dashboard_stats CASCADE;

create view public.dashboard_stats as
select
  p.id as profile_id,
  p.name,
  p.email,
  p.avatar_url,
  p.role,
  (select count(*) from public.devices d where d.user_id = p.id) as total_devices,
  (select count(*) from public.places pl where pl.user_id = p.id) as total_places,
  (select count(*) from public.support_tickets st where st.user_id = p.id and st.status = 'abierto') as open_tickets,
  (select count(*) from public.notifications n where n.user_id = p.id and n.is_read = false) as unread_notifications,
  (select count(*) from public.subscriptions s where s.user_id = p.id and s.status in ('active','trialing')) as active_subscriptions
from public.profiles p;

create view public.v_superadmin_dashboard as
select
  (select count(*) from public.profiles) as total_users,
  (select count(*) from public.profiles where lower(role)='cliente') as total_clients,
  (select count(*) from public.profiles where lower(role)='emprendedor') as total_entrepreneurs,
  (select coalesce(sum(amount),0) from public.subscriptions where status in ('active','trialing')) as total_income,
  (select count(*) from public.devices) as total_devices,
  (select count(*) from public.devices where is_online = true) as online_devices,
  (select coalesce(round(avg(wifi_signal)),0) from public.devices) as avg_wifi_signal,
  (select count(*) from public.support_tickets where status <> 'cerrado') as open_tickets,
  (select count(*) from public.inventory_items) as inventory_items;

-- Storage avatars
insert into storage.buckets (id, name, public)
values ('avatars','avatars',true)
on conflict (id) do nothing;

drop policy if exists avatars_read on storage.objects;
create policy avatars_read on storage.objects for select to public using (bucket_id='avatars');

drop policy if exists avatars_insert on storage.objects;
create policy avatars_insert on storage.objects for insert to authenticated with check (bucket_id='avatars');

drop policy if exists avatars_update on storage.objects;
create policy avatars_update on storage.objects for update to authenticated using (bucket_id='avatars') with check (bucket_id='avatars');

drop policy if exists avatars_delete on storage.objects;
create policy avatars_delete on storage.objects for delete to authenticated using (bucket_id='avatars');

-- RLS básico compatible
alter table public.profiles enable row level security;
alter table public.places enable row level security;
alter table public.devices enable row level security;
alter table public.sensors enable row level security;
alter table public.sensor_readings enable row level security;
alter table public.actuators enable row level security;
alter table public.actuator_events enable row level security;
alter table public.support_tickets enable row level security;
alter table public.notifications enable row level security;
alter table public.subscriptions enable row level security;

-- Políticas idempotentes
drop policy if exists profiles_read_authenticated on public.profiles;
create policy profiles_read_authenticated on public.profiles for select to authenticated using (true);

drop policy if exists profiles_update_self on public.profiles;
create policy profiles_update_self on public.profiles for update to authenticated using (id=auth.uid()) with check (id=auth.uid());

drop policy if exists places_owner_all on public.places;
create policy places_owner_all on public.places for all to authenticated using (user_id=auth.uid()) with check (user_id=auth.uid());

drop policy if exists devices_owner_all on public.devices;
create policy devices_owner_all on public.devices for all to authenticated using (user_id=auth.uid()) with check (user_id=auth.uid());

drop policy if exists sensors_by_device_owner_all on public.sensors;
create policy sensors_by_device_owner_all on public.sensors for all to authenticated
using (exists (select 1 from public.devices d where d.id=sensors.device_id and d.user_id=auth.uid()))
with check (exists (select 1 from public.devices d where d.id=sensors.device_id and d.user_id=auth.uid()));

drop policy if exists readings_by_device_owner_all on public.sensor_readings;
create policy readings_by_device_owner_all on public.sensor_readings for all to authenticated
using (exists (select 1 from public.devices d where d.id=sensor_readings.device_id and d.user_id=auth.uid()))
with check (exists (select 1 from public.devices d where d.id=sensor_readings.device_id and d.user_id=auth.uid()));

drop policy if exists actuators_by_device_owner_all on public.actuators;
create policy actuators_by_device_owner_all on public.actuators for all to authenticated
using (exists (select 1 from public.devices d where d.id=actuators.device_id and d.user_id=auth.uid()))
with check (exists (select 1 from public.devices d where d.id=actuators.device_id and d.user_id=auth.uid()));

drop policy if exists actuator_events_by_device_owner_all on public.actuator_events;
create policy actuator_events_by_device_owner_all on public.actuator_events for all to authenticated
using (exists (select 1 from public.devices d where d.id=actuator_events.device_id and d.user_id=auth.uid()))
with check (exists (select 1 from public.devices d where d.id=actuator_events.device_id and d.user_id=auth.uid()));

drop policy if exists support_tickets_owner_all on public.support_tickets;
create policy support_tickets_owner_all on public.support_tickets for all to authenticated using (user_id=auth.uid()) with check (user_id=auth.uid());

drop policy if exists notifications_owner_all on public.notifications;
create policy notifications_owner_all on public.notifications for all to authenticated using (user_id=auth.uid()) with check (user_id=auth.uid());

drop policy if exists subscriptions_owner_select on public.subscriptions;
create policy subscriptions_owner_select on public.subscriptions for select to authenticated using (user_id=auth.uid());

-- Realtime: no falla si ya estaba agregado
do $$
begin
  begin alter publication supabase_realtime add table public.sensor_readings; exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.actuator_events; exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.devices; exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.sensors; exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.actuators; exception when duplicate_object then null; end;
end $$;

-- Planes base
insert into public.plans (name, code, monthly_price, annual_price, max_devices, is_active)
values
 ('Cliente','cliente',0,0,1,true),
 ('Emprendedor','emprendedor',9.99,99.99,3,true),
 ('Business','business',29.99,299.99,25,true)
on conflict (code) do update set
 name=excluded.name,
 monthly_price=excluded.monthly_price,
 annual_price=excluded.annual_price,
 max_devices=excluded.max_devices,
 is_active=excluded.is_active,
 updated_at=now();

select 'SALAMANDRA IOT PATCH V06 OK' as status;
