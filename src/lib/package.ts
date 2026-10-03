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
      slug: "daily-unique-orthodontic-techniques",
      title: "Daily and Unique Orthodontic Techniques for Prosthodontics",
      instructor: "Dr. John C. Voudouris, DDS, D.Ortho, MSc.(D)",
      image: "/course-orthodontic-prosthodontics-poster.jpeg",
      summary:
        "A clinical blueprint for advanced clear-aligner therapy — covering evidence-based biomechanics, the JV Supercorrection Rx, digital treatment planning, and modern auxiliaries for predictable, efficient outcomes across complex orthodontic and interdisciplinary prosthodontic cases.",
      allocationCAD: 300,
      href: "/courses/daily-unique-orthodontic-techniques",
      confirmed: true,
    },
  ],
};

// ── Four-Course Package ────────────────────────────────────────────────────
// The same three confirmed courses as above, plus a fourth confirmed course
// ("Things I Wish Someone Had Told Me – Series 01"). Bundled for one combined
// price of $900 CAD (tax-exclusive). Every course is confirmed, so this package
// is complete and purchasable immediately.
export const fourCoursePackage: CoursePackage = {
  slug: "four-course-package",
  route: "/packages/four-course-package",
  title: "Four Courses. One Complete Learning Package.",
  eyebrow: "CanaDent Course Package",
  totalCAD: 900,
  courses: [
    // Reuse the three confirmed courses verbatim (same supplied allocations).
    ...threeCoursePackage.courses,
    {
      slug: "things-i-wish-someone-had-told-me-series-01",
      title: "Things I Wish Someone Had Told Me – Series 01",
      instructor: "Dr. Fatemeh Hosseinkhani",
      image: "/course-things-i-wish.jpeg",
      summary:
        "A practical guide for newly licensed and internationally trained dentists entering Canadian practice — how dental offices operate, associate agreements and compensation, patient and team communication, informed consent and record keeping, and financial planning for a sustainable career.",
      allocationCAD: 50,
      href: "/courses/things-i-wish-someone-had-told-me-series-01",
      confirmed: true,
    },
  ],
};

/** Every bundle, keyed for lookup by the checkout action and pages. */
export const coursePackages: CoursePackage[] = [
  threeCoursePackage,
  fourCoursePackage,
];

/** Find a bundle by its slug (used by the server checkout action). */
export function getPackage(slug: string): CoursePackage | undefined {
  return coursePackages.find((p) => p.slug === slug);
}

/** Sum of the per-course allocations — must equal totalCAD. */
export function allocationSum(pkg: CoursePackage): number {
  return pkg.courses.reduce((sum, c) => sum + c.allocationCAD, 0);
}

/** True only when every course is confirmed (no placeholders remain). */
export function isPackageComplete(pkg: CoursePackage): boolean {
  return pkg.courses.every((c) => c.confirmed);
}
