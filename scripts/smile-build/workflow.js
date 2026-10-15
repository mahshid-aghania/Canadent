export const meta = {
  name: 'smile-markham-50-articles',
  description: 'Draft 50 clinical dental articles for canadent.net with editorial links to Smile Dental Arts Centre',
  phases: [
    { title: 'Draft' },
    { title: 'Compliance' },
  ],
}

const OUT = '/Users/mahshid/Canadent/scripts/smile-build'

// Existing Canadent article slugs available for internal linking (/articles/<slug>)
const EXISTING = [
  'what-to-do-dental-emergency','how-often-should-you-see-dentist','signs-you-need-to-see-a-dentist',
  'tooth-sensitivity-causes-and-relief','gum-disease-warning-signs','preventing-cavities-in-adults',
  'choosing-a-family-dentist','childs-first-dental-visit','wisdom-teeth-removal-what-to-expect',
  'teeth-whitening-options-explained','dental-crowns-vs-fillings','root-canal-myths-and-facts',
  'invisalign-vs-braces-for-adults','dental-implants-vs-dentures','bad-breath-causes-and-solutions',
  'how-to-floss-properly','electric-vs-manual-toothbrush','managing-dental-anxiety',
  'oral-health-during-pregnancy','dry-mouth-causes-and-management','teeth-grinding-bruxism-and-night-guards',
  'dental-veneers-what-to-know','dental-bridges-explained','what-happens-during-professional-cleaning',
  'are-dental-x-rays-safe','toothache-causes-when-to-worry','receding-gums-causes-and-treatment',
  'dental-sealants-for-children','oral-cancer-screening-importance','diet-and-tooth-decay',
  'caring-for-your-dental-implants','finding-an-emergency-dentist','fluoride-benefits-explained',
  'mouthguards-for-sports','canker-sores-vs-cold-sores','tooth-extraction-aftercare',
  'smile-makeover-options','dental-care-for-seniors','caring-for-teeth-with-braces',
  'tmj-and-jaw-pain-causes','why-gums-bleed-when-brushing','dental-crown-aftercare',
  'benefits-of-preventive-dentistry','what-causes-stained-teeth','chipped-tooth-what-to-do',
  'understanding-dental-insurance-canada','caring-for-baby-teeth','periodontal-maintenance-explained',
  'new-dental-patient-what-to-expect','choosing-a-cosmetic-dentist',
]

