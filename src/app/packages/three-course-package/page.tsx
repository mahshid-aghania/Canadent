import { permanentRedirect } from "next/navigation";

// The former "Three-Course Package" has been replaced by the four-course
// Complete Learning Package. Permanently redirect the old URL so existing
// links and emails keep working.
export default function ThreeCoursePackageRedirect() {
  permanentRedirect("/packages/complete-learning-package");
}
