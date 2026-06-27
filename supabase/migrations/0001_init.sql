-- ===========================================================================
-- Tillandsia — initial schema + Row-Level Security
-- Phase 1 schema WITH the Phase-2/3 hooks baked in (see TILLANDSIA-BUILD-SPEC §14c)
-- so later phases are behaviour changes, not migrations.
-- Postgres / Supabase. Run in the Supabase SQL editor (or via supabase db push).
-- ===========================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- PROFILES (1:1 with auth.users)
-- ---------------------------------------------------------------------------
create table public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  display_name  text,
  avatar_url    text,
  timezone      text not null default 'America/Edmonton',  -- Calgary default
  units         text not null default 'cm' check (units in ('cm','in')),
  push_opt_in   boolean not null default false,            -- per-user (see spec §14b)
  created_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- HOUSEHOLDS  (all collection data is scoped to one of these)
-- ---------------------------------------------------------------------------
create table public.households (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  quiet_hours_start smallint not null default 21,  -- per-household quiet hours
  quiet_hours_end   smallint not null default 8,
  created_at    timestamptz not null default now()
);

create table public.household_members (
  household_id  uuid not null references public.households(id) on delete cascade,
  user_id       uuid not null references public.profiles(id) on delete cascade,
  role          text not null default 'member' check (role in ('owner','member')),
  joined_at     timestamptz not null default now(),
  primary key (household_id, user_id)
);

create table public.household_invites (
  id            uuid primary key default gen_random_uuid(),
  household_id  uuid not null references public.households(id) on delete cascade,
  code          text not null unique default encode(gen_random_bytes(6),'hex'),
  email         text,
  expires_at    timestamptz not null default (now() + interval '7 days'),
  accepted_by   uuid references public.profiles(id),
  created_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- MEMBERSHIP HELPER  (used by every RLS policy)
-- ---------------------------------------------------------------------------
create or replace function public.is_member(h uuid)
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.household_members m
    where m.household_id = h and m.user_id = auth.uid()
  );
$$;

