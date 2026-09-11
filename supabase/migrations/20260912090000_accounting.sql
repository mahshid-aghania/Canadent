-- ─────────────────────────────────────────────────────────────────────────
-- CanaDent — Accountant Dashboard schema
--
-- Adds staff auth/roles, the accounting domain (students, registrations,
-- invoices, payments, allocations, receipts, documents), import tracking, a
-- financial-settings singleton, and an audit log. Money is stored as integer
-- minor units (cents); currency is always explicit.
--
-- Security model (defence in depth):
--   • Every acct_* table has RLS ON. Only staff (admin/accountant) can read;
--     only admins (or accountants explicitly granted can_edit_financials) can
--     write. The anon + ordinary authenticated (student) roles get nothing.
--   • App server code additionally re-checks the caller's role on every route
--     and server action, and uses the service-role key (which bypasses RLS)
--     only after that check. RLS is the backstop, not the only gate.
--
-- Safe to re-run: guarded with IF NOT EXISTS / CREATE OR REPLACE.
-- ─────────────────────────────────────────────────────────────────────────

create extension if not exists "pgcrypto";

-- ── Roles & users ───────────────────────────────────────────────────────────
-- One row per Supabase Auth user, carrying their role. 'student' is the safe
-- default so ordinary signups can NEVER see accounting data. Staff roles are
-- only ever granted via an accepted invitation or an admin action.
create table if not exists public.app_users (
  id                   uuid primary key references auth.users (id) on delete cascade,
  email                text not null,
  full_name            text,
  role                 text not null default 'student'
                         check (role in ('admin', 'accountant', 'student')),
  -- Accountants are read-only by default; this must be explicitly set by an
  -- admin to allow financial edits. Ignored for admins (who can always edit).
  can_edit_financials  boolean not null default false,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

-- Auto-provision an app_users row (role 'student') whenever an auth user is
-- created, so a bare signup is always a student and never staff.
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.app_users (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

-- Role lookups used by RLS policies. SECURITY DEFINER so they can read
-- app_users without tripping that table's own RLS (avoids recursion).
create or replace function public.app_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.app_users where id = auth.uid();
$$;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.app_role() in ('admin', 'accountant'), false);
$$;

create or replace function public.can_edit_financials()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select role = 'admin' or (role = 'accountant' and can_edit_financials)
       from public.app_users where id = auth.uid()),
    false);
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.app_role() = 'admin', false);
$$;

alter table public.app_users enable row level security;
-- A user may read their own row; admins may read everyone.
drop policy if exists app_users_select on public.app_users;
create policy app_users_select on public.app_users
  for select using (id = auth.uid() or public.is_admin());
-- Only admins may change roles/permissions (service role bypasses RLS anyway).
drop policy if exists app_users_admin_write on public.app_users;
create policy app_users_admin_write on public.app_users
  for all using (public.is_admin()) with check (public.is_admin());

-- ── Staff invitations ────────────────────────────────────────────────────────
-- Invitation-based access: an admin creates an invite; the invitee accepts it
-- (sets a password, verifies email via Supabase) and is then promoted to their
-- invited role. We store only a SHA-256 hash of the raw token.
create table if not exists public.accountant_invitations (
  id            uuid primary key default gen_random_uuid(),
  email         text not null,
  role          text not null default 'accountant'
                  check (role in ('admin', 'accountant')),
  token_hash    text not null,
  invited_by    uuid references auth.users (id),
  created_at    timestamptz not null default now(),
  expires_at    timestamptz not null,
  accepted_at   timestamptz,
  status        text not null default 'pending'
                  check (status in ('pending', 'accepted', 'revoked', 'expired'))
);
create unique index if not exists accountant_invitations_pending_email_idx
  on public.accountant_invitations (lower(email)) where status = 'pending';
create index if not exists accountant_invitations_token_idx
  on public.accountant_invitations (token_hash);

alter table public.accountant_invitations enable row level security;
drop policy if exists invitations_admin_all on public.accountant_invitations;
create policy invitations_admin_all on public.accountant_invitations
  for all using (public.is_admin()) with check (public.is_admin());

-- ── Financial settings (singleton) ───────────────────────────────────────────
-- Admin-configured legal seller details and tax settings. New invoices use
-- these; imported course fees are NEVER auto-taxed.
create table if not exists public.acct_settings (
  id                boolean primary key default true check (id),
  seller            jsonb not null default '{}'::jsonb,
  tax_label         text,
  tax_rate_bps      integer,              -- basis points, e.g. 1300 = 13% HST
  default_currency  text not null default 'cad',
  invoice_prefix    text not null default 'CD',
  updated_by        uuid references auth.users (id),
  updated_at        timestamptz not null default now()
);
insert into public.acct_settings (id) values (true) on conflict (id) do nothing;

alter table public.acct_settings enable row level security;
drop policy if exists settings_staff_read on public.acct_settings;
create policy settings_staff_read on public.acct_settings
  for select using (public.is_staff());
