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


-- ============================================================
-- Categories — top-level groupings (e.g. "Quantitative Aptitude")
-- ============================================================

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  created_at timestamptz not null default now()
);

alter table categories enable row level security;

drop policy if exists "Categories are publicly readable" on categories;
create policy "Categories are publicly readable"
  on categories for select
  using (true);


-- ============================================================
-- Topics — sit under a Category (e.g. "Time & Work" under "Quantitative Aptitude")
-- ============================================================

create table if not exists topics (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

alter table topics enable row level security;

drop policy if exists "Topics are publicly readable" on topics;
create policy "Topics are publicly readable"
  on topics for select
  using (true);


-- ============================================================
-- Questions — individual MCQs, optionally linked to a topic and/or test
-- ============================================================

create table if not exists questions (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid references topics(id) on delete set null,
  test_id uuid references tests(id) on delete set null,
  question_text text not null,
  options jsonb not null default '[]',
  correct_option integer not null default 0,
  created_at timestamptz not null default now()
);

alter table questions enable row level security;
-- No public read policy yet — the question bank isn't exposed to users
-- until the test-taking flow is built. Admin API routes use the service role.


-- ============================================================
-- Test attempts — one row per user completing a test
-- (powers Results and "Tests Attempted Today")
-- ============================================================

create table if not exists test_attempts (
  id uuid primary key default gen_random_uuid(),
  test_id uuid references tests(id) on delete cascade,
  email text not null,
  score integer not null default 0,
  total_questions integer not null default 0,
  attempted_at timestamptz not null default now()
);

alter table test_attempts enable row level security;

drop policy if exists "Users can view their own attempts" on test_attempts;
create policy "Users can view their own attempts"
  on test_attempts for select
  using (auth.jwt() ->> 'email' = email);


-- ============================================================
-- Payments — a running ledger of every captured payment (powers Total Revenue)
-- Written by the Razorpay webhook alongside the subscriptions upsert.
-- ============================================================

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  amount_inr integer not null,
  razorpay_payment_id text,
  created_at timestamptz not null default now()
);

alter table payments enable row level security;
-- No public policy — only the webhook (service role) writes here,
-- and only admin API routes (service role) read the full ledger.


-- ============================================================
-- Materials — reading materials/links under a Category, free or premium
-- ============================================================

create table if not exists materials (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id) on delete cascade,
  title text not null,
  description text,
  material_type text not null default 'link', -- 'link' | 'pdf' | 'video' | 'note'
  url text,
  content text,
  is_premium boolean not null default false,
  created_at timestamptz not null default now()
);

alter table materials enable row level security;
-- No public policy — served only through server components/API routes using the
-- service role, so a premium material's URL is never exposed to a Free user's page.


-- ============================================================
-- Track how long a test attempt took (for result analysis)
-- ============================================================

alter table test_attempts add column if not exists time_taken_seconds integer;


-- ============================================================
-- Material progress — tracks which materials a student has marked as read
-- ============================================================

create table if not exists material_progress (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  material_id uuid references materials(id) on delete cascade,
  viewed_at timestamptz not null default now(),
  unique (email, material_id)
);

alter table material_progress enable row level security;

drop policy if exists "Users can view their own material progress" on material_progress;
create policy "Users can view their own material progress"
  on material_progress for select
  using (auth.jwt() ->> 'email' = email);

-- No public insert/update/delete policy — writes go through the API route
-- (using the service role), which always writes under the logged-in user's own email.


-- ============================================================
-- Material progress — tracks which materials a user has marked as read
-- ============================================================

create table if not exists material_progress (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  material_id uuid references materials(id) on delete cascade,
  completed_at timestamptz not null default now(),
  unique (email, material_id)
);

alter table material_progress enable row level security;

drop policy if exists "Users can view their own material progress" on material_progress;
create policy "Users can view their own material progress"
  on material_progress for select
  using (auth.jwt() ->> 'email' = email);
-- Writes happen only through the API route (service role), which verifies the
-- logged-in user's own email server-side before inserting/deleting.
