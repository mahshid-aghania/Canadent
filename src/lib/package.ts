// ── Course package definitions ──────────────────────────────────────────────
// Each package bundles continuing-education courses for one combined price.
// The allocations below are the SUPPLIED package prices for each bundle — they
// are intentionally different from (and do not change) the individual course
// prices in `courses.ts`.
//
// Like every course fee, package totals are stored TAX-EXCLUSIVE: Ontario HST
// (13%) is added on top at checkout. See `lib/tax.ts`.
//
// A package is purchasable only when every course is `confirmed`. The server
// action in `actions/package-checkout.ts` refuses to create a Stripe session
// while a package is incomplete, so a preview can never take a real payment.

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

// ── Shared course entries (reused across bundles) ───────────────────────────
const adhesiveCourse: PackageCourse = {
  slug: "advanced-adhesive-dentistry-master-blueprint",
  title: "Advanced Adhesive Dentistry: The Master Blueprint",
  instructor: "Dr. Amin Asadollahi",
  image: "/course-adhesive-dentistry-poster.jpeg",
  summary:
    "A foundational blueprint mapping the full landscape of modern adhesive, biomimetic, and minimally invasive restorative dentistry — covering advanced isolation, bonding chemistry, Immediate Dentin Sealing and Deep Margin Elevation, and polymerization-stress control.",
  allocationCAD: 300,
  href: "/courses/advanced-adhesive-dentistry-master-blueprint",
  confirmed: true,
};

const endodonticsCourse: PackageCourse = {
  slug: "overcoming-severe-curvatures-and-ledges-in-endodontics",
  title: "Overcoming Severe Curvatures and Ledges in Endodontics",
  instructor: "Dr. Kalantar Motamedi",
  image: "/course-overcoming-curvatures.jpeg",
  summary:
    "A practical, case-based lecture on managing some of the most challenging situations in endodontics — severely curved canals and ledged root canal systems — including hybrid and crown-down shaping and an innovative ledge-bypass method.",
  allocationCAD: 250,
  href: "/courses/overcoming-severe-curvatures-and-ledges-in-endodontics",
  confirmed: true,
};

// Clinical orthodontics course — part of the Four-Course Package only.
const orthodonticCourse: PackageCourse = {
  slug: "daily-unique-orthodontic-techniques",
  title: "Daily and Unique Orthodontic Techniques for Prosthodontics",
  instructor: "Dr. John C. Voudouris, DDS, D.Ortho, MSc.(D)",
  image: "/course-orthodontic-prosthodontics-poster.jpeg",
  summary:
    "A clinical blueprint for advanced clear-aligner therapy — covering evidence-based biomechanics, the JV Supercorrection Rx, digital treatment planning, and modern auxiliaries for predictable, efficient outcomes across complex orthodontic and interdisciplinary prosthodontic cases.",
  allocationCAD: 300,
  href: "/courses/daily-unique-orthodontic-techniques",
  confirmed: true,
};

// New-to-practice course — part of the Four-Course Package only.
const thingsIWishCourse: PackageCourse = {
  slug: "things-i-wish-someone-had-told-me-series-01",
  title: "Things I Wish Someone Had Told Me – Series 01",
  instructor: "Dr. Fatemeh Hosseinkhani",
  image: "/course-things-i-wish.jpeg",
  summary:
    "A practical guide for newly licensed and internationally trained dentists entering Canadian practice — how dental offices operate, associate agreements and compensation, patient and team communication, informed consent and record keeping, and financial planning for a sustainable career.",
  allocationCAD: 50,
  href: "/courses/things-i-wish-someone-had-told-me-series-01",
  confirmed: true,
};

// Practice-growth masterclass — part of the Complete Learning Package.
const fillEveryChairCourse: PackageCourse = {
  slug: "fill-every-chair",
  title: "Fill Every Chair: Dental Practice Growth Evening Masterclass",
  instructor: "Mona Vahab, MSc, MSc",
  image: "/course-fill-every-chair.jpeg",
  summary:
    "An evening masterclass for dentists and practice owners who want to better understand their practice data and turn those insights into practical action — uncovering the hidden revenue already sitting in your schedule, recall list, and front desk.",
  allocationCAD: 100,
  href: "/courses/fill-every-chair",
  confirmed: true,
};

// New-dentist financial session — part of the Complete Learning Package.
const financialStepsCourse: PackageCourse = {
  slug: "your-first-financial-steps-as-a-dentist",
  title: "Your First Financial Steps as a New Dentist",
  instructor: "Mohammad Hossein Mohammadi",
  image: "/course-financial-steps.png",
  summary:
    "A practical, insight-driven session focused on the real financial decisions dentists face in their first years entering practice as associates.",
  allocationCAD: 0,
  href: "/courses/your-first-financial-steps-as-a-dentist",
  confirmed: true,
};

// Surgical/periodontal course — part of the Complete Learning Package.
const postExtractionCourse: PackageCourse = {
  slug: "post-extraction-site-management",
  title: "Post-Extraction Site Management",
  instructor: "Clinical Periodontist & Biomaterials Specialist",
  image: "/course-post-extraction.jpeg",
  summary:
    "An evidence-based program on socket grafting and alveolar ridge preservation for implant site preparation — covering bone graft biomaterials, barrier membranes, guided bone regeneration, ridge augmentation, suturing, and complication management.",
  allocationCAD: 150,
  href: "/courses/post-extraction-site-management",
  confirmed: true,
};

// ── Complete Learning Package ───────────────────────────────────────────────
// Five confirmed courses bundled for one combined price of $800 CAD
// (tax-exclusive). Lives at /packages/five-course-package; the former
// /packages/complete-learning-package and /packages/three-course-package URLs
// permanently redirect here.
export const fiveCoursePackage: CoursePackage = {
  slug: "five-course-package",
  route: "/packages/five-course-package",
  title: "Five Courses. One Complete Learning Package.",
  eyebrow: "CanaDent Course Package",
  totalCAD: 800,
  courses: [
    adhesiveCourse,
    endodonticsCourse,
    postExtractionCourse,
    fillEveryChairCourse,
    financialStepsCourse,
  ],
};

// ── Four-Course Package ─────────────────────────────────────────────────────
// A separate, clinically focused bundle: Adhesive, Endodontics, Orthodontic
// Techniques, and "Things I Wish Someone Had Told Me – Series 01", for one
// combined price of $900 CAD (tax-exclusive). Every course is confirmed.
export const fourCoursePackage: CoursePackage = {
  slug: "four-course-package",
  route: "/packages/four-course-package",
  title: "Four Courses. One Complete Learning Package.",
  eyebrow: "CanaDent Course Package",
  totalCAD: 900,
  courses: [
    adhesiveCourse,
    endodonticsCourse,
    orthodonticCourse,
    thingsIWishCourse,
  ],
};

/** Every bundle, keyed for lookup by the checkout action and pages. */
export const coursePackages: CoursePackage[] = [
  fiveCoursePackage,
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
