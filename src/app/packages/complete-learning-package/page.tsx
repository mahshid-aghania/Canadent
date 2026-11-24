import { permanentRedirect } from "next/navigation";

// The bundle gained a fifth course and moved to /packages/five-course-package.
// Permanently redirect this URL so existing links keep working.
export default function CompleteLearningPackageRedirect() {
  permanentRedirect("/packages/five-course-package");
}
