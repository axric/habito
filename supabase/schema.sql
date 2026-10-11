-- ============================================================
-- Terminal Financiera Personal — Supabase Schema
-- Version: 0.1.0
-- ============================================================

-- ------------------------------------------------------------
-- EXTENSIONS
-- ------------------------------------------------------------
create extension if not exists "uuid-ossp";


-- ------------------------------------------------------------
-- MACRO DATA (shared across all users)
-- ------------------------------------------------------------
create table if not exists macro_data (
  id          uuid primary key default uuid_generate_v4(),
  key         text not null unique,   -- e.g. 'dolar_oficial', 'riesgo_pais'
  value       text,                   -- raw value (string, number, JSON)
  label       text,                   -- display label
  change      text,                   -- e.g. '+2,71%'
  context     text,                   -- narrative summary for the indicator
  updated_at  timestamptz default now()
);

-- Seed macro_data with known indicators
insert into macro_data (key, label, value, change, context) values
  ('dolar_oficial',  'Dólar Oficial BNA',  '1410',   '-0,35%',  null),
  ('dolar_mep',      'Dólar MEP',          '1474',   '+2,71%',  null),
  ('dolar_blue',     'Dólar Blue',         '1400',   '-1,06%',  null),
  ('dolar_ccl',      'Dólar CCL',          '1503',   '+1,01%',  null),
  ('riesgo_pais',    'Riesgo País EMBI+',  '582',    '+4,5%',   null),
  ('inflacion_ipc',  'IPC — INDEC',        '3.4',    '-',       null),
  ('brent',          'Brent Crude',        '65',     '-2,45%',  null),
  ('sp500',          'S&P 500',            '7230',   '+0,29%',  null),
  ('bitcoin',        'Bitcoin',            '78135',  '+2,53%',  null),
  ('ust_1y',         'UST 1 año',          '4.85',   '-0,03%',  null),
  ('ust_5y',         'UST 5 años',         '4.48',   '-0,04%',  null),
  ('ust_10y',        'UST 10 años',        '4.35',   '-0,10%',  null)
on conflict (key) do nothing;


-- ------------------------------------------------------------
-- PORTFOLIOS
-- ------------------------------------------------------------
create table if not exists portfolios (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  type        text not null check (type in ('family', 'personal')),
  label       text,                   -- display name, e.g. 'Inversiones Familia'
  description text,                   -- shown in portfolio analysis box
  created_at  timestamptz default now(),
  unique (user_id, type)
);


-- ------------------------------------------------------------
-- ASSETS
-- ------------------------------------------------------------
create table if not exists assets (
  id           uuid primary key default uuid_generate_v4(),
  portfolio_id uuid not null references portfolios(id) on delete cascade,
  name         text not null,         -- e.g. 'Super Ahorro Plus'
  sub          text,                  -- subtitle / description
  broker       text,
  currency     text not null check (currency in ('ARS', 'USD')),
  amount       numeric(18,2) default 0,
  retiro       text,                  -- 'Inmediato' | '24 hs' | '48 hs' | '72 hs'
  riesgo       text,                  -- 'Bajo' | 'Moderado' | 'Alto'
  horizonte    text,                  -- e.g. '<30d', '3–12m', '+5a'
  rend_mes     numeric(6,2),          -- % last month
  rend_anual   numeric(6,2),          -- % annualized
  sort_order   integer default 0,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);


-- ------------------------------------------------------------
-- OBJECTIVES
-- ------------------------------------------------------------
create table if not exists objectives (
  id           uuid primary key default uuid_generate_v4(),
  portfolio_id uuid not null references portfolios(id) on delete cascade,
  icon         text,                  -- emoji, e.g. '🚗'
  name         text not null,         -- e.g. 'Auto / Carro'
  description  text,
  currency     text not null check (currency in ('ARS', 'USD')),
  target       numeric(18,2) not null,
  current      numeric(18,2) default 0,
  eta_months   integer,               -- estimated months to goal
  note         text,
  sort_order   integer default 0,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);


