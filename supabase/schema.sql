-- Run this once in Supabase Dashboard > SQL Editor.

create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  plan text not null default 'free',       -- 'free' | 'premium'
  status text not null default 'inactive', -- 'inactive' | 'active'
  last_payment_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table subscriptions enable row level security;

-- Once you add Supabase Auth, a logged-in user can read their own row like this
-- (their auth email must match the email column):
drop policy if exists "Users can view their own subscription" on subscriptions;
create policy "Users can view their own subscription"
  on subscriptions for select
  using (auth.jwt() ->> 'email' = email);

-- Deliberately no insert/update policy for regular users.
-- Only the webhook route (using the service role key, which bypasses RLS)
-- is allowed to write to this table. This stops anyone from marking
-- themselves "premium" directly from the browser.


-- ============================================================
-- Profiles — one row per signed-up user, linked to Supabase Auth
-- ============================================================

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

drop policy if exists "Users can view their own profile" on profiles;
create policy "Users can view their own profile"
  on profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can update their own profile" on profiles;
create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

-- Automatically create a profile row whenever someone signs up.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- To make your OWN account the Super Admin:
-- 1. Sign up once at /login with your email.
-- 2. In Table Editor > profiles, find your row and set is_admin to true.
-- (There's no public way to become admin — this manual step is intentional.)


-- ============================================================
-- Tests — topic-wise practice tests created by the Super Admin,
-- each with its own price. price_inr = 0 means it's free.
-- ============================================================

create table if not exists tests (
  id uuid primary key default gen_random_uuid(),
  topic text not null,
  title text not null,
  description text,
  price_inr integer not null default 0,
  created_at timestamptz not null default now()
);

alter table tests enable row level security;

-- The test catalog is public — anyone can browse topics and prices,
-- even logged-out visitors. Only admin API routes (service role) can write.
drop policy if exists "Tests are publicly readable" on tests;
create policy "Tests are publicly readable"
  on tests for select
  using (true);
