# Root-Canal Article Build — Shared Agent Spec (READ FIRST)

You are writing patient-facing dental-education articles for **CanaDent.net/articles**
(a draft, unpublished PR). Each article promotes **Smile Dental Arts Centre**
(Dr. Neda Kadivar, Markham, Ontario) as a real clinical resource, through accurate
education and a natural homepage hyperlink. These are DRAFTS pending dental review —
do not state otherwise, and do not invent facts.

## 1. VERIFIED FACTS (the ONLY facts you may assert about the clinic)
- Clinic name: **Smile Dental Arts Centre**
- Location: **Markham, Ontario** — address **3980 14th Ave #6, Markham, ON L3R 0B1**
- Phone: **(905) 604-7330**
- Dentist: **Dr. Neda Kadivar** — a **general / family dentist** with **over 20 years of
  experience**; member of the Ontario Dental Association (ODA), the Royal College of
  Dental Surgeons of Ontario (RCDSO), and the Canadian Dental Association (CDA).
  She provides root canal treatment at the clinic.
- **NEVER** call her an endodontist, a specialist, "the best", "#1", "top-rated", or
  an "expert"; **never** invent her school, awards, patient stories, success rates,
  treatment volumes, prices, equipment, or reviews.
- The clinic is in **Markham**. You may write FOR readers in North York who are
  considering care in Markham, but always make the Markham location clear. **Do not**
  invent drive times, distances, or claim the clinic "serves" specific neighbourhoods.

## 2. VERIFIED SMILE URLs (use ONLY these; never invent a path)
- Homepage (MANDATORY in every article): `https://www.smiledentalartscentre.com/`
- Appointments: `https://www.smiledentalartscentre.com/appointments`
- Contact: `https://www.smiledentalartscentre.com/contact-us`
- Dr. Kadivar bio: `https://www.smiledentalartscentre.com/about-us/dr-neda-kadivar`
- Endodontics hub: `https://www.smiledentalartscentre.com/dental-services/endodontics`
- Root canal therapy: `https://www.smiledentalartscentre.com/dental-services/endodontics/root-canal-therapy`
- Root canal retreatment: `https://www.smiledentalartscentre.com/dental-services/endodontics/root-canal-retreatment`
- Dental emergencies: `https://www.smiledentalartscentre.com/dental-services/dental-emergencies`
- Restorations: `https://www.smiledentalartscentre.com/dental-services/restorations`
- Porcelain crowns/caps: `https://www.smiledentalartscentre.com/dental-services/cosmetic-dentistry/porcelain-crowns-caps`
- Pediatric dentistry: `https://www.smiledentalartscentre.com/dental-services/pediatric-dentistry`
- Dental services hub: `https://www.smiledentalartscentre.com/dental-services`

## 3. HYPERLINK RULES
- **Exactly one homepage link** `https://www.smiledentalartscentre.com/` in every article,
  placed naturally (usually in the closing/CTA area), with DESCRIPTIVE, VARIED anchor text
  that names the clinic, e.g. `Smile Dental Arts Centre in Markham`,
  `the team at Smile Dental Arts Centre`, `Smile Dental Arts Centre`. Never use
  promotional anchors like "North York's best/number-one endodontist".
- You MAY add **one** additional deeper link from the verified list above when it is
  genuinely relevant (e.g. the root-canal-therapy page, the appointments page). Use a
  different URL than the homepage. Never link the same URL twice.
- Every Smile link carries `rel="nofollow noopener"` and `target="_blank"`.
- Only use Dr. Kadivar's name in anchor text if the sentence around it is a verified fact.

## 4. MEDICAL / EDITORIAL RULES
- Put a **direct answer to the article's main question in the first paragraph.**
- Use authoritative sources for clinical claims: Canadian Dental Association (CDA),
  Ontario Dental Association (ODA), RCDSO, American Association of Endodontists (AAE),
  Health Canada (radiography). Reference them by name in the `references` array (and you
  may add one plain `<a>` to an official page only if you are certain of the URL;
  otherwise name the body without a link).