-- ------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS)
-- ------------------------------------------------------------

-- user_data: one private JSON document per signed-in user
create table if not exists public.user_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.user_data enable row level security;

drop policy if exists "user_data: owner can select" on public.user_data;
create policy "user_data: owner can select"
  on public.user_data for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "user_data: owner can insert" on public.user_data;
create policy "user_data: owner can insert"
  on public.user_data for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "user_data: owner can update" on public.user_data;
create policy "user_data: owner can update"
  on public.user_data for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "user_data: owner can delete" on public.user_data;
create policy "user_data: owner can delete"
  on public.user_data for delete
  to authenticated
  using (auth.uid() = user_id);

revoke all on public.user_data from anon;
grant select, insert, update, delete on public.user_data to authenticated;

-- macro_data: readable by all authenticated users, writable by none (admin only)
alter table macro_data enable row level security;

create policy "macro_data: authenticated users can read"
  on macro_data for select
  to authenticated
  using (true);


-- portfolios: users can only see and edit their own
alter table portfolios enable row level security;

create policy "portfolios: owner can select"
  on portfolios for select
  to authenticated
  using (auth.uid() = user_id);

create policy "portfolios: owner can insert"
  on portfolios for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "portfolios: owner can update"
  on portfolios for update
  to authenticated
  using (auth.uid() = user_id);

create policy "portfolios: owner can delete"
  on portfolios for delete
  to authenticated
  using (auth.uid() = user_id);


-- assets: inherit access through portfolio ownership
alter table assets enable row level security;

create policy "assets: owner can select"
  on assets for select
  to authenticated
  using (
    exists (
      select 1 from portfolios
      where portfolios.id = assets.portfolio_id
      and portfolios.user_id = auth.uid()
    )
  );

create policy "assets: owner can insert"
  on assets for insert
  to authenticated
  with check (
    exists (
      select 1 from portfolios
      where portfolios.id = assets.portfolio_id
      and portfolios.user_id = auth.uid()
    )
  );

create policy "assets: owner can update"
  on assets for update
  to authenticated
  using (
    exists (
      select 1 from portfolios
      where portfolios.id = assets.portfolio_id
      and portfolios.user_id = auth.uid()
    )
  );

create policy "assets: owner can delete"
  on assets for delete
  to authenticated
  using (
    exists (
      select 1 from portfolios
      where portfolios.id = assets.portfolio_id
      and portfolios.user_id = auth.uid()
    )
  );


-- objectives: same pattern as assets
alter table objectives enable row level security;

create policy "objectives: owner can select"
  on objectives for select
  to authenticated
  using (
    exists (
      select 1 from portfolios
      where portfolios.id = objectives.portfolio_id
      and portfolios.user_id = auth.uid()
    )
  );

create policy "objectives: owner can insert"
  on objectives for insert
  to authenticated
  with check (
    exists (
      select 1 from portfolios
      where portfolios.id = objectives.portfolio_id
      and portfolios.user_id = auth.uid()
    )
  );

create policy "objectives: owner can update"
  on objectives for update
  to authenticated
  using (
    exists (
      select 1 from portfolios
      where portfolios.id = objectives.portfolio_id
      and portfolios.user_id = auth.uid()
    )
  );

create policy "objectives: owner can delete"
  on objectives for delete
  to authenticated
  using (
    exists (
      select 1 from portfolios
      where portfolios.id = objectives.portfolio_id
      and portfolios.user_id = auth.uid()
    )
  );


-- ------------------------------------------------------------
-- UPDATED_AT TRIGGER
-- ------------------------------------------------------------
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger assets_updated_at
  before update on assets
  for each row execute function update_updated_at();

create trigger objectives_updated_at
  before update on objectives
  for each row execute function update_updated_at();