import { permanentRedirect } from "next/navigation";

// The former "Three-Course Package" has been replaced by the five-course
// Complete Learning Package. Permanently redirect the old URL straight to the
// current page (no redirect chain) so existing links and emails keep working.
export default function ThreeCoursePackageRedirect() {
  permanentRedirect("/packages/five-course-package");
}
