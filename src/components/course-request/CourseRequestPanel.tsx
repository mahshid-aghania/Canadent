"use client";

import { CalendarPlus, Bell } from "lucide-react";
import type { CourseSummary } from "@/lib/course-requests";
import { CourseRequestProvider, useCourseRequest } from "./CourseRequestProvider";
import { RequestInterestDialog } from "./RequestInterestDialog";

/**
 * Replaces the registration / sold-out area on a course page that has ended or
 * is unavailable. The course is pre-selected, so the dialog opens ready to send.
 * The rest of the page (curriculum, instructor, details) stays intact.
 */
export function CourseRequestPanel({ course }: { course: CourseSummary }) {
  return (
    <CourseRequestProvider surface="course-detail" initialSelected={[course]}>
      <PanelInner />
      <RequestInterestDialog />
    </CourseRequestProvider>
  );
}

function PanelInner() {
  const { openDialog } = useCourseRequest();
  return (
    <div className="req-panel">
      <div className="flex items-center gap-2 mb-2">
        <span className="req-badge-previous">Previously Offered</span>
      </div>
      <h2 className="font-heading text-xl font-bold text-[#0f2150] mb-2">
        Would you like this course to return?
      </h2>
      <p className="text-sm text-[#1a1a2e]/65 leading-relaxed mb-4">
        This session has ended and no new date has been announced yet. Request another
        session and we&apos;ll notify you if the course returns.
      </p>
      <button type="button" onClick={openDialog} className="btn-primary w-full">
        <CalendarPlus className="h-4 w-4" aria-hidden="true" />
        Request a New Date
      </button>
      <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-[#1a1a2e]/50">
        <Bell className="h-3.5 w-3.5" style={{ color: "#c9a84c" }} aria-hidden="true" />
        Join the interest list — free, and no commitment to register.
      </p>
    </div>
  );
}
