"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ListChecks } from "lucide-react";
import { useCourseRequest } from "./CourseRequestProvider";

/**
 * Floating summary bar for a multi-select surface. Appears once at least one
 * course is selected and the dialog is closed, so the primary "submit" action is
 * always reachable without covering the cards.
 */
export function RequestSelectionBar() {
  const { count, dialogOpen, openDialog, phase } = useCourseRequest();
  const [mounted, setMounted] = useState(false);
  // Portal target only exists on the client; gate on mount.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  if (!mounted || count === 0 || dialogOpen || phase === "success") return null;

  return createPortal(
    <div className="req-selection-bar" role="region" aria-label="Your course requests">
      <div className="req-selection-bar__inner">
        <div className="flex items-center gap-2.5 min-w-0">
          <ListChecks className="h-5 w-5 shrink-0" style={{ color: "#c9a84c" }} aria-hidden="true" />
          <span className="font-semibold text-[#0f2150]" aria-live="polite">
            You selected {count} {count === 1 ? "course" : "courses"}
          </span>
        </div>
        <button type="button" onClick={openDialog} className="btn-primary shrink-0">
          {count === 1 ? "Submit My Request" : "Submit My Course Requests"}
        </button>
      </div>
    </div>,
    document.body
  );
}
