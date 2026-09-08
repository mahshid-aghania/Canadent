-- ─────────────────────────────────────────────────────────────────────────
-- CanaDent — Supabase schema
-- Run this once in the Supabase SQL editor (or `supabase db push`) after the
-- project is provisioned. Safe to re-run: guarded with IF NOT EXISTS.
-- ─────────────────────────────────────────────────────────────────────────

create extension if not exists "pgcrypto";

-- One row per completed course registration, written server-side by the Stripe
-- webhook after payment is confirmed. This is the source of truth for the
-- admin registration list and exports.
create table if not exists public.registrations (
  id                     uuid primary key default gen_random_uuid(),
  created_at             timestamptz not null default now(),

  course_slug            text not null,
  course_title           text not null,
  attendance             text,                 -- e.g. "Online Attendance" / "In-Person Attendance"

  student_name           text,
  student_email          text not null,
  -- Operational contact number for essential course communication. Stored
  -- server-side only; never exposed on public pages, analytics, or the client.
  student_phone          text,

  amount_total_cents     integer,              -- final charged amount incl. HST
  currency               text default 'cad',

  stripe_session_id      text unique,          -- idempotency: one row per Checkout session
  stripe_payment_intent  text,

  utm                    jsonb default '{}'::jsonb,

  -- Marketing consent is separate from the operational phone number. Only set
  -- to true (with a timestamp) when the student explicitly opts in.
  marketing_consent      boolean not null default false,
  marketing_consent_at   timestamptz
);

create index if not exists registrations_course_slug_idx on public.registrations (course_slug);
create index if not exists registrations_created_at_idx on public.registrations (created_at desc);

-- Lock the table down. RLS is enabled with NO public policies, so the anon and
-- authenticated roles cannot read or write it. Only the service-role key (used
-- by the webhook) bypasses RLS. Add narrower policies later when you build the
-- authenticated student dashboard / admin views.
alter table public.registrations enable row level security;
