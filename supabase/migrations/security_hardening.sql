-- supabase/migrations/security_hardening.sql

-- ── Prevent session token enumeration ───────────────────────────────────────
-- Add abuse tracking table
create table if not exists public.security_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  ip_address text,
  user_id uuid references auth.users(id) on delete set null,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

-- Only admins can read security events
alter table public.security_events enable row level security;
create policy "admin reads security events" on public.security_events
  for select using (public.has_role(auth.uid(), 'admin'));
-- Server-side inserts via service role only (no client insert policy)

-- ── Order spam prevention table ──────────────────────────────────────────────
create table if not exists public.order_sessions (
  id uuid primary key default gen_random_uuid(),
  table_id uuid references public.tables(id) on delete cascade,
  session_token text not null unique,
  ip_address text,
  created_at timestamptz default now(),
  expires_at timestamptz not null,
  order_count int not null default 0,
  last_order_at timestamptz
);

alter table public.order_sessions enable row level security;
-- No client access — managed server-side only

-- ── Tighten orders RLS: require table to be active ───────────────────────────
drop policy if exists "anyone inserts order" on public.orders;
create policy "verified table inserts order" on public.orders
  for insert with check (
    exists (
      select 1 from public.tables t
      where t.id = table_id and t.active = true
    )
  );

-- ── Prevent reading other users' roles ───────────────────────────────────────
drop policy if exists "user reads own roles" on public.user_roles;
create policy "user reads own roles" on public.user_roles
  for select using (auth.uid() = user_id);

-- Ensure no policy allows full table scan on user_roles
-- (admin policy already restricts to admin role)

-- ── Add updated_at to reservations ────────────────────────────────────────────
alter table public.reservations
  add column if not exists updated_at timestamptz default now();

-- ── Rate limit tracking (for Supabase Edge Functions if used) ────────────────
create table if not exists public.rate_limit_buckets (
  key text primary key,
  count int not null default 0,
  reset_at timestamptz not null
);

alter table public.rate_limit_buckets enable row level security;
-- No client access
