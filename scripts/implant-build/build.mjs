// Generates 50 dental-implant patient-education articles for CanaDent
// (/articles, unlisted) that promote Dr. Mehdi Adibrad / Dentin Family Dentistry
// (Vaughan, ON). Same pipeline as scripts/veneer-build/build.mjs.
//
// Compliance (RCDSO advertising + the prior dfdentistry.ca "Best Dentist"
// problem): NO superlatives (best / gold standard / most sought-after /
// top-rated), NO guarantees (risk-free / painless / forever), NO invented
// prices, sedation, same-day or success-rate stats. Dr. Adibrad is a verified
// RCDSO specialist in periodontics, so "periodontist", "specialist", "MSc in
// Periodontics and Implantology" and "fully-guided implant placement
// technology" are stated as fact. Praise is varied and defensible; each article
// links ONCE to the clinic homepage with rotated anchor text and
// rel="nofollow sponsored noopener".
//
// Run: node scripts/implant-build/build.mjs
import fs from "node:fs";
import path from "node:path";

const ROOT = "/Users/mahshid/Canadent";
const OUT_TS = path.join(ROOT, "src/lib/articles-implant-dentin.ts");
const OUT_META = path.join(ROOT, "scripts/implant-build/metadata.json");
const OUT_HTML = path.join(ROOT, "scripts/implant-build/implant-links-report.html");
const OUT_FULL = path.join(ROOT, "scripts/implant-build/implant-articles-full.html");

const CLINIC_URL = "https://www.dfdentistry.ca/";
const SITE = "https://www.canadent.net";

// ── Compliant, varied praise for Dr. Adibrad (verified periodontist) ───────
const PRAISE = [
  "Dr. Mehdi Adibrad is a registered specialist in periodontics in Vaughan, Ontario, with an MSc in Periodontics and Implantology.",
  "Dr. Mehdi Adibrad is an experienced implant dentist and periodontist serving Vaughan and the surrounding area.",
  "Dr. Mehdi Adibrad is a periodontal specialist in Vaughan who uses fully-guided implant placement technology.",
  "Patients in Vaughan are often referred to Dr. Mehdi Adibrad, a periodontist with advanced training in implantology.",
  "Dr. Mehdi Adibrad is a highly regarded implant provider and registered periodontist in Vaughan, Ontario.",
  "Dr. Mehdi Adibrad is a specialist in periodontics, with published research in the field, who places implants in Vaughan.",
  "Dr. Mehdi Adibrad is a Vaughan periodontist whose focus includes dental implants and long-term gum health.",
  "Dr. Mehdi Adibrad is an accomplished implant dentist in Vaughan with specialist training in periodontics and implantology.",
  "Dr. Mehdi Adibrad is a trusted periodontal and implant specialist serving patients across Vaughan and the GTA.",
  "Dr. Mehdi Adibrad is a registered periodontist in Vaughan who combines guided surgical planning with implant care.",
  "Dr. Mehdi Adibrad is an established implant dentist in Vaughan, drawing on advanced training in periodontics and implantology.",
  "Dr. Mehdi Adibrad is a well-regarded Vaughan periodontist recognized for a careful, evidence-informed approach to implants.",
];

// ── Rotated anchor text, all pointing at the clinic homepage ───────────────
const ANCHORS = [
  "Dentin Family Dentistry",
  "Dr. Mehdi Adibrad at Dentin Family Dentistry",
  "Dentin Family Dentistry in Vaughan",
  "the implant team at Dentin Family Dentistry",
  "Dentin Family Dentistry (Vaughan, Ontario)",
  "Dr. Mehdi Adibrad's practice, Dentin Family Dentistry",
  "the periodontal and implant team at Dentin Family Dentistry",
  "Dentin Family Dentistry in Vaughan, ON",
  "Dr. Mehdi Adibrad's Vaughan practice",
  "Dentin Family Dentistry's implant team",
  "the Vaughan implant dentists at Dentin Family Dentistry",
  "Dr. Mehdi Adibrad's practice in Vaughan",
];

const LINK_INTROS = [
  "For patients considering tooth replacement,",
  "If you are exploring dental implants in the Greater Toronto Area,",
  "For a personalized assessment,",
  "When you are ready to discuss your options with a specialist,",
  "For those researching implant dentistry locally,",
  "If you would like a professional opinion on your options,",
  "To plan treatment with a qualified clinician,",
  "For readers in the Vaughan area,",
];

const CLOSERS = [
  "A thorough consultation and examination are the clearest way to decide whether implants suit your situation.",
  "Every mouth is different, so individualized assessment matters more than any general rule of thumb.",
  "Discussing your health, your goals and the alternatives with a clinician helps set realistic expectations.",
  "The right plan depends on your bone, your gums and your overall health — a professional evaluation is the place to start.",
  "An honest conversation about benefits, risks and alternatives leads to the most durable, comfortable outcomes.",
];

