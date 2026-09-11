"use client";

import { useState, useTransition } from "react";
import { UploadCloud, CheckCircle2, AlertTriangle, Copy } from "lucide-react";
import { previewImport, commitImportAction } from "@/app/accountant/admin-actions";
import type { ImportPreview, PreviewAction } from "@/lib/accounting/import-service";
import { formatCents } from "@/lib/accounting/money";
import { attendanceLabel } from "@/lib/accounting/labels";

const ACTION_LABELS: Record<PreviewAction, string> = {
  create: "New", link: "Link to existing", update: "Update", unchanged: "Unchanged", review: "Needs review",
};
const ACTION_BADGE: Record<PreviewAction, string> = {
  create: "badge-available", link: "badge-upcoming", update: "badge-early-bird", unchanged: "badge-past", review: "badge-sold-out",
};

export function ImportWizard({ courses }: { courses: { slug: string; title: string }[] }) {
  const [file, setFile] = useState<File | null>(null);
  const [courseSlug, setCourseSlug] = useState("");
  const [sheet, setSheet] = useState("Registrants");
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [includeReview, setIncludeReview] = useState<Set<number>>(new Set());
  const [pending, startTransition] = useTransition();

  function buildFormData(): FormData {
    const fd = new FormData();
    if (file) fd.set("file", file);
    fd.set("courseSlug", courseSlug);
    fd.set("sheet", sheet);
    return fd;
  }

  function onPreview() {
    setError(null); setMessage(null); setPreview(null);
    startTransition(async () => {
      const res = await previewImport(null, buildFormData());
      if (res?.error) setError(res.error);
      else if (res?.preview) setPreview(res.preview);
    });
  }

  function onCommit() {
    setError(null); setMessage(null);
    startTransition(async () => {
      const fd = buildFormData();
      fd.set("includeReviewRows", [...includeReview].join(","));
      const res = await commitImportAction(null, fd);
      if (res?.error) setError(res.error);
      else { setMessage(res?.message ?? "Import complete."); setPreview(null); setFile(null); }
    });
  }

  const field = "w-full rounded-lg border border-[#e2e8f0] px-3 py-2 text-sm focus:border-[#1b3a8a] focus:outline-none focus:ring-2 focus:ring-[#1b3a8a]/20";

  return (
    <div className="space-y-5">
      <div className="card p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block sm:col-span-1">
            <span className="mb-1 block text-xs font-medium text-[#1a1a2e]/60">Course</span>
            <select className={field} value={courseSlug} onChange={(e) => setCourseSlug(e.target.value)}>
              <option value="">Select a course…</option>
              {courses.map((c) => <option key={c.slug} value={c.slug}>{c.title}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-[#1a1a2e]/60">Worksheet</span>
            <input className={field} value={sheet} onChange={(e) => setSheet(e.target.value)} />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-[#1a1a2e]/60">Spreadsheet (.xlsx)</span>
            <input className={field} type="file" accept=".xlsx,.xls" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          </label>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <button onClick={onPreview} disabled={pending || !file || !courseSlug} className="btn-primary inline-flex items-center gap-2 text-sm disabled:opacity-50">
            <UploadCloud className="h-4 w-4" aria-hidden="true" /> {pending ? "Reading…" : "Preview import"}
          </button>
          <p className="text-xs text-[#1a1a2e]/50">Nothing is saved until you review and confirm.</p>
        </div>
      </div>

      {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{error}</p>}
      {message && (
        <p className="flex items-center gap-2 rounded-lg bg-[#ecfdf5] px-4 py-3 text-sm text-[#065f46]">
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> {message}
        </p>
      )}

      {preview && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {(Object.keys(ACTION_LABELS) as PreviewAction[]).map((a) => (
              <span key={a} className={`${ACTION_BADGE[a]}`}>{preview.counts[a]} {ACTION_LABELS[a]}</span>
            ))}
          </div>

          {preview.parseErrors.length > 0 && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {preview.parseErrors.map((e, i) => <p key={i}>{e}</p>)}
            </div>
          )}
          {preview.inFileDuplicates.length > 0 && (
            <div className="rounded-lg bg-[#fef3c7] px-4 py-3 text-sm text-[#92400e]">
              <p className="flex items-center gap-2 font-medium"><Copy className="h-4 w-4" aria-hidden="true" /> Possible duplicates within this file</p>
              {preview.inFileDuplicates.map((d, i) => (
                <p key={i} className="mt-1 text-xs">{d.reason}: rows {d.rows.join(", ")}</p>
              ))}
            </div>
          )}

          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] text-sm">
                <thead>
                  <tr className="border-b border-[#1a1a2e]/8 bg-[#f9fafb] text-left text-[11px] font-bold uppercase tracking-wide text-[#1a1a2e]/45">
                    <th className="px-3 py-2.5">Row</th>
                    <th className="px-3 py-2.5">Participant</th>
                    <th className="px-3 py-2.5">Email</th>
                    <th className="px-3 py-2.5">Fee</th>
                    <th className="px-3 py-2.5">Status</th>
                    <th className="px-3 py-2.5">Attendance</th>
                    <th className="px-3 py-2.5">Action</th>
                    <th className="px-3 py-2.5">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.items.map((it) => (
                    <tr key={it.sourceRow} className="border-b border-[#1a1a2e]/6 last:border-0 align-top">
                      <td className="px-3 py-2.5 text-[#1a1a2e]/50">{it.sourceRow}</td>
                      <td className="px-3 py-2.5 font-medium text-[#0f2150]">{it.registrant.name ?? "—"}{it.registrant.organization ? <span className="block text-xs font-normal text-[#1a1a2e]/50">{it.registrant.organization}</span> : null}</td>
                      <td className="px-3 py-2.5 text-[#1a1a2e]/70">
                        {it.registrant.email ?? <span className="inline-flex items-center gap-1 text-[#92400e]"><AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" /> Missing</span>}
                      </td>
                      <td className="px-3 py-2.5 tabular-nums">{formatCents(it.registrant.feeCents)}</td>
                      <td className="px-3 py-2.5 text-[#1a1a2e]/70">{it.registrant.originalStatus ?? "—"}</td>
                      <td className="px-3 py-2.5 text-[#1a1a2e]/70">{attendanceLabel(it.registrant.attendance === "not_specified" ? null : it.registrant.attendance)}</td>
                      <td className="px-3 py-2.5">
                        <span className={ACTION_BADGE[it.action]}>{ACTION_LABELS[it.action]}</span>
                        {it.action === "review" && (
                          <label className="mt-1 flex items-center gap-1.5 text-xs text-[#1a1a2e]/60">
                            <input
                              type="checkbox"
                              checked={includeReview.has(it.sourceRow)}
                              onChange={(e) => {
                                const next = new Set(includeReview);
                                if (e.target.checked) next.add(it.sourceRow); else next.delete(it.sourceRow);
                                setIncludeReview(next);
                              }}
                            />
                            Import anyway
                          </label>
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-xs text-[#1a1a2e]/55">{it.notes.join(" ")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={onCommit} disabled={pending} className="btn-primary inline-flex items-center gap-2 text-sm disabled:opacity-50">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> {pending ? "Importing…" : "Confirm & import"}
            </button>
            <button onClick={() => setPreview(null)} className="btn-secondary text-sm">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