drop policy if exists settings_admin_write on public.acct_settings;
create policy settings_admin_write on public.acct_settings
  for all using (public.is_admin()) with check (public.is_admin());

-- ── Imports ──────────────────────────────────────────────────────────────────
create table if not exists public.acct_imports (
  id             uuid primary key default gen_random_uuid(),
  filename       text not null,
  sheet          text,
  course_slug    text,
  course_title   text,
  imported_by    uuid references auth.users (id),
  created_at     timestamptz not null default now(),
  row_count      integer not null default 0,
  created_count  integer not null default 0,
  updated_count  integer not null default 0,
  skipped_count  integer not null default 0,
  summary        jsonb not null default '{}'::jsonb
);

-- ── Students (canonical people) ──────────────────────────────────────────────
create table if not exists public.acct_students (
  id               uuid primary key default gen_random_uuid(),
  full_name        text not null,
  organization     text,
  email            text,
  -- Generated lowercase email for case-insensitive matching/dedup.
  email_normalized text generated always as (nullif(lower(trim(email)), '')) stored,
  flags            jsonb not null default '{}'::jsonb,   -- e.g. {"missing_email": true}
  notes            text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create unique index if not exists acct_students_email_idx
  on public.acct_students (email_normalized) where email_normalized is not null;

-- ── Registrations (a student enrolled in a course offering) ──────────────────
create table if not exists public.acct_registrations (
  id                   uuid primary key default gen_random_uuid(),
  student_id           uuid not null references public.acct_students (id) on delete cascade,
  course_slug          text,
  course_title         text not null,
  course_date          text,                 -- human date, stored verbatim
  delivery             text,                 -- e.g. "Hybrid"
  -- NULL = attendance was blank in the source. The UI renders "Not specified";
  -- we never infer In-Person vs Online.
  attendance_format    text,
  imported_fee_cents   integer,              -- exact per-row fee; never a flat price
  currency             text not null default 'cad',
  original_import_status text,               -- e.g. "Confirmed" (verbatim)
  -- Payment verification is SEPARATE from the imported status. Starts
  -- 'unverified' until real payment evidence is matched.
  payment_verification text not null default 'unverified'
                         check (payment_verification in
                           ('unverified', 'verified', 'partial', 'refunded')),
  -- Provenance for traceability + idempotent re-imports.
  import_id            uuid references public.acct_imports (id),
  source_file          text,
  source_sheet         text,
  source_row           integer,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);
-- Idempotency by source identity: the same spreadsheet row can only land once.
create unique index if not exists acct_registrations_source_idx
  on public.acct_registrations (source_file, source_sheet, source_row)
  where source_file is not null;
create index if not exists acct_registrations_student_idx
  on public.acct_registrations (student_id);
create index if not exists acct_registrations_course_idx
  on public.acct_registrations (course_slug);

-- ── Invoices ─────────────────────────────────────────────────────────────────
create table if not exists public.acct_invoices (
  id               uuid primary key default gen_random_uuid(),
  invoice_number   text,                     -- nullable for historical docs; unique when set
  student_id       uuid references public.acct_students (id),
  registration_id  uuid references public.acct_registrations (id),
  issue_date       date,
  due_date         date,
  seller           jsonb not null default '{}'::jsonb,
  bill_to          jsonb not null default '{}'::jsonb,
  course_slug      text,
  course_title     text,
  line_items       jsonb not null default '[]'::jsonb,
  currency         text not null default 'cad',
  subtotal_cents   integer not null default 0,
  discount_cents   integer not null default 0,
  tax_cents        integer,                  -- NULL = unknown; never auto-filled
  tax_label        text,
  total_cents      integer not null default 0,
  status           text not null default 'draft'
                     check (status in ('draft','issued','partially_paid','paid','overdue','void')),
  notes            text,
  created_by       uuid references auth.users (id),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create unique index if not exists acct_invoices_number_idx
  on public.acct_invoices (invoice_number) where invoice_number is not null;
create index if not exists acct_invoices_student_idx on public.acct_invoices (student_id);

-- ── Payments (real money movements) ──────────────────────────────────────────
create table if not exists public.acct_payments (
  id               uuid primary key default gen_random_uuid(),
  student_id       uuid references public.acct_students (id),
  amount_cents     integer not null,         -- negative for refunds (is_refund = true)
  currency         text not null default 'cad',
  method           text,                     -- 'card','etransfer','cash','cheque','other'
  source           text not null default 'manual'
                     check (source in ('stripe','manual','import')),
  paid_at          timestamptz,              -- NULL = unknown; never invented
  reference        text,                     -- e-transfer ref / cheque no.
  provider_ref     text,                     -- stripe payment_intent / charge id
  seller           jsonb not null default '{}'::jsonb,
  -- A payment is only "verified" once supporting evidence is recorded.
  verified         boolean not null default false,
  verified_by      uuid references auth.users (id),
  verified_at      timestamptz,
  is_refund        boolean not null default false,
  is_fee           boolean not null default false,   -- processor fee, not customer money
  status           text not null default 'succeeded'
                     check (status in ('succeeded','pending','failed','refunded')),
  created_by       uuid references auth.users (id),
  created_at       timestamptz not null default now()
);
-- Webhook idempotency: one row per provider reference.
create unique index if not exists acct_payments_provider_idx
  on public.acct_payments (provider_ref) where provider_ref is not null;
create index if not exists acct_payments_student_idx on public.acct_payments (student_id);

-- ── Payment → invoice allocations ────────────────────────────────────────────
create table if not exists public.acct_payment_allocations (
  id           uuid primary key default gen_random_uuid(),
  payment_id   uuid not null references public.acct_payments (id) on delete cascade,
  invoice_id   uuid not null references public.acct_invoices (id) on delete cascade,
  amount_cents integer not null,
  created_at   timestamptz not null default now()
);
create index if not exists acct_alloc_invoice_idx on public.acct_payment_allocations (invoice_id);

-- ── Receipts (acknowledge a verified payment) ────────────────────────────────
create table if not exists public.acct_receipts (
  id                    uuid primary key default gen_random_uuid(),
  receipt_number        text,
  payment_id            uuid references public.acct_payments (id),
  student_id            uuid references public.acct_students (id),
  invoice_id            uuid references public.acct_invoices (id),
  amount_cents          integer,
  currency              text not null default 'cad',
  method                text,
  transaction_reference text,
  paid_at               timestamptz,
  seller                jsonb not null default '{}'::jsonb,
  created_by            uuid references auth.users (id),
  created_at            timestamptz not null default now()
);
create unique index if not exists acct_receipts_number_idx
  on public.acct_receipts (receipt_number) where receipt_number is not null;

-- ── Documents (private PDFs: invoices, receipts, evidence) ───────────────────
create table if not exists public.acct_documents (
  id            uuid primary key default gen_random_uuid(),
  kind          text not null default 'other'
                  check (kind in ('invoice','receipt','evidence','other')),
  storage_path  text not null,               -- path in the private 'accounting' bucket
  filename      text,
  mime          text,
  byte_size     integer,
  student_id    uuid references public.acct_students (id),
  invoice_id    uuid references public.acct_invoices (id),
  payment_id    uuid references public.acct_payments (id),
  receipt_id    uuid references public.acct_receipts (id),
  uploaded_by   uuid references auth.users (id),
  created_at    timestamptz not null default now()
);
create index if not exists acct_documents_student_idx on public.acct_documents (student_id);
create index if not exists acct_documents_invoice_idx on public.acct_documents (invoice_id);

-- ── Audit log ────────────────────────────────────────────────────────────────
create table if not exists public.acct_audit_events (
  id          uuid primary key default gen_random_uuid(),
  actor_id    uuid references auth.users (id),
  actor_email text,
  action      text not null,                 -- e.g. 'import.commit','payment.verify'
  entity      text,
  entity_id   uuid,
  meta        jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);
create index if not exists acct_audit_created_idx on public.acct_audit_events (created_at desc);

-- ── RLS for every acct_* table: staff read, editors write ────────────────────
do $$
declare t text;
begin
  foreach t in array array[
    'acct_settings','acct_imports','acct_students','acct_registrations',
    'acct_invoices','acct_payments','acct_payment_allocations','acct_receipts',
    'acct_documents','acct_audit_events'
  ] loop
    execute format('alter table public.%I enable row level security;', t);
  end loop;
end $$;

-- Generic staff-read / editor-write policies for the data tables. (acct_settings
-- already has its own stricter admin-write policy above.)
do $$
declare t text;
begin
  foreach t in array array[
    'acct_imports','acct_students','acct_registrations','acct_invoices',
    'acct_payments','acct_payment_allocations','acct_receipts','acct_documents'
  ] loop
    execute format('drop policy if exists %I on public.%I;', t || '_staff_read', t);
    execute format(
      'create policy %I on public.%I for select using (public.is_staff());',
      t || '_staff_read', t);
    execute format('drop policy if exists %I on public.%I;', t || '_editor_write', t);
    execute format(
      'create policy %I on public.%I for all using (public.can_edit_financials()) with check (public.can_edit_financials());',
      t || '_editor_write', t);
  end loop;
end $$;

-- Audit events: staff can read; inserts happen via the service role only
-- (no authenticated write policy), so the log cannot be forged from the client.
drop policy if exists acct_audit_staff_read on public.acct_audit_events;
create policy acct_audit_staff_read on public.acct_audit_events
  for select using (public.is_staff());

-- ─────────────────────────────────────────────────────────────────────────
-- STORAGE: create a PRIVATE bucket named 'accounting' for financial PDFs.
-- Run once (bucket creation isn't expressible in plain SQL here):
--
--   insert into storage.buckets (id, name, public)
--   values ('accounting', 'accounting', false)
--   on conflict (id) do nothing;
--
-- Do NOT add public storage policies. All access goes through the server, which
-- checks the caller's role and then issues short-lived signed URLs using the
-- service-role key. See ACCOUNTANT_SETUP.md.
-- ─────────────────────────────────────────────────────────────────────────
