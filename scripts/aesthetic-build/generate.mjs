import { readFileSync, readdirSync, writeFileSync } from "node:fs";

const DIR = new URL("./", import.meta.url).pathname;
const OUT = DIR + "../../src/lib/articles-aesthetic-training.ts";

const ORDER = [
 "facial-anatomy-education-for-dental-professionals","head-and-neck-anatomy-dentistry-to-aesthetics","facial-injection-danger-zones-education","understanding-the-aging-face-primer","smile-design-and-lower-face-proportion",
 "full-face-aesthetic-assessment-for-dentists","perioral-aesthetics-and-skin-health","facial-symmetry-assessment-in-treatment-planning","questions-before-choosing-aesthetic-training","how-to-evaluate-a-botox-filler-curriculum",
 "certificate-vs-diploma-medical-aesthetics","hands-on-vs-theory-only-aesthetic-courses","class-size-and-mentorship-in-aesthetics-education","evaluating-an-aesthetics-trainer-credentials","admissions-and-prerequisites-aesthetic-programs",
 "planning-cost-and-time-aesthetic-training","theory-simulation-supervised-practice-aesthetics","live-model-training-in-injectable-education","cohort-based-vs-self-paced-aesthetic-courses","informed-consent-in-aesthetic-medicine",
 "managing-patient-expectations-cosmetic-results","communication-skills-in-aesthetic-training","documentation-and-photography-aesthetic-practice","infection-prevention-in-aesthetic-procedures","adverse-event-recognition-injectables",
 "professional-boundaries-scope-of-practice","safety-first-culture-in-aesthetics-education","what-a-botox-filler-certification-covers","who-can-take-botox-filler-training-ontario","neuromodulators-vs-dermal-fillers-basics",
 "laser-physics-and-safety-technician-training","advanced-laser-training-multi-platform","laser-tattoo-removal-education","microneedling-collagen-induction-training","prp-therapy-science-platelet-rich-plasma",
 "one-day-prp-certificate-overview","professional-skincare-fundamentals-education","medical-aesthetician-certification-pathway","micropigmentation-training-overview","non-surgical-body-contouring-education",
 "continuing-education-planning-dental-professionals","interdisciplinary-dentistry-and-aesthetics","diversifying-clinical-skills-with-aesthetics","building-a-career-learning-plan-aesthetics","facial-aesthetics-knowledge-and-tmd-care",
 "medical-aesthetic-specialist-advanced-pathway","evaluating-course-schedules-and-start-dates","gta-aesthetics-education-landscape","how-to-contact-and-tour-a-training-institute","mapping-your-first-year-in-aesthetics-education",
];

const bySlug = {};
for (const f of readdirSync(DIR).filter(f => /^batch-\d+\.json$/.test(f))) {
  for (const a of JSON.parse(readFileSync(DIR + f, "utf8"))) bySlug[a.slug] = a;
}

// staggered publish dates, newest first, one every ~1 day back from 2026-10-16
function dateFor(i) {
  const start = new Date(Date.UTC(2026, 9, 16)); // 2026-10-16
  const d = new Date(start.getTime() - i * 24 * 3600 * 1000);
  return d.toISOString().slice(0, 10);
}

const esc = (s) => s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
const q = (s) => JSON.stringify(s);

const out = [];
out.push(`import type { Article } from "./articles";`);
out.push(``);
out.push(`/**`);
out.push(` * Aesthetic-training continuing-education article library for CanaDent (/articles).`);
out.push(` *`);
out.push(` * These 50 articles serve dentists, dental professionals and other healthcare`);
out.push(` * professionals exploring continuing education in facial aesthetics. Each article`);
out.push(` * carries exactly one contextual reference to a verified live page on Ziba`);
out.push(` * Aesthetics Training Institute (aesthetictraining.ca, Markham, Ontario), using`);
out.push(` * varied descriptive anchor text and rel="noopener nofollow sponsored" to`);
out.push(` * transparently signal the promotional cross-reference. Destinations describe`);
out.push(` * professional TRAINING, not patient treatment. Injectable-related articles reflect`);
out.push(` * the RCDSO position on botulinum toxin / dermal fillers and dentists' scope of`);
out.push(` * practice. Do not fabricate URLs, prices, credentials, accreditation or outcomes.`);
out.push(` *`);
out.push(` * Generated from scripts/aesthetic-build (see validate.mjs / generate.mjs).`);
out.push(` */`);
out.push(``);
out.push(`const AUTHOR = "CanaDent Education Team";`);
out.push(`const AUTHOR_TITLE = "CanaDent Education Center";`);
out.push(`const AUTHOR_BIO =`);
out.push(`  "The CanaDent Education Team produces evidence-informed articles on clinical practice, continuing education and professional development for dentists and healthcare professionals across Canada.";`);
out.push(``);
out.push(`export const aestheticTrainingArticles: Article[] = [`);

ORDER.forEach((slug, i) => {
  const a = bySlug[slug];
  if (!a) throw new Error("missing article for slug " + slug);
  out.push(`  {`);
  out.push(`    slug: ${q(a.slug)},`);
  out.push(`    title: ${q(a.title)},`);
  out.push(`    excerpt: ${q(a.metaDescription)},`);
  out.push(`    author: AUTHOR,`);
  out.push(`    authorTitle: AUTHOR_TITLE,`);
  out.push(`    authorBio: AUTHOR_BIO,`);
  out.push(`    publishDate: ${q(dateFor(i))},`);
  out.push(`    category: ${q(a.category)},`);
  out.push(`    bodyHtml: \`\n${esc(a.bodyHtml.trim())}\n\`,`);
  out.push(`  },`);
});

out.push(`];`);
out.push(``);

writeFileSync(OUT, out.join("\n"), "utf8");
console.log("Wrote " + OUT + " with " + ORDER.length + " articles.");
