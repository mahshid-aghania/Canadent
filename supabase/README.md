# Supabase — course interest list

Durable storage for the "Request This Course Again" feature. Until the two
environment variables below are set, the app runs on a **non-persistent
in-memory store** (safe, but requests are not saved). Once they're set, the app
automatically uses Supabase — no code change required.

## 1. Apply the migration

Run `migrations/20260903180000_course_requests.sql` against the Supabase project
(`uyfayhofeqjigyzoglst`). Any of:

- Supabase Dashboard → **SQL Editor** → paste the file → **Run**
- Supabase CLI: `supabase db push`
- The Supabase MCP server (ask Claude to apply it)

It creates `public.course_requests` with a unique index on `(email, slug)` (the
dedupe key), supporting indexes, and RLS enabled with no public policies.

## 2. Set environment variables

Set these on **Vercel** (Project → Settings → Environment Variables) and in a
local `.env.local` for development:

| Variable | Value |
| --- | --- |
| `SUPABASE_URL` | `https://uyfayhofeqjigyzoglst.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Project → Settings → API → **service_role** secret |

> ⚠️ The service role key bypasses Row Level Security. It is used **server-side
> only** (API route + admin pages) and must never be exposed to the browser or
> committed to the repo.

## 3. Redeploy

Redeploy on Vercel so the new env vars are picked up. Submit a test request and
confirm the row appears in the Supabase table and in `/admin/course-requests`.

## How it maps to the code

- `src/lib/course-requests-store.ts` — `SupabaseCourseRequestStore` implements
  the `CourseRequestStore` interface (`save` / `all` / `bySlug`) and is selected
  automatically when both env vars are present.
- Dedupe: `save()` normalises the email to lower-case and updates an existing
  `(email, slug)` row in place instead of inserting a duplicate.
