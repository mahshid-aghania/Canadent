-- "Request This Course Again" — interest-list storage
-- One row per (email, slug). A repeat submission updates preferences in place
-- instead of creating a duplicate vote (enforced by the unique index below).

create table if not exists public.course_requests (
  id           uuid primary key default gen_random_uuid(),
  slug         text        not null,
  course_title text        not null,
  name         text        not null,
  email        text        not null,
  phone        text        not null,
  role         text        not null,
  attendance   text,
  timing       text,
  message      text,
  consent      boolean     not null default false,
  utm          jsonb,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Dedupe key: one interest record per person per course. Email is stored
-- lower-cased by the app, so a plain unique index is sufficient.
create unique index if not exists course_requests_email_slug_key
  on public.course_requests (email, slug);

-- Fast lookups for the admin demand aggregations.
create index if not exists course_requests_slug_idx
  on public.course_requests (slug);
create index if not exists course_requests_created_at_idx
  on public.course_requests (created_at desc);

-- Lock the table down. The app connects with the service role key, which
-- bypasses RLS; no anon/public access is granted, so the interest list (which
-- contains contact details) is never readable from the browser.
alter table public.course_requests enable row level security;
