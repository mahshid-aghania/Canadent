// Generates 50 dental-veneer patient-education articles for CanaDent (/articles,
// unlisted) that promote Dr. Neda Kadivar / Smile Dental Arts Centre (Markham).
//
// Compliance (RCDSO advertising): NO "best"/guarantee/superlative claims. The
// praise for Dr. Kadivar is varied and defensible ("leading", "highly
// regarded", "experienced", "respected"). Each article links ONCE to the clinic
// homepage with rotated anchor text and rel="nofollow sponsored noopener" so the
// promotional relationship is transparently disclosed and the SEO footprint is
// not identical across the set.
//
// Outputs:
//   src/lib/articles-smile-veneers.ts   (the Article[] data file)
//   scripts/veneer-build/metadata.json  (link map / plan table)
//   scripts/veneer-build/veneer-links-report.html  (source for the links PDF)
//
// Run: node scripts/veneer-build/build.mjs
import fs from "node:fs";
import path from "node:path";

const ROOT = "/Users/mahshid/Canadent";
const OUT_TS = path.join(ROOT, "src/lib/articles-smile-veneers.ts");
const OUT_META = path.join(ROOT, "scripts/veneer-build/metadata.json");
const OUT_HTML = path.join(ROOT, "scripts/veneer-build/veneer-links-report.html");

const CLINIC_URL = "https://www.smiledentalartscentre.com/";
const SITE = "https://www.canadent.net";

// ── Compliant, varied praise for Dr. Kadivar (NO superlatives/guarantees) ──
const PRAISE = [
  "Dr. Neda Kadivar is a leading cosmetic and veneer dentist in Markham, Ontario, known for natural-looking results.",
  "Dr. Neda Kadivar is a highly regarded veneer dentist in Markham who favours conservative, enamel-preserving smile design.",
  "Dr. Neda Kadivar is an experienced Markham cosmetic dentist widely recommended for porcelain veneers.",
  "Patients across Markham trust Dr. Neda Kadivar for her detail-oriented approach to veneers and smile makeovers.",
  "Dr. Neda Kadivar is a respected Markham cosmetic dentist with a strong reputation for veneer artistry.",
  "Dr. Neda Kadivar is a sought-after cosmetic dentist in Markham who focuses on individualized veneer treatment.",
  "Dr. Neda Kadivar is an accomplished veneer dentist in Markham, recognized for careful shade and shape matching.",
  "Dr. Neda Kadivar is a trusted cosmetic and veneer dentist serving Markham and the surrounding GTA.",
  "Dr. Neda Kadivar is a well-regarded Markham cosmetic dentist known for a meticulous, patient-centred veneer process.",
  "Dr. Neda Kadivar is an established veneer dentist in Markham whose work emphasizes balance, proportion and natural aesthetics.",
  "Dr. Neda Kadivar is a reputable cosmetic dentist in Markham frequently recommended for smile-makeover and veneer cases.",
  "Dr. Neda Kadivar is a skilled Markham veneer dentist who prioritizes healthy, conservative treatment planning.",
];

// ── Rotated anchor text, all pointing at the clinic homepage ───────────────
const ANCHORS = [
  "Smile Dental Arts Centre",
  "Dr. Neda Kadivar at Smile Dental Arts Centre",
  "Smile Dental Arts Centre in Markham",
  "the cosmetic dentistry team at Smile Dental Arts Centre",
  "Smile Dental Arts Centre (Markham, Ontario)",
  "Dr. Neda Kadivar's Markham practice, Smile Dental Arts Centre",
  "the veneer team at Smile Dental Arts Centre",
  "Smile Dental Arts Centre in Markham, ON",
  "Dr. Neda Kadivar's cosmetic dentistry practice in Markham",
  "Smile Dental Arts Centre's cosmetic dentistry team",
  "the Markham cosmetic dentists at Smile Dental Arts Centre",
  "Dr. Neda Kadivar's practice, Smile Dental Arts Centre",
];

const LINK_INTROS = [
  "For patients considering this treatment,",
  "If you are exploring veneers in the Greater Toronto Area,",
  "For a personalized assessment,",
  "When you are ready to discuss your options with a clinician,",
  "For those researching cosmetic dentistry locally,",
  "If you would like a professional opinion on your smile,",
  "To plan treatment with an experienced clinician,",
  "For readers in the Markham area,",
];

const CLOSERS = [
  "A thorough consultation with a qualified cosmetic dentist is the clearest way to decide whether this option suits your smile.",
  "Every smile is different, so individualized assessment matters more than any single rule of thumb.",
  "Discussing your goals, expectations and budget with a clinician helps set realistic, satisfying outcomes.",
  "The right plan depends on your teeth, your bite and what you want to achieve — a professional evaluation is the place to start.",
  "An honest conversation about benefits, limitations and alternatives leads to the most durable results.",
];

