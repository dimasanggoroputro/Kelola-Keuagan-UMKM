-- =============================================================
-- Catetin AI – User Isolation Migration
-- Jalankan di Supabase: Dashboard → SQL Editor → Paste & Run
-- =============================================================

-- 1. Tambah kolom session_id (untuk guest) dan user_id (untuk auth user)
alter table transactions
  add column if not exists session_id  uuid,
  add column if not exists user_id     uuid references auth.users(id) on delete cascade;

-- 2. Index agar query per user/session cepat
create index if not exists idx_transactions_session_id on transactions(session_id);
create index if not exists idx_transactions_user_id    on transactions(user_id);

-- 3. Aktifkan Row Level Security
alter table transactions enable row level security;

-- 4. Hapus policy lama (kalau ada) supaya tidak konflik
drop policy if exists "guest_select"  on transactions;
drop policy if exists "guest_insert"  on transactions;
drop policy if exists "guest_update"  on transactions;
drop policy if exists "guest_delete"  on transactions;
drop policy if exists "auth_select"   on transactions;
drop policy if exists "auth_insert"   on transactions;
drop policy if exists "auth_update"   on transactions;
drop policy if exists "auth_delete"   on transactions;

-- ─────────────────────────────────────────────────────────────
-- POLICY untuk GUEST (anon key, session_id via custom header)
-- request.headers->>'x-guest-id' dibaca dari header custom
-- ─────────────────────────────────────────────────────────────
create policy "guest_select" on transactions
  for select
  using (
    auth.uid() is null
    and session_id = (current_setting('request.headers', true)::json->>'x-guest-id')::uuid
  );

create policy "guest_insert" on transactions
  for insert
  with check (
    auth.uid() is null
    and session_id = (current_setting('request.headers', true)::json->>'x-guest-id')::uuid
  );

create policy "guest_update" on transactions
  for update
  using (
    auth.uid() is null
    and session_id = (current_setting('request.headers', true)::json->>'x-guest-id')::uuid
  );

create policy "guest_delete" on transactions
  for delete
  using (
    auth.uid() is null
    and session_id = (current_setting('request.headers', true)::json->>'x-guest-id')::uuid
  );

-- ─────────────────────────────────────────────────────────────
-- POLICY untuk AUTH USER (logged-in, user_id = auth.uid())
-- ─────────────────────────────────────────────────────────────
create policy "auth_select" on transactions
  for select
  using (auth.uid() is not null and user_id = auth.uid());

create policy "auth_insert" on transactions
  for insert
  with check (auth.uid() is not null and user_id = auth.uid());

create policy "auth_update" on transactions
  for update
  using (auth.uid() is not null and user_id = auth.uid());

create policy "auth_delete" on transactions
  for delete
  using (auth.uid() is not null and user_id = auth.uid());