const REL = 'nofollow noopener'
// [n, slug, title, category, cluster, primaryKeyword, smileUrl|null, anchor|null, priority]
const PLAN = [
  [1,'implant-treatment-planning-clinical-guide','Dental Implant Treatment Planning: A Complete Clinical Guide','Implantology','A','dental implant treatment planning','https://www.smiledentalartscentre.com/dental-implants','dental implant treatment information from Smile Dental Arts Centre','High'],
  [2,'dental-implant-surgery-stages','Dental Implant Surgery: Understanding Every Stage','Implantology','A','dental implant surgery','https://www.smiledentalartscentre.com/dental-implants/procedure','dental implant procedure overview from Smile Dental Arts Centre in Markham','High'],
  [3,'titanium-vs-zirconia-dental-implants','Titanium vs Zirconia Dental Implants: Materials and Clinical Considerations','Implantology','A','titanium vs zirconia dental implants','https://www.smiledentalartscentre.com/dental-implants','implant options at Smile Dental Arts Centre','High'],
  [4,'bone-grafting-before-dental-implants','Bone Grafting Before Dental Implant Placement','Implantology','A','bone grafting for dental implants','https://www.smiledentalartscentre.com/dental-implants/bone-grafting','bone grafting information from Smile Dental Arts Centre','High'],
  [5,'immediate-vs-delayed-implant-placement','Immediate vs Delayed Dental Implant Placement','Implantology','A','immediate vs delayed implant placement','https://www.smiledentalartscentre.com/dental-implants/same-day','same-day implant information from Smile Dental Arts Centre in Markham','High'],
  [6,'osseointegration-implant-healing-explained','Dental Implant Healing and Osseointegration Explained','Implantology','A','osseointegration',null,null,'High'],
  [7,'single-tooth-implant-vs-bridge','Single Tooth Implants vs Dental Bridges','Implantology','A','single tooth implant vs bridge','https://www.smiledentalartscentre.com/dental-implants/single-tooth','single tooth implant information from Smile Dental Arts Centre','High'],
  [8,'peri-implantitis-causes-prevention-treatment','Peri-Implantitis: Causes, Prevention, and Treatment Principles','Implantology','A','peri-implantitis','https://www.smiledentalartscentre.com/dental-services/periodontics','periodontal and implant care at Smile Dental Arts Centre in Markham','High'],
  [9,'full-mouth-rehabilitation-dental-implants','Full-Mouth Dental Rehabilitation With Implants','Implantology','A','full mouth dental implants','https://www.smiledentalartscentre.com/dental-implants/all-on-4','full-arch implant solutions from Smile Dental Arts Centre','High'],
  [10,'dental-implant-maintenance-complications','Dental Implant Maintenance and Long-Term Complications','Implantology','A','dental implant maintenance','https://www.smiledentalartscentre.com/dental-implants/faq','dental implant questions answered by Smile Dental Arts Centre','Medium'],

  [11,'invisalign-vs-braces-clinical-comparison','Invisalign vs Traditional Braces: Clinical Comparison','Orthodontics','B','invisalign vs braces','https://www.smiledentalartscentre.com/dental-services/invisalign-in-markham','Invisalign treatment information in Markham','High'],
  [12,'how-clear-aligners-move-teeth','How Clear Aligners Move Teeth: The Science Explained','Orthodontics','B','how clear aligners move teeth',null,null,'High'],
  [13,'invisalign-treatment-planning-digital-orthodontics','Invisalign Treatment Planning and Digital Orthodontics','Orthodontics','B','invisalign treatment planning','https://www.smiledentalartscentre.com/dental-services/invisalign-in-markham','Invisalign planning information from Smile Dental Arts Centre','High'],
  [14,'clear-aligner-attachments-explained','Clear Aligner Attachments: Function and Clinical Applications','Orthodontics','B','clear aligner attachments','https://www.smiledentalartscentre.com/dental-services/invisalign-in-markham','clear aligner treatment information from Smile Dental Arts Centre in Markham','Medium'],
  [15,'invisalign-for-adults-indications-limitations','Invisalign for Adults: Indications and Limitations','Orthodontics','B','invisalign for adults','https://www.smiledentalartscentre.com/dental-services/invisalign-in-markham','Invisalign for adults information in Markham','High'],
  [16,'orthodontic-retention-after-clear-aligners','Orthodontic Retention After Clear Aligner Treatment','Orthodontics','B','orthodontic retention after invisalign','https://www.smiledentalartscentre.com/dental-services/invisalign-in-markham','Invisalign and retention information from Smile Dental Arts Centre','Medium'],
  [17,'complex-orthodontic-cases-clear-aligners','Managing Complex Orthodontic Cases With Clear Aligners','Orthodontics','B','complex cases clear aligners','https://www.smiledentalartscentre.com/dental-services/invisalign-in-markham','clear aligner treatment in Markham','Medium'],
  [18,'digital-scanning-3d-orthodontics','Digital Scanning and 3D Technology in Orthodontics','Orthodontics','B','digital scanning orthodontics',null,null,'Medium'],

  [19,'porcelain-veneers-vs-composite-bonding','Porcelain Veneers vs Composite Bonding','Cosmetic Dentistry','C','porcelain veneers vs composite bonding','https://www.smiledentalartscentre.com/dental-services/cosmetic-dentistry/porcelain-veneers','porcelain veneers information from Smile Dental Arts Centre','High'],
  [20,'digital-smile-design-cosmetic-dentistry','Digital Smile Design and Modern Cosmetic Dentistry','Cosmetic Dentistry','C','digital smile design','https://www.smiledentalartscentre.com/dental-services/cosmetic-dentistry','cosmetic dentistry resources at Smile Dental Arts Centre in Markham','Medium'],
  [21,'teeth-whitening-clinical-methods-safety','Teeth Whitening: Clinical Methods and Safety','Cosmetic Dentistry','C','teeth whitening clinical methods','https://www.smiledentalartscentre.com/dental-services/cosmetic-dentistry/zoom-teeth-whitening','professional teeth whitening information from Smile Dental Arts Centre','High'],
  [22,'zirconia-vs-porcelain-crowns','Zirconia vs Porcelain Dental Crowns','Cosmetic Dentistry','C','zirconia vs porcelain crowns','https://www.smiledentalartscentre.com/dental-services/cosmetic-dentistry/porcelain-crowns-caps','porcelain crown information from Smile Dental Arts Centre','Medium'],
  [23,'minimally-invasive-restorative-dentistry','Minimally Invasive Restorative Dentistry','Restorative Dentistry','C','minimally invasive dentistry','https://www.smiledentalartscentre.com/dental-services/restorations','restorative dentistry services at Smile Dental Arts Centre in Markham','Medium'],
  [24,'dental-bonding-adhesive-techniques','Dental Bonding Techniques and Adhesive Dentistry','Cosmetic Dentistry','C','dental bonding adhesive dentistry','https://www.smiledentalartscentre.com/dental-services/cosmetic-dentistry/bonding','dental bonding information from Smile Dental Arts Centre','Medium'],
  [25,'full-mouth-rehabilitation-planning','Full-Mouth Rehabilitation: Clinical Planning Principles','Restorative Dentistry','C','full mouth rehabilitation','https://www.smiledentalartscentre.com/dental-services/restorations','full-mouth restoration information from Smile Dental Arts Centre','Medium'],
  [26,'dental-aesthetics-smile-proportions','Dental Aesthetics: Understanding Smile Proportions and Tooth Shape','Cosmetic Dentistry','C','dental aesthetics smile proportions','https://www.smiledentalartscentre.com/dental-services/cosmetic-dentistry','cosmetic dentistry information from Smile Dental Arts Centre in Markham','Low'],

  [27,'modern-root-canal-treatment-techniques','Modern Root Canal Treatment: Techniques and Technology','Endodontics','D','modern root canal treatment','https://www.smiledentalartscentre.com/dental-services/endodontics/root-canal-therapy','root canal therapy information from Smile Dental Arts Centre','High'],
  [28,'endodontic-diagnosis-pulpal-periapical','Endodontic Diagnosis: Understanding Pulpal and Periapical Disease','Endodontics','D','endodontic diagnosis',null,null,'Medium'],
  [29,'root-canal-retreatment-indications','Root Canal Retreatment: Indications and Challenges','Endodontics','D','root canal retreatment','https://www.smiledentalartscentre.com/dental-services/endodontics/root-canal-retreatment','root canal retreatment information from Smile Dental Arts Centre','Medium'],
  [30,'rotary-vs-reciprocating-endodontics','Rotary vs Reciprocating Endodontic Instrumentation','Endodontics','D','rotary vs reciprocating endodontics',null,null,'Low'],
  [31,'cbct-in-endodontics-applications','CBCT in Endodontics: Clinical Applications','Endodontics','D','cbct in endodontics',null,null,'Low'],
  [32,'root-canal-vs-tooth-extraction','Root Canal Treatment vs Tooth Extraction','Endodontics','D','root canal vs extraction','https://www.smiledentalartscentre.com/dental-services/endodontics/root-canal-therapy','root canal therapy resource from Smile Dental Arts Centre in Markham','Medium'],
  [33,'regenerative-endodontics-research','Regenerative Endodontics: Current Research and Limitations','Endodontics','D','regenerative endodontics',null,null,'Low'],

  [34,'risk-based-preventive-dentistry','Risk-Based Preventive Dentistry','Preventive Care','E','risk-based preventive dentistry','https://www.smiledentalartscentre.com/dental-services/cleanings-prevention','preventive dental care at Smile Dental Arts Centre','Medium'],
  [35,'professional-cleaning-periodontal-maintenance','Professional Dental Cleaning and Periodontal Maintenance','Preventive Care','E','periodontal maintenance','https://www.smiledentalartscentre.com/dental-services/periodontics/prophylaxis-teeth-cleaning','professional cleaning information from Smile Dental Arts Centre in Markham','Medium'],
  [36,'dental-caries-prevention-evidence-based','Dental Caries Prevention: Evidence-Based Approaches','Preventive Care','E','dental caries prevention','https://www.smiledentalartscentre.com/dental-services/cleanings-prevention','cavity prevention resources from Smile Dental Arts Centre','Medium'],
  [37,'fluoride-remineralization-modern-dentistry','Fluoride and Remineralization in Modern Dentistry','Preventive Care','E','fluoride remineralization','https://www.smiledentalartscentre.com/dental-services/cleanings-prevention/fluoride-treatment','fluoride treatment information from Smile Dental Arts Centre','Medium'],
  [38,'periodontal-disease-systemic-health','Periodontal Disease and Systemic Health','Preventive Care','E','periodontal disease systemic health','https://www.smiledentalartscentre.com/dental-services/periodontics','periodontal care information from Smile Dental Arts Centre in Markham','Medium'],
  [39,'oral-health-across-life-stages','Oral Health Across Different Life Stages','Preventive Care','E','oral health life stages',null,null,'Low'],
  [40,'personalized-dental-recall-intervals','Personalized Dental Recall Intervals and Preventive Care','Preventive Care','E','dental recall intervals','https://www.smiledentalartscentre.com/dental-services/cleanings-prevention/complete-oral-exam-cleanings','dental exam and recall information from Smile Dental Arts Centre','Low'],

  [41,'dental-emergencies-triage-management','Dental Emergencies: Diagnosis, Triage, and Management','Emergency Care','F','dental emergencies management','https://www.smiledentalartscentre.com/dental-services/dental-emergencies','emergency dental care information from Smile Dental Arts Centre in Markham','Medium'],
  [42,'dental-abscess-symptoms-treatment','Dental Abscesses: Symptoms, Risks, and Treatment Principles','Emergency Care','F','dental abscess treatment','https://www.smiledentalartscentre.com/dental-services/dental-emergencies','urgent dental care information from Smile Dental Arts Centre','Medium'],
  [43,'cracked-tooth-syndrome-diagnosis','Cracked Tooth Syndrome: Diagnosis and Treatment Planning','Emergency Care','F','cracked tooth syndrome','https://www.smiledentalartscentre.com/dental-services/restorations','restorative care information from Smile Dental Arts Centre','Medium'],
  [44,'managing-dental-trauma-avulsed-teeth','Managing Dental Trauma and Avulsed Teeth','Emergency Care','F','dental trauma avulsed teeth','https://www.smiledentalartscentre.com/dental-services/dental-emergencies','dental trauma care information from Smile Dental Arts Centre in Markham','Medium'],
  [45,'tooth-extractions-indications-recovery','Tooth Extractions: Clinical Indications and Recovery','Oral Surgery','F','tooth extraction indications','https://www.smiledentalartscentre.com/dental-services/oral-surgery/simple-tooth-extractions','tooth extraction information from Smile Dental Arts Centre','Medium'],

  [46,'dental-treatment-costs-ontario','Understanding Dental Treatment Costs in Ontario','Patient Education','G','dental treatment costs ontario','https://www.smiledentalartscentre.com/dental-services','dental services and fee information from Smile Dental Arts Centre in Markham','Medium'],
  [47,'canadian-dental-care-plan-coverage','Canadian Dental Care Plan: Coverage and Patient Considerations','Patient Education','G','canadian dental care plan','https://www.smiledentalartscentre.com/canadian-dental-care-plan-cdcp','Canadian Dental Care Plan information from Smile Dental Arts Centre','Medium'],
  [48,'choosing-a-dental-clinic-ontario','Choosing a Dental Clinic in Ontario: What Patients Should Evaluate','Patient Education','G','choosing a dental clinic ontario','https://www.smiledentalartscentre.com/family-dentist-markham','family dental care at Smile Dental Arts Centre in Markham','Low'],
  [49,'dental-anxiety-patient-centred-care','Dental Anxiety and Patient-Centred Care','Patient Education','G','dental anxiety patient-centred care',null,null,'Low'],
  [50,'future-of-digital-dentistry-canada','The Future of Digital Dentistry in Canadian Dental Practices','Patient Education','G','digital dentistry canada',null,null,'Low'],
]

