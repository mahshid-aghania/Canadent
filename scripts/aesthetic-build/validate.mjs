import { readFileSync, readdirSync } from "node:fs";

const DIR = new URL("./", import.meta.url).pathname;

const ALLOWED = new Set([
  "https://www.aesthetictraining.ca/courses",
  "https://www.aesthetictraining.ca/courses/aesthetic-diploma",
  "https://www.aesthetictraining.ca/courses/medical-aesthetic",
  "https://www.aesthetictraining.ca/courses/advanced-laser-technician",
  "https://www.aesthetictraining.ca/courses/laser-technician",
  "https://www.aesthetictraining.ca/courses/medical-aesthetician",
  "https://www.aesthetictraining.ca/courses/botox-filler",
  "https://www.aesthetictraining.ca/courses/plasma-prp",
  "https://www.aesthetictraining.ca/courses/prp-certificate",
  "https://www.aesthetictraining.ca/courses/tattoo-removal",
  "https://www.aesthetictraining.ca/courses/microneedling",
  "https://www.aesthetictraining.ca/courses/micropigmentation",
  "https://www.aesthetictraining.ca/courses/butt-lift",
  "https://www.aesthetictraining.ca/courses/skin-care",
  "https://www.aesthetictraining.ca/about",
  "https://www.aesthetictraining.ca/why-train-with-us",
  "https://www.aesthetictraining.ca/trainer",
  "https://www.aesthetictraining.ca/admissions",
  "https://www.aesthetictraining.ca/contact",
  "https://www.aesthetictraining.ca/blog",
]);

const EXPECTED_SLUGS = [
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

const files = readdirSync(DIR).filter(f => /^batch-\d+\.json$/.test(f)).sort();
let all = [];
const errors = [];
const anchors = {};

for (const f of files) {
  let data;
  try { data = JSON.parse(readFileSync(DIR + f, "utf8")); }
  catch (e) { errors.push(`${f}: INVALID JSON — ${e.message}`); continue; }
  if (!Array.isArray(data)) { errors.push(`${f}: not an array`); continue; }
  for (const a of data) all.push({ ...a, _file: f });
}

for (const a of all) {
  const req = ["slug","title","metaDescription","category","destUrl","anchor","bodyHtml"];
  for (const k of req) if (!a[k]) errors.push(`${a._file}/${a.slug||"?"}: missing key ${k}`);
  const html = a.bodyHtml || "";

  // all href targets
  const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map(m => m[1]);
  const externals = hrefs.filter(h => /^https?:\/\//i.test(h));
  const atLinks = externals.filter(h => /aesthetictraining\.ca/i.test(h));
  const otherExternals = externals.filter(h => !/aesthetictraining\.ca/i.test(h));

  if (atLinks.length !== 1) errors.push(`${a.slug}: expected 1 aesthetictraining link, found ${atLinks.length}`);
  if (otherExternals.length > 0) errors.push(`${a.slug}: has ${otherExternals.length} OTHER external link(s): ${otherExternals.join(", ")}`);
  if (atLinks[0] && !ALLOWED.has(atLinks[0])) errors.push(`${a.slug}: dest URL not in allowlist: ${atLinks[0]}`);
  if (atLinks[0] && atLinks[0] !== a.destUrl) errors.push(`${a.slug}: body link (${atLinks[0]}) != destUrl field (${a.destUrl})`);

  // rel + target on the aesthetic link
  const linkTagRe = new RegExp(`<a[^>]*href="${(atLinks[0]||"___").replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}"[^>]*>`, "i");
  const tag = (html.match(linkTagRe)||[])[0] || "";
  if (!/rel="noopener nofollow sponsored"/.test(tag)) errors.push(`${a.slug}: link rel attr not exactly 'noopener nofollow sponsored' -> ${tag}`);
  if (!/target="_blank"/.test(tag)) errors.push(`${a.slug}: link missing target=_blank -> ${tag}`);

  // internal links present
  const internal = hrefs.filter(h => h.startsWith("/articles/"));
  if (internal.length < 1) errors.push(`${a.slug}: no internal /articles/ link`);

  // word count (strip tags)
  const words = html.replace(/<[^>]+>/g," ").replace(/&[a-z]+;/g," ").trim().split(/\s+/).filter(Boolean).length;
  if (words < 760 || words > 1300) errors.push(`${a.slug}: word count ${words} out of range`);

  // banned content (flag for manual review)
  const body = html.toLowerCase();
  for (const bad of ["accredited","guaranteed results","guarantee results","best training","#1 ","number one"]) {
    if (body.includes(bad)) errors.push(`${a.slug}: WARN contains banned phrase "${bad}"`);
  }

  anchors[a.destUrl] = anchors[a.destUrl]||[];
  anchors[a.destUrl].push(a.anchor);
}

// slug coverage
const got = new Set(all.map(a => a.slug));
const missing = EXPECTED_SLUGS.filter(s => !got.has(s));
const extra = [...got].filter(s => !EXPECTED_SLUGS.includes(s));
const dupes = all.map(a=>a.slug).filter((s,i,arr)=>arr.indexOf(s)!==i);

console.log(`FILES: ${files.length}  ARTICLES: ${all.length}`);
console.log(`MISSING slugs (${missing.length}): ${missing.join(", ")||"none"}`);
console.log(`EXTRA/unexpected slugs (${extra.length}): ${extra.join(", ")||"none"}`);
console.log(`DUPLICATE slugs: ${dupes.join(", ")||"none"}`);
console.log(`\nDEST URL usage counts:`);
for (const [u,arr] of Object.entries(anchors).sort((a,b)=>b[1].length-a[1].length)) {
  const dupAnchor = arr.filter((x,i)=>arr.map(y=>y.toLowerCase().trim()).indexOf(x.toLowerCase().trim())!==i);
  console.log(`  ${arr.length.toString().padStart(2)}  ${u}${dupAnchor.length?`   [DUP ANCHOR: ${dupAnchor.join(" | ")}]`:""}`);
}
console.log(`\nTOTAL aesthetictraining links (should be 50): ${all.length}`);
console.log(`\nERRORS/WARNINGS (${errors.length}):`);
for (const e of errors) console.log("  - " + e);
console.log(errors.filter(e=>!e.includes("WARN")).length === 0 && missing.length===0 && all.length===50 ? "\n✅ PASS" : "\n❌ NEEDS ATTENTION");
