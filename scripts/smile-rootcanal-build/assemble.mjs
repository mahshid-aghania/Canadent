// Assembles scripts/smile-rootcanal-build/article-*.json -> src/lib/articles-smile-rootcanal.ts
import fs from 'node:fs'
import path from 'node:path'

const DIR = '/Users/mahshid/Canadent/scripts/smile-rootcanal-build'
const OUT = '/Users/mahshid/Canadent/src/lib/articles-smile-rootcanal.ts'

const REQUIRED = ['n','slug','title','metaTitle','metaDescription','primaryKeyword','secondaryKeywords','excerpt','category','heroImageAlt','bodyHtml','smile']

function esc(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${')
}
function q(s) { return JSON.stringify(String(s == null ? '' : s)) }

const files = fs.readdirSync(DIR).filter(f => /^article-\d{2}\.json$/.test(f)).sort()
const articles = []
const problems = []
for (const f of files) {
  let obj
  try { obj = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8')) }
  catch (e) { problems.push(`${f}: invalid JSON (${e.message})`); continue }
  for (const k of REQUIRED) if (!(k in obj)) problems.push(`${f}: missing key ${k}`)
  // Hyperlink integrity: homepage link must be present in bodyHtml
  if (obj.bodyHtml && !/href="https:\/\/www\.smiledentalartscentre\.com\/"/.test(obj.bodyHtml)) {
    problems.push(`${f}: MISSING homepage link in bodyHtml`)
  }
  if (obj.bodyHtml && !/article-disclaimer/.test(obj.bodyHtml)) {
    problems.push(`${f}: MISSING disclaimer paragraph`)
  }
  articles.push(obj)
}
articles.sort((a, b) => a.n - b.n)

const missing = []
for (let i = 1; i <= 50; i++) if (!articles.find(a => a.n === i)) missing.push(i)
if (missing.length) problems.push('MISSING article numbers: ' + missing.join(', '))

// publishDate: stagger descending from base so newest (n=1) sits on top
const base = new Date('2026-11-09T00:00:00Z')
function dateFor(n) {
  const d = new Date(base.getTime() - (n - 1) * 36 * 3600 * 1000) // ~1.5 days apart
  return d.toISOString().slice(0, 10)
}

const slugs = new Set()
for (const a of articles) {
  if (slugs.has(a.slug)) problems.push(`duplicate slug: ${a.slug}`)
  slugs.add(a.slug)
}

const header = `import type { Article } from "./articles";

/**
 * Patient-facing ROOT CANAL education library for CanaDent (/articles).
 *
 * 50 plain-language articles answering the questions patients ask about root
 * canal treatment — choosing a provider, symptoms, the procedure, comfort,
 * preparation, recovery, restorations, retreatment, and decisions. Each links
 * to Smile Dental Arts Centre (Dr. Neda Kadivar, Markham, Ontario) via a
 * contextual homepage link with varied anchor text and rel="nofollow noopener"
 * to transparently signal the promotional relationship.
 *
 * These COMPLEMENT (do not duplicate) the clinically-detailed endodontic
 * articles in articles-smile-markham.ts; near-topic pages are cross-referenced,
 * not restated.
 *
 * DRAFT — pending dental review. Generated from scripts/smile-rootcanal-build.
 * Do not fabricate clinical facts, credentials, prices, or outcomes.
 */

const AUTHOR = "CanaDent Education Team";
const AUTHOR_TITLE = "CanaDent Education Center";
const AUTHOR_BIO =
  "The CanaDent Education Team produces evidence-informed, plain-language patient education on dental treatment and oral health for readers across Canada. Articles are reviewed for accuracy and are general information, not a substitute for individual dental advice.";

export const smileRootCanalArticles: Article[] = [
`

let body = ''
for (const a of articles) {
  body += `  {
    slug: ${q(a.slug)},
    title: ${q(a.title)},
    excerpt: ${q(a.excerpt)},
    author: AUTHOR,
    authorTitle: AUTHOR_TITLE,
    authorBio: AUTHOR_BIO,
    publishDate: ${q(dateFor(a.n))},
    category: ${q(a.category)},
    heroImageAlt: ${q(a.heroImageAlt)},
    bodyHtml: \`
${esc(a.bodyHtml)}
\`,
  },
`
}
const footer = `];\n`

fs.writeFileSync(OUT, header + body + footer)

// Machine-readable metadata sidecar for the deliverables (plan table, link map)
const meta = articles.map(a => ({
  n: a.n, slug: a.slug, title: a.title, category: a.category,
  metaTitle: a.metaTitle, metaDescription: a.metaDescription,
  primaryKeyword: a.primaryKeyword, secondaryKeywords: a.secondaryKeywords,
  publishDate: dateFor(a.n), priority: a.priority,
  internalLinkSlugs: a.internalLinkSlugs || [],
  smile: a.smile, secondarySmileLink: a.secondarySmileLink || null,
  references: a.references || [], editorialNote: a.editorialNote || 'None.',
  suggestedImageFilename: a.suggestedImageFilename,
}))
fs.writeFileSync(path.join(DIR, 'metadata.json'), JSON.stringify(meta, null, 2))

console.log(`Wrote ${articles.length} articles -> ${OUT}`)
if (problems.length) {
  console.log('\nPROBLEMS:\n' + problems.map(p => ' - ' + p).join('\n'))
  process.exitCode = 2
} else {
  console.log('No problems detected.')
}
