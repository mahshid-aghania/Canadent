# CanaDent Accountant Dashboard — setup

The accountant dashboard lives at **`/accountant`**. It reuses the site's existing
Supabase (Auth + Postgres + Storage), Stripe, and Resend integrations. This guide
is the one-time setup to take it from "Connection required" to fully working.

> Until the steps below are done, the dashboard degrades honestly: protected
> pages redirect to a sign-in screen that says the service isn't configured, and
> no financial figures are fabricated.

## 1. Environment variables

Set these (locally in `.env.local`, and in Vercel for deployed environments):

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Browser/session client (RLS-governed) |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Server-only. Bypasses RLS; used by dashboard server code, imports, document signing |
| `NEXT_PUBLIC_BASE_URL` | ✅ | Builds invite + password-reset links (e.g. `https://www.canadent.net`) |
| `RESEND_API_KEY` | optional | Emails invitations. If absent, an invite link is shown to the admin to share manually |
| `STRIPE_SECRET_KEY` | optional | Enables the Stripe reconciliation boundary |

## 2. Run the database migration

Apply `supabase/migrations/20260912090000_accounting.sql` (Supabase SQL editor or
`supabase db push`). It creates: `app_users`, `accountant_invitations`,
`acct_settings`, `acct_imports`, `acct_students`, `acct_registrations`,
`acct_invoices`, `acct_payments`, `acct_payment_allocations`, `acct_receipts`,
`acct_documents`, `acct_audit_events` — all with **RLS enabled** (staff-read,
editor-write) plus a trigger that makes every new auth user a `student` by
default (so ordinary signups can never see accounting data).

## 3. Create the private storage bucket

Financial PDFs live in a **private** bucket named `accounting`. Run once:

```sql
insert into storage.buckets (id, name, public)
values ('accounting', 'accounting', false)
on conflict (id) do nothing;
```

Do **not** add public storage policies. All access goes through
`/api/accountant/documents/[id]`, which authorises the request server-side and
issues a 60-second signed URL.

## 4. Seed the first administrator

Roles are only granted via an accepted invitation or an admin action — there's a
deliberate bootstrap step for the very first admin:

1. Create the user in **Supabase → Authentication → Users → Add user** (set a
   password, mark email confirmed).
2. Promote them in the SQL editor:
   ```sql
   update public.app_users set role = 'admin' where email = 'you@canadent.net';
   ```
3. Sign in at `/accountant/login`. You can now invite everyone else from
   **Settings** — no more SQL required.

## 5. Invite the accountant

**Settings → Invite staff** → enter her email, role **Accountant**. She receives
an email (or you share the link) → sets a password at `/accountant/accept-invite`
→ her email is confirmed and she's signed in. Accountants are **read-only by
default**; grant "Can edit financials" in Settings only if she should record
payments or upload/create documents.

## 6. Import the registrants spreadsheet

**Imports** (admin only) → choose the course (*Advanced Adhesive Dentistry: The
Master Blueprint*), worksheet `Registrants`, and the `.xlsx` file → **Preview**.
The preview shows new / link / update / unchanged / review rows, missing info,
and in-file duplicates. **Confirm & import** commits. Re-importing the same file
is safe (idempotent by file + sheet + row).

## 7. Optional — configure invoicing & tax

**Settings → Financial settings**: legal seller details, tax label/rate, invoice
prefix. These apply **only** when creating new invoices. Imported course fees are
never auto-taxed and never counted as collected revenue.

## 8. Optional — Stripe reconciliation

The seam is at `POST /api/accountant/stripe/sync`. With `STRIPE_SECRET_KEY` set it
reports "attribution required" until you configure a **brand-attribution rule**
(a metadata key/value, or a dedicated Stripe account) that explicitly identifies
CanaDent charges — so records from other brands on a shared account are never
imported by inference. Matching prefers explicit registration/order/invoice/
payment identifiers; email+amount are treated as suggestions only; upserts key on
the provider reference so webhook retries never double-count. It never initiates
charges, refunds, or customer emails.

## Security notes

- Access is enforced in three places: the `/accountant` **proxy** (session),
  the dashboard **layout/server actions** (`requireStaff`/`requireAdmin`/
  `requireEditor`), and Postgres **RLS**. Hiding nav is never the only gate.
- The service-role key stays server-side. Documents are private + signed.
  Imports, verifications, permission changes, document up/downloads, and exports
  are written to `acct_audit_events`.
- Direct-URL and modified-id access to documents/records fails without a valid
  staff session.
