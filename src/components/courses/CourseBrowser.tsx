"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CourseCard, courseGridClass } from "@/components/CourseCard";
import { ScrollReveal } from "@/components/ScrollReveal";
import type { CourseCardModel } from "@/lib/course-status";

type Tab = "upcoming" | "past";

const TABS: { id: Tab; label: string }[] = [
  { id: "upcoming", label: "Upcoming Courses" },
  { id: "past", label: "Past Courses" },
];

const ALL = "all";

function normalizeTab(value: string | null | undefined): Tab {
  return value === "past" ? "past" : "upcoming";
}

/**
 * Tabbed, filterable course browser. Tab + category live in the URL query
 * (?tab=&category=) via the native History API so the view is bookmarkable and
 * survives browser back/forward — all without a full page reload. The initial
 * values are seeded from the server (searchParams) so the correct tab renders
 * in the SSR HTML; a popstate listener keeps state in sync afterwards.
 */
export function CourseBrowser({
  upcoming,
  past,
  initialTab = "upcoming",
  initialCategory = ALL,
}: {
  upcoming: CourseCardModel[];
  past: CourseCardModel[];
  initialTab?: Tab;
  initialCategory?: string;
}) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const [category, setCategory] = useState<string>(initialCategory);
  const tablistRef = useRef<HTMLDivElement>(null);

  // Keep state in sync when the user navigates with browser back/forward.
  useEffect(() => {
    const sync = () => {
      const params = new URLSearchParams(window.location.search);
      setTab(normalizeTab(params.get("tab")));
      setCategory(params.get("category") ?? ALL);
    };
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  const writeUrl = useCallback((nextTab: Tab, nextCategory: string) => {
    const params = new URLSearchParams(window.location.search);
    if (nextTab === "upcoming") params.delete("tab");
    else params.set("tab", nextTab);
    if (nextCategory === ALL) params.delete("category");
    else params.set("category", nextCategory);
    const qs = params.toString();
    window.history.pushState(null, "", qs ? `?${qs}` : window.location.pathname);
  }, []);

  const selectTab = useCallback(
    (next: Tab) => {
      // Category context doesn't carry across groups — reset to All.
      setTab(next);
      setCategory(ALL);
      writeUrl(next, ALL);
    },
    [writeUrl],
  );

  const selectCategory = useCallback(
    (cat: string) => {
      setCategory(cat);
      writeUrl(tab, cat);
    },
    [tab, writeUrl],
  );

  const activeList = tab === "past" ? past : upcoming;

  // Categories present within the selected group only.
  const categories = useMemo(
    () => Array.from(new Set(activeList.map((c) => c.category))).sort((a, b) => a.localeCompare(b)),
    [activeList],
  );

  const filtered = useMemo(
    () => (category === ALL ? activeList : activeList.filter((c) => c.category === category)),
    [activeList, category],
  );

  // Roving arrow-key navigation across the tabs.
  const onTabKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const idx = TABS.findIndex((t) => t.id === tab);
      let nextIdx = idx;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") nextIdx = (idx + 1) % TABS.length;
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") nextIdx = (idx - 1 + TABS.length) % TABS.length;
      else if (e.key === "Home") nextIdx = 0;
      else if (e.key === "End") nextIdx = TABS.length - 1;
      else return;
      e.preventDefault();
      selectTab(TABS[nextIdx].id);
      const buttons = tablistRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
      buttons?.[nextIdx]?.focus();
    },
    [tab, selectTab],
  );

  const counts: Record<Tab, number> = { upcoming: upcoming.length, past: past.length };

  return (
    <div>
      {/* Tabs */}
      <div
        ref={tablistRef}
        role="tablist"
        aria-label="Course timing"
        onKeyDown={onTabKeyDown}
        className="flex gap-2 border-b border-[#1a1a2e]/10"
      >
        {TABS.map((t) => {
          const selected = t.id === tab;
          return (
            <button
              key={t.id}
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={selected}
              aria-controls="course-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => selectTab(t.id)}
              className={`relative -mb-px inline-flex min-h-[44px] items-center gap-2 rounded-t-lg px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c] focus-visible:ring-offset-2 sm:px-5 ${
                selected ? "text-[#0f2150]" : "text-[#1a1a2e]/50 hover:text-[#1a1a2e]/80"
              }`}
            >
              {t.label}
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                  selected ? "bg-[#c9a84c] text-white" : "bg-[#1a1a2e]/8 text-[#1a1a2e]/50"
                }`}
              >
                {counts[t.id]}
              </span>
              {selected && (
                <span
                  aria-hidden
                  className="absolute inset-x-0 -bottom-px h-0.5 rounded-full"
                  style={{ background: "#c9a84c" }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Category filters (within the selected group) */}
      {categories.length > 1 && (
        <div className="mt-6 flex flex-wrap gap-2">
          <FilterPill active={category === ALL} onClick={() => selectCategory(ALL)}>
            All Categories
          </FilterPill>
          {categories.map((cat) => (
            <FilterPill key={cat} active={category === cat} onClick={() => selectCategory(cat)}>
              {cat}
            </FilterPill>
          ))}
        </div>
      )}

      {/* Course grid / empty state */}
      <div role="tabpanel" id="course-panel" aria-labelledby={`tab-${tab}`} className="mt-8">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-[#1a1a2e]/8 bg-white/60 py-16 text-center">
            <p className="text-[#1a1a2e]/60">
              {activeList.length === 0
                ? `No ${tab === "past" ? "past" : "upcoming"} courses to show right now.`
                : "No courses match this category."}
            </p>
            {category !== ALL && (
              <button
                onClick={() => selectCategory(ALL)}
                className="mt-4 inline-flex min-h-[44px] items-center rounded-full bg-[#c9a84c] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#b8963d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c] focus-visible:ring-offset-2"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className={courseGridClass(filtered.length)}>
            {filtered.map((course, i) => (
              <ScrollReveal key={course.slug} delay={Math.min(i % 3, 2) * 80}>
                <CourseCard course={course} priority={i < 3} />
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`inline-flex min-h-[44px] items-center rounded-full px-4 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c] focus-visible:ring-offset-2 ${
        active
          ? "bg-[#c9a84c] text-white"
          : "border border-[#1a1a2e]/15 text-[#1a1a2e]/65 hover:border-[#c9a84c]/50 hover:text-[#0f2150]"
      }`}
    >
      {children}
    </button>
  );
}
