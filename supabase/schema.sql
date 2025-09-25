-- Enable UUID generation helper if it isn't already available
create extension if not exists "pgcrypto";

-- Core transactions table used by the app
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  type text not null check (type in ('income', 'expense')),
  amount numeric(12, 2) not null,
  category text not null,
  date date not null,
  description text,
  status text not null default 'todo' check (status in ('todo', 'in-progress', 'done')),
  currency text not null default 'INR',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- User preferences for theme and currency
create table if not exists public.user_preferences (
  user_id uuid primary key references auth.users (id) on delete cascade,
  theme text not null default 'light' check (theme in ('light', 'dark')),
  currency text not null default 'INR',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- Keep the updated_at column in sync automatically
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists transactions_set_updated_at on public.transactions;
create trigger transactions_set_updated_at
before update on public.transactions
for each row execute function public.set_updated_at();

drop trigger if exists user_preferences_set_updated_at on public.user_preferences;
create trigger user_preferences_set_updated_at
before update on public.user_preferences
for each row execute function public.set_updated_at();

-- Helpful index for filtering by ownership + currency + status
create index if not exists transactions_user_currency_status_idx
  on public.transactions (user_id, currency, status);

-- Enforce row level security so users only see their data
alter table public.transactions enable row level security;
alter table public.user_preferences enable row level security;

drop policy if exists "Users can read their transactions" on public.transactions;
drop policy if exists "Users can insert their transactions" on public.transactions;
drop policy if exists "Users can update their transactions" on public.transactions;
drop policy if exists "Users can delete their transactions" on public.transactions;

drop policy if exists "Users can manage their preferences" on public.user_preferences;

create policy "Users can read their transactions"
  on public.transactions
  for select
  using (auth.uid() = user_id);

create policy "Users can insert their transactions"
  on public.transactions
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their transactions"
  on public.transactions
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their transactions"
  on public.transactions
  for delete
  using (auth.uid() = user_id);

create policy "Users can manage their preferences"
  on public.user_preferences
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