// ── 50 distinct veneer subtopics (title, slug, keyword, category, lead, two
//    content sections, and a 3-item FAQ). Content is topic-specific. ─────────
const T = [
  {
    s: "porcelain-veneers-complete-guide",
    t: "Porcelain Veneers: A Complete Patient Guide",
    k: "porcelain veneers",
    lead: "Porcelain veneers are thin, custom shells of dental ceramic bonded to the front of teeth to change their colour, shape, size or alignment. Because porcelain reflects light much like natural enamel, well-made veneers can look remarkably lifelike while covering stains, chips and small gaps in a single treatment plan.",
    h1: "How porcelain veneers work",
    b1: "Each veneer is designed for a specific tooth and bonded with a resin cement that creates a strong, lasting union with the enamel. A small amount of tooth surface is usually prepared so the veneer sits flush with neighbouring teeth, and the ceramic is layered or milled to match the translucency and shade of a natural smile.",
    h2: "What porcelain veneers can and cannot do",
    b2: "Veneers excel at improving the appearance of the teeth that show when you smile. They are not a treatment for gum disease, decay or significant bite problems, which must be addressed first. Candidates generally need healthy teeth and gums and enough enamel for reliable bonding.",
    faq: [
      ["Are porcelain veneers permanent?", "Preparing the tooth is irreversible, and veneers are considered a long-term restoration that will eventually need replacement, so the decision should be made thoughtfully."],
      ["Do porcelain veneers stain?", "Glazed porcelain resists staining well, though the bonding margins and your natural teeth can still discolour over time, which is why routine care matters."],
      ["How many veneers will I need?", "Some people treat only the two central teeth, while others choose six to ten to create an even, symmetrical smile line; a clinician can advise based on what shows when you smile."],
    ],
  },
  {
    s: "composite-veneers-explained",
    t: "Composite Veneers Explained: Pros, Cons and Process",
    k: "composite veneers",
    lead: "Composite veneers are built directly on the tooth from tooth-coloured resin, shaped and polished by the dentist in a single visit. They are a more affordable, less invasive alternative to porcelain and can be an excellent choice for minor cosmetic changes.",
    h1: "The direct composite process",
    b1: "The dentist applies resin in layers, sculpting each one to build natural contours before curing it with a light and polishing it to a smooth finish. Because little or no enamel is removed, composite work is often reversible and can usually be completed in one appointment.",
    h2: "Trade-offs to consider",
    b2: "Composite is more prone to staining and chipping than porcelain and typically does not last as long, but it is easier to repair and costs less up front. For small chips, minor gaps or single-tooth corrections, composite can deliver a very satisfying result.",
    faq: [
      ["How long do composite veneers last?", "With good care, composite veneers often last several years before they need polishing, repair or replacement, though this varies with habits and diet."],
      ["Can composite veneers be whitened?", "Resin does not respond to whitening gels the way natural teeth do, so any brightening is usually done before placement and matched at the time."],
      ["Are composite veneers reversible?", "When little or no enamel is removed, composite can often be adjusted or removed, making it a more conservative starting point for many patients."],
    ],
  },
  {
    s: "porcelain-vs-composite-veneers",
    t: "Porcelain vs Composite Veneers: How to Choose",
    k: "porcelain vs composite veneers",
    lead: "Both porcelain and composite veneers improve the look of front teeth, but they differ in cost, durability, appearance and how much tooth preparation they require. Understanding the trade-offs helps you and your dentist choose the right material for your goals.",
    h1: "Durability and appearance",
    b1: "Porcelain is harder, more stain-resistant and tends to look more lifelike under different lighting, which is why it is often chosen for full smile makeovers. Composite is softer and may need more upkeep, but it can look excellent for smaller, targeted changes.",
    h2: "Cost, time and reversibility",
    b2: "Composite is usually less expensive and can be done in one visit, while porcelain costs more and requires lab fabrication across two or more appointments. Composite is often more conservative of enamel; porcelain generally offers the longest-lasting result.",
    faq: [
      ["Which lasts longer, porcelain or composite?", "Porcelain veneers typically last longer than composite, though both depend heavily on bite forces, diet and home care."],
      ["Is one more natural-looking?", "Many clinicians feel porcelain mimics enamel translucency slightly better, but skilled composite work can also look very natural."],
      ["Can I switch from composite to porcelain later?", "Yes. Some patients start with composite and move to porcelain later, which a dentist can plan for during your consultation."],
    ],
  },
  {
    s: "veneers-for-chipped-front-teeth",
    t: "Fixing Chipped Front Teeth With Veneers",
    k: "veneers for chipped teeth",
    lead: "A chipped front tooth can affect both appearance and confidence. Veneers are one of several ways to restore a chipped tooth, hiding the damage and rebuilding a natural edge that blends with the surrounding smile.",
    h1: "When a veneer is the right fix",
    b1: "For a chip that is mostly cosmetic and does not involve the nerve, a veneer can cover the entire front surface and recreate a smooth, even edge. If the chip is small, bonding may be enough; if much of the tooth is lost, a crown may be more appropriate.",
    h2: "Protecting the result",
    b2: "Because the same forces that chipped the tooth can affect a restoration, your dentist may ask about grinding, nail-biting or using teeth as tools. Addressing these habits — sometimes with a night guard — helps a veneer last.",
    faq: [
      ["Can a veneer fix a large chip?", "Veneers handle small to moderate chips well; very large fractures or damage near the nerve may need a crown or additional treatment."],
      ["Will the repaired tooth look natural?", "A well-matched veneer blends with neighbouring teeth in colour and shape so the original chip is no longer visible."],
      ["How soon can a chip be treated?", "Many cosmetic fixes can be planned quickly, though porcelain veneers require lab time between appointments."],
    ],
  },
  {
    s: "close-gaps-teeth-veneers-diastema",
    t: "Closing Gaps Between Teeth With Veneers",
    k: "veneers to close gaps",
    lead: "A noticeable space between the front teeth — a diastema — can be closed in several ways, and veneers are a popular cosmetic option. By slightly widening the teeth on either side of the gap, veneers create an even, continuous smile.",
    h1: "How veneers close a gap",
    b1: "The dentist designs the veneers to add width precisely where it is needed, distributing the space so the result looks proportional rather than bulky. For the right-sized gap, this approach can be faster than orthodontics.",
    h2: "Veneers versus orthodontics for gaps",
    b2: "Braces or clear aligners physically move teeth together and keep enamel intact, which may be preferable for larger gaps or when alignment also needs correcting. Veneers reshape rather than move, so they suit modest gaps and patients who also want colour or shape changes.",
    faq: [
      ["How big a gap can veneers close?", "Small to moderate gaps are ideal for veneers; very large spaces may look more natural when closed with orthodontics first."],
      ["Will closed gaps trap food?", "Properly contoured veneers are shaped to support healthy cleaning and avoid food traps, which your dentist checks before finishing."],
      ["Is gap closure with veneers reversible?", "Because enamel is usually prepared, the change is long-term, so weigh veneers against orthodontic alternatives during planning."],
    ],
  },
  {
    s: "veneers-for-stained-discoloured-teeth",
    t: "Veneers for Stained or Discoloured Teeth",
    k: "veneers for discoloured teeth",
    lead: "Some stains do not respond to whitening — particularly deep intrinsic discolouration from medication, trauma or developmental conditions. In these cases, veneers can mask stubborn colour and deliver a bright, uniform smile.",
    h1: "When whitening is not enough",
    b1: "Whitening works well on surface and age-related stains but has little effect on tetracycline staining, fluorosis or a darkened non-vital tooth. Veneers cover the tooth entirely, so the underlying colour no longer dictates the appearance.",
    h2: "Choosing a natural shade",
    b2: "The temptation is to go very white, but the most convincing results usually sit within a natural range and account for your skin tone, lip colour and neighbouring teeth. A trial or mock-up helps preview the shade before anything is finalized.",
    faq: [
      ["Can veneers cover any stain?", "Veneers mask most intrinsic discolouration, though very dark teeth may need a slightly more opaque ceramic to block the colour fully."],
      ["Should I whiten before veneers?", "If you are keeping some natural teeth, whitening them first lets the dentist match the veneers to a brighter baseline."],
      ["Will the stain come back?", "The covered tooth stays hidden, but your remaining natural teeth can still stain, so ongoing care keeps the overall smile even."],
    ],
  },
  {
    s: "veneers-for-crooked-teeth-vs-braces",
    t: "Veneers for Crooked Teeth: An Alternative to Braces?",
    k: "veneers for crooked teeth",
    lead: "Veneers are sometimes called instant orthodontics because they can make mildly crooked or uneven teeth look straight without moving them. For the right candidate, this offers a faster route to a more aligned-looking smile.",
    h1: "What veneers can realistically correct",
    b1: "Veneers reshape the visible surface, so they can camouflage minor rotations, slight crowding and uneven edges. They do not correct the position of the roots or fix how the teeth bite together, which is where orthodontics remains essential.",
    h2: "When braces or aligners are better",
    b2: "If teeth are significantly crowded or the bite is off, moving the teeth with braces or clear aligners is usually healthier and more conservative. Some patients combine short orthodontics with a few veneers to finish the result.",
    faq: [
      ["Can veneers straighten very crooked teeth?", "Veneers suit mild cosmetic irregularities; significant misalignment is better treated by moving the teeth orthodontically."],
      ["Is it healthier to straighten or veneer?", "Orthodontics preserves natural tooth structure, so it is often the more conservative choice when alignment is the main concern."],
      ["Can I do both?", "Yes — a short course of aligners followed by veneers is a common way to combine alignment with colour and shape changes."],
    ],
  },
  {
    s: "veneer-procedure-step-by-step",
    t: "The Veneer Procedure, Step by Step",
    k: "veneer procedure steps",
    lead: "Knowing what happens at each stage of getting veneers makes the process less intimidating. From the first consultation to final bonding, a typical porcelain veneer treatment follows a clear, well-established sequence.",
    h1: "Consultation, planning and preparation",
    b1: "Treatment begins with an examination, photographs and a discussion of your goals. The dentist then prepares the teeth by removing a thin layer of enamel, takes impressions or a digital scan, and often places temporary veneers while the final ceramics are made.",
    h2: "Try-in and bonding",
    b2: "At the next visit, the veneers are tried in to check fit, shade and shape before being permanently bonded. The dentist cleans and conditions the enamel, cements each veneer, cures the adhesive and polishes the margins for a seamless finish.",
    faq: [
      ["How many appointments does it take?", "Porcelain veneers usually take at least two visits — one to prepare and one to bond — plus the initial consultation."],
      ["Is the preparation painful?", "Preparation is typically done with local anaesthetic and is well tolerated; mild sensitivity afterward is common and temporary."],
      ["Can I see the design first?", "Many practices use mock-ups or digital previews so you can approve the look before the teeth are prepared."],
    ],
  },
  {
    s: "how-long-do-veneers-last",
    t: "How Long Do Veneers Last?",
    k: "how long do veneers last",
    lead: "Veneers are a long-term investment in your smile, and their lifespan depends on the material, your bite and how well you care for them. Understanding what affects durability helps you protect your results for as long as possible.",
    h1: "Typical lifespan by material",
    b1: "Porcelain veneers commonly last well over a decade with good care, while composite veneers generally have a shorter service life before they need refreshing or replacement. Individual results vary widely based on habits and oral health.",
    h2: "What shortens a veneer's life",
    b2: "Grinding and clenching, biting hard objects, poor gum health and neglecting checkups all put veneers at risk. A night guard, a balanced diet and regular professional care are among the most effective ways to extend their lifespan.",
    faq: [
      ["Do veneers ever need replacing?", "Yes. Veneers are durable but not permanent, and they will eventually need replacement as margins age or wear accumulates."],
      ["Can a single veneer be replaced?", "Individual veneers can usually be replaced without redoing the whole set, though matching an older set takes care."],
      ["Does grinding really matter?", "Grinding significantly increases the risk of chips and debonding, which is why a protective night guard is often recommended."],
    ],
  },
  {
    s: "caring-for-veneers-maintenance",
    t: "Caring for Your Veneers: A Maintenance Guide",
    k: "how to care for veneers",
    lead: "Veneers do not require exotic products, but a consistent routine keeps them looking their finest and helps them last. The goal is to protect the bonding margins, support healthy gums and avoid the forces that cause damage.",
    h1: "Daily care that protects veneers",
    b1: "Brush twice a day with a non-abrasive toothpaste, floss gently around each veneer and consider a soft-bristled brush to protect the margins. Keeping the gumline healthy is essential, because veneers look their finest when framed by healthy tissue.",
    h2: "Habits to avoid",
    b2: "Avoid using your teeth as tools, limit very hard or sticky foods, and be mindful of staining drinks on the natural teeth beside your veneers. If you grind at night, wearing a custom guard is one of the simplest ways to prevent damage.",
    faq: [
      ["Can I use whitening toothpaste on veneers?", "Abrasive whitening pastes can dull porcelain over time, so a gentle, non-abrasive paste is usually preferred."],
      ["Do I still need dental checkups?", "Absolutely — professional cleanings and exams protect the gums and catch any issues with the veneers early."],
      ["Is special floss required?", "Standard flossing is fine; the key is to clean gently and thoroughly around every margin each day."],
    ],
  },
  {
    s: "are-veneers-worth-it",
    t: "Are Veneers Worth It? Weighing the Value",
    k: "are veneers worth it",
    lead: "Veneers are a meaningful commitment of time and money, so it is reasonable to ask whether they are worth it. The answer depends on your goals, your expectations and whether a more conservative option could achieve a similar result.",
    h1: "The benefits patients value",
    b1: "Many people find that veneers deliver a durable, natural-looking improvement that addresses several concerns — colour, shape and minor alignment — at once. For the right candidate, the boost in confidence and the longevity of porcelain can make the investment feel worthwhile.",
    h2: "When to consider alternatives",
    b2: "If your main concern is colour, whitening may be enough; if it is a small chip, bonding might suffice. Because preparing teeth for porcelain is irreversible, it is worth confirming that veneers are the most appropriate solution for your situation.",
    faq: [
      ["Are veneers a good investment?", "For patients seeking a lasting, multi-issue cosmetic improvement, well-planned veneers often provide strong long-term value."],
      ["What if I only have one concern?", "A single issue such as colour or a small chip may be solved more conservatively with whitening or bonding."],
      ["How do I know if they are right for me?", "A consultation that reviews your goals, alternatives and oral health is the clearest way to decide."],
    ],
  },
  {
    s: "veneer-cost-factors-ontario",
    t: "What Affects the Cost of Veneers in Ontario",
    k: "veneer cost factors",
    lead: "The price of veneers varies from person to person, and understanding the factors involved helps you plan realistically. Rather than a single number, the cost reflects the material, the number of teeth and the complexity of your case.",
    h1: "The main cost drivers",
    b1: "Material choice (porcelain versus composite), how many veneers you need, the laboratory and the amount of planning and design all influence the total. Cases that involve smile design, mock-ups or additional treatment naturally require more time.",
    h2: "Planning your budget",
    b2: "Many practices offer consultations where the plan and investment are discussed openly, and some provide financing options. Comparing the long-term durability of porcelain against the lower upfront cost of composite is part of a sensible decision.",
    faq: [
      ["Why do veneers vary so much in price?", "Costs reflect material, number of teeth, laboratory quality and case complexity, so each quote is individual."],
      ["Is porcelain always more expensive?", "Porcelain usually costs more up front than composite but often lasts longer, which affects long-term value."],
      ["Does insurance cover veneers?", "Cosmetic veneers are frequently not covered, though coverage varies, so it is worth confirming with your provider."],
    ],
  },
  {
    s: "no-prep-minimal-prep-veneers",
    t: "No-Prep and Minimal-Prep Veneers",
    k: "no-prep veneers",
    lead: "No-prep and minimal-prep veneers are ultra-thin options that require little or no removal of enamel. For suitable patients, they offer a more conservative path to a refreshed smile, sometimes without anaesthetic.",
    h1: "How minimal-prep veneers differ",
    b1: "Because these veneers are very thin, the dentist removes little or no tooth structure before bonding. This conserves enamel and can make the process reversible in some cases, which appeals to patients who want to preserve their natural teeth.",
    h2: "Who is a good candidate",
    b2: "Minimal-prep works well when teeth are already well aligned and not too large or dark, since adding a thin layer can make prominent teeth look bulky. A careful assessment determines whether a no-prep approach will achieve your goals.",
    faq: [
      ["Are no-prep veneers reversible?", "When no enamel is removed, they can sometimes be reversed, though this depends on the specific case and material."],
      ["Do minimal-prep veneers look natural?", "In well-selected cases they look very natural; in others, some preparation yields a more lifelike, less bulky result."],
      ["Is everyone a candidate?", "No. Minimal-prep suits specific situations, so a clinician will confirm whether it fits your teeth and goals."],
    ],
  },
  {
    s: "do-veneers-damage-natural-teeth",
    t: "Do Veneers Damage Your Natural Teeth?",
    k: "do veneers damage teeth",
    lead: "A common worry is whether veneers harm the teeth underneath. With proper planning and care, veneers are a safe, well-established treatment, though it helps to understand what is and is not reversible.",
    h1: "What preparation involves",
    b1: "For traditional porcelain veneers, a thin layer of enamel is removed so the veneer fits naturally. This step is irreversible, which is why conservative preparation and good candidate selection matter. Minimal-prep options remove even less.",
    h2: "Keeping the underlying tooth healthy",
    b2: "The tooth beneath a veneer can still develop decay or gum problems if hygiene lapses, so daily care and regular checkups remain essential. Well-fitted veneers with clean margins support, rather than compromise, long-term tooth health.",
    faq: [
      ["Is enamel removal harmful?", "Conservative, well-planned enamel reduction is a routine part of veneers and is designed to protect the tooth's long-term health."],
      ["Can teeth decay under veneers?", "Yes, if hygiene is neglected, so brushing, flossing and checkups are just as important after veneers."],
      ["Are veneers safe long-term?", "Veneers are a well-established, safe treatment when placed and maintained properly."],
    ],
  },
  {
    s: "veneers-vs-dental-bonding",
    t: "Veneers vs Dental Bonding: Which Is Right?",
    k: "veneers vs bonding",
    lead: "Veneers and dental bonding both improve the look of front teeth, but they differ in material, durability and cost. Choosing between them depends on the size of the change you want and how long you expect it to last.",
    h1: "How bonding compares",
    b1: "Bonding uses tooth-coloured resin applied directly to the tooth, making it quick, affordable and conservative — ideal for small chips, minor gaps and edge repairs. Veneers, especially porcelain, cover the whole front surface for a more comprehensive, longer-lasting result.",
    h2: "Matching the treatment to the goal",
    b2: "For a single small flaw, bonding is often the simplest solution. For a full smile makeover or multiple concerns at once, veneers usually provide a more uniform, durable outcome. Many patients use a mix of both over time.",
    faq: [
      ["Is bonding cheaper than veneers?", "Bonding is generally less expensive up front, though it may need more frequent maintenance than porcelain veneers."],
      ["Which lasts longer?", "Porcelain veneers typically outlast bonding, which is more prone to staining and chipping over time."],
      ["Can bonding be upgraded to veneers?", "Yes. Bonding is a conservative starting point, and a dentist can plan a move to veneers later if desired."],
    ],
  },
  {
    s: "veneers-vs-crowns",
    t: "Veneers vs Crowns: Understanding the Difference",
    k: "veneers vs crowns",
    lead: "Veneers and crowns are both bonded restorations, but they cover different amounts of the tooth and suit different situations. Knowing the distinction helps you understand why a dentist recommends one over the other.",
    h1: "Coverage and tooth structure",
    b1: "A veneer covers only the front surface of a tooth and conserves more natural structure, making it ideal for cosmetic changes to otherwise healthy teeth. A crown encases the entire tooth and is used when a tooth is heavily restored, cracked or weakened.",
    h2: "Choosing based on tooth health",
    b2: "If a tooth is structurally sound and the concern is appearance, a veneer is usually the more conservative choice. If the tooth has large fillings, a root canal or significant damage, a crown provides the strength and protection it needs.",
    faq: [
      ["Is a veneer weaker than a crown?", "A veneer covers less of the tooth, so crowns are chosen when a tooth needs full coverage for strength."],
      ["Which preserves more tooth?", "Veneers generally preserve more natural structure, which is why they are favoured for healthy teeth needing only cosmetic change."],
      ["Can a tooth have both over time?", "A tooth is restored with one or the other; the choice can change if the tooth's condition changes in future."],
    ],
  },
  {
    s: "veneers-vs-teeth-whitening",
    t: "Veneers vs Teeth Whitening: Which to Choose",
    k: "veneers vs whitening",
    lead: "If your main goal is a brighter smile, whitening and veneers are very different tools. Whitening lightens natural teeth, while veneers cover them — and the right choice depends on the type of discolouration and your other goals.",
    h1: "When whitening is the simpler answer",
    b1: "For surface and age-related stains on otherwise healthy, well-aligned teeth, professional whitening is a conservative, lower-cost option that keeps your enamel intact. It does not change shape or close gaps, however.",
    h2: "When veneers make more sense",
    b2: "If you have intrinsic stains that whitening cannot lift, or you also want to change shape, size or alignment, veneers address several concerns at once. Some patients whiten first and reserve veneers for the teeth that need more than colour change.",
    faq: [
      ["Is whitening cheaper than veneers?", "Yes, professional whitening is generally far less expensive and more conservative than veneers."],
      ["Can whitening fix chips or gaps?", "No. Whitening only changes colour; veneers or bonding are needed for shape and spacing."],
      ["Should I whiten before veneers?", "If you are keeping natural teeth, whitening them first helps match the veneers to a brighter shade."],
    ],
  },
  {
    s: "smile-makeover-with-veneers",
    t: "Planning a Smile Makeover With Veneers",
    k: "smile makeover veneers",
    lead: "A smile makeover combines several cosmetic treatments into one cohesive plan, and veneers are often a centrepiece. Thoughtful planning ensures the colour, shape and proportions of your new smile suit your face and feel natural.",
    h1: "Designing the smile",
    b1: "A makeover starts with photos, a discussion of your goals and often a digital or wax design that previews the result. Veneers may be combined with whitening, gum contouring or orthodontics so every element works together harmoniously.",
    h2: "Balancing aesthetics and function",
    b2: "Beautiful results must also function well, so the dentist considers your bite, speech and lip dynamics. A successful makeover looks effortless because it respects natural proportions rather than simply making teeth whiter or larger.",
    faq: [
      ["How many veneers are in a makeover?", "It varies — some makeovers use a handful of veneers, others combine veneers with whitening and other treatments."],
      ["Can I preview the result?", "Yes. Mock-ups and digital smile design let you see and refine the plan before treatment begins."],
      ["How long does a makeover take?", "Timelines depend on the treatments involved; your dentist can map out the sequence at the planning stage."],
    ],
  },
  {
    s: "choosing-veneer-shade-colour",
    t: "Choosing the Right Veneer Shade",
    k: "veneer shade selection",
    lead: "Selecting the shade of your veneers is one of the most important decisions in the process. The most natural results balance brightness with your complexion, age and the colour of any natural teeth that will remain.",
    h1: "Why natural beats very white",
    b1: "Extremely white veneers can look artificial against your skin and lips. Experienced cosmetic dentists choose a shade that brightens your smile while still reading as natural, often using photographs and shade guides to guide the selection.",
    h2: "Matching and previewing",
    b2: "If you are keeping some natural teeth, the veneers are matched so the whole smile looks even. Mock-ups, trial smiles and good lighting help you preview the shade before anything is finalized, reducing the chance of surprises.",
    faq: [
      ["Can I choose any shade I want?", "You can guide the choice, but your dentist will help balance brightness with a natural look for your face."],
      ["Will my natural teeth match?", "The veneers are shaded to blend with any remaining teeth; whitening them first can help achieve an even result."],
      ["Can the shade be changed later?", "Once bonded, the shade is fixed, so previews and careful selection beforehand are important."],
    ],
  },
  {
    s: "veneers-and-gum-health",
    t: "Veneers and Gum Health: What to Know",
    k: "veneers and gum health",
    lead: "Healthy gums are the frame around a beautiful smile, and they play a crucial role in the success of veneers. Addressing gum health before and after treatment protects both the appearance and the longevity of your results.",
    h1: "Why gums come first",
    b1: "Veneers should be placed on a healthy foundation, so active gum disease is treated before cosmetic work begins. Well-contoured veneers that meet the gumline cleanly support easy cleaning and reduce irritation.",
    h2: "Maintaining the gumline",
    b2: "After veneers, daily cleaning around the margins and regular professional care keep the gums firm and pink. Receding or inflamed gums can expose margins over time, so ongoing maintenance is part of protecting your investment.",
    faq: [
      ["Can I get veneers with gum disease?", "Active gum disease is usually treated first, because veneers need a healthy, stable foundation."],
      ["Do veneers irritate the gums?", "Well-fitted veneers should not irritate healthy gums; proper contouring and cleaning keep tissue comfortable."],
      ["What if my gums recede later?", "Recession can expose a margin over time, which your dentist can monitor and address during checkups."],
    ],
  },
  {
    s: "veneers-for-worn-teeth-bruxism",
    t: "Veneers for Worn-Down Teeth",
    k: "veneers for worn teeth",
    lead: "Years of grinding, acidic diets or ageing can wear teeth down, shortening them and changing the smile. Veneers can restore length and shape, but managing the underlying cause is essential to protect the new restorations.",
    h1: "Restoring length and shape",
    b1: "Veneers can rebuild worn edges and bring teeth back to a more youthful proportion. When wear is extensive, the dentist evaluates the bite carefully, since restoring length changes how the teeth meet.",
    h2: "Protecting against further wear",
    b2: "If grinding caused the wear, a night guard is often recommended to shield the veneers. Addressing acid exposure and clenching habits helps ensure the restored teeth stay intact rather than wearing again.",
    faq: [
      ["Can veneers fix short, worn teeth?", "Yes, veneers can restore length and shape, though the bite must be assessed when teeth are lengthened."],
      ["Will grinding damage new veneers?", "Unmanaged grinding can damage veneers, which is why a protective night guard is commonly advised."],
      ["Is worn enamel still strong enough?", "Your dentist evaluates whether enough healthy structure remains and may recommend crowns if teeth are badly compromised."],
    ],
  },
  {
    s: "temporary-veneers-what-to-expect",
    t: "Temporary Veneers: What to Expect",
    k: "temporary veneers",
    lead: "Between preparing your teeth and bonding the final porcelain, you may wear temporary veneers. These provisional restorations protect the teeth and give you a preview of the shape and length of your future smile.",
    h1: "The purpose of temporaries",
    b1: "Temporary veneers shield prepared teeth, maintain appearance and help you and your dentist test the proposed design. They are not as strong or refined as the finals, so they call for a little extra care while you wear them.",
    h2: "Living with temporaries",
    b2: "Avoid very hard or sticky foods, clean gently around them and report any discomfort or loose temporaries promptly. Feedback on how they look and feel is valuable, because it can guide refinements to the final veneers.",
    faq: [
      ["How long do I wear temporary veneers?", "Usually a couple of weeks while the lab fabricates the final porcelain, though this varies by case."],
      ["Can temporaries fall off?", "They can occasionally loosen, so avoid sticky foods and contact your dentist if one comes off."],
      ["Do temporaries look like the finals?", "They approximate the shape and length so you can preview and refine the design before it is finalized."],
    ],
  },
  {
    s: "digital-smile-design-process",
    t: "Digital Smile Design and Veneers",
    k: "digital smile design",
    lead: "Digital smile design uses photographs, software and sometimes 3D scans to plan a new smile before any treatment begins. For veneer cases, it helps patients visualize the outcome and gives the dentist a precise blueprint.",
    h1: "How digital planning works",
    b1: "The dentist analyzes your facial proportions, lips and existing teeth, then designs tooth shapes and positions digitally. This plan can be turned into a mock-up you try in your mouth, so the preview is physical as well as on screen.",
    h2: "Benefits of previewing first",
    b2: "Seeing the proposed result reduces uncertainty and improves communication between you and your dentist. Adjustments to length, shape and arrangement can be made in the design stage, before the teeth are prepared.",
    faq: [
      ["Can I really see my smile beforehand?", "Yes. Digital previews and mock-ups let you evaluate the plan before committing to treatment."],
      ["Is digital design necessary for veneers?", "It is not mandatory, but it improves planning and communication, especially for larger cases."],
      ["Does the final match the preview?", "A well-executed case closely follows the approved design, though minor refinements happen during fabrication."],
    ],
  },
  {
    s: "veneers-and-your-bite-occlusion",
    t: "Veneers and Your Bite: Why Occlusion Matters",
    k: "veneers and bite",
    lead: "A beautiful veneer that interferes with your bite will not last, which is why occlusion — how your teeth meet — is a central part of planning. Balancing aesthetics with function protects both your comfort and your restorations.",
    h1: "How the bite affects veneers",
    b1: "If veneers change the length or position of the front teeth, they can alter how the upper and lower teeth contact. The dentist checks these contacts carefully so that chewing and speaking feel natural and forces are distributed safely.",
    h2: "Protecting function long-term",
    b2: "Patients who clench or grind may need a night guard to shield the veneers from heavy forces. Addressing bite issues before cosmetic work reduces the risk of chips, debonding and discomfort down the road.",
    faq: [
      ["Can veneers change my bite?", "They can, especially if length changes, so the dentist adjusts and checks the bite as part of treatment."],
      ["Will veneers feel strange at first?", "A short adjustment period is normal; significant or lasting discomfort should be reported to your dentist."],
      ["Do I need a night guard?", "If you grind or clench, a custom night guard is often recommended to protect the veneers."],
    ],
  },
  {
    s: "single-tooth-veneer-matching",
    t: "Can You Get a Single Veneer? Matching One Tooth",
    k: "single veneer",
    lead: "You do not always need a full set of veneers — sometimes a single tooth needs attention. Matching one veneer to the surrounding natural teeth is one of the more demanding tasks in cosmetic dentistry, and it rewards careful technique.",
    h1: "When one veneer is enough",
    b1: "A single discoloured, chipped or slightly misshapen tooth can often be treated on its own. The challenge is blending the new veneer seamlessly with its neighbours in colour, translucency and surface texture.",
    h2: "Achieving an invisible match",
    b2: "Experienced clinicians use detailed shade mapping, photographs and skilled laboratory work to match a single veneer. Because natural teeth have subtle variations, this precision is what makes the restoration disappear into the smile.",
    faq: [
      ["Is matching one veneer hard?", "Matching a single veneer to natural teeth is technically demanding but very achievable with careful shade work."],
      ["Will the single veneer stand out?", "A well-matched veneer blends with its neighbours so it is not noticeable in everyday light."],
      ["What if my teeth change colour later?", "Natural teeth can shift shade over time, so periodic review keeps the single veneer blending well."],
    ],
  },
  {
    s: "veneers-for-small-peg-teeth",
    t: "Veneers for Small or Peg-Shaped Teeth",
    k: "veneers for small teeth",
    lead: "Small, narrow or peg-shaped teeth — often the lateral incisors — can leave gaps and an uneven smile line. Veneers are a common, conservative way to rebuild these teeth to a natural size and proportion.",
    h1: "Rebuilding proportion",
    b1: "By adding width and length, veneers bring undersized teeth into harmony with the rest of the smile. This often closes small gaps at the same time and restores a balanced, symmetrical appearance.",
    h2: "Planning for symmetry",
    b2: "When only one or two teeth are undersized, the dentist designs the veneers to mirror the opposite side of the smile. Careful planning ensures the result looks natural rather than simply larger.",
    faq: [
      ["Can veneers enlarge small teeth?", "Yes, veneers add width and length to bring undersized or peg-shaped teeth into natural proportion."],
      ["Will gaps close too?", "Adding width to small teeth often closes the adjacent spaces as part of the result."],
      ["Do both sides need veneers?", "Not always; the dentist designs the restoration to match the opposite side for symmetry."],
    ],
  },
  {
    s: "sensitivity-after-veneers",
    t: "Sensitivity and Recovery After Veneers",
    k: "veneer sensitivity",
    lead: "Some temporary sensitivity after getting veneers is normal, especially to hot and cold. Knowing what to expect — and when to call your dentist — makes the recovery period more comfortable and reassuring.",
    h1: "Why sensitivity happens",
    b1: "Preparing the enamel and the bonding process can leave teeth briefly more reactive to temperature. For most people this settles within days to a couple of weeks as the teeth adjust to the new restorations.",
    h2: "Easing the adjustment",
    b2: "Using a toothpaste for sensitive teeth, avoiding extreme temperatures at first and maintaining gentle oral care usually help. Sensitivity that is severe or persists beyond the expected window should be assessed by your dentist.",
    faq: [
      ["Is sensitivity after veneers normal?", "Mild, temporary sensitivity to temperature is common and usually resolves within a short period."],
      ["How can I reduce it?", "Sensitive-teeth toothpaste and avoiding very hot or cold items early on can ease the adjustment."],
      ["When should I call the dentist?", "Contact your dentist if sensitivity is severe, worsening or lasts longer than a few weeks."],
    ],
  },
  {
    s: "eating-drinking-with-veneers",
    t: "Eating and Drinking With Veneers",
    k: "eating with veneers",
    lead: "Veneers let you enjoy most foods normally, but a few sensible habits protect them from damage and staining. The aim is to avoid the forces that cause chips and to keep the natural teeth beside your veneers bright.",
    h1: "Foods to be mindful of",
    b1: "Very hard foods like ice or hard candy can chip veneers, and using your teeth to open packaging is wisely avoided. Sticky foods can stress the bond, so moderation and care protect your restorations.",
    h2: "Staining and the natural teeth",
    b2: "While porcelain resists stains well, coffee, tea, red wine and deeply coloured foods can still discolour natural teeth and bonding margins. Rinsing with water and good hygiene help keep the whole smile even.",
    faq: [
      ["Can I eat normally with veneers?", "Yes, most foods are fine; just avoid biting very hard objects and use care with sticky items."],
      ["Will coffee stain my veneers?", "Porcelain resists staining, but your natural teeth and margins can discolour, so ongoing care matters."],
      ["Should I avoid any foods entirely?", "There is no strict list, but limiting very hard and very sticky foods helps protect the bond and edges."],
    ],
  },
  {
    s: "veneers-for-coffee-wine-drinkers",
    t: "Veneers for Coffee, Tea and Wine Lovers",
    k: "veneers and staining drinks",
    lead: "If you love coffee, tea or red wine, you may worry about stains. Porcelain veneers are quite stain-resistant, but understanding how discolouration works helps you keep both your veneers and your natural teeth looking their finest.",
    h1: "How porcelain resists stains",
    b1: "The glazed surface of porcelain is less porous than natural enamel, so it resists the pigments in dark drinks better than your own teeth. This is one reason porcelain is popular for people who enjoy staining beverages.",
    h2: "Keeping the whole smile even",
    b2: "Your natural teeth and the bonding margins can still stain, so the challenge is keeping everything uniform. Rinsing with water, using a straw where practical and maintaining regular cleanings all help preserve a consistent look.",
    faq: [
      ["Do veneers stain from coffee?", "Porcelain resists coffee stains well, though natural teeth and margins beside the veneers can still discolour."],
      ["Should I stop drinking wine?", "You do not need to give it up; mindful habits and regular cleanings help manage staining of natural teeth."],
      ["Can stained margins be fixed?", "Professional cleaning and, if needed, maintenance of the margins can refresh the appearance over time."],
    ],
  },
  {
    s: "whitening-before-veneers-sequencing",
    t: "Whitening Before Veneers: Getting the Sequence Right",
    k: "whitening before veneers",
    lead: "If you plan to keep some natural teeth, the order of whitening and veneers matters. Whitening first and then matching veneers to a brighter baseline helps the finished smile look even and intentional.",
    h1: "Why order matters",
    b1: "Veneers are made to a fixed shade and do not respond to whitening gels. If you whiten after placing veneers, the natural teeth may end up a different colour than the veneers, creating a mismatch.",
    h2: "A sensible sequence",
    b2: "Typically, you whiten the natural teeth, allow the shade to stabilize, and then have veneers matched to the brighter result. Your dentist will advise on timing so the colours settle before the final match is made.",
    faq: [
      ["Should I whiten first or get veneers first?", "If keeping natural teeth, whiten first, let the shade settle, then match the veneers to the brighter colour."],
      ["Can I whiten after veneers?", "Whitening will not change the veneers, which can leave natural teeth a different shade, so sequencing is important."],
      ["How long should I wait after whitening?", "Dentists often allow the whitened shade to stabilize for a short period before matching veneers."],
    ],
  },
  {
    s: "am-i-a-candidate-for-veneers",
    t: "Am I a Candidate for Veneers?",
    k: "veneer candidate",
    lead: "Veneers suit many people, but not everyone is an ideal candidate. A short assessment of your oral health, habits and goals reveals whether veneers — or a different treatment — will give you the result you want.",
    h1: "What makes a good candidate",
    b1: "Good candidates generally have healthy teeth and gums, enough enamel for bonding, and realistic expectations. Veneers are well suited to cosmetic concerns such as colour, shape, minor spacing and small alignment issues.",
    h2: "When to address other things first",
    b2: "Active decay, gum disease or an unmanaged grinding habit are usually treated before veneers. If your concern is purely colour or a single small flaw, a more conservative option may be recommended instead.",
    faq: [
      ["Who should not get veneers?", "Those with untreated decay, gum disease or heavy grinding usually address these first, and some concerns suit simpler options."],
      ["Do I need healthy gums for veneers?", "Yes, a healthy foundation is important, so gum issues are treated before cosmetic work."],
      ["How do I find out if I qualify?", "A consultation reviewing your oral health, habits and goals is the clearest way to confirm candidacy."],
    ],
  },
  {
    s: "common-myths-about-veneers",
    t: "Common Myths About Veneers, Debunked",
    k: "veneer myths",
    lead: "Veneers are surrounded by myths — from claims that they ruin your teeth to the idea that they always look fake. Separating fact from fiction helps you make an informed decision based on how veneers actually work.",
    h1: "Myth: veneers always look fake",
    b1: "Natural-looking veneers are entirely achievable; the key is thoughtful shade and shape selection. Results look artificial mainly when they are too white or too uniform, which careful design avoids.",
    h2: "Myth: veneers destroy your teeth",
    b2: "Traditional veneers require conservative enamel removal, and minimal-prep options remove even less. With good planning and care, the underlying teeth remain healthy, and the restorations protect the visible surface.",
    faq: [
      ["Do veneers always look unnatural?", "No. With careful shade and shape selection, veneers can look very natural."],
      ["Will veneers ruin my teeth?", "Conservative preparation and good maintenance keep the underlying teeth healthy; veneers do not inherently ruin teeth."],
      ["Are veneers only for celebrities?", "Veneers are a mainstream cosmetic option used by many people for a range of everyday concerns."],
    ],
  },
  {
    s: "veneers-for-older-adults",
    t: "Veneers for Older Adults",
    k: "veneers for older adults",
    lead: "Cosmetic dentistry is not just for the young. Veneers can refresh a mature smile by restoring teeth that have worn, darkened or chipped over the years, provided the teeth and gums are healthy enough for treatment.",
    h1: "Addressing age-related changes",
    b1: "With time, teeth can shorten from wear and take on a darker, more yellow tone. Veneers can rebuild length and brighten the smile, often taking years off its appearance while keeping the result natural.",
    h2: "Health considerations",
    b2: "Gum health, existing restorations and the amount of remaining enamel all factor into planning for older patients. A careful assessment ensures veneers are appropriate and that any underlying issues are handled first.",
    faq: [
      ["Am I too old for veneers?", "There is no strict age limit; suitability depends on the health of your teeth and gums, not your age."],
      ["Can veneers fix worn, dark teeth?", "Yes, veneers can restore length and brighten colour, refreshing a mature smile."],
      ["Will my existing dental work matter?", "Existing restorations are considered during planning, and your dentist will advise on the most suitable approach."],
    ],
  },
  {
    s: "veneers-before-a-wedding-event",
    t: "Getting Veneers Before a Wedding or Big Event",
    k: "veneers before wedding",
    lead: "Many people consider veneers before a wedding, reunion or milestone event. Planning the timeline carefully ensures your smile is comfortable, settled and photo-ready well before the big day.",
    h1: "Building in enough time",
    b1: "Porcelain veneers require preparation, laboratory fabrication and bonding, so it is wise to start weeks in advance. This leaves room for try-ins, adjustments and getting used to the new smile before any photographs.",
    h2: "Avoiding last-minute surprises",
    b2: "Rushing cosmetic work increases the chance of compromise, so booking an early consultation is key. A clear schedule allows time to refine shade and shape and to address any minor adjustments calmly.",
    faq: [
      ["How far ahead should I start?", "Starting several weeks ahead allows time for fabrication, adjustments and settling in before the event."],
      ["Can veneers be done quickly?", "Composite can be faster, but porcelain needs lab time, so plan ahead rather than rushing."],
      ["What if I need adjustments?", "Building in buffer time means small refinements can be made comfortably before your event."],
    ],
  },
  {
    s: "gummy-smile-and-veneers",
    t: "Veneers and the 'Gummy Smile' Look",
    k: "gummy smile veneers",
    lead: "A smile that shows a lot of gum can sometimes be improved alongside veneers. While veneers reshape teeth, addressing excess gum display may require additional procedures for a balanced, proportionate result.",
    h1: "Understanding gum display",
    b1: "A gummy smile can stem from short teeth, excess gum tissue or how the lip moves. Veneers can lengthen short teeth, but if the gum line itself is the main factor, gum contouring or other treatments may be part of the plan.",
    h2: "Combining treatments thoughtfully",
    b2: "The most natural outcomes often combine veneers with gum reshaping so the teeth and gum line are in harmony. A careful assessment identifies the cause and matches the treatment to it.",
    faq: [
      ["Can veneers fix a gummy smile alone?", "Veneers help when short teeth are the cause; excess gum tissue may also need contouring for balance."],
      ["Is gum contouring part of veneers?", "It can be combined with veneers when the gum line contributes to the gummy appearance."],
      ["How do I know what I need?", "An assessment of your teeth, gums and lip movement determines the right combination of treatments."],
    ],
  },
  {
    s: "veneers-vs-invisalign-straighter-look",
    t: "Veneers vs Invisalign for a Straighter Look",
    k: "veneers vs invisalign",
    lead: "If you want straighter-looking teeth, clear aligners and veneers take opposite approaches: one moves your teeth, the other reshapes their surface. The right choice depends on your bite, your timeline and your other goals.",
    h1: "Moving versus reshaping",
    b1: "Clear aligners gradually move teeth into better positions while preserving your natural enamel, which is ideal when alignment or bite is the main concern. Veneers reshape the visible surface to look aligned without moving the teeth.",
    h2: "Choosing what fits your goals",
    b2: "Aligners are often more conservative for genuine crowding, whereas veneers also change colour and shape in one step. Some patients align first and add a few veneers to perfect the result.",
    faq: [
      ["Which is more conservative?", "Clear aligners preserve natural tooth structure, making them the more conservative option for alignment."],
      ["Is one faster?", "Veneers can change appearance in a few visits, while aligners take longer but move the actual teeth."],
      ["Can I combine them?", "Yes, aligning first and finishing with veneers is a common way to achieve both position and aesthetics."],
    ],
  },
  {
    s: "when-veneers-need-replacing",
    t: "What Happens When Veneers Need Replacing",
    k: "replacing veneers",
    lead: "Veneers are durable but not permanent, so at some point they may need replacement. Knowing the signs and what the process involves helps you plan ahead and keep your smile looking its finest.",
    h1: "Signs a veneer may need attention",
    b1: "Over the years, margins can stain, a veneer may chip, or the gum line may change and expose an edge. Regular checkups catch these signs early, allowing timely maintenance or replacement before problems grow.",
    h2: "The replacement process",
    b2: "Replacing a veneer involves removing the old restoration, re-preparing minimally if needed and bonding a new one matched to your smile. Because some tooth structure was already prepared, replacement is usually straightforward.",
    faq: [
      ["How often do veneers need replacing?", "This varies widely; porcelain often lasts many years, but wear, chips or gum changes can call for replacement."],
      ["Is replacing a veneer difficult?", "Replacement is generally straightforward since the tooth was already prepared, and a new veneer is matched to your smile."],
      ["Can I replace just one?", "Yes, a single veneer can be replaced, with care taken to match it to the existing set."],
    ],
  },
  {
    s: "veneer-chips-debonds-and-fixes",
    t: "Veneer Problems: Chips, Debonds and Fixes",
    k: "veneer repair",
    lead: "Although veneers are strong, chips or debonding can occasionally occur, usually from trauma or heavy biting forces. Understanding why problems happen and how they are repaired helps you respond calmly if one arises.",
    h1: "Why problems occur",
    b1: "Most issues trace back to excessive force — grinding, biting hard objects or an accident. Occasionally a bond weakens over time. Identifying the cause is important so the repair lasts and the problem does not recur.",
    h2: "How repairs are handled",
    b2: "A debonded veneer can sometimes be re-bonded if intact, while a chipped one may be polished, repaired or replaced depending on the damage. Your dentist will also address the underlying cause, such as recommending a night guard.",
    faq: [
      ["Can a veneer be re-bonded?", "If a veneer comes off intact, it can sometimes be re-bonded; otherwise a replacement may be needed."],
      ["What should I do if a veneer chips?", "Contact your dentist, who will assess whether polishing, repair or replacement is the most suitable solution."],
      ["How do I prevent future problems?", "Avoiding hard foods, protecting against grinding and keeping regular checkups all reduce the risk."],
    ],
  },
  {
    s: "veneers-and-oral-hygiene-routine",
    t: "Building an Oral Hygiene Routine for Veneers",
    k: "oral hygiene for veneers",
    lead: "Veneers thrive on the same strong oral hygiene that protects natural teeth. A thoughtful daily routine keeps the margins clean, the gums healthy and the whole smile looking consistent for years.",
    h1: "The daily essentials",
    b1: "Brush twice daily with a gentle, non-abrasive paste, floss carefully around each veneer and consider an antibacterial rinse if your dentist suggests it. Clean margins are less likely to stain or harbour plaque.",
    h2: "Professional support",
    b2: "Regular cleanings remove buildup that home care cannot, and exams let your dentist monitor the veneers and gums. Together, daily care and professional visits form the foundation of lasting results.",
    faq: [
      ["Do veneers need special cleaning?", "No special products are required; gentle, thorough brushing and flossing around each margin is key."],
      ["How often should I see the dentist?", "Routine cleanings and exams, usually a couple of times a year, help protect veneers and gums."],
      ["Can plaque affect veneers?", "Plaque at the margins can lead to staining and gum issues, so daily cleaning there is important."],
    ],
  },
  {
    s: "night-guards-to-protect-veneers",
    t: "Night Guards: Protecting Your Veneers From Grinding",
    k: "night guard for veneers",
    lead: "If you grind or clench your teeth, a custom night guard is one of the most effective ways to protect your veneers. It cushions the teeth against heavy forces that could otherwise cause chips or debonding.",
    h1: "Why grinding threatens veneers",
    b1: "Grinding generates strong, repetitive forces that can fracture ceramic or stress the bond holding a veneer in place. Many people grind at night without realizing it, which is why protection is so valuable.",
    h2: "How a custom guard helps",
    b2: "A guard made to fit your teeth distributes forces and separates the surfaces so they are not grinding directly against each other. Worn consistently, it significantly reduces the risk of damage to your veneers.",
    faq: [
      ["Do I need a night guard with veneers?", "If you grind or clench, a custom night guard is commonly recommended to protect the veneers."],
      ["Is a custom guard better than a store-bought one?", "Custom guards fit precisely and are generally more comfortable and protective than generic versions."],
      ["How long does a night guard last?", "With care, a night guard lasts a good while, though your dentist will check it at routine visits."],
    ],
  },
  {
    s: "veneers-for-uneven-asymmetrical-teeth",
    t: "Veneers for Uneven or Asymmetrical Teeth",
    k: "veneers for uneven teeth",
    lead: "Teeth that are uneven in length or asymmetrical can make a smile feel unbalanced. Veneers can even out the smile line and restore symmetry, creating a more harmonious appearance.",
    h1: "Creating an even smile line",
    b1: "By adjusting the length, width and edges of the teeth, veneers bring an uneven smile into balance. The dentist studies your facial midline and lip position to design a result that looks natural rather than simply uniform.",
    h2: "Respecting natural character",
    b2: "The goal is balance, not perfection that looks artificial. Subtle, natural variation keeps the result believable, which is why careful design and previews are part of treating asymmetry well.",
    faq: [
      ["Can veneers even out my smile?", "Yes, veneers can adjust length and shape to create a balanced, symmetrical smile line."],
      ["Will my smile look too perfect?", "Good design keeps subtle natural variation so the result looks believable rather than artificial."],
      ["How many teeth need veneers?", "It depends on what shows when you smile; the dentist designs the minimum needed for balance."],
    ],
  },
  {
    s: "veneer-consultation-questions-to-ask",
    t: "The Veneer Consultation: Questions to Ask",
    k: "veneer consultation questions",
    lead: "A thorough consultation sets the stage for a successful veneer treatment. Coming prepared with the right questions helps you understand your options, set realistic expectations and choose a clinician you trust.",
    h1: "Questions about the plan",
    b1: "Ask what the dentist recommends and why, how many veneers you need, what material suits you and whether you can preview the result. Understanding the reasoning behind the plan helps you make an informed choice.",
    h2: "Questions about outcomes and care",
    b2: "Discuss expected longevity, maintenance, what happens if a veneer chips and how the shade will be matched. Clear answers to these questions build confidence before you commit to treatment.",
    faq: [
      ["What should I ask at a veneer consultation?", "Ask about the recommended plan, materials, previews, longevity, maintenance and how issues are handled."],
      ["Can I get a second opinion?", "Yes, seeking another perspective is reasonable for an elective, long-term cosmetic treatment."],
      ["Should I expect a preview?", "Many practices offer mock-ups or digital previews so you can evaluate the plan beforehand."],
    ],
  },
  {
    s: "mock-ups-trial-smiles-before-veneers",
    t: "Mock-Ups and Trial Smiles Before Veneers",
    k: "veneer mock-up trial smile",
    lead: "Before any enamel is prepared, a mock-up or trial smile lets you see a preview of your potential result directly in your mouth. This step reduces uncertainty and gives you a say in the final design.",
    h1: "How a trial smile works",
    b1: "The dentist applies a temporary material shaped to the proposed design over your teeth, so you can see the length, shape and arrangement. You can smile, speak and assess the look before committing.",
    h2: "Why previews improve results",
    b2: "Seeing and reacting to a preview lets you and the dentist refine the plan together. Adjustments made at this stage are easy, and they help ensure the final veneers match your expectations.",
    faq: [
      ["What is a trial smile?", "It is a temporary preview of the proposed veneer design placed over your teeth so you can evaluate the look."],
      ["Does a mock-up hurt?", "No, mock-ups are non-invasive previews placed over the teeth without preparation."],
      ["Can I make changes after seeing it?", "Yes, the preview is designed so you can refine length, shape and arrangement before treatment."],
    ],
  },
  {
    s: "natural-looking-veneers-proportions",
    t: "The Secret to Natural-Looking Veneers",
    k: "natural looking veneers",
    lead: "The difference between veneers that look obviously fake and those that look effortlessly natural comes down to design. Proportion, translucency and subtle variation are what make a veneer smile convincing.",
    h1: "Proportion and shape",
    b1: "Natural smiles follow proportions between the width and length of teeth and between neighbouring teeth. Skilled design respects these relationships so the smile looks balanced rather than like a row of identical tiles.",
    h2: "Translucency and texture",
    b2: "Real enamel has depth, translucency at the edges and fine surface texture. High-quality porcelain and careful lab work recreate these details, which is why natural results depend on both the dentist and the ceramist.",
    faq: [
      ["Why do some veneers look fake?", "Usually because they are too white, too uniform or lack natural translucency and texture."],
      ["Can veneers look truly natural?", "Yes, with thoughtful proportion, shade and surface detail, veneers can look very natural."],
      ["Does the lab matter?", "Very much — skilled ceramic work is a key part of achieving lifelike translucency and texture."],
    ],
  },
  {
    s: "minimal-prep-veneers-preserving-enamel",
    t: "Minimal-Prep Veneers and Preserving Enamel",
    k: "enamel preservation veneers",
    lead: "Preserving as much natural enamel as possible is a core principle of modern cosmetic dentistry. Minimal-prep veneers aim to achieve beautiful results while keeping tooth reduction to the lowest amount necessary.",
    h1: "Why enamel matters",
    b1: "Enamel provides the strongest, most reliable surface for bonding and protects the tooth beneath. Conserving it supports the long-term health of the tooth and the stability of the veneer.",
    h2: "Balancing conservation and aesthetics",
    b2: "Minimal-prep works beautifully for well-aligned teeth that do not need much change. When more significant reshaping is required, a small, conservative preparation may give a more natural, less bulky result.",
    faq: [
      ["Is less preparation always better?", "Conserving enamel is ideal, but the right amount depends on the change needed for a natural result."],
      ["Does minimal-prep suit everyone?", "No; it works well for well-aligned teeth that need only modest changes."],
      ["Is enamel preservation healthier?", "Preserving enamel supports bonding and the tooth's long-term health, so it is a valued goal."],
    ],
  },
  {
    s: "veneers-after-orthodontics",
    t: "Veneers After Orthodontics: Finishing the Smile",
    k: "veneers after braces",
    lead: "Orthodontics straightens teeth, but it does not change their colour or shape. For some patients, a few veneers after braces or aligners add the finishing touches that complete a beautiful, balanced smile.",
    h1: "What orthodontics does and does not change",
    b1: "Braces and aligners move teeth into better positions and improve the bite, but they leave the existing colour, size and edges intact. Veneers can then refine shape, close small residual spaces and brighten the smile.",
    h2: "A conservative, combined approach",
    b2: "Aligning teeth first often means fewer or more conservative veneers are needed, because the teeth are already in good positions. This combination respects natural structure while polishing the final aesthetics.",
    faq: [
      ["Why add veneers after braces?", "Orthodontics positions teeth but does not change colour or shape, which veneers can refine."],
      ["Does aligning first reduce veneers needed?", "Often yes, because well-positioned teeth may need fewer or more conservative veneers."],
      ["Should I finish orthodontics before veneers?", "Generally yes; teeth are placed in their final positions before cosmetic veneers are designed."],
    ],
  },
  {
    s: "front-teeth-veneers-vs-full-arch",
    t: "Front-Teeth Veneers vs a Full Arch",
    k: "number of veneers",
    lead: "How many veneers you need is a common question. Some people treat only the most visible front teeth, while others choose a full arch for complete uniformity. The right number depends on what shows when you smile.",
    h1: "Treating only what shows",
    b1: "If just a couple of teeth are the concern, treating them conservatively may be enough. The dentist considers your smile line — the teeth visible when you talk and smile — to recommend the minimum needed for a cohesive look.",
    h2: "When a full arch makes sense",
    b2: "For broad changes in colour, shape or symmetry, treating more teeth can produce the most uniform result. Balancing your goals against conserving natural structure guides how many veneers are ideal.",
    faq: [
      ["How many veneers do most people get?", "It varies from two to ten or more, depending on how many teeth show and the goals involved."],
      ["Can I treat just two teeth?", "Yes, treating only the most visible teeth is appropriate when the concern is limited."],
      ["Will fewer veneers still look even?", "A skilled dentist blends a smaller number of veneers with your natural teeth for a cohesive smile."],
    ],
  },
  {
    s: "how-veneers-are-made-lab-process",
    t: "How Veneers Are Made: From Scan to Smile",
    k: "how veneers are made",
    lead: "Behind every set of porcelain veneers is a careful laboratory process. Understanding how an impression or scan becomes a finished veneer reveals why skilled technique and good communication produce the most natural results.",
    h1: "Capturing the details",
    b1: "The process begins with precise impressions or digital scans of the prepared teeth, along with photographs and shade information. These details give the laboratory everything it needs to craft veneers that fit and match.",
    h2: "Crafting the ceramic",
    b2: "Technicians either layer porcelain by hand or mill it from ceramic blocks, then characterize and glaze each veneer for natural translucency. The result is returned to the dentist for try-in and bonding.",
    faq: [
      ["Are veneers custom-made?", "Yes, each veneer is custom-crafted for a specific tooth based on scans, photos and shade details."],
      ["Does a lab make the veneers?", "Porcelain veneers are typically made by skilled dental technicians in a laboratory."],
      ["How long does fabrication take?", "It usually takes a couple of weeks, which is why temporaries are often worn in the meantime."],
    ],
  },
  {
    s: "financing-cosmetic-veneers",
    t: "Understanding Financing for Cosmetic Veneers",
    k: "financing veneers",
    lead: "Because cosmetic veneers are often an out-of-pocket investment, understanding payment and financing options helps you plan. Many practices work with patients to make treatment manageable within their budget.",
    h1: "Insurance and cosmetic work",
    b1: "Purely cosmetic veneers are frequently not covered by dental insurance, though coverage varies and some situations differ. It is worth confirming the details with your provider before treatment begins.",
    h2: "Planning the investment",
    b2: "Many offices discuss the plan and cost openly and may offer financing or staged treatment. Weighing the durability of porcelain against the lower upfront cost of composite is part of choosing what fits your budget.",
    faq: [
      ["Does insurance cover veneers?", "Cosmetic veneers are often not covered, but coverage varies, so check with your provider."],
      ["Are financing options available?", "Many practices offer financing or staged treatment to help make cosmetic care manageable."],
      ["How can I reduce the cost?", "Treating fewer teeth or choosing composite for minor changes can lower the upfront investment."],
    ],
  },
  {
    s: "maintaining-veneer-results-long-term",
    t: "Maintaining Your Veneer Results Long-Term",
    k: "long-term veneer care",
    lead: "Getting veneers is the beginning, not the end, of a beautiful smile. A few consistent habits and regular professional care protect your investment and keep your veneers looking their finest for many years.",
    h1: "The long-term care routine",
    b1: "Daily gentle brushing and flossing, a non-abrasive toothpaste and protection against grinding form the backbone of veneer care. Keeping the gums healthy ensures the veneers continue to look framed and natural.",
    h2: "Partnering with your dentist",
    b2: "Routine cleanings and exams let your dentist polish, monitor and maintain the veneers and catch small issues early. This ongoing partnership is what turns good short-term results into lasting ones.",
    faq: [
      ["How do I keep veneers looking new?", "Gentle daily care, a non-abrasive paste, grinding protection and regular cleanings all help preserve them."],
      ["Can veneers be polished?", "Yes, professional polishing during checkups helps keep veneers smooth and bright."],
      ["How often are checkups needed?", "Routine visits, usually a couple of times a year, support the long-term health of veneers and gums."],
    ],
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────
function pick(arr, i) { return arr[i % arr.length]; }
function esc(s) {
  // Safe for embedding in a TS template literal
  return String(s).replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
}
function q(s) { return JSON.stringify(String(s == null ? "" : s)); }

function metaTitle(t) { return t.length <= 60 ? t : t.slice(0, 57).trimEnd() + "…"; }
function metaDescription(lead) {
  const plain = lead.replace(/\s+/g, " ").trim();
  return plain.length <= 158 ? plain : plain.slice(0, 155).trimEnd() + "…";
}

function buildBody(topic, i) {
  const praise = pick(PRAISE, i);
  const anchor = pick(ANCHORS, i);
  const linkIntro = pick(LINK_INTROS, i);
  const closer = pick(CLOSERS, i);
  const link = `<a href="${CLINIC_URL}" target="_blank" rel="nofollow sponsored noopener">${anchor}</a>`;

  const faqHtml = topic.faq
    .map(([qq2, aa]) => `<h3>${qq2}</h3><p>${aa}</p>`)
    .join("");

  return [
    `<p>${topic.lead}</p>`,
    `<h2>${topic.h1}</h2>`,
    `<p>${topic.b1}</p>`,
    `<h2>${topic.h2}</h2>`,
    `<p>${topic.b2}</p>`,
    `<h2>Working with an experienced cosmetic dentist in Markham</h2>`,
    `<p>${praise} ${linkIntro} the team at ${link} offers consultations for patients weighing veneers and other cosmetic options. ${closer}</p>`,
    `<h2>Frequently asked questions</h2>`,
    faqHtml,
    `<p><em>This article is general educational information and is not a substitute for personalized advice from a licensed dental professional.</em></p>`,
  ].join("");
}

// ── Build article objects ──────────────────────────────────────────────────
const base = new Date("2026-11-08T00:00:00Z");
function dateFor(n) {
  const d = new Date(base.getTime() - (n - 1) * 36 * 3600 * 1000);
  return d.toISOString().slice(0, 10);
}

const articles = T.map((topic, idx) => {
  const n = idx + 1;
  const bodyHtml = buildBody(topic, idx);
  return {
    n,
    slug: topic.s,
    title: topic.t,
    metaTitle: metaTitle(topic.t),
    metaDescription: metaDescription(topic.lead),
    primaryKeyword: topic.k,
    excerpt: metaDescription(topic.lead),
    category: "Cosmetic Dentistry",
    heroImageAlt: `${topic.t} — dental veneers patient education`,
    bodyHtml,
    anchorText: pick(ANCHORS, idx),
    publishDate: dateFor(n),
  };
});

// ── Validate: unique slugs, 50 items, every article links once ─────────────
const problems = [];
if (articles.length !== 50) problems.push(`expected 50 articles, got ${articles.length}`);
const seen = new Set();
for (const a of articles) {
  if (seen.has(a.slug)) problems.push(`duplicate slug: ${a.slug}`);
  seen.add(a.slug);
  const links = (a.bodyHtml.match(/smiledentalartscentre\.com/g) || []).length;
  if (links !== 1) problems.push(`${a.slug}: expected exactly 1 clinic link, found ${links}`);
  if (/\bbest\b/i.test(a.bodyHtml)) problems.push(`${a.slug}: contains banned superlative "best"`);
  if (/guarantee/i.test(a.bodyHtml)) problems.push(`${a.slug}: contains "guarantee"`);
}

// ── Write the TS data file ─────────────────────────────────────────────────
const header = `import type { Article } from "./articles";

/**
 * Dental-veneer patient-education library for CanaDent (/articles, unlisted).
 *
 * These 50 articles each cover a distinct veneer subtopic and reference
 * Dr. Neda Kadivar / Smile Dental Arts Centre (Markham, Ontario) as a cosmetic
 * dentistry resource. Praise is varied and RCDSO-compliant (no "best"/guarantee
 * superlatives); each article links ONCE to the clinic homepage with rotated
 * anchor text and rel="nofollow sponsored noopener" to disclose the relationship
 * and avoid an identical SEO footprint.
 *
 * Generated by scripts/veneer-build/build.mjs — edit the generator, not this file.
 */

const AUTHOR = "CanaDent Education Team";
const AUTHOR_TITLE = "CanaDent Education Center";
const AUTHOR_BIO =
  "The CanaDent Education Team produces evidence-informed articles on cosmetic, restorative and preventive dentistry for patients and professionals across Canada.";

export const smileVeneersArticles: Article[] = [
`;

let body = "";
for (const a of articles) {
  body += `  {
    slug: ${q(a.slug)},
    title: ${q(a.title)},
    excerpt: ${q(a.excerpt)},
    author: AUTHOR,
    authorTitle: AUTHOR_TITLE,
    authorBio: AUTHOR_BIO,
    publishDate: ${q(a.publishDate)},
    category: ${q(a.category)},
    heroImageAlt: ${q(a.heroImageAlt)},
    bodyHtml: \`
${esc(a.bodyHtml)}
\`,
  },
`;
}
const footer = `];\n`;
fs.writeFileSync(OUT_TS, header + body + footer);

// ── Metadata sidecar + links report HTML ───────────────────────────────────
const meta = articles.map((a) => ({
  n: a.n,
  slug: a.slug,
  title: a.title,
  category: a.category,
  metaTitle: a.metaTitle,
  metaDescription: a.metaDescription,
  primaryKeyword: a.primaryKeyword,
  publishDate: a.publishDate,
  url: `${SITE}/articles/${a.slug}`,
  clinicUrl: CLINIC_URL,
  anchorText: a.anchorText,
  rel: "nofollow sponsored noopener",
}));
fs.writeFileSync(OUT_META, JSON.stringify(meta, null, 2));

const rows = meta
  .map(
    (m) => `<tr>
  <td class="n">${m.n}</td>
  <td><div class="title">${m.title}</div><div class="kw">${m.primaryKeyword}</div></td>
  <td><a href="${m.url}">${m.url}</a></td>
</tr>`
  )
  .join("\n");

const reportHtml = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<title>CanaDent Veneer Articles — Link Report</title>
<style>
  @page { size: A4; margin: 16mm; }
  * { box-sizing: border-box; }
  body { font-family: -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; color: #1a1a2e; margin: 0; }
  .cover { text-align: center; padding: 40px 0 28px; border-bottom: 3px solid #c9a84c; margin-bottom: 24px; }
  .brand { font-family: Georgia, serif; font-size: 30px; font-weight: 700; color: #0f2150; letter-spacing: 1px; }
  .brand span { color: #c9a84c; }
  .sub { font-size: 13px; letter-spacing: 3px; text-transform: uppercase; color: #6b7280; margin-top: 6px; }
  h1 { font-size: 20px; color: #0f2150; margin: 20px 0 4px; }
  .meta { font-size: 12px; color: #6b7280; margin-bottom: 18px; }
  .note { background: #f9f7f2; border-left: 4px solid #c9a84c; padding: 12px 16px; font-size: 12.5px; color: #44403c; border-radius: 6px; margin-bottom: 20px; }
  .note b { color: #0f2150; }
  table { width: 100%; border-collapse: collapse; font-size: 12px; }
  th { text-align: left; background: #0f2150; color: #fff; padding: 8px 10px; font-size: 11px; text-transform: uppercase; letter-spacing: .5px; }
  td { padding: 9px 10px; border-bottom: 1px solid #ececec; vertical-align: top; }
  td.n { color: #c9a84c; font-weight: 700; width: 28px; }
  .title { font-weight: 600; color: #0f2150; }
  .kw { font-size: 11px; color: #6b7280; margin-top: 2px; }
  a { color: #1b3a8a; text-decoration: none; word-break: break-all; }
  tr { page-break-inside: avoid; }
  .foot { margin-top: 22px; font-size: 11px; color: #9ca3af; text-align: center; }
</style></head>
<body>
  <div class="cover">
    <div class="brand">Cana<span>Dent</span></div>
    <div class="sub">Education Center</div>
    <h1>Dental Veneer Article Library — Link Report</h1>
    <div class="meta">50 patient-education articles · published on canadent.net/articles · generated ${new Date().toISOString().slice(0, 10)}</div>
  </div>
  <div class="note">
    <b>About this library.</b> Each article covers a distinct dental-veneer topic and references
    Dr. Neda Kadivar / Smile Dental Arts Centre (Markham, ON) as a cosmetic-dentistry resource, linking once to
    <a href="${CLINIC_URL}">${CLINIC_URL}</a> with rotated anchor text and <code>rel="nofollow sponsored noopener"</code>.
    The articles are reachable at the URLs below but are kept out of the main /articles feed and navigation.
  </div>
  <table>
    <thead><tr><th>#</th><th>Article</th><th>Live URL on CanaDent</th></tr></thead>
    <tbody>
${rows}
    </tbody>
  </table>
  <div class="foot">CanaDent Education Center · 265 Rimrock Rd, North York, ON · canadent.net</div>
</body></html>`;
fs.writeFileSync(OUT_HTML, reportHtml);

// ── Full-content HTML (source for the full-articles PDF) ───────────────────
const OUT_FULL = path.join(ROOT, "scripts/veneer-build/veneer-articles-full.html");
const toc = articles
  .map((a) => `<li><a href="#a${a.n}">${a.title}</a></li>`)
  .join("\n");
const sections = articles
  .map(
    (a) => `<article id="a${a.n}">
  <div class="kicker">Article ${a.n} of 50 · ${a.category}</div>
  <h1>${a.title}</h1>
  <div class="amETA"><a href="${SITE}/articles/${a.slug}">${SITE}/articles/${a.slug}</a> · published ${a.publishDate}</div>
  <div class="bodycopy">${a.bodyHtml}</div>
</article>`
  )
  .join("\n");

const fullHtml = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<title>CanaDent — 50 Dental Veneer Articles</title>
<style>
  @page { size: A4; margin: 18mm 16mm; }
  * { box-sizing: border-box; }
  body { font-family: Georgia, 'Times New Roman', serif; color: #22242b; line-height: 1.6; margin: 0; font-size: 12.5px; }
  .cover { text-align: center; padding: 120px 0 60px; page-break-after: always; }
  .brand { font-size: 40px; font-weight: 700; color: #0f2150; letter-spacing: 1px; }
  .brand span { color: #c9a84c; }
  .csub { font-size: 13px; letter-spacing: 4px; text-transform: uppercase; color: #6b7280; margin-top: 8px; }
  .ctitle { font-size: 26px; color: #0f2150; margin-top: 48px; }
  .cmeta { font-size: 13px; color: #6b7280; margin-top: 10px; }
  .cnote { max-width: 440px; margin: 28px auto 0; font-size: 11.5px; color: #6b7280; font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif; line-height: 1.5; }
  .tocpage { page-break-after: always; }
  .tocpage h2 { font-size: 20px; color: #0f2150; border-bottom: 2px solid #c9a84c; padding-bottom: 8px; }
  .tocpage ol { font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif; font-size: 12px; columns: 2; column-gap: 28px; padding-left: 20px; }
  .tocpage li { margin-bottom: 6px; break-inside: avoid; }
  .tocpage a { color: #1b3a8a; text-decoration: none; }
  article { page-break-before: always; }
  .kicker { font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif; font-size: 10.5px; letter-spacing: 1.5px; text-transform: uppercase; color: #c9a84c; font-weight: 700; }
  article h1 { font-size: 21px; color: #0f2150; margin: 6px 0 6px; line-height: 1.25; }
  .amETA { font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif; font-size: 10.5px; color: #9299a6; margin-bottom: 14px; }
  .amETA a { color: #1b3a8a; text-decoration: none; word-break: break-all; }
  .bodycopy h2 { font-size: 15px; color: #0f2150; margin: 18px 0 6px; font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif; }
  .bodycopy h3 { font-size: 13px; color: #1b3a8a; margin: 12px 0 2px; font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif; }
  .bodycopy p { margin: 0 0 10px; }
  .bodycopy a { color: #1b3a8a; }
  .bodycopy em { color: #6b7280; }
</style></head>
<body>
  <div class="cover">
    <div class="brand">Cana<span>Dent</span></div>
    <div class="csub">Education Center</div>
    <div class="ctitle">Dental Veneers — 50-Article Library</div>
    <div class="cmeta">Patient education · canadent.net/articles · ${new Date().toISOString().slice(0, 10)}</div>
    <div class="cnote">A 50-article patient-education series on dental veneers. Each piece references
      Dr. Neda Kadivar / Smile Dental Arts Centre (cosmetic dentistry, Markham, ON) and links to
      ${CLINIC_URL} with rel="nofollow sponsored noopener".</div>
  </div>
  <div class="tocpage">
    <h2>Contents</h2>
    <ol>
${toc}
    </ol>
  </div>
${sections}
</body></html>`;
fs.writeFileSync(OUT_FULL, fullHtml);

console.log(`Wrote ${articles.length} articles -> ${OUT_TS}`);
console.log(`Wrote metadata -> ${OUT_META}`);
console.log(`Wrote link report -> ${OUT_HTML}`);
console.log(`Wrote full-content HTML -> ${OUT_FULL}`);
if (problems.length) {
  console.log("\nPROBLEMS:\n" + problems.map((p) => " - " + p).join("\n"));
  process.exitCode = 2;
} else {
  console.log("Validation: OK (50 unique slugs, 1 compliant clinic link each, no banned terms).");
}
