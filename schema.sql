-- CelebrateVerse production schema
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists public.celebrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  occasion text, relationship text, theme text,
  person_name text, customer_name text, special_date date,
  customer_email text, message text, package text,
  status text not null default 'draft' check (status in ('draft','pending_payment','paid','processing','completed','cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.celebration_photos (
  id uuid primary key default gen_random_uuid(),
  celebration_id uuid not null references public.celebrations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  storage_path text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique,
  user_id uuid not null references auth.users(id) on delete cascade,
  celebration_id uuid not null unique references public.celebrations(id) on delete cascade,
  package text not null,
  amount integer not null,
  currency text not null default 'INR',
  payment_provider text,
  provider_order_id text,
  provider_payment_id text,
  payment_status text not null default 'created',
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.celebrations enable row level security;
alter table public.celebration_photos enable row level security;
alter table public.orders enable row level security;

create policy "profiles own" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "celebrations own" on public.celebrations for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "photos own" on public.celebration_photos for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "orders own" on public.orders for select using (auth.uid() = user_id);

-- Create Storage bucket named celebration-photos in Supabase Dashboard.
-- Storage policies should allow authenticated users to manage only objects whose first path segment is auth.uid().