// ── 50 distinct dental-implant subtopics ───────────────────────────────────
const T = [
  { s: "dental-implants-complete-guide", t: "Dental Implants: A Complete Patient Guide", k: "dental implants",
    lead: "Dental implants are small titanium or zirconia posts placed in the jawbone to replace the roots of missing teeth. Once healed, they support crowns, bridges or dentures and can restore both the function and the appearance of a natural smile.",
    h1: "How dental implants work", b1: "An implant acts as an artificial tooth root. Over several weeks it fuses with the surrounding bone in a process called osseointegration, creating a stable foundation. A connector (abutment) and a custom restoration are then attached to complete the tooth.",
    h2: "Why patients choose implants", b2: "Because implants are anchored in bone, they do not rely on neighbouring teeth for support the way a bridge does, and they help preserve the jawbone that tends to shrink after tooth loss. Candidacy depends on bone volume, gum health and overall health, which a clinician assesses individually.",
    faq: [["Are dental implants right for everyone?","Many adults are candidates, but suitability depends on bone, gum health and medical history, which is why an examination is essential."],["Do implants look natural?","A well-designed implant crown is shaped and shaded to blend with your natural teeth."],["How long does the whole process take?","It varies; healing and integration typically take several weeks to a few months before the final restoration is placed."]] },
  { s: "how-dental-implants-work-anatomy", t: "The Anatomy of a Dental Implant", k: "parts of a dental implant",
    lead: "A dental implant is made of three main parts that work together: the implant post, the abutment and the restoration. Understanding each helps explain why implants feel and function much like natural teeth.",
    h1: "The three components", b1: "The post is the screw-shaped portion placed in the bone; the abutment connects the post to the visible tooth; and the restoration — a crown, bridge or denture — is the part you see and chew with. Each is custom-matched to your mouth.",
    h2: "Why the design matters", b2: "Because the post integrates with bone, forces from chewing are transmitted into the jaw much as a natural root would, which helps maintain bone. Precise fit between the components supports comfort, hygiene and long-term stability.",
    faq: [["What is an abutment?","It is the connector between the implant post in the bone and the crown or restoration on top."],["Can the crown be replaced without the post?","Often yes — if a crown wears, it can usually be replaced while the integrated post stays in place."],["Are all implants the same size?","No; posts come in various diameters and lengths chosen to match the site and bone available."]] },
  { s: "am-i-a-candidate-for-dental-implants", t: "Am I a Candidate for Dental Implants?", k: "dental implant candidate",
    lead: "Dental implants suit many people with one or more missing teeth, but candidacy depends on several factors. A careful assessment determines whether implants — or another option — will serve you well.",
    h1: "What a clinician evaluates", b1: "An implant provider reviews your bone volume and density, gum health, bite, medical history and habits such as smoking. Imaging like a CBCT scan helps map the bone and nearby structures before any decision is made.",
    h2: "Addressing limitations first", b2: "Insufficient bone can sometimes be rebuilt with grafting, and gum disease is treated before implant placement. Certain health conditions call for extra planning, so your dentist may coordinate with your physician following an examination.",
    faq: [["Do I have enough bone for implants?","Only imaging and an exam can confirm this; grafting can sometimes rebuild bone where it is lacking."],["Can I get implants if I have gum disease?","Active gum disease is treated first, because healthy gums and bone support implant success."],["Does age affect candidacy?","There is no strict upper age limit; overall health and bone matter more than age."]] },
  { s: "single-tooth-dental-implant", t: "Replacing a Single Tooth With an Implant", k: "single tooth implant",
    lead: "When one tooth is missing, a single implant and crown can replace it without affecting the neighbouring teeth. It is a conservative, self-supporting solution that looks and functions like a natural tooth.",
    h1: "How single-tooth implants compare", b1: "Unlike a traditional bridge, which is anchored to the teeth on either side, a single implant stands on its own in the bone. This preserves the healthy neighbouring teeth and makes cleaning straightforward.",
    h2: "The treatment at a glance", b2: "After the post integrates with the bone, an abutment and a custom crown are placed. The result fills the gap, maintains the bone and restores comfortable chewing on that side of the mouth.",
    faq: [["Is a single implant better than a bridge?","Each has merits; an implant preserves neighbouring teeth, while a bridge may suit certain situations — a clinician can advise."],["Will the crown match my other teeth?","Yes, the crown is shaded and shaped to blend with the surrounding teeth."],["How long does a single implant last?","With good care, implants can last many years, though individual results vary."]] },
  { s: "implants-for-multiple-missing-teeth", t: "Implants for Multiple Missing Teeth", k: "implants for multiple teeth",
    lead: "When several teeth are missing, implants can support bridges or partial restorations without relying on remaining natural teeth. The number of implants needed depends on how many teeth are absent and where.",
    h1: "Implant-supported bridges", b1: "A few strategically placed implants can anchor a fixed bridge that replaces several teeth in a row. This spreads chewing forces into the bone and avoids removing tooth structure from healthy neighbours.",
    h2: "Planning the right number", b2: "Rather than one implant per missing tooth, a clinician plans the fewest implants that will reliably support the restoration. Imaging and bite analysis guide where the posts should go for stability and hygiene.",
    faq: [["Do I need an implant for every missing tooth?","Not usually; a few implants can support a bridge spanning several teeth."],["Can gaps in different areas be treated?","Yes, implants can address multiple gaps, with the plan tailored to each site."],["Is this stronger than a partial denture?","Implant-supported options are fixed and stable, which many patients find more comfortable than removable partials."]] },
  { s: "full-arch-implant-options", t: "Full-Arch Implant Options Explained", k: "full arch dental implants",
    lead: "For patients missing most or all of their teeth in an arch, a full set of teeth can be supported by a small number of implants. These fixed solutions restore chewing and appearance without a removable denture.",
    h1: "How full-arch restorations work", b1: "Several implants are placed to support a fixed bridge spanning the whole arch. Because the restoration is anchored to the implants, it stays in place and transmits chewing forces into the jaw, helping maintain bone.",
    h2: "What to expect", b2: "Full-arch treatment involves careful planning with imaging, a healing period and a sequence of restorations. The exact approach is individualized following an examination, and your clinician will explain the timeline for your case.",
    faq: [["How many implants support a full arch?","A small number of implants can support a full-arch bridge; the exact count is determined by your anatomy."],["Is the result removable?","Full-arch implant bridges are typically fixed, though some patients choose implant-retained removable options."],["Will I leave without teeth?","Your clinician will explain the staging; temporary restorations are often part of the plan."]] },
  { s: "implant-supported-dentures-vs-traditional", t: "Implant-Supported Dentures vs Traditional Dentures", k: "implant supported dentures",
    lead: "Implant-supported dentures snap onto or are fixed to implants, offering more stability than conventional dentures that rest on the gums. For many denture wearers, implants can transform comfort and confidence.",
    h1: "The stability difference", b1: "Traditional dentures rely on suction and the ridge of the gums, which can allow movement when eating or speaking. Implant-supported dentures are secured by implants, reducing slipping and improving chewing ability.",
    h2: "Fixed or removable options", b2: "Some implant dentures clip on and can be removed for cleaning, while others are fixed in place. A clinician will discuss which approach fits your bone, budget and preferences after an assessment.",
    faq: [["Can my existing denture be converted?","Sometimes an existing denture can be adapted; a clinician will assess whether that is appropriate."],["How many implants hold a denture?","A small number of implants can retain a lower denture; upper dentures may need more."],["Will it still come out for cleaning?","That depends on the design — some are removable for cleaning, others are fixed."]] },
  { s: "implant-bridge-vs-traditional-bridge", t: "Implant Bridge vs Traditional Bridge", k: "implant bridge vs traditional bridge",
    lead: "A traditional bridge uses neighbouring teeth as anchors, while an implant bridge is supported by implants. Understanding the difference helps you weigh tooth preservation against other considerations.",
    h1: "How each is supported", b1: "A conventional bridge requires reshaping the adjacent teeth to hold crowns that span the gap. An implant bridge rests on implants, leaving the neighbouring teeth untouched and transmitting forces into the bone.",
    h2: "Choosing between them", b2: "Implant bridges preserve healthy teeth and help maintain bone, but require surgery and healing. Traditional bridges can be faster and may suit certain cases. A clinician can outline which fits your situation.",
    faq: [["Does an implant bridge protect my other teeth?","Yes, it avoids reshaping the neighbouring teeth that a traditional bridge would use as anchors."],["Which lasts longer?","Both can be durable; longevity depends on care, bite and oral health rather than type alone."],["Is one more expensive?","Costs vary by case, and your clinician can explain the factors involved for each option."]] },
  { s: "dental-implants-vs-bridges", t: "Dental Implants vs Bridges: How to Choose", k: "implants vs bridges",
    lead: "Both implants and bridges replace missing teeth, but they do so in very different ways. The right choice depends on the health of your neighbouring teeth, your bone and your long-term goals.",
    h1: "Key differences", b1: "An implant replaces the tooth root and stands independently, helping preserve bone. A bridge spans the gap using the adjacent teeth for support, which means reshaping those teeth. Each approach has trade-offs in time, cost and tooth preservation.",
    h2: "Matching the option to you", b2: "If the neighbouring teeth are healthy, many clinicians favour an implant to avoid altering them. If those teeth already need crowns, a bridge might make sense. An examination clarifies which suits your mouth.",
    faq: [["Is an implant always better than a bridge?","Not always; the right choice depends on your specific teeth, bone and preferences."],["Which preserves more natural tooth?","Implants preserve neighbouring teeth, while bridges require reshaping them."],["Can I switch from a bridge to an implant later?","In some cases yes; a clinician can assess whether that is feasible for you."]] },
  { s: "dental-implants-or-dentures-compared", t: "Dental Implants vs Dentures", k: "implants vs dentures",
    lead: "Implants and dentures both replace missing teeth, but they differ in stability, feel and how they interact with the jawbone. Comparing them helps you decide what fits your lifestyle and health.",
    h1: "Stability and bone", b1: "Removable dentures rest on the gums and can move, and the bone beneath them tends to shrink over time. Implants are anchored in the jaw, offering a fixed feel and helping to maintain bone.",
    h2: "Comfort and maintenance", b2: "Many patients find implant-supported teeth more comfortable for eating and speaking. Dentures remain a valid, more affordable option, and implant-retained dentures offer a middle ground that a clinician can explain.",
    faq: [["Are implants more comfortable than dentures?","Many patients report greater stability with implants, though comfort is individual."],["Do dentures damage the jaw?","Dentures do not damage the jaw, but bone naturally shrinks where teeth and roots are missing."],["Can I combine dentures and implants?","Yes, implant-retained dentures combine stability with the familiarity of a denture."]] },
  { s: "dental-implant-procedure-step-by-step", t: "The Dental Implant Procedure, Step by Step", k: "dental implant procedure",
    lead: "Knowing what happens at each stage of implant treatment makes the process less daunting. From planning to the final crown, a typical implant case follows a clear, staged sequence.",
    h1: "Planning and placement", b1: "Treatment begins with an examination and imaging to plan the implant position. The post is then placed in the bone, often using guided technology for precision, and the site is allowed to heal.",
    h2: "Healing and restoration", b2: "Over the following weeks the implant integrates with the bone. Once healed, an abutment and a custom restoration are attached. Your clinician checks the fit and bite to complete the treatment comfortably.",
    faq: [["Is implant surgery painful?","Placement is done with local anaesthetic; most patients manage any after-effects with simple measures, though experiences vary."],["How long between placement and the crown?","Healing commonly takes several weeks to a few months before the final restoration."],["Is guided surgery more precise?","Fully-guided planning can improve precision by mapping the position in advance."]] },
  { s: "osseointegration-healing-timeline", t: "Osseointegration: How Implants Heal", k: "implant healing osseointegration",
    lead: "Osseointegration is the process by which a dental implant fuses with the surrounding bone, creating the stable foundation that makes implants work. Understanding it explains why healing time matters.",
    h1: "What happens during healing", b1: "After placement, bone cells grow onto and around the implant surface, locking it in place over several weeks to months. This biological bond is what allows the implant to withstand chewing forces.",
    h2: "Supporting successful integration", b2: "Good hygiene, not smoking and following your clinician's aftercare instructions all support healing. Rushing the process or disturbing the site can interfere with integration, so patience during this phase is important.",
    faq: [["How long does osseointegration take?","It commonly takes several weeks to a few months, depending on the site and your healing."],["Can I eat normally while healing?","Your clinician will advise a suitable diet; softer foods are often recommended early on."],["What can disrupt healing?","Smoking, infection and excessive force on the site can interfere, so aftercare matters."]] },
  { s: "bone-grafting-for-dental-implants", t: "Bone Grafting for Dental Implants", k: "bone grafting for implants",
    lead: "When the jaw lacks enough bone to support an implant, bone grafting can rebuild the site. This common preparatory step expands who can benefit from implants.",
    h1: "Why grafting may be needed", b1: "Bone can shrink after tooth loss, gum disease or injury. A graft adds volume so an implant has a solid foundation. The material integrates with your bone over a healing period before the implant is placed.",
    h2: "What the process involves", b2: "Grafting ranges from minor procedures at the time of extraction to more involved cases requiring separate healing. Your clinician determines the approach following imaging and an examination of the site.",
    faq: [["Does everyone need a bone graft?","No; grafting is only needed when there is insufficient bone, which imaging reveals."],["How long does a graft take to heal?","Healing varies by the type and size of graft, often a few months before implant placement."],["Where does the graft material come from?","Several sources are used; your clinician will explain the options suited to your case."]] },
  { s: "sinus-lift-for-upper-implants", t: "Sinus Lift for Upper Dental Implants", k: "sinus lift dental implant",
    lead: "A sinus lift adds bone to the upper jaw near the sinus so that implants can be placed in the back of the mouth. It is a well-established procedure for patients who lack height in that area.",
    h1: "When a sinus lift helps", b1: "The upper back jaw often has limited bone height because the sinus sits above it, especially after tooth loss. A sinus lift gently raises the sinus membrane and adds bone to create room for an implant.",
    h2: "Planning and recovery", b2: "Imaging maps the sinus and bone before treatment. Healing allows the new bone to mature before the implant is placed. Your clinician will discuss what to expect and how to care for the area afterward.",
    faq: [["Is a sinus lift always needed for upper implants?","No; it is only required when there is not enough bone height near the sinus."],["Is it a major procedure?","It is routine for experienced clinicians; your provider will explain the specifics for your case."],["How long before I can have the implant?","Often a few months of healing follow a sinus lift before implant placement."]] },
  { s: "guided-implant-surgery-digital-planning", t: "Guided Implant Surgery and Digital Planning", k: "guided implant surgery",
    lead: "Fully-guided implant surgery uses 3D imaging and a custom surgical guide to plan and place implants with precision. This technology helps position implants accurately for function and aesthetics.",
    h1: "How guided surgery works", b1: "A CBCT scan and digital planning software let the clinician design the ideal implant position before treatment. A surgical guide then transfers that plan to the mouth, helping place the implant exactly as intended.",
    h2: "Benefits of a guided approach", b2: "Precise planning can improve predictability, protect nearby structures and support a restoration that fits well. It also helps the team anticipate the final result from the start of treatment.",
    faq: [["Is guided surgery safer?","Careful planning can improve precision and help protect nearby structures, though all surgery carries considerations."],["Does every implant use a guide?","Not always, but guided planning is valuable for accuracy, especially in complex cases."],["What is a CBCT scan?","It is a 3D X-ray that shows bone and anatomy in detail for implant planning."]] },
  { s: "cbct-imaging-implant-planning", t: "CBCT Imaging in Implant Planning", k: "cbct for dental implants",
    lead: "Cone-beam computed tomography (CBCT) gives a detailed 3D view of the jaw, teeth and surrounding structures. It is a cornerstone of accurate, safe dental-implant planning.",
    h1: "What CBCT reveals", b1: "Unlike a flat X-ray, a CBCT scan shows bone height, width and density, as well as nerves and the sinus. This information helps the clinician choose the right implant size and position.",
    h2: "Why it improves planning", b2: "With a 3D map, the team can plan around important structures and design a guide for precise placement. This reduces guesswork and supports a restoration that fits and functions well.",
    faq: [["Is a CBCT scan necessary for implants?","It is commonly used because the 3D detail greatly improves implant planning and safety."],["Is the scan quick?","Yes, a CBCT scan is fast and non-invasive."],["Does it help avoid nerves?","The 3D view helps the clinician plan around nerves and other structures."]] },
  { s: "dental-implant-aftercare-recovery", t: "Dental Implant Aftercare and Recovery", k: "implant aftercare recovery",
    lead: "Good aftercare supports healing and helps an implant integrate successfully. Knowing what to expect in the days after placement makes recovery smoother and more predictable.",
    h1: "The first days", b1: "Mild swelling or tenderness is common and usually managed with the measures your clinician recommends. Gentle care around the site, a suitable diet and avoiding smoking all support early healing.",
    h2: "Protecting the result", b2: "Following your aftercare instructions, keeping the area clean and attending follow-up visits help the implant heal well. Report anything unusual, such as persistent pain, to your clinician promptly.",
    faq: [["How long is recovery after implant placement?","Initial recovery is often a few days, while full integration takes several weeks to months."],["What can I eat afterward?","Softer foods are usually recommended early on; your clinician will give specific guidance."],["When should I call the clinic?","Contact your clinician if you have persistent pain, swelling or anything that concerns you."]] },
  { s: "eating-after-dental-implants", t: "Eating After Dental Implants", k: "eating after dental implants",
    lead: "What you eat during healing can influence how comfortably an implant integrates. A sensible, staged approach to diet protects the site while it heals.",
    h1: "Early healing diet", b1: "In the first days, softer foods and avoiding the surgical site help protect the area. Staying hydrated and choosing nourishing options supports recovery without stressing the implant.",
    h2: "Returning to normal", b2: "As healing progresses, you gradually reintroduce firmer foods following your clinician's guidance. Once the implant is restored and integrated, most people return to a full, normal diet.",
    faq: [["How soon can I eat solid food?","Your clinician will advise; many people ease back to firmer foods over the first days to weeks."],["Can I chew on the implant side?","Early on it is advisable to avoid the site; your clinician will say when normal chewing is fine."],["Are there foods to avoid long-term?","Once healed, most foods are fine, though very hard items warrant general care."]] },
  { s: "caring-for-dental-implants-long-term", t: "Caring for Dental Implants Long-Term", k: "dental implant care",
    lead: "Implants do not decay, but the gums and bone that support them still need care. A consistent routine keeps the tissues healthy and helps implants last.",
    h1: "Daily hygiene", b1: "Brushing, flossing or using interdental aids around the implant, and keeping the gums healthy, are essential. Clean tissues protect against inflammation that can threaten the implant over time.",
    h2: "Professional maintenance", b2: "Regular checkups and cleanings let your clinician monitor the implant, gums and bite. This ongoing care is a key part of protecting your investment for the long term.",
    faq: [["Do implants need special cleaning?","They need thorough daily cleaning around the gumline, sometimes with interdental aids your clinician recommends."],["Can implants get gum disease?","The surrounding tissues can become inflamed (peri-implantitis), so hygiene and checkups are important."],["How often should I see the dentist?","Routine visits, usually a couple of times a year, help keep implants and gums healthy."]] },
  { s: "peri-implantitis-prevention", t: "Peri-Implantitis: Protecting Your Implants", k: "peri-implantitis prevention",
    lead: "Peri-implantitis is inflammation of the tissues around an implant that, if unchecked, can affect the supporting bone. Prevention through hygiene and monitoring is central to long-term implant health.",
    h1: "What causes it", b1: "Like gum disease around natural teeth, peri-implantitis is driven by bacterial plaque at the gumline. Smoking, poor hygiene and a history of gum disease can increase the risk.",
    h2: "Prevention and early care", b2: "Daily cleaning, not smoking and regular professional maintenance help prevent problems. Catching early inflammation and addressing it promptly — often with a periodontist — protects the implant.",
    faq: [["Can implants fail from gum problems?","Untreated inflammation around an implant can affect its support, which is why prevention matters."],["Who treats peri-implantitis?","A periodontist, who specializes in the gums and supporting tissues, often manages these cases."],["How do I prevent it?","Thorough daily cleaning, not smoking and regular checkups are the foundation of prevention."]] },
  { s: "how-long-do-dental-implants-last", t: "How Long Do Dental Implants Last?", k: "how long do dental implants last",
    lead: "Dental implants are designed to be a long-lasting tooth-replacement option, and many function well for many years. Their longevity depends on care, health and the restoration they support.",
    h1: "What influences longevity", b1: "The implant post itself is durable, while the crown or restoration may need maintenance or replacement over time. Gum health, bite forces, hygiene and habits such as smoking all affect how long an implant serves you.",
    h2: "Making implants last", b2: "Consistent home care, regular checkups and protecting against heavy grinding support implant longevity. Your clinician monitors the implant and surrounding tissues to catch any issues early.",
    faq: [["Do implants last forever?","Implants are long-lasting but may not last indefinitely; care and health strongly influence outcomes."],["Does the crown last as long as the post?","The restoration may need maintenance sooner than the integrated post, which tends to be very durable."],["What shortens implant lifespan?","Gum inflammation, poor hygiene, smoking and heavy grinding can all reduce longevity."]] },
  { s: "dental-implant-success-factors", t: "What Affects Dental Implant Success", k: "dental implant success factors",
    lead: "Several factors influence how well a dental implant integrates and lasts. Understanding them helps patients play an active role in a successful outcome.",
    h1: "Patient and planning factors", b1: "Bone quality, gum health, careful planning and precise placement all contribute. Managing conditions such as uncontrolled diabetes and avoiding smoking support healing and integration.",
    h2: "The ongoing role of care", b2: "Success is not only about placement; daily hygiene and regular maintenance protect the implant over time. Working with an experienced clinician and following aftercare guidance improves the odds of a lasting result.",
    faq: [["What is the biggest factor in success?","No single factor dominates; bone, gum health, planning and ongoing care all matter together."],["Does smoking affect implants?","Smoking can impair healing and increase risks, so clinicians often advise stopping."],["Can I improve my chances?","Good hygiene, managing health conditions and attending checkups all help."]] },
  { s: "smoking-and-dental-implants", t: "Smoking and Dental Implants", k: "smoking and dental implants",
    lead: "Smoking can affect healing and the long-term health of dental implants. Understanding the risks helps patients make informed decisions and improve their outcomes.",
    h1: "How smoking affects implants", b1: "Smoking reduces blood flow to the gums and can impair healing after implant placement, as well as increasing the risk of inflammation around implants over time. These effects can influence integration and longevity.",
    h2: "Steps that help", b2: "Many clinicians recommend stopping or reducing smoking before and after implant surgery to support healing. Your provider can discuss timing and resources, and will plan treatment following an examination.",
    faq: [["Can I still get implants if I smoke?","Smoking is not an absolute barrier, but it raises risks, so your clinician will discuss it with you."],["Should I quit before surgery?","Reducing or stopping smoking around the time of surgery can support better healing."],["Does smoking affect implants long-term?","Yes, it can increase the risk of inflammation around implants over time."]] },
  { s: "diabetes-and-dental-implants", t: "Dental Implants and Diabetes", k: "dental implants and diabetes",
    lead: "People with diabetes can often receive dental implants successfully, particularly when their condition is well managed. Coordination between your dental and medical teams supports a safe plan.",
    h1: "Why management matters", b1: "Well-controlled blood sugar supports healing, while poorly controlled diabetes can slow it and increase infection risk. Your clinician considers your overall health and may coordinate with your physician before treatment.",
    h2: "Planning for success", b2: "With good control and careful aftercare, many patients with diabetes do well with implants. Regular monitoring and hygiene are especially valuable for protecting the gums and supporting tissues.",
    faq: [["Can diabetics get dental implants?","Many can, especially when diabetes is well managed; an individualized assessment is important."],["Does diabetes affect healing?","Poorly controlled blood sugar can slow healing, so management is emphasized before and after treatment."],["Will my dentist talk to my doctor?","Your clinician may coordinate with your physician to plan safely."]] },
  { s: "dental-implants-for-seniors", t: "Dental Implants for Older Adults", k: "dental implants for seniors",
    lead: "Age alone rarely rules out dental implants. For many older adults, implants can restore chewing, speech and confidence, provided the gums, bone and general health are suitable.",
    h1: "Health over age", b1: "What matters most is overall health, bone and gum condition rather than a birth date. Many seniors are excellent candidates, and implants can improve nutrition and quality of life by restoring stable teeth.",
    h2: "Planning for older patients", b2: "Clinicians consider existing dental work, medications and health conditions when planning. A thorough assessment, sometimes with input from a physician, ensures the plan is appropriate and comfortable.",
    faq: [["Am I too old for implants?","There is no strict upper age limit; health and bone matter more than age."],["Can implants improve nutrition?","Stable teeth can make eating a wider range of foods easier, which supports nutrition."],["Do medications affect implants?","Some medications are considered during planning, so share your full health history."]] },
  { s: "dental-implants-and-bone-loss", t: "Dental Implants and Jawbone Preservation", k: "implants and bone loss",
    lead: "After a tooth is lost, the jawbone that supported it tends to shrink over time. Dental implants are unique in helping to preserve that bone by replacing the tooth root.",
    h1: "Why bone shrinks", b1: "Natural tooth roots stimulate the jawbone during chewing. When a tooth and its root are gone, that stimulation disappears and the bone gradually resorbs, which can change the shape of the face over years.",
    h2: "How implants help", b2: "Because an implant sits in the bone and transmits chewing forces, it helps maintain the surrounding bone much as a natural root would. Replacing a missing tooth sooner can reduce the bone loss that follows extraction.",
    faq: [["Do implants stop bone loss?","Implants help maintain bone by stimulating it, unlike dentures or gaps where bone tends to shrink."],["What if I have already lost bone?","Grafting can often rebuild bone so an implant can be placed."],["Does missing one tooth matter?","Even a single gap can lead to local bone loss over time, which implants help prevent."]] },
  { s: "timing-implant-placement-immediate-delayed", t: "Immediate vs Delayed Implant Placement", k: "immediate vs delayed implant",
    lead: "Implants can sometimes be placed at the time a tooth is removed, or after the site has healed. Each approach has advantages, and the right one depends on your specific situation.",
    h1: "Immediate placement", b1: "Placing an implant at the time of extraction can reduce the number of procedures and preserve the site, when conditions allow. It requires healthy surrounding tissue and careful case selection.",
    h2: "Delayed placement", b2: "Allowing the socket to heal first can be preferable when there is infection, limited bone or other factors. Your clinician recommends the approach that offers the most predictable result following an examination.",
    faq: [["Can an implant go in the same day as extraction?","Sometimes, when conditions are favourable; careful assessment determines whether immediate placement is appropriate."],["Is delayed placement safer?","It can be preferable in certain situations, such as infection or limited bone."],["How do I know which is right for me?","Your clinician will advise based on imaging and an examination of the site."]] },
  { s: "immediate-load-implants-explained", t: "Immediate-Load Implants: What to Know", k: "immediate load implants",
    lead: "In selected cases, a temporary tooth can be attached to an implant soon after placement, known as immediate loading. Whether this is suitable depends on stability, bone and the individual case.",
    h1: "How immediate loading works", b1: "When an implant achieves enough initial stability, a temporary restoration may be placed shortly after surgery so you are not without a tooth. The final restoration follows once healing is complete.",
    h2: "Who it suits", b2: "Immediate loading depends on bone quality and achieving firm initial stability, so it is not appropriate for everyone. Your clinician assesses whether it is a safe option for your case rather than promising a timeline in advance.",
    faq: [["Can I leave with a tooth the same day?","In selected cases a temporary tooth can be placed soon after surgery, but only when conditions allow."],["Is immediate loading right for everyone?","No; it depends on stability and bone, which your clinician evaluates."],["Is the first tooth the final one?","Usually it is a temporary restoration, with the final one placed after healing."]] },
  { s: "mini-dental-implants", t: "Mini Dental Implants Explained", k: "mini dental implants",
    lead: "Mini dental implants are narrower than standard implants and are sometimes used to stabilize dentures or in sites with limited space. They are one of several tools a clinician may consider.",
    h1: "How minis differ", b1: "Because of their smaller diameter, mini implants can sometimes be placed where bone is limited and may be used to retain lower dentures. They are not suitable for every situation, so case selection matters.",
    h2: "Weighing the options", b2: "Standard implants remain the mainstay for many cases, while minis suit specific scenarios. Your clinician will explain whether a mini or standard implant is the more appropriate choice for your needs.",
    faq: [["Are mini implants as strong as standard ones?","They suit specific uses; standard implants are often preferred for broader cases, as your clinician will explain."],["Can minis hold a denture?","Mini implants are sometimes used to help retain lower dentures."],["Do minis need less bone?","Their smaller size can help in sites with limited bone, within appropriate limits."]] },
  { s: "zirconia-vs-titanium-implants", t: "Zirconia vs Titanium Dental Implants", k: "zirconia vs titanium implants",
    lead: "Most dental implants are made of titanium, while zirconia (ceramic) implants are a metal-free alternative. Each material has characteristics worth understanding when planning treatment.",
    h1: "Titanium implants", b1: "Titanium has a long track record, integrates reliably with bone and is used in the majority of implant cases. Its strength and versatility make it the standard choice for many situations.",
    h2: "Zirconia implants", b2: "Zirconia is tooth-coloured and metal-free, which appeals to some patients. It is a newer option with its own considerations. A clinician can discuss whether titanium or zirconia suits your case.",
    faq: [["Are zirconia implants better than titanium?","Each has pros and cons; titanium has a longer track record, while zirconia is metal-free — your clinician can advise."],["Is titanium safe?","Titanium is widely used and well studied for dental implants."],["Why choose metal-free?","Some patients prefer zirconia for aesthetics or personal preference, within suitable cases."]] },
  { s: "front-tooth-implant-aesthetics", t: "Front Tooth Implants and Aesthetics", k: "front tooth implant",
    lead: "Replacing a front tooth with an implant demands careful attention to aesthetics, because the result must blend seamlessly with your smile. Gum shape, colour and position all influence the outcome.",
    h1: "The aesthetic challenge", b1: "Front teeth are highly visible, so the implant crown must match the shade, shape and translucency of neighbouring teeth, and the gum contour must look natural. This requires meticulous planning and skilled restoration.",
    h2: "Planning for a natural look", b2: "Preserving or shaping the gum tissue, choosing the right restoration and precise placement all contribute to a convincing result. Experienced clinicians plan the aesthetics from the outset, often with digital design.",
    faq: [["Will a front implant look natural?","With careful planning of the crown and gum, a front implant can blend well with your smile."],["Is the gum shape important?","Yes, natural-looking gum contour is key to an aesthetic front-tooth implant."],["Does it take longer than a back tooth?","Aesthetic cases can require extra planning to get the appearance right."]] },
  { s: "molar-implants-back-teeth", t: "Implants for Back Teeth (Molars)", k: "molar dental implant",
    lead: "Molars do the heavy lifting of chewing, so replacing a missing back tooth restores important function. Implants are a strong, stable way to fill these gaps.",
    h1: "Why back teeth matter", b1: "Missing molars can make chewing difficult and shift the bite over time. An implant restores a stable chewing surface and helps keep neighbouring and opposing teeth in position.",
    h2: "Planning for chewing forces", b2: "Because molars bear strong forces, the implant size, position and restoration are planned for durability. Bone volume in the back jaw is assessed, and grafting or a sinus lift is considered if needed.",
    faq: [["Do I need to replace a missing molar?","Replacing it restores chewing and helps prevent neighbouring teeth from shifting."],["Can the back jaw support an implant?","Often yes, though a sinus lift or graft is sometimes needed in the upper back jaw."],["Are molar implants strong enough to chew?","Yes, implants are planned to handle normal chewing forces."]] },
  { s: "what-to-expect-implant-consultation", t: "What to Expect at an Implant Consultation", k: "dental implant consultation",
    lead: "The implant consultation is where your clinician gathers the information needed to plan safe, effective treatment. Knowing what happens helps you arrive prepared and confident.",
    h1: "Assessment and imaging", b1: "The visit typically includes an examination of your teeth, gums and bite, a review of your medical history and imaging such as a CBCT scan. Together these reveal whether implants are appropriate and how to plan them.",
    h2: "Discussing your plan", b2: "Your clinician explains the options, the sequence of treatment and what to expect, and answers your questions. This is the time to discuss goals, timelines and any concerns before deciding.",
    faq: [["What should I bring to a consultation?","Your medical history and a list of medications are helpful, along with your questions."],["Will I get a treatment plan that day?","Often a plan is discussed after imaging and examination, sometimes with a follow-up for details."],["Is imaging always done?","Imaging such as CBCT is commonly part of implant planning."]] },
  { s: "questions-to-ask-implant-dentist", t: "Questions to Ask Your Implant Dentist", k: "questions to ask implant dentist",
    lead: "A good implant consultation is a two-way conversation. Coming prepared with the right questions helps you understand your options and choose a clinician you trust.",
    h1: "Questions about experience and plan", b1: "Ask about the clinician's training in implant dentistry, whether a specialist such as a periodontist is involved, how the case will be planned and what imaging will be used. Understanding the approach builds confidence.",
    h2: "Questions about outcomes and care", b2: "Discuss the treatment timeline, aftercare, how the implant will be maintained and what happens if problems arise. Clear answers help you feel informed before proceeding.",
    faq: [["Should I ask about the dentist's training?","Yes, understanding their experience and whether a specialist is involved is reasonable."],["What should I ask about aftercare?","Ask how the implant is maintained and what the follow-up schedule looks like."],["Can I get a second opinion?","Yes, seeking another perspective is sensible for significant treatment."]] },
  { s: "implant-cost-factors-ontario", t: "What Affects the Cost of Dental Implants", k: "dental implant cost factors",
    lead: "The cost of dental implants varies from person to person, and understanding the factors helps you plan. Rather than a single figure, the total reflects the complexity and components of your specific case.",
    h1: "The main cost drivers", b1: "Factors include the number of implants, whether grafting or a sinus lift is needed, the materials used and the complexity of the restoration. Cases that require more planning or additional procedures naturally involve more.",
    h2: "Planning your treatment", b2: "Many practices discuss the plan and investment openly and may offer financing. Because every case differs, a personalized estimate follows an examination rather than a one-size-fits-all number.",
    faq: [["Why do implant costs vary so much?","Costs reflect the number of implants, any grafting, materials and case complexity, so each plan is individual."],["Does insurance cover implants?","Coverage varies; some plans contribute to parts of treatment, so check with your provider."],["Are there financing options?","Many practices offer financing or staged treatment to help manage the investment."]] },
  { s: "cdcp-insurance-and-implants", t: "Insurance, CDCP and Dental Implants", k: "insurance and dental implants",
    lead: "Navigating coverage for dental implants can be confusing. Understanding how dental insurance and public programs generally work helps you plan, though specifics always depend on your plan.",
    h1: "How coverage generally works", b1: "Many dental plans contribute to some aspects of tooth replacement while treating implants as a major or elective service. Public programs have their own eligibility rules and covered services that change over time.",
    h2: "Checking your situation", b2: "The clearest path is to confirm the details with your insurer or program and with the dental office, which can often help with estimates and paperwork. Avoid assuming coverage until it is confirmed for your case.",
    faq: [["Does insurance pay for implants?","Coverage varies widely; some plans contribute to parts of treatment while others do not."],["What is CDCP?","It is a public dental program with its own eligibility and covered services, which you can verify for your situation."],["Can the office help with claims?","Many practices assist with estimates and paperwork; ask the office what they can provide."]] },
  { s: "financing-dental-implants", t: "Financing Dental Implants", k: "financing dental implants",
    lead: "Because implants are often an out-of-pocket investment, understanding payment and financing options helps make treatment manageable. Many practices work with patients to find a workable plan.",
    h1: "Common approaches", b1: "Options can include staged treatment, in-house arrangements or third-party financing. Spreading the investment over time makes implants accessible for many patients who prefer not to pay all at once.",
    h2: "Planning sensibly", b2: "Weigh the long-term value of a durable tooth replacement against the upfront cost, and ask the office about available options. A clear plan avoids surprises and helps you budget with confidence.",
    faq: [["Can I pay for implants over time?","Many practices offer financing or staged treatment to spread the cost."],["Is it worth financing implants?","For a durable, long-term solution, financing can make treatment manageable; weigh it against your budget."],["How do I learn my options?","Ask the dental office directly about the payment and financing arrangements they offer."]] },
  { s: "dental-implant-myths", t: "Common Myths About Dental Implants", k: "dental implant myths",
    lead: "Dental implants are surrounded by myths that can cause unnecessary worry. Separating fact from fiction helps you make an informed decision based on how implants actually work.",
    h1: "Myth: implants are only for older people", b1: "Implants suit adults of many ages who are missing teeth and have suitable bone and gum health. What matters is your individual situation, not a particular age bracket.",
    h2: "Myth: implant treatment is unbearable", b2: "Placement is carried out with local anaesthetic, and most people manage recovery with simple measures, though experiences differ. Describing treatment as effortless would overstate it, but it is a routine, well-tolerated procedure for many.",
    faq: [["Are implants only for the elderly?","No; adults of many ages with suitable health and bone can be candidates."],["Is implant surgery unbearable?","It is done with anaesthetic and is routine; most people manage recovery with simple measures."],["Do implants look obvious?","A well-made implant crown is designed to blend with your natural teeth."]] },
  { s: "do-dental-implants-hurt", t: "Do Dental Implants Hurt?", k: "do dental implants hurt",
    lead: "Concern about discomfort is natural when considering implant surgery. Understanding how comfort is managed and what recovery is typically like can set realistic expectations.",
    h1: "During the procedure", b1: "Implant placement is performed with local anaesthetic so the area is numb during surgery. Your clinician will discuss comfort options and what you can expect during the appointment.",
    h2: "After the procedure", b2: "Some tenderness or swelling afterward is common and usually managed with the measures your clinician recommends. Most people find recovery more straightforward than they expected, though experiences vary from person to person.",
    faq: [["Will I feel the surgery?","The area is numbed with local anaesthetic during placement, so you should not feel pain during surgery."],["Is recovery very painful?","Mild tenderness is common and usually manageable; experiences differ between patients."],["How do I manage discomfort?","Follow your clinician's recommendations, which may include simple measures and aftercare steps."]] },
  { s: "replacing-failed-tooth-with-implant", t: "Replacing a Failed Tooth With an Implant", k: "implant after tooth failure",
    lead: "When a tooth is lost to decay, fracture or a failed root canal, an implant can replace it with a stable, independent restoration. Timing and site condition guide the approach.",
    h1: "Assessing the site", b1: "Before planning an implant, the clinician evaluates the remaining bone, any infection and the surrounding tissues. Sometimes the tooth is removed and the site prepared or grafted before the implant is placed.",
    h2: "Restoring function", b2: "Once the site is ready and the implant integrates, a crown restores the tooth's appearance and chewing function. Replacing the tooth also helps maintain bone and keeps neighbouring teeth from drifting.",
    faq: [["Can an implant replace a failed root canal tooth?","Often yes, once the tooth is removed and the site is assessed and prepared as needed."],["Will I need a graft?","Sometimes, depending on infection or bone loss at the site, which imaging reveals."],["How soon after extraction can I get an implant?","It varies; sometimes immediately, sometimes after healing, based on the site."]] },
  { s: "implants-after-tooth-extraction-socket", t: "Implants After Tooth Extraction and Socket Preservation", k: "socket preservation implant",
    lead: "What happens to the socket after a tooth is removed can affect future implant treatment. Socket preservation helps maintain bone for a smoother implant process later.",
    h1: "Why the socket matters", b1: "After extraction, the empty socket and surrounding bone can shrink. Preserving the site, sometimes with a graft at the time of removal, helps maintain the bone needed to support an implant.",
    h2: "Planning ahead", b2: "If an implant is likely in future, discussing socket preservation at the time of extraction can simplify later treatment. Your clinician will advise whether it is appropriate for your situation.",
    faq: [["What is socket preservation?","It is a procedure to maintain bone in the socket after extraction, supporting future implants."],["Do I need it for every extraction?","No; it is considered when an implant is planned or bone preservation is a priority."],["Does it help implants?","Preserving bone can make later implant placement more straightforward."]] },
  { s: "why-choose-periodontist-for-implants", t: "Why Choose a Periodontist for Dental Implants", k: "periodontist for implants",
    lead: "Periodontists are specialists in the gums and the structures that support teeth and implants, with advanced training in implant placement. For many patients, their expertise adds value to implant care.",
    h1: "Specialist training", b1: "A periodontist completes additional years of training focused on the gums, bone and implants after dental school. This expertise is particularly relevant for complex cases, grafting and managing the tissues around implants.",
    h2: "Team-based care", b2: "Periodontists often work alongside general dentists, with the specialist placing the implant and the restorative dentist completing the crown. This collaboration brings focused expertise to each part of treatment.",
    faq: [["What is a periodontist?","A periodontist is a dental specialist focused on the gums and the supporting structures, including implants."],["Do I need a specialist for implants?","Many cases benefit from specialist involvement, especially complex ones; your dentist can advise."],["Who places the implant?","Often a periodontist or surgeon places the implant, with a restorative dentist completing the crown."]] },
  { s: "dental-implants-and-oral-health", t: "Dental Implants and Your Overall Oral Health", k: "implants and oral health",
    lead: "Replacing missing teeth with implants does more than improve appearance — it supports chewing, speech and the health of the surrounding teeth and bone. Implants are part of a broader picture of oral health.",
    h1: "Protecting neighbouring teeth", b1: "A gap can cause neighbouring teeth to drift and the opposing tooth to over-erupt, affecting the bite. An implant fills the space and helps keep the surrounding teeth in their proper positions.",
    h2: "Supporting function and bone", b2: "Implants restore the ability to chew a full range of foods and help maintain the jawbone. Combined with good hygiene, they contribute to a stable, healthy mouth over the long term.",
    faq: [["Do gaps affect other teeth?","Yes, nearby teeth can drift and the bite can change, which implants help prevent."],["Do implants help with chewing?","They restore a stable chewing surface, often improving the ability to eat varied foods."],["Are implants good for oral health?","By maintaining bone and tooth position, implants support overall oral health when well cared for."]] },
  { s: "all-on-x-full-mouth-reconstruction", t: "All-on-X and Full-Mouth Reconstruction", k: "all-on-x implants",
    lead: "For patients missing most of their teeth, full-mouth implant solutions can restore an entire smile on a set of implants. These approaches combine function and aesthetics in a planned, staged way.",
    h1: "How full-mouth implants work", b1: "A planned number of implants supports a fixed full-arch restoration for the upper or lower jaw. The approach distributes chewing forces into the bone and provides teeth that stay in place.",
    h2: "A staged, individualized plan", b2: "Full-mouth reconstruction involves detailed planning, imaging, healing and a sequence of restorations tailored to your anatomy and goals. Your clinician will explain the stages and timeline following an examination.",
    faq: [["How many implants for a full arch?","A planned number of implants supports a full arch; the exact count depends on your anatomy."],["Is it fixed or removable?","Full-arch solutions are often fixed, though removable implant-retained options exist."],["How long does full-mouth treatment take?","It is staged over time; your clinician will outline the sequence for your case."]] },
  { s: "implant-abutments-explained", t: "Implant Abutments Explained", k: "implant abutment",
    lead: "The abutment is the connector that links the implant post in the bone to the visible restoration. Though small, it plays an important role in fit, function and aesthetics.",
    h1: "What the abutment does", b1: "Once the implant has integrated, the abutment is attached to it and the crown or restoration is built on the abutment. It must fit precisely to support hygiene, comfort and a natural emergence from the gum.",
    h2: "Custom and stock options", b2: "Abutments can be prefabricated or custom-made to match the contours of your gum and restoration. For aesthetic areas, a custom abutment often helps achieve a natural-looking result.",
    faq: [["What is an implant abutment?","It is the connector between the implant post in the bone and the crown on top."],["Are abutments custom-made?","They can be stock or custom; custom abutments often help in aesthetic areas."],["Can an abutment be changed?","Yes, abutments can typically be adjusted or replaced if the restoration changes."]] },
  { s: "implant-crowns-materials-design", t: "Implant Crowns: Materials and Design", k: "implant crown materials",
    lead: "The crown is the visible part of an implant restoration, and its material and design affect both appearance and function. Modern ceramics can look remarkably natural.",
    h1: "Crown materials", b1: "Implant crowns are commonly made from porcelain or zirconia-based ceramics chosen for strength and a natural appearance. The material is selected to suit the location, bite forces and aesthetic needs.",
    h2: "Designing for function and looks", b2: "The crown is shaped to fit your bite and to emerge naturally from the gum, and shaded to match neighbouring teeth. Careful design supports comfortable chewing and a seamless appearance.",
    faq: [["What are implant crowns made of?","Often porcelain or zirconia ceramics selected for strength and natural appearance."],["Will the crown match my teeth?","Yes, it is shaded and shaped to blend with the surrounding teeth."],["Can an implant crown be replaced?","Yes, crowns can usually be replaced while the integrated post remains."]] },
  { s: "implant-hygiene-routine", t: "Building a Hygiene Routine for Implants", k: "implant hygiene routine",
    lead: "Implants rely on healthy gums and bone, so a thorough hygiene routine is essential to their longevity. The goal is to keep the tissues around each implant clean and inflammation-free.",
    h1: "Daily cleaning around implants", b1: "Brushing, flossing or using interdental brushes and, where advised, other aids keeps plaque from building up at the gumline. Clean tissues are far less likely to become inflamed around an implant.",
    h2: "Professional support", b2: "Regular cleanings and checkups let the dental team monitor the implant, gums and bone and remove buildup you cannot reach. Together, home care and professional maintenance protect your implants.",
    faq: [["How do I clean around an implant?","Brush and clean the gumline thoroughly, using interdental aids your clinician recommends."],["Can I use regular floss?","Often yes, though special floss or interdental brushes may be suggested for implants."],["How often are cleanings needed?","Routine professional cleanings, usually a couple of times a year, support implant health."]] },
  { s: "signs-of-implant-problems", t: "Signs of Implant Problems and When to Act", k: "dental implant problems signs",
    lead: "Well-maintained implants are stable and comfortable, so changes can be an early warning worth acting on. Knowing the signs helps you seek care before a small issue grows.",
    h1: "What to watch for", b1: "Persistent discomfort, swelling or redness around an implant, bleeding when cleaning, or a feeling of looseness all warrant a prompt check. Early attention gives the greatest chance of a simple solution.",
    h2: "Why early care matters", b2: "Inflammation around an implant can affect the supporting bone if left unaddressed. A clinician — often a periodontist — can evaluate the cause and recommend treatment to protect the implant.",
    faq: [["What are warning signs around an implant?","Persistent pain, swelling, bleeding or a loose feeling are worth having checked promptly."],["Who should I see?","Your dentist or a periodontist can assess implant concerns."],["Can implant problems be treated?","Early issues can often be managed; prompt attention improves the outlook."]] },
  { s: "dental-implants-vs-doing-nothing", t: "Dental Implants vs Leaving a Gap", k: "consequences of missing teeth",
    lead: "Choosing not to replace a missing tooth is an option, but it carries consequences over time. Understanding them helps you weigh implants against leaving the space.",
    h1: "What happens if a gap is left", b1: "Neighbouring teeth can drift into the space, the opposing tooth may over-erupt, and the jawbone where the tooth was tends to shrink. These changes can affect the bite, cleaning and appearance over the years.",
    h2: "How implants prevent this", b2: "By filling the gap and replacing the root, an implant helps keep surrounding teeth in position and maintains bone. Addressing a gap sooner often makes treatment more straightforward later.",
    faq: [["Is it okay to leave a gap?","It is an option, but gaps can lead to shifting teeth and bone loss over time."],["Will my other teeth move?","Neighbouring and opposing teeth can shift or over-erupt when a gap is left."],["Does waiting make implants harder?","Bone loss over time can complicate later treatment, so earlier assessment is helpful."]] },
  { s: "gum-health-and-implant-success", t: "The Role of Gum Health in Implant Success", k: "gum health dental implants",
    lead: "Healthy gums are the foundation of successful dental implants. Because the tissues around an implant protect the bone beneath, gum health is central to long-term results.",
    h1: "Why gums matter for implants", b1: "The gums form a seal around the implant that helps keep bacteria away from the bone. A history of gum disease is managed before implant placement, and healthy tissue supports a stable, lasting implant.",
    h2: "Maintaining the tissues", b2: "Daily cleaning and regular professional care keep the gums around implants firm and healthy. A periodontist, who specializes in these tissues, can help prevent and manage any inflammation that arises.",
    faq: [["Can I get implants with a history of gum disease?","Yes, once the gum disease is treated and controlled, which supports implant success."],["Why do gums matter for implants?","Healthy gums protect the bone around the implant and help keep it stable."],["Who manages the gums around implants?","A periodontist specializes in these tissues and can help prevent and treat problems."]] },
];