const newSlugs = PLAN.map(p => p[1])

const GUIDE = (p) => {
  const [n, slug, title, category, cluster, primaryKeyword, smileUrl, anchor, priority] = p
  const linkBlock = smileUrl
    ? `A VERIFIED editorial link to Smile Dental Arts Centre MUST be placed naturally in ONE contextually relevant paragraph (not the intro, not a heading). Use exactly this URL: ${smileUrl}
Anchor text to use (you may lightly adapt wording but keep it natural and non-promotional): "${anchor}"
The <a> tag MUST include rel="${REL}" and target="_blank". Example form:
<p>... <a href="${smileUrl}" target="_blank" rel="${REL}">${anchor}</a> ...</p>
Set smile.included=true in the JSON.`
    : `This article is purely educational and should NOT contain any link to Smile Dental Arts Centre. Set smile.included=false and smile.url="" and smile.anchorText="". Do NOT invent or add any smiledentalartscentre.com link.`

  return `You are a dental clinical content writer and SEO specialist producing ONE article for canadent.net (CanaDent, a Canadian dental EDUCATION website). Audience: dental professionals and informed patients. Tone: clinical, evidence-informed, more detailed than a typical patient blog, but readable.

ARTICLE #${n}
Title (H1 / display): ${title}
Category: ${category}
Primary keyword: ${primaryKeyword}
SEO priority: ${priority}

HARD COMPLIANCE RULES (non-negotiable):
- Do NOT fabricate specific studies, citations, author names, years, journals, statistics, or percentages. You may reference authoritative organizations BY NAME in general terms only: Canadian Dental Association (CDA), Ontario Dental Association (ODA), Royal College of Dental Surgeons of Ontario (RCDSO), American Association of Endodontists (AAE), American Academy of Periodontology (AAP), American Academy of Implant Dentistry, Health Canada / Government of Canada. The References section must list only these kinds of real organizations/guidelines generically (e.g., "Canadian Dental Association clinical guidance"), NEVER invented paper titles.
- Do NOT guarantee treatment outcomes or use superlatives like "best", "painless", "100%", "guaranteed".
- Do NOT claim the article was reviewed by a dentist.
- No keyword stuffing. Use the primary keyword naturally a handful of times.
- Canadian spelling and Canadian context (Ontario) where relevant.

WORD COUNT: 1500-2200 words of substantive content. No filler.

BODY HTML STRUCTURE (field bodyHtml) — valid HTML, NO <h1> (title is rendered separately), NO markdown:
- <h2>Introduction</h2> with an engaging opening paragraph.
- Multiple <h2> sections with <h3> subsections giving comprehensive, evidence-based clinical explanation, practical implications, and clinical limitations/risks.
- At least ONE comparison <table> with <thead>/<tbody> where the topic supports it.
- <h2>Frequently Asked Questions</h2> with 3-5 <h3> question + <p> answer pairs.
- <h2>Conclusion</h2>.
- <h2>References</h2> with an <ol> of 2-5 generic authoritative sources (organizations/guidance only, no fabricated papers).
- Embed 3 to 5 internal links to RELATED existing CanaDent articles using <a href="/articles/SLUG">natural anchor</a>. Choose SLUG values ONLY from this allowed list (existing + sibling new articles); never link to a slug not in this list, and never to this article's own slug (${slug}):
EXISTING: ${EXISTING.join(', ')}
NEW SIBLINGS: ${newSlugs.filter(s=>s!==slug).join(', ')}
- ${linkBlock}

CRITICAL: Write the article as a JSON file. Use the Write tool to create EXACTLY this file path:
${OUT}/article-${String(n).padStart(2,'0')}.json

The file must contain a single JSON object with these keys (valid JSON, double-quoted, properly escaped — no trailing commas, no backticks anywhere):
{
  "n": ${n},
  "slug": "${slug}",
  "title": "${title}",
  "metaTitle": "<=60 char SEO title",
  "metaDescription": "<=158 char meta description",
  "primaryKeyword": "${primaryKeyword}",
  "secondaryKeywords": ["4-7 relevant secondary/long-tail keywords"],
  "excerpt": "1-2 sentence card summary (<=220 chars)",
  "category": "${category}",
  "heroImageAlt": "descriptive alt text for a featured image",
  "suggestedImageFilename": "kebab-case.jpg",
  "bodyHtml": "the full HTML article as described",
  "internalLinkSlugs": ["the slugs you linked to"],
  "smile": {"included": ${smileUrl?'true':'false'}, "url": "${smileUrl||''}", "anchorText": "${anchor||''}", "rel": "${REL}", "reason": "1 sentence editorial justification or empty if not included"},
  "references": ["generic authoritative sources listed in the References section"],
  "priority": "${priority}"
}

After writing the file, reply with ONLY: OK ${n} words=<approx body word count> link=${smileUrl?'yes':'no'}`
}