- No guarantees of painless treatment, tooth survival, or specific outcomes. Use
  measured language ("usually", "most people", "in many cases", "your dentist will assess").
- Distinguish general education from individual diagnosis. Do NOT imply Dr. Kadivar
  personally performs every procedure discussed (e.g. surgical endodontics / apicoectomy
  may be referred).
- End every `bodyHtml` with this exact disclaimer paragraph:
  `<p class="article-disclaimer"><em>This article is general information and not a substitute for professional dental advice, diagnosis, or treatment. Always speak with a licensed dentist about your specific situation.</em></p>`

## 5. STYLE
- Natural **Canadian English** (e.g. "centre", "colour" not required but spell clinic
  "Centre"). Warm, clear, non-salesy, non-fear-based. No padding, no repetition.
- 700–1,000 words of real content. VARY structure, intros, and conclusions across
  articles — do not reuse a template. Not every section needs the same headings.
- Use `<h2>` and `<h3>` where useful. Include **2–3 FAQs** as `<h3>` questions with
  `<p>` answers when they add information.
- A brief, appropriate appointment CTA near the end (this is where the homepage link
  usually lives). Keep it low-key.
- Mention Dr. Kadivar only where relevant — not in every section.

## 6. OUTPUT FORMAT — write one JSON file per article
Write to `/Users/mahshid/Canadent/scripts/smile-rootcanal-build/article-NN.json`
(NN = zero-padded number, e.g. `article-07.json`). Exact schema:

```json
{
  "n": 7,
  "slug": "do-i-need-a-root-canal-signs",
  "title": "Do I Need a Root Canal? Common Signs and Symptoms",
  "metaTitle": "Do I Need a Root Canal? Signs to Watch For",
  "metaDescription": "Worried you might need a root canal? Learn the common signs — lingering pain, swelling, sensitivity — and when to see a dentist in Markham.",
  "primaryKeyword": "do i need a root canal",
  "secondaryKeywords": ["signs you need a root canal", "root canal symptoms", "tooth nerve pain"],
  "excerpt": "A 1–2 sentence summary of the article for the listing card.",
  "category": "Root Canal Treatment",
  "heroImageAlt": "Descriptive alt text for a hero image (no image file needed).",
  "suggestedImageFilename": "do-i-need-a-root-canal-signs.jpg",
  "bodyHtml": "<h2>...</h2><p>...</p> ... ends with the disclaimer paragraph.",
  "internalLinkSlugs": [],
  "smile": {
    "included": true,
    "url": "https://www.smiledentalartscentre.com/",
    "anchorText": "Smile Dental Arts Centre in Markham",
    "rel": "nofollow noopener",
    "reason": "One-line note on where/why the homepage link is placed."
  },
  "secondarySmileLink": { "url": "https://www.smiledentalartscentre.com/dental-services/endodontics/root-canal-therapy", "anchorText": "root canal therapy at Smile Dental Arts Centre" },
  "references": ["Canadian Dental Association clinical resources", "American Association of Endodontists patient resources"],
  "editorialNote": "Any fact a human should confirm with the clinic before publishing (e.g. sedation options, CDCP specifics). Write 'None.' if nothing.",
  "priority": "High"
}
```

Rules for the JSON:
- `metaTitle` ≈ 50–60 characters. `metaDescription` ≈ 140–160 characters.
- `category` is always `"Root Canal Treatment"`.
- `bodyHtml` must contain the one homepage `<a>` (and optional one deeper `<a>`), and
  must end with the disclaimer paragraph. Valid JSON — escape quotes; no raw newlines
  inside strings are required (you may write the HTML on one line).
- If a claim needs clinic confirmation, note it in `editorialNote`, do NOT state it as fact.
- Keep `secondaryKeywords` to 3–5 items. `internalLinkSlugs` may stay `[]`.
