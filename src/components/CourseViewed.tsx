"use client";
import { useEffect } from "react";
import { track } from "@/lib/analytics";

/** Fires the privacy-safe course_viewed funnel event once on mount. */
export function CourseViewed({ slug }: { slug: string }) {
  useEffect(() => {
    track("course_viewed", { slug });
  }, [slug]);
  return null;
}