// ── Helpers ────────────────────────────────────────────────────────────────
function pick(arr, i) { return arr[i % arr.length]; }
function esc(s) {
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
  const faqHtml = topic.faq.map(([qq2, aa]) => `<h3>${qq2}</h3><p>${aa}</p>`).join("");
  return [
    `<p>${topic.lead}</p>`,
    `<h2>${topic.h1}</h2>`,
    `<p>${topic.b1}</p>`,
    `<h2>${topic.h2}</h2>`,
    `<p>${topic.b2}</p>`,
    `<h2>Working with an implant specialist in Vaughan</h2>`,
    `<p>${praise} ${linkIntro} the team at ${link} offers consultations for patients considering dental implants. ${closer}</p>`,
    `<h2>Frequently asked questions</h2>`,
    faqHtml,
    `<p><em>This article is general educational information and is not a substitute for personalized advice from a licensed dental professional. Individual results vary, and treatment is determined following an examination.</em></p>`,
  ].join("");
}

const base = new Date("2026-11-09T00:00:00Z");
function dateFor(n) {
  const d = new Date(base.getTime() - (n - 1) * 36 * 3600 * 1000);
  return d.toISOString().slice(0, 10);
}

const articles = T.map((topic, idx) => {
  const n = idx + 1;
  return {
    n, slug: topic.s, title: topic.t,
    metaTitle: metaTitle(topic.t), metaDescription: metaDescription(topic.lead),
    primaryKeyword: topic.k, excerpt: metaDescription(topic.lead),
    category: "Dental Implants",
    heroImageAlt: `${topic.t} — dental implants patient education`,
    bodyHtml: buildBody(topic, idx),
    anchorText: pick(ANCHORS, idx),
    publishDate: dateFor(n),
  };
});