const REVIEW = (p) => {
  const [n, slug] = p
  const f = `${OUT}/article-${String(n).padStart(2,'0')}.json`
  return `Compliance & QA review of a single drafted dental article.
Read the JSON file: ${f}
Validate and FIX IN PLACE (rewrite the same file with the Write tool) against this checklist:
1. It is valid JSON with all required keys (n, slug, title, metaTitle, metaDescription, primaryKeyword, secondaryKeywords, excerpt, category, heroImageAlt, suggestedImageFilename, bodyHtml, internalLinkSlugs, smile, references, priority).
2. slug MUST equal "${slug}". n MUST equal ${n}.
3. bodyHtml has NO <h1>, includes <h2>Introduction</h2>, an FAQ section, a Conclusion, and a References <ol>. Body is 1500-2200 words — if clearly under ~1400 words, EXPAND it with substantive clinical content.
4. NO fabricated studies/citations/authors/years/statistics. If any specific fake citation or invented percentage exists, replace it with generic authoritative-organization language.
5. NO treatment guarantees, NO "best/painless/guaranteed/100%" superlatives. Remove or soften any.
6. metaTitle <=60 chars, metaDescription <=158 chars — trim if over.
7. Internal links: every <a href="/articles/SLUG"> must use a SLUG from the allowed list; remove or re-point any invalid one. Allowed: ${[...EXISTING, ...newSlugs].filter(s=>s!==slug).join(', ')}. There should be 3-5 internal links.
8. Smile link: ${p[6] ? `exactly ONE link to ${p[6]} with rel="${REL}" and target="_blank"; smile.included must be true. If missing, add it naturally in one relevant paragraph.` : `there must be NO smiledentalartscentre.com link anywhere and smile.included must be false. Remove any that exist.`}
9. No backticks or \${ sequences anywhere in the JSON.

If everything already passes, leave the file as-is. If you change anything, rewrite the full corrected JSON file.
Reply with ONLY: REVIEWED ${n} status=<ok|fixed> notes=<short>`
}

phase('Draft')
const results = await pipeline(
  PLAN,
  (p) => agent(GUIDE(p), { label: `draft:${String(p[0]).padStart(2,'0')}-${p[1]}`, phase: 'Draft' }),
  (draftOut, p) => agent(REVIEW(p), { label: `qa:${String(p[0]).padStart(2,'0')}-${p[1]}`, phase: 'Compliance' })
    .then(r => ({ n: p[0], slug: p[1], draft: draftOut, review: r }))
)

const done = results.filter(Boolean)
log(`Completed ${done.length}/50 articles`)
return { total: PLAN.length, completed: done.length, items: done }
