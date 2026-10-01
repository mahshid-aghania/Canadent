// ── Single source of truth for the Three-Course Package ────────────────────
// The package bundles three continuing-education courses for one combined
// price. Allocations below are the SUPPLIED package prices for this bundle —
// they are intentionally different from (and do not change) the individual
// course prices in `courses.ts`.
//
// Like every course fee, the package total is stored TAX-EXCLUSIVE: Ontario
// HST (13%) is added on top at checkout. See `lib/tax.ts`.
//
// The third course is unconfirmed, so `isComplete` is false and purchasing is
// disabled site-wide until it is supplied. The server action in
// `actions/package-checkout.ts` refuses to create a Stripe session while the
// package is incomplete, so the preview can never take a real payment.

export type PackageCourse = {
  /** Course slug in `courses.ts`, when this course is a real catalogue entry. */
  slug: string | null;
  title: string;
  instructor: string | null;
  /** Public banner/poster in /public, reused verbatim from the course page. */
  image: string | null;
  /** Concise summary derived from the existing course description. */
  summary: string | null;
  /** This course's allocation within the package, in CAD (tax-exclusive). */
  allocationCAD: number;
  /** Link to the original, unchanged course page. */
  href: string | null;
  /** Confirmed content vs. a development placeholder. */
  confirmed: boolean;
};

export type CoursePackage = {
  slug: string;
  route: string;
  title: string;
  eyebrow: string;
  /** Combined package price in CAD, tax-exclusive (HST added at checkout). */
  totalCAD: number;
  courses: PackageCourse[];
};

export const threeCoursePackage: CoursePackage = {
  slug: "three-course-package",
  route: "/packages/three-course-package",
  title: "Three Courses. One Complete Learning Package.",
  eyebrow: "CanaDent Course Package",
  totalCAD: 850,
  courses: [
    {
      slug: "advanced-adhesive-dentistry-master-blueprint",
      title: "Advanced Adhesive Dentistry: The Master Blueprint",
      instructor: "Dr. Amin Asadollahi",
      image: "/course-adhesive-dentistry-poster.jpeg",
      summary:
        "A foundational blueprint mapping the full landscape of modern adhesive, biomimetic, and minimally invasive restorative dentistry — covering advanced isolation, bonding chemistry, Immediate Dentin Sealing and Deep Margin Elevation, and polymerization-stress control.",
      allocationCAD: 300,
      href: "/courses/advanced-adhesive-dentistry-master-blueprint",
      confirmed: true,
    },
    {
      slug: "overcoming-severe-curvatures-and-ledges-in-endodontics",
      title: "Overcoming Severe Curvatures and Ledges in Endodontics",
      instructor: "Dr. Kalantar Motamedi",
      image: "/course-overcoming-curvatures.jpeg",
      summary:
        "A practical, case-based lecture on managing some of the most challenging situations in endodontics — severely curved canals and ledged root canal systems — including hybrid and crown-down shaping and an innovative ledge-bypass method.",
      allocationCAD: 250,
      href: "/courses/overcoming-severe-curvatures-and-ledges-in-endodontics",
      confirmed: true,
    },
    {
      // Development placeholder — the supplied third-course URL duplicated
      // course 2, so the real course is pending confirmation. Do not invent it.
      slug: null,
      title: "Third course — to be confirmed",
      instructor: null,
      image: null,
      summary: null,
      allocationCAD: 300,
      href: null,
      confirmed: false,
    },
  ],
};

/** Sum of the per-course allocations — must equal totalCAD. */
export function allocationSum(pkg: CoursePackage): number {
  return pkg.courses.reduce((sum, c) => sum + c.allocationCAD, 0);
}

/** True only when every course is confirmed (no placeholders remain). */
export function isPackageComplete(pkg: CoursePackage): boolean {
  return pkg.courses.every((c) => c.confirmed);
}