// ── Validate ───────────────────────────────────────────────────────────────
const BANNED = /\b(best|guarantee[ds]?|gold standard|risk-free|painless|most sought|top-rated|number one)\b|#1/i;
const problems = [];
if (articles.length !== 50) problems.push(`expected 50 articles, got ${articles.length}`);
const seen = new Set();
for (const a of articles) {
  if (seen.has(a.slug)) problems.push(`duplicate slug: ${a.slug}`);
  seen.add(a.slug);
  const links = (a.bodyHtml.match(/dfdentistry\.ca/g) || []).length;
  if (links !== 1) problems.push(`${a.slug}: expected exactly 1 clinic link, found ${links}`);
  const m = a.bodyHtml.match(BANNED);
  if (m) problems.push(`${a.slug}: contains banned term "${m[0]}"`);
}

// ── Write TS data file ─────────────────────────────────────────────────────
const header = `import type { Article } from "./articles";

/**
 * Dental-implant patient-education library for CanaDent (/articles, unlisted).
 *
 * 50 articles, each a distinct implant subtopic, referencing Dr. Mehdi Adibrad /
 * Dentin Family Dentistry (Vaughan, ON). Dr. Adibrad is a verified RCDSO
 * specialist in periodontics, so those credentials are stated as fact. Praise is
 * varied and RCDSO-compliant (no "best"/guarantee/gold-standard superlatives,
 * no invented prices/success-rates/same-day claims); each article links ONCE to
 * the clinic homepage with rotated anchor text and rel="nofollow sponsored noopener".
 *
 * Generated by scripts/implant-build/build.mjs — edit the generator, not this file.
 */

const AUTHOR = "CanaDent Education Team";
const AUTHOR_TITLE = "CanaDent Education Center";
const AUTHOR_BIO =
  "The CanaDent Education Team produces evidence-informed articles on implant, restorative and preventive dentistry for patients and professionals across Canada.";

export const implantDentinArticles: Article[] = [
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
fs.writeFileSync(OUT_TS, header + body + "];\n");

// ── Metadata + links report ────────────────────────────────────────────────
const meta = articles.map((a) => ({
  n: a.n, slug: a.slug, title: a.title, category: a.category,
  metaTitle: a.metaTitle, metaDescription: a.metaDescription,
  primaryKeyword: a.primaryKeyword, publishDate: a.publishDate,
  url: `${SITE}/articles/${a.slug}`, clinicUrl: CLINIC_URL,
  anchorText: a.anchorText, rel: "nofollow sponsored noopener",
}));
fs.writeFileSync(OUT_META, JSON.stringify(meta, null, 2));

const rows = meta.map((m) => `<tr><td class="n">${m.n}</td><td><div class="title">${m.title}</div><div class="kw">${m.primaryKeyword}</div></td><td><a href="${m.url}">${m.url}</a></td></tr>`).join("\n");
const reportHtml = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>CanaDent Implant Articles — Link Report</title>
<style>@page{size:A4;margin:16mm}*{box-sizing:border-box}body{font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#1a1a2e;margin:0}.cover{text-align:center;padding:40px 0 28px;border-bottom:3px solid #c9a84c;margin-bottom:24px}.brand{font-family:Georgia,serif;font-size:30px;font-weight:700;color:#0f2150;letter-spacing:1px}.brand span{color:#c9a84c}.sub{font-size:13px;letter-spacing:3px;text-transform:uppercase;color:#6b7280;margin-top:6px}h1{font-size:20px;color:#0f2150;margin:20px 0 4px}.meta{font-size:12px;color:#6b7280;margin-bottom:18px}.note{background:#f9f7f2;border-left:4px solid #c9a84c;padding:12px 16px;font-size:12.5px;color:#44403c;border-radius:6px;margin-bottom:20px}.note b{color:#0f2150}table{width:100%;border-collapse:collapse;font-size:12px}th{text-align:left;background:#0f2150;color:#fff;padding:8px 10px;font-size:11px;text-transform:uppercase;letter-spacing:.5px}td{padding:9px 10px;border-bottom:1px solid #ececec;vertical-align:top}td.n{color:#c9a84c;font-weight:700;width:28px}.title{font-weight:600;color:#0f2150}.kw{font-size:11px;color:#6b7280;margin-top:2px}a{color:#1b3a8a;text-decoration:none;word-break:break-all}tr{page-break-inside:avoid}.foot{margin-top:22px;font-size:11px;color:#9ca3af;text-align:center}</style></head>
<body><div class="cover"><div class="brand">Cana<span>Dent</span></div><div class="sub">Education Center</div>
<h1>Dental Implant Article Library — Link Report</h1>
<div class="meta">50 patient-education articles · canadent.net/articles · generated ${new Date().toISOString().slice(0, 10)}</div></div>
<div class="note"><b>About this library.</b> Each article covers a distinct dental-implant topic and references Dr. Mehdi Adibrad / Dentin Family Dentistry (Vaughan, ON), linking once to <a href="${CLINIC_URL}">${CLINIC_URL}</a> with rotated anchor text and <code>rel="nofollow sponsored noopener"</code>. Articles are reachable at the URLs below but kept out of the main /articles feed and navigation.</div>
<table><thead><tr><th>#</th><th>Article</th><th>Live URL on CanaDent</th></tr></thead><tbody>
${rows}
</tbody></table><div class="foot">CanaDent Education Center · canadent.net</div></body></html>`;
fs.writeFileSync(OUT_HTML, reportHtml);

