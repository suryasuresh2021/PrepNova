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
create policy "Users can view their own subscription"
  on subscriptions for select
  using (auth.jwt() ->> 'email' = email);

-- Deliberately no insert/update policy for regular users.
-- Only the webhook route (using the service role key, which bypasses RLS)
-- is allowed to write to this table. This stops anyone from marking
-- themselves "premium" directly from the browser.