-- ---------------------------------------------------------------------------
-- SPECIES  (content table — powers the care sheets; editable without redeploy)
-- ---------------------------------------------------------------------------
create table public.species (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  binomial      text not null,
  authority     text,                       -- e.g. 'Hook.' / 'É.Morren' / 'Sw.'
  common_names  text[] default '{}',
  care_group    text not null check (care_group in
                  ('bulbous_no_soak','soft_rosette_soak_safe','xeric_grey','wispy')),
  native_range  text,
  max_size_cm   int,
  mesic_xeric   text,                        -- 'mesic' | 'xeric' | 'looks xeric, behaves mesic'
  trichome_notes text,
  watering      text, light text, fertilizer text, air text,
  bloom         text, pups text, display text, calgary_notes text,
  sources       text[] default '{}',
  created_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- SPECIMENS  (the user's actual plants)
-- ---------------------------------------------------------------------------
create table public.specimens (
  id            uuid primary key default gen_random_uuid(),
  household_id  uuid not null references public.households(id) on delete cascade,
  name          text not null,
  species_id    uuid references public.species(id),
  code          text,
  acquired      date,
  notes         text,
  confident     boolean not null default false,  -- false = provisional ID badge
  cover_photo_id uuid,                            -- FK added after photos exists
  created_by    uuid references public.profiles(id),
  created_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- OBSERVATIONS  (dated log entries — measurements live here so size has HISTORY)
-- ---------------------------------------------------------------------------
create table public.observations (
  id            uuid primary key default gen_random_uuid(),
  specimen_id   uuid not null references public.specimens(id) on delete cascade,
  observed_on   date not null default current_date,
  tags          text[] default '{}',
  bulb_cm        numeric(5,1),   -- \
  longest_leaf_cm numeric(5,1),  --  } measurements → power the container designer
  span_cm        numeric(5,1),   --  |  (capture from Phase 1 so 3B has data)
  height_cm      numeric(5,1),   -- /
  note          text,
  created_by    uuid references public.profiles(id),
  created_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- PHOTOS  (recognition columns included now — see spec §14c)
-- ---------------------------------------------------------------------------
create table public.photos (
  id            uuid primary key default gen_random_uuid(),
  household_id  uuid not null references public.households(id) on delete cascade,
  specimen_id   uuid references public.specimens(id) on delete set null,
  observation_id uuid references public.observations(id) on delete set null,
  storage_path  text not null,
  width int, height int,
  taken_on      date,
  is_bloom      boolean not null default false,
  caption       text,
  -- recognition / auto-sort (Phase 2A) --
  suggested_specimen_id uuid references public.specimens(id) on delete set null,
  match_confidence numeric(4,3),                       -- 0.000–1.000
  review_status text not null default 'unsorted'
                  check (review_status in ('sorted','needs_review','unsorted')),
  uploaded_by   uuid references public.profiles(id),   -- attribution ("added by Mom")
  created_at    timestamptz not null default now()
);

-- specimen cover photo FK (now that photos exists)
alter table public.specimens
  add constraint specimens_cover_fk
  foreign key (cover_photo_id) references public.photos(id) on delete set null;

-- ---------------------------------------------------------------------------
-- CARE TASKS  (scheduler — Phase 2B)
-- ---------------------------------------------------------------------------
create table public.care_tasks (
  id            uuid primary key default gen_random_uuid(),
  specimen_id   uuid not null references public.specimens(id) on delete cascade,
  type          text not null check (type in ('mist','dunk','soak','fertilize')),
  interval_days int not null,
  season_overrides jsonb default '{}'::jsonb,   -- e.g. {"nov_feb_interval_days":2}
  last_done_at  timestamptz,
  next_due_at   timestamptz,
  active        boolean not null default true,
  notified_at   timestamptz                     -- cron idempotency
);

-- ---------------------------------------------------------------------------
-- PUSH SUBSCRIPTIONS  (Web Push — Phase 2B)
-- ---------------------------------------------------------------------------
create table public.push_subscriptions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles(id) on delete cascade,
  endpoint      text not null,
  p256dh        text not null,
  auth          text not null,
  user_agent    text,
  created_at    timestamptz not null default now(),
  unique (user_id, endpoint)
);

-- ---------------------------------------------------------------------------
-- REFERENCE IMAGES  (training set for recognition + best-in-class + container examples)
-- ---------------------------------------------------------------------------
create table public.reference_images (
  id            uuid primary key default gen_random_uuid(),
  species_id    uuid references public.species(id) on delete cascade,
  specimen_id   uuid references public.specimens(id) on delete cascade,  -- recognition training
  kind          text not null check (kind in ('specimen','bloom','container_example')),
  storage_path  text, url text,
  source        text, author text, license text, attribution text,
  approved      boolean not null default false,
  created_at    timestamptz not null default now()
);

-- ===========================================================================
-- ROW-LEVEL SECURITY
-- A user can touch rows whose household is in their memberships.
-- Content tables (species, reference_images) are world-readable.
-- ===========================================================================
alter table public.profiles            enable row level security;
alter table public.households          enable row level security;
alter table public.household_members   enable row level security;
alter table public.household_invites   enable row level security;
alter table public.specimens           enable row level security;
alter table public.observations        enable row level security;
alter table public.photos              enable row level security;
alter table public.care_tasks          enable row level security;
alter table public.push_subscriptions  enable row level security;
alter table public.species             enable row level security;
alter table public.reference_images    enable row level security;

-- profiles: you can read/update your own
create policy "own profile read"   on public.profiles for select using (id = auth.uid());
create policy "own profile write"  on public.profiles for update using (id = auth.uid());
create policy "own profile insert" on public.profiles for insert with check (id = auth.uid());

-- households: any authenticated user can create one; members read; members manage
create policy "household create" on public.households for insert with check (auth.uid() is not null);
create policy "household read"   on public.households for select using (public.is_member(id));
create policy "household write"  on public.households for update using (public.is_member(id));

-- memberships: read rows for your households; add yourself (onboarding) or add others if already a member
create policy "members read"   on public.household_members for select using (public.is_member(household_id));
create policy "members insert" on public.household_members for insert
  with check (user_id = auth.uid() or public.is_member(household_id));
create policy "members delete" on public.household_members for delete using (public.is_member(household_id));

-- invites: members of the household can manage
create policy "invites rw" on public.household_invites
  for all using (public.is_member(household_id)) with check (public.is_member(household_id));

-- specimens / observations / photos / care_tasks: scoped to household membership
create policy "specimens rw" on public.specimens
  for all using (public.is_member(household_id)) with check (public.is_member(household_id));

create policy "observations rw" on public.observations
  for all using (public.is_member((select household_id from public.specimens s where s.id = specimen_id)))
  with check (public.is_member((select household_id from public.specimens s where s.id = specimen_id)));

create policy "photos rw" on public.photos
  for all using (public.is_member(household_id)) with check (public.is_member(household_id));

create policy "care_tasks rw" on public.care_tasks
  for all using (public.is_member((select household_id from public.specimens s where s.id = specimen_id)))
  with check (public.is_member((select household_id from public.specimens s where s.id = specimen_id)));

-- push subscriptions: your own
create policy "push own" on public.push_subscriptions
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- content: species world-readable; reference images world-readable when approved
create policy "species read" on public.species for select using (true);
create policy "refimg read"  on public.reference_images for select using (approved or species_id is not null);

-- ---------------------------------------------------------------------------
-- New-user trigger: create a profile row automatically on signup
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email,'@',1)), null)
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users for each row execute function public.handle_new_user();