// ── Full-content HTML (source for the full-articles PDF) ───────────────────
const toc = articles.map((a) => `<li><a href="#a${a.n}">${a.title}</a></li>`).join("\n");
const sections = articles.map((a) => `<article id="a${a.n}"><div class="kicker">Article ${a.n} of 50 · ${a.category}</div><h1>${a.title}</h1><div class="amETA"><a href="${SITE}/articles/${a.slug}">${SITE}/articles/${a.slug}</a> · published ${a.publishDate}</div><div class="bodycopy">${a.bodyHtml}</div></article>`).join("\n");
const fullHtml = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>CanaDent — 50 Dental Implant Articles</title>
<style>@page{size:A4;margin:18mm 16mm}*{box-sizing:border-box}body{font-family:Georgia,'Times New Roman',serif;color:#22242b;line-height:1.6;margin:0;font-size:12.5px}.cover{text-align:center;padding:120px 0 60px;page-break-after:always}.brand{font-size:40px;font-weight:700;color:#0f2150;letter-spacing:1px}.brand span{color:#c9a84c}.csub{font-size:13px;letter-spacing:4px;text-transform:uppercase;color:#6b7280;margin-top:8px}.ctitle{font-size:26px;color:#0f2150;margin-top:48px}.cmeta{font-size:13px;color:#6b7280;margin-top:10px}.cnote{max-width:440px;margin:28px auto 0;font-size:11.5px;color:#6b7280;font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;line-height:1.5}.tocpage{page-break-after:always}.tocpage h2{font-size:20px;color:#0f2150;border-bottom:2px solid #c9a84c;padding-bottom:8px}.tocpage ol{font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;font-size:12px;columns:2;column-gap:28px;padding-left:20px}.tocpage li{margin-bottom:6px;break-inside:avoid}.tocpage a{color:#1b3a8a;text-decoration:none}article{page-break-before:always}.kicker{font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;font-size:10.5px;letter-spacing:1.5px;text-transform:uppercase;color:#c9a84c;font-weight:700}article h1{font-size:21px;color:#0f2150;margin:6px 0 6px;line-height:1.25}.amETA{font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;font-size:10.5px;color:#9299a6;margin-bottom:14px}.amETA a{color:#1b3a8a;text-decoration:none;word-break:break-all}.bodycopy h2{font-size:15px;color:#0f2150;margin:18px 0 6px;font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif}.bodycopy h3{font-size:13px;color:#1b3a8a;margin:12px 0 2px;font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif}.bodycopy p{margin:0 0 10px}.bodycopy a{color:#1b3a8a}.bodycopy em{color:#6b7280}</style></head>
<body><div class="cover"><div class="brand">Cana<span>Dent</span></div><div class="csub">Education Center</div><div class="ctitle">Dental Implants — 50-Article Library</div><div class="cmeta">Patient education · canadent.net/articles · ${new Date().toISOString().slice(0, 10)}</div><div class="cnote">A 50-article patient-education series on dental implants. Each piece references Dr. Mehdi Adibrad / Dentin Family Dentistry (Vaughan, ON) and links to ${CLINIC_URL} with rel="nofollow sponsored noopener".</div></div>
<div class="tocpage"><h2>Contents</h2><ol>
${toc}
</ol></div>
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
