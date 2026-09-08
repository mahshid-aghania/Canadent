"use client";

// Shared state for the "Request This Course Again" experience: which courses are
// selected, whether the interest dialog is open, and the submission lifecycle.
// One provider instance backs a surface (the courses section, the homepage
// section, or a single course page), so cards, the selection bar, and the dialog
// all stay in sync.

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  validateRequest,
  type CourseRequestInput,
  type CourseSummary,
  type FieldErrors,
} from "@/lib/course-requests";
import { track } from "@/lib/analytics";

type Phase = "idle" | "submitting" | "success" | "error";

export type SubmitResultItem = {
  slug: string;
  title: string;
  status: "created" | "updated";
};
export type SubmitResult = {
  results: SubmitResultItem[];
  anyUpdated: boolean;
};

export type FormValues = {
  name: string;
  email: string;
  phone: string;
  role: string;
  attendance?: string;
  timing?: string;
  message?: string;
  consent: boolean;
};

interface Ctx {
  surface: string;
  selected: CourseSummary[];
  count: number;
  isSelected: (slug: string) => boolean;
  toggle: (course: CourseSummary) => void;
  remove: (slug: string) => void;
  dialogOpen: boolean;
  openDialog: () => void;
  closeDialog: () => void;
  phase: Phase;
  errorMessage: string | null;
  fieldErrors: FieldErrors;
  result: SubmitResult | null;
  submit: (values: FormValues) => Promise<void>;
  reset: () => void;
}

const CourseRequestContext = createContext<Ctx | null>(null);

export function useCourseRequest(): Ctx {
  const ctx = useContext(CourseRequestContext);
  if (!ctx)
    throw new Error("useCourseRequest must be used within CourseRequestProvider");
  return ctx;
}

/** UTM params only — never PII. */
function readUtm(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const utm: Record<string, string> = {};
  const params = new URLSearchParams(window.location.search);
  for (const [k, v] of params.entries()) {
    if (k.toLowerCase().startsWith("utm_") && v) utm[k.toLowerCase()] = v;
  }
  return utm;
}

export function CourseRequestProvider({
  surface,
  initialSelected = [],
  children,
}: {
  surface: string;
  initialSelected?: CourseSummary[];
  children: ReactNode;
}) {
  const [selected, setSelected] = useState<CourseSummary[]>(initialSelected);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [result, setResult] = useState<SubmitResult | null>(null);
  // Tracks whether the visitor engaged with the form, so we can emit an
  // "abandoned" event if they close it without submitting.
  const formStartedRef = useRef(false);

  const isSelected = useCallback(
    (slug: string) => selected.some((c) => c.slug === slug),
    [selected]
  );

  const openDialog = useCallback(() => {
    setPhase("idle");
    setErrorMessage(null);
    setFieldErrors({});
    setDialogOpen(true);
    formStartedRef.current = true;
    track("request_form_started", { surface, count: selected.length });
  }, [surface, selected.length]);

  const closeDialog = useCallback(() => {
    setDialogOpen(false);
    // Only count as abandoned if they engaged and did not reach success.
    if (formStartedRef.current && phase !== "success") {
      track("request_form_abandoned", { surface, count: selected.length });
    }
    formStartedRef.current = false;
  }, [surface, selected.length, phase]);

  const toggle = useCallback(
    (course: CourseSummary) => {
      setSelected((prev) => {
        const exists = prev.some((c) => c.slug === course.slug);
        if (exists) {
          track("request_course_deselected", { slug: course.slug, surface });
          return prev.filter((c) => c.slug !== course.slug);
        }
        track("request_course_selected", {
          slug: course.slug,
          surface,
          count: prev.length + 1,
        });
        return [...prev, course];
      });
    },
    [surface]
  );

  const remove = useCallback((slug: string) => {
    setSelected((prev) => prev.filter((c) => c.slug !== slug));
  }, []);

  const reset = useCallback(() => {
    setSelected([]);
    setDialogOpen(false);
    setPhase("idle");
    setResult(null);
    setErrorMessage(null);
    setFieldErrors({});
    formStartedRef.current = false;
  }, []);

  const submit = useCallback(
    async (values: FormValues) => {
      const slugs = selected.map((c) => c.slug);
      const payload: CourseRequestInput = { ...values, slugs, utm: readUtm() };

      // Validate client-side first for instant inline feedback.
      const { errors } = validateRequest(payload);
      setFieldErrors(errors);
      if (Object.keys(errors).length > 0) {
        setPhase("error");
        setErrorMessage("Please check the highlighted fields and try again.");
        return;
      }

      setPhase("submitting");
      setErrorMessage(null);
      try {
        const res = await fetch("/api/course-requests", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          if (data?.fieldErrors) setFieldErrors(data.fieldErrors);
          setPhase("error");
          setErrorMessage(
            data?.error ??
              "Something went wrong submitting your request. Please try again."
          );
          return;
        }

        const submitResult: SubmitResult = {
          results: data.results ?? [],
          anyUpdated: Boolean(data.anyUpdated),
        };
        setResult(submitResult);
        setPhase("success");
        formStartedRef.current = false;
        track("request_submitted", { surface, count: slugs.length });
      } catch {
        setPhase("error");
        setErrorMessage(
          "We couldn't reach the server. Please check your connection and try again."
        );
      }
    },
    [selected, surface]
  );

  const value = useMemo<Ctx>(
    () => ({
      surface,
      selected,
      count: selected.length,
      isSelected,
      toggle,
      remove,
      dialogOpen,
      openDialog,
      closeDialog,
      phase,
      errorMessage,
      fieldErrors,
      result,
      submit,
      reset,
    }),
    [
      surface,
      selected,
      isSelected,
      toggle,
      remove,
      dialogOpen,
      openDialog,
      closeDialog,
      phase,
      errorMessage,
      fieldErrors,
      result,
      submit,
      reset,
    ]
  );

  return (
    <CourseRequestContext.Provider value={value}>
      {children}
    </CourseRequestContext.Provider>
  );
}
