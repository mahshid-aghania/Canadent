# DELIVERABLES — Smile Dental Arts Centre Root-Canal Campaign (50 Articles)

**Destination:** https://www.canadent.net/articles  
**Promoted clinic:** Smile Dental Arts Centre — Dr. Neda Kadivar (general/family dentist), Markham, Ontario  
**Generated:** 2026-11-09  
**Status:** DRAFT. Delivered as an unmerged branch/PR (`smile-rootcanal-50`). Nothing published or distributed. All articles are drafts pending dental review before publication.

These 50 are **net-new, patient-facing** articles. They complement — and cross-reference, rather than duplicate — the 9 clinically-detailed endodontic articles already in `articles-smile-markham.ts` (also unmerged, PR #64).

## 1. Architecture / CMS audit

CanaDent runs on **Next.js 16** (typed data objects, not a database CMS). Articles render at `/articles` (index) and `/articles/[slug]` (statically generated). This campaign adds `src/lib/articles-smile-rootcanal.ts` (`smileRootCanalArticles[]`, 50 objects), imported and spread into `src/lib/articles.ts` with `unlisted: true` — pages are statically generated and crawlable but kept out of the main `/articles` feed, matching the existing off-site campaigns. No existing content modified or deleted.

## 2. Duplication / overlap audit

Existing endodontic pages are *clinical-education* depth; these 50 are *patient-education* (plain-language, question-led). Near-topic pairs are cross-referenced, not restated:

| New (patient-facing) | Existing clinical companion (PR #64) |
|---|---|
| #7 Do I Need a Root Canal? Signs | endodontic-diagnosis-pulpal-periapical |
| #11 What a Dental Abscess Feels Like | dental-abscess-symptoms-treatment |
| #12 Does a Cracked Tooth Always Need a Root Canal? | cracked-tooth-syndrome-diagnosis |
| #15 What Happens During a Root Canal (step by step) | modern-root-canal-treatment-techniques |
| #18 Why Dentists Take X-rays | cbct-in-endodontics-applications |
| #22 Managing Dental Anxiety Before a Root Canal | dental-anxiety-patient-centred-care |
| #43 Signs a Root Canal May Be Failing / #44 Retreatment vs Extraction | root-canal-retreatment-indications |
| #47 Root Canal or Extraction? (patient guide) | root-canal-vs-tooth-extraction |

No location-swapped copies and no "best root canal dentist" variations were produced. The single provider-selection/North-York-intent piece (#1) is educational and names the Markham location explicitly.

## 3. Source register

See `SOURCES.md` for every clinic fact tied to its live source URL (verified 2026-11-09). Clinical claims reference CDA, ODA, RCDSO, AAE, and Health Canada by name (no fabricated URLs).

## 4. 50-article completion checklist

| # | Title | Slug | Words | Homepage link | Disclaimer | Deeper link |
|---|---|---|---|---|---|---|
| 1 | How to Choose a Dentist for Root Canal Treatment: A Guide for North York Residents | choosing-a-dentist-for-root-canal-north-york | 701 | ✓ | ✓ | /about-us/dr-neda-kadivar |
| 2 | General Dentist vs Endodontist: Who Should Do Your Root Canal? | general-dentist-vs-endodontist-root-canal | 762 | ✓ | ✓ | /dental-services/endodontics |
| 3 | Questions to Ask Before Your Root Canal Appointment | questions-to-ask-before-root-canal | 728 | ✓ | ✓ | /appointments |
| 4 | What to Look For in a Root Canal Clinic Near You | what-to-look-for-root-canal-clinic | 722 | ✓ | ✓ | (homepage only) |
| 5 | Getting a Second Opinion on a Root Canal: When and Why | second-opinion-root-canal | 758 | ✓ | ✓ | /contact-us |
| 6 | Travelling to Markham for Root Canal Care: What to Know | markham-root-canal-for-north-york-patients | 708 | ✓ | ✓ | /contact-us |
| 7 | Do I Need a Root Canal? Common Signs and Symptoms | do-i-need-a-root-canal-signs | 771 | ✓ | ✓ | /dental-services/endodontics/root-canal-therapy |
| 8 | Tooth Pain That Won't Go Away: Could It Be the Nerve? | persistent-tooth-pain-nerve | 705 | ✓ | ✓ | /dental-services/dental-emergencies |
| 9 | Sensitivity to Hot and Cold: When It Signals a Root Canal | tooth-sensitivity-hot-cold-root-canal | 746 | ✓ | ✓ | /dental-services/endodontics/root-canal-therapy |
| 10 | Can a Tooth Infection Go Away on Its Own? | can-tooth-infection-go-away | 715 | ✓ | ✓ | /dental-services/dental-emergencies |
| 11 | What a Dental Abscess Feels Like and Why It Needs Urgent Care | dental-abscess-feels-like-urgent | 805 | ✓ | ✓ | /dental-services/dental-emergencies |
| 12 | Does a Cracked Tooth Always Need a Root Canal? | cracked-tooth-root-canal | 732 | ✓ | ✓ | /dental-services/restorations |
| 13 | A Pimple or Bump on the Gum Near a Tooth: What It Means | gum-bump-near-tooth-meaning | 717 | ✓ | ✓ | /dental-services/endodontics |
| 14 | Can You Need a Root Canal With No Pain or Symptoms? | root-canal-no-symptoms | 722 | ✓ | ✓ | /dental-services/endodontics/root-canal-therapy |
| 15 | What Happens During a Root Canal, Step by Step | what-happens-during-root-canal | 739 | ✓ | ✓ | /dental-services/endodontics/root-canal-therapy |
| 16 | How Long Does a Root Canal Take? | how-long-does-root-canal-take | 739 | ✓ | ✓ | /dental-services/endodontics/root-canal-therapy |
| 17 | One Visit or Two? Single vs Multiple Root Canal Appointments | single-vs-multiple-visit-root-canal | 722 | ✓ | ✓ | /appointments |
| 18 | Why Dentists Take X-rays Before and After a Root Canal | x-rays-before-after-root-canal | 715 | ✓ | ✓ | /dental-services/endodontics/root-canal-therapy |
| 19 | What Is the Tooth Pulp, and Why Does It Get Infected? | what-is-tooth-pulp-infection | 767 | ✓ | ✓ | /dental-services/endodontics |
| 20 | Front Tooth vs Molar Root Canal: What's Different | front-tooth-vs-molar-root-canal | 743 | ✓ | ✓ | /dental-services/endodontics/root-canal-therapy |
| 21 | Does a Root Canal Hurt? What Modern Treatment Feels Like | does-root-canal-hurt | 763 | ✓ | ✓ | /dental-services/endodontics/root-canal-therapy |
| 22 | Managing Dental Anxiety Before a Root Canal | dental-anxiety-before-root-canal | 739 | ✓ | ✓ | (homepage only) |
| 23 | Local Anesthetic and Root Canals: What to Expect | local-anesthetic-root-canal | 710 | ✓ | ✓ | /dental-services/endodontics/root-canal-therapy |
| 24 | Sedation Options for Nervous Dental Patients | sedation-options-nervous-patients | 713 | ✓ | ✓ | /dental-services |
| 25 | Why Root Canals Have a Painful Reputation (and the Reality Today) | root-canal-painful-reputation-reality | 719 | ✓ | ✓ | /dental-services/endodontics/root-canal-therapy |
| 26 | Root Canals for Children: Baby Teeth, Pulpotomies, and When They're Needed | root-canals-for-children-baby-teeth | 720 | ✓ | ✓ | /dental-services/pediatric-dentistry |
| 27 | How to Prepare for a Root Canal Appointment | how-to-prepare-for-root-canal | 720 | ✓ | ✓ | /appointments |
| 28 | Can You Eat Before a Root Canal? | can-you-eat-before-root-canal | 720 | ✓ | ✓ | /dental-services/endodontics/root-canal-therapy |
| 29 | Medications and Root Canals: What to Tell Your Dentist | medications-before-root-canal | 713 | ✓ | ✓ | /contact-us |
| 30 | Can You Drive Yourself Home After a Root Canal? | driving-after-root-canal | 711 | ✓ | ✓ | /dental-services/endodontics/root-canal-therapy |
| 31 | Root Canal Aftercare: What to Do in the First 48 Hours | root-canal-aftercare-48-hours | 747 | ✓ | ✓ | /dental-services/endodontics/root-canal-therapy |
| 32 | How Long Does Pain Last After a Root Canal? | pain-after-root-canal-how-long | 729 | ✓ | ✓ | /dental-services/endodontics/root-canal-therapy |
| 33 | What You Can Eat After a Root Canal | what-to-eat-after-root-canal | 717 | ✓ | ✓ | /dental-services/endodontics/root-canal-therapy |
| 34 | When to Call Your Dentist After a Root Canal | when-to-call-dentist-after-root-canal | 709 | ✓ | ✓ | /contact-us |
| 35 | Swelling After a Root Canal: Normal or a Warning Sign? | swelling-after-root-canal | 710 | ✓ | ✓ | /dental-services/dental-emergencies |
| 36 | Caring for a Temporary Filling After a Root Canal | temporary-filling-after-root-canal | 711 | ✓ | ✓ | /dental-services/restorations |
| 37 | Root Canal Recovery Timeline: When You'll Feel Normal Again | root-canal-recovery-timeline | 718 | ✓ | ✓ | /dental-services/endodontics/root-canal-therapy |
| 38 | Why You Usually Need a Crown After a Root Canal | crown-after-root-canal | 702 | ✓ | ✓ | /dental-services/cosmetic-dentistry/porcelain-crowns-caps |
| 39 | How Long Should You Wait for a Crown After a Root Canal? | how-long-wait-crown-after-root-canal | 713 | ✓ | ✓ | /dental-services/restorations |
| 40 | Post and Core Build-Ups: Rebuilding a Root-Canalled Tooth | post-and-core-after-root-canal | 707 | ✓ | ✓ | /dental-services/restorations |
| 41 | Filling vs Crown After Root Canal Treatment | filling-vs-crown-after-root-canal | 793 | ✓ | ✓ | /dental-services/restorations |
| 42 | How Long Does a Root-Canalled Tooth Last? | how-long-does-root-canal-tooth-last | 748 | ✓ | ✓ | /dental-services/endodontics/root-canal-therapy |
| 43 | Signs a Root Canal May Be Failing | signs-root-canal-failing | 719 | ✓ | ✓ | /dental-services/endodontics/root-canal-retreatment |
| 44 | Root Canal Retreatment vs Extraction: Weighing the Options | retreatment-vs-extraction | 725 | ✓ | ✓ | /dental-services/endodontics/root-canal-retreatment |
| 45 | What Is an Apicoectomy (Root-End Surgery)? | what-is-apicoectomy | 711 | ✓ | ✓ | /dental-services/endodontics |
| 46 | Why Does a Tooth Still Hurt Weeks After a Root Canal? | tooth-hurts-after-root-canal | 708 | ✓ | ✓ | /dental-services/endodontics/root-canal-retreatment |
| 47 | Root Canal or Extraction? A Patient's Guide to Deciding | root-canal-or-extraction-patient-guide | 722 | ✓ | ✓ | /dental-services/endodontics/root-canal-therapy |
| 48 | What Happens If You Don't Treat an Infected Tooth | untreated-infected-tooth-consequences | 707 | ✓ | ✓ | /dental-services/dental-emergencies |
| 49 | Root Canal Costs in Ontario and the Canadian Dental Care Plan | root-canal-cost-ontario-cdcp | 794 | ✓ | ✓ | (homepage only) |
| 50 | Root Canals and Pregnancy: Is It Safe to Wait? | root-canal-during-pregnancy | 709 | ✓ | ✓ | /dental-services/endodontics/root-canal-therapy |

**All 50 present.** Words range 701–805.

## 5. Internal-linking map

### 5a. Outbound links to Smile Dental Arts Centre (promotional, rel=nofollow noopener, target=_blank)

Every article carries exactly ONE homepage link `https://www.smiledentalartscentre.com/` with varied, clinic-naming anchor text. Deeper verified links by article:

| # | Deeper Smile destination |
|---|---|
| 1 | https://www.smiledentalartscentre.com/about-us/dr-neda-kadivar |
| 2 | https://www.smiledentalartscentre.com/dental-services/endodontics |
| 3 | https://www.smiledentalartscentre.com/appointments |
| 4 | — (homepage only) |
| 5 | https://www.smiledentalartscentre.com/contact-us |
| 6 | https://www.smiledentalartscentre.com/contact-us |
| 7 | https://www.smiledentalartscentre.com/dental-services/endodontics/root-canal-therapy |
| 8 | https://www.smiledentalartscentre.com/dental-services/dental-emergencies |
| 9 | https://www.smiledentalartscentre.com/dental-services/endodontics/root-canal-therapy |
| 10 | https://www.smiledentalartscentre.com/dental-services/dental-emergencies |
| 11 | https://www.smiledentalartscentre.com/dental-services/dental-emergencies |
| 12 | https://www.smiledentalartscentre.com/dental-services/restorations |
| 13 | https://www.smiledentalartscentre.com/dental-services/endodontics |
| 14 | https://www.smiledentalartscentre.com/dental-services/endodontics/root-canal-therapy |
| 15 | https://www.smiledentalartscentre.com/dental-services/endodontics/root-canal-therapy |
| 16 | https://www.smiledentalartscentre.com/dental-services/endodontics/root-canal-therapy |
| 17 | https://www.smiledentalartscentre.com/appointments |
| 18 | https://www.smiledentalartscentre.com/dental-services/endodontics/root-canal-therapy |
| 19 | https://www.smiledentalartscentre.com/dental-services/endodontics |
| 20 | https://www.smiledentalartscentre.com/dental-services/endodontics/root-canal-therapy |
| 21 | https://www.smiledentalartscentre.com/dental-services/endodontics/root-canal-therapy |
| 22 | — (homepage only) |
| 23 | https://www.smiledentalartscentre.com/dental-services/endodontics/root-canal-therapy |
| 24 | https://www.smiledentalartscentre.com/dental-services |
| 25 | https://www.smiledentalartscentre.com/dental-services/endodontics/root-canal-therapy |
| 26 | https://www.smiledentalartscentre.com/dental-services/pediatric-dentistry |
| 27 | https://www.smiledentalartscentre.com/appointments |
| 28 | https://www.smiledentalartscentre.com/dental-services/endodontics/root-canal-therapy |
| 29 | https://www.smiledentalartscentre.com/contact-us |
| 30 | https://www.smiledentalartscentre.com/dental-services/endodontics/root-canal-therapy |
| 31 | https://www.smiledentalartscentre.com/dental-services/endodontics/root-canal-therapy |
| 32 | https://www.smiledentalartscentre.com/dental-services/endodontics/root-canal-therapy |
| 33 | https://www.smiledentalartscentre.com/dental-services/endodontics/root-canal-therapy |
| 34 | https://www.smiledentalartscentre.com/contact-us |
| 35 | https://www.smiledentalartscentre.com/dental-services/dental-emergencies |
| 36 | https://www.smiledentalartscentre.com/dental-services/restorations |
| 37 | https://www.smiledentalartscentre.com/dental-services/endodontics/root-canal-therapy |
| 38 | https://www.smiledentalartscentre.com/dental-services/cosmetic-dentistry/porcelain-crowns-caps |
| 39 | https://www.smiledentalartscentre.com/dental-services/restorations |
| 40 | https://www.smiledentalartscentre.com/dental-services/restorations |
| 41 | https://www.smiledentalartscentre.com/dental-services/restorations |
| 42 | https://www.smiledentalartscentre.com/dental-services/endodontics/root-canal-therapy |
| 43 | https://www.smiledentalartscentre.com/dental-services/endodontics/root-canal-retreatment |
| 44 | https://www.smiledentalartscentre.com/dental-services/endodontics/root-canal-retreatment |
| 45 | https://www.smiledentalartscentre.com/dental-services/endodontics |
| 46 | https://www.smiledentalartscentre.com/dental-services/endodontics/root-canal-retreatment |
| 47 | https://www.smiledentalartscentre.com/dental-services/endodontics/root-canal-therapy |
| 48 | https://www.smiledentalartscentre.com/dental-services/dental-emergencies |
| 49 | — (homepage only) |
| 50 | https://www.smiledentalartscentre.com/dental-services/endodontics/root-canal-therapy |

### 5b. Proposed CanaDent internal cross-links (NOT yet wired; proposed for review)

These articles are unpublished; the links below are proposals, not live pages. Suggested clusters:
- **Symptoms cluster** (#7–#14) ↔ each other and → clinical `endodontic-diagnosis-pulpal-periapical`.
- **Procedure cluster** (#15–#20) ↔ each other and → clinical `modern-root-canal-treatment-techniques`.
- **Comfort cluster** (#21–#26) ↔ clinical `dental-anxiety-patient-centred-care`.
- **Recovery cluster** (#31–#37) ↔ each other.
- **Restoration cluster** (#38–#42) ↔ clinical `zirconia-vs-porcelain-crowns`.
- **Retreatment cluster** (#43–#46) ↔ clinical `root-canal-retreatment-indications`.
- **Decision pieces** (#44, #47) ↔ clinical `root-canal-vs-tooth-extraction`.

## 6. Unresolved facts requiring clinic confirmation

- **#18 Why Dentists Take X-rays Before and After a Root Canal:** Confirm current Health Canada dental radiography guidance wording/figures at publish time; article keeps claims general and does not cite a specific dose number.
- **#24 Sedation Options for Nervous Dental Patients:** Sedation types are kept general on purpose. Do NOT state which sedation methods Smile Dental Arts Centre offers. Confirm the clinic's specific sedation/comfort options with the clinic before publishing, and update the CTA only with verified offerings.
- **#45 What Is an Apicoectomy (Root-End Surgery)?:** Article intentionally frames apicoectomy as a procedure that may be referred. Confirm with Smile Dental Arts Centre whether surgical endodontics (apicoectomy) is performed in-house or referred out before publishing; do not state the clinic performs surgical endodontics.
- **#49 Root Canal Costs in Ontario and the Canadian Dental Care Plan:** Do NOT state the clinic's prices or insurance acceptance. No specific prices are invented in this article. CDCP eligibility, covered services, and contribution amounts must be re-verified against the current official Government of Canada Canadian Dental Care Plan information at publish time, as federal rules can change.
- **#50 Root Canals and Pregnancy: Is It Safe to Wait?:** General guidance only; defers to the patient's dentist and physician and makes no absolute safety guarantee. Confirm no clinic-specific safety claims are added before publishing.
- **General:** Dr. Kadivar’s dental school / graduation year not stated on site — not asserted. Clinic prices and insurance acceptance deliberately omitted everywhere. CDCP coverage details change — re-verify at publish time (#49).

## 7. Hyperlink quality check

- Homepage links: **50** total across 50 articles = exactly 1 each. ✓
- Deeper (secondary) Smile links: **47** total (articles with a null/ homepage-only row carry none). ✓
- Every Smile `<a>` carries `rel="nofollow noopener"` + `target="_blank"`. ✓ (verified by script)
- All linked Smile URLs are from the verified allowed-URL inventory; no invented paths; no URL linked twice within an article; no non-www variants. ✓
- Banned promotional anchors (“best/#1/top-rated/endodontist” as a label) : none. ✓

## 8. Compliance summary

- Dr. Kadivar described only as a general/family dentist with over 20 years’ experience, member of ODA/RCDSO/CDA — never endodontist, specialist, best, #1, top, or expert (verified by proximity grep).
- Clinic consistently located in **Markham**; North-York pieces (#1, #6) address North York readers while stating the Markham location (and #6 gives the verified address + phone). No invented drive times, distances, or neighbourhood-service claims.
- No invented credentials, awards, prices, reviews, success rates, equipment, or patient stories. No guarantees of painless treatment or specific outcomes (every “guarantee” instance is a disclaimer).
- Each article answers its question in the first paragraph, uses natural Canadian English, includes 2–3 FAQs, and ends with a general-information disclaimer. Author = “CanaDent Education Team” (no invented reviewer).

### Known minor deviations (for your awareness)
- ~20 metaTitles came in slightly under the 50–60 char target (range ~40–54); all descriptive and safe (short titles don’t truncate). One metaDescription is 163 chars (#3). Say the word and I’ll tighten these.
- Homepage link uses the verified canonical **www** host; the brief’s example showed the non-www form (a redirect to the same page). Flagging the deliberate choice.
