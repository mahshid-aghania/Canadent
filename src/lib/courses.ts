export type Course = {
  slug: string;
  title: string;
  subtitle?: string;
  instructor: string;
  price: number | null;
  originalPrice?: number;
  isFree?: boolean;
  date: string;
  time?: string;
  duration?: string;
  location: string;
  ceCredits?: string;
  status: "sold-out" | "available" | "upcoming";
  category: string;
  format?: string;
  image?: string;
  posterImage?: string;
  instructorPhoto?: string;
  description: string;
  highlights?: string[];
  schedule?: { day: string; topic: string }[];
  priceOptions?: { label: string; price: number }[];
  seatsRemaining?: number;
  earlyBirdDeadline?: string;
};

export const courses: Course[] = [
  {
    slug: "advanced-adhesive-dentistry-master-blueprint",
    title: "Advanced Adhesive Dentistry: The Master Blueprint",
    subtitle:
      "How to obtain a comprehensive understanding of predictable, minimally invasive, and long-lasting restorative workflows with zero post-operative sensitivity.",
    instructor: "Dr. Amin Asadollahi",
    price: 699,
    originalPrice: 799,
    earlyBirdDeadline: "August 10, 2026",
    date: "Sunday, September 6, 2026",
    time: "9:00 AM – 4:00 PM",
    duration: "6 hours",
    location: "265 Rimrock Rd, North York, ON",
    ceCredits: "6 CE Credits",
    status: "available",
    seatsRemaining: 14,
    category: "Restorative Dentistry",
    format: "In-Person Lecture",
    image: "/course-advanced-adhesive.png",
    instructorPhoto: "/dr-amin-asadollahi.png",
    description:
      "Transitioning to a truly biomimetic and minimally invasive practice requires moving past traditional mechanical retention and understanding the sophisticated mechanics of modern adhesion. Because advanced adhesive dentistry is an incredibly comprehensive and multi-layered discipline, it cannot be mastered in a single day. Instead, this intensive 6-hour course is designed to serve as your ultimate foundational platform and comprehensive overview. Led by an experienced clinician and educator, this session maps out the entire adhesive landscape, providing the big-picture clarity you need before diving into specific technical execution.\n\nThis course serves as the mandatory preliminary blueprint for a series of upcoming, consecutive deep-dive sessions. Over 6 hours, we will establish the structural framework of modern adhesion, covering the core principles of advanced rubber dam isolation, dental histology, and modern caries and crack management. We will break down the chemistry behind modern dentin bonding agents, and explore the clinical logic behind Immediate Dentin Sealing (IDS) and Deep Margin Elevation (DME). Finally, we will overview how to control the C-factor to manage polymerization stress, shifting from direct composite restorations to semi-direct and indirect options. By the end of this course, participants will not only understand how these components interconnect to eliminate post-operative sensitivity, but they will also possess the essential conceptual roadmap required to excel in the subsequent step-by-step, hands-on modules.",
    highlights: [
      "Understand Absolute Isolation Dynamics: Gain a clear understanding of how advanced rubber dam isolation, clamp selection, and inversion techniques protect the hybrid layer from moisture.",
      "Correlate Histology with Substrate Chemistry: Comprehend how bonding protocols must change when treating enamel versus deep, cracked, or caries-affected dentin.",
      "Differentiate Bonding Systems: Grasp the fundamental differences between various generations of dentin bonding agents to eliminate clinical guesswork.",
      "Recognize Sensitivity-Prevention Protocols: Understand the clinical rationale and biological benefits of utilizing Immediate Dentin Sealing (IDS) and Deep Margin Elevation (DME).",
      "Identify Stress Management Strategies: Learn how the C-factor impacts the adhesive interface and understand the concepts behind decoupled mechanics and layering.",
      "Navigate the Restorative Spectrum: Establish a clear conceptual framework for deciding when a clinical case calls for direct, semi-direct, or indirect adhesive restorations.",
    ],
  },
  {
    slug: "daily-unique-orthodontic-techniques",
    title: "Daily and Unique Orthodontic Techniques for Prosthodontics",
    subtitle:
      "How to obtain a comprehensive understanding of evidence-based aligner therapy, advanced biomechanics, and efficient clinical workflows for predictable treatment outcomes.",
    instructor: "Dr. John C. Voudouris, DDS, D.Ortho, MSc.(D)",
    price: 799,
    originalPrice: 999,
    date: "Sunday, September 27, 2026",
    time: "9:00 AM – 4:00 PM",
    duration: "6 hours",
    location: "265 Rimrock Rd, North York, ON",
    ceCredits: "6 CE Credits (PACE Approved)",
    status: "available",
    earlyBirdDeadline: "August 29, 2026",
    category: "Orthodontics",
    format: "In-Person Lecture",
    image: "/course-orthodontic-prosthodontics-poster.jpeg",
    description:
      "Achieving predictable, efficient, and biologically sound orthodontic treatment with clear aligners requires more than simply prescribing attachments or following default software setups. Successful aligner therapy depends on understanding biomechanics, evidence-based treatment planning, supercorrection strategies, and the appropriate integration of auxiliary appliances. Because modern aligner orthodontics is a comprehensive and rapidly evolving discipline, it cannot be mastered in a single day. Instead, this intensive 6-hour course is designed to provide participants with a comprehensive foundation and clinical blueprint for advanced aligner therapy.\n\nLed by experienced clinicians, this course presents the biological principles and biomechanical concepts that underpin predictable tooth movement with clear aligners. Participants will learn the rationale behind evidence-based attachment design, the JV Supercorrection Rx, digital treatment planning, and the incorporation of modern auxiliaries to improve treatment efficiency while minimizing refinements.\n\nThrough numerous finished clinical cases, attendees will explore practical solutions for treating deep bite, open bite, Class II and Class III malocclusions, transverse discrepancies, impacted teeth, and complex interdisciplinary orthodontic–prosthodontic cases. Special emphasis will be placed on understanding digital workflows, evidence-based biomechanics, and clinical decision-making that can be immediately incorporated into everyday practice.\n\nThe course combines comprehensive lectures with hands-on demonstrations of innovative orthodontic auxiliaries, including the U2 Seater, Molar Intruder™️, Anterior Intruder™️, and the Experience®️ low-profile self-ligating bracket system, providing participants with practical techniques to increase treatment predictability and efficiency.\n\nParticipants will also receive the opportunity to obtain the full-colour hardcover textbook Excellence and Efficiency, providing an extensive evidence-based reference for continued clinical learning.\n\nBy the end of this course, participants will possess a structured conceptual framework for planning, executing, and finishing aligner treatments with greater confidence, efficiency, and predictability.",
    highlights: [
      "Understand the biological and biomechanical principles governing predictable tooth movement with clear aligners.",
      "Apply evidence-based attachment design and the JV Supercorrection Rx to improve treatment accuracy and reduce refinements.",
      "Develop efficient digital workflows for diagnosis, treatment planning, and aligner prescription.",
      "Recognize appropriate indications for auxiliary appliances, including the U2 Seater, Molar Intruder™️, and Anterior Intruder™️, to enhance treatment outcomes.",
      "Integrate low-profile self-ligating bracket therapy with aligner treatment when clinically indicated.",
      "Diagnose and manage common orthodontic challenges including deep bite, open bite, Class II, Class III, transverse discrepancies, impacted teeth, and interdisciplinary restorative cases.",
      "Interpret current scientific evidence supporting modern aligner biomechanics and evidence-based clinical protocols.",
      "Apply practical clinical tips and treatment strategies that can be immediately incorporated into daily orthodontic and interdisciplinary practice.",
    ],
  },
  {
    slug: "endo-course-for-general-dentists",
    title: "Endo Course For General Dentists",
    subtitle: "Precision Endo: From Access to Apex",
    instructor: "Dr. Hengameh Bakhtiar (DDS, MSc, FRCD(C))",
    price: 768,
    originalPrice: 1280,
    date: "Friday, June 5, 2026",
    time: "8:30 AM – 5:30 PM",
    duration: "9 hours",
    location: "West Beaver Creek Road, Richmond Hill, Ontario",
    status: "sold-out",
    category: "Endodontics",
    format: "In-Person Hands-On",
    image: "/course-endo-general.png",   // user-supplied screenshot (kept as primary)
    posterImage: "/course-endo-poster.png",
    description:
      "A comprehensive full-day endodontics course designed specifically for general dentists. This course covers everything from proper access cavity preparation through to working length determination, canal instrumentation, and obturation. Led by a certified endodontist, participants will develop the confidence and skills to handle a wider range of endo cases in their own practice.",
    highlights: [
      "Access cavity design and coronal flaring",
      "Working length determination with electronic apex locators",
      "Rotary file systems — technique and sequencing",
      "Canal obturation methods",
      "Case selection and referral criteria",
    ],
  },
  {
    slug: "your-first-financial-steps-as-a-dentist",
    title: "Your First Financial Steps as a New Dentist",
    instructor: "Mohammad Hossein Mohammadi, Financial Advisor",
    price: 0,
    isFree: true,
    date: "Sunday, May 31",
    time: "11:00 AM – 2:00 PM",
    duration: "3 hours",
    location: "20 Cachet Woods Ct., Markham",
    ceCredits: "2 CE Credits (Type 3)",
    status: "sold-out",
    category: "Practice Management",
    format: "Seminar",
    image: "/course-financial-steps.png",
    description:

      "A practical, insight-driven session focused on real financial decisions dentists face in their first years entering practice as associates. The course covers managing debt effectively while building financial growth and protecting your income and future. Limited seating ensures an interactive and personal learning experience.",
    highlights: [
      "Debt management strategies for early-career dentists",
      "Cash flow prioritization",
      "Early-stage investing fundamentals",
      "Income protection principles",
      "Real-world financial planning scenarios",
    ],
  },
  {
    slug: "overcoming-severe-curvatures-and-ledges-in-endodontics",
    title: "Overcoming Severe Curvatures and Ledges in Endodontics",
    instructor: "Dr. Kalantar Motamedi",
    price: 390,
    date: "May 16, 2026",
    time: "1:00 PM – 4:00 PM",
    duration: "3 hours",
    location: "Online",
    ceCredits: "3 CE Credits",
    status: "sold-out",
    category: "Endodontics",
    format: "Online Lecture",
    image: "/course-overcoming-curvatures.jpeg",
    description:
      "An advanced online lecture delivering practical, step-by-step clinical insights based on real cases for managing some of the most challenging situations in endodontics — severely curved canals and ledged root canal systems. Dr. Kalantar Motamedi shares his unique and innovative method for bypassing severe ledges, along with hybrid and crown-down shaping approaches applicable in daily practice.",
    highlights: [
      "Techniques for negotiating severely curved canals",
      "Hybrid and crown-down shaping methods",
      "Dr. Motamedi's unique ledge-bypass method",
      "Daily practice shaping strategies",
      "Real case walkthroughs and immediately applicable clinical tips",
    ],
  },
  {
    slug: "post-extraction-site-management",
    title: "Post-Extraction Site Management",
    instructor: "Clinical Periodontist & Biomaterials Specialist",
    price: 400,
    originalPrice: undefined,
    date: "April 19, 2026",
    time: "10:00 AM – 4:00 PM",
    duration: "6 hours",
    location: "Hybrid — Online + In-Person (265 Rimrock Road, Units 209, North York, ON)",
    ceCredits: "3 CE Credits (online) / 6 CE Credits (in-person)",
    status: "sold-out",
    category: "Oral Surgery / Periodontics",
    format: "Hybrid",
    image: "/course-post-extraction.jpeg",
    description:
      "An evidence-based program on socket grafting and alveolar ridge preservation for implant site preparation. The course covers bone graft biomaterials, barrier membranes, suturing techniques, guided bone regeneration, ridge augmentation, and complication management. The in-person session includes hands-on practice on simulated models.",
    highlights: [
      "Bone remodeling biology and defect classification",
      "Graft material and membrane selection and handling",
      "Hands-on alveolar ridge preservation on simulated models",
      "Suturing technique demonstration",
      "Ridge augmentation protocols",
      "Complication recognition and management",
    ],
    priceOptions: [
      { label: "Online Lecture (3 CE Credits)", price: 400 },
      { label: "Full Registration — Online + Hands-On (6 CE Credits)", price: 790 },
    ],
  },
  {
    slug: "root-to-resolution",
    title: "Root to Resolution",
    subtitle: "The Endo Complications Symposium: An Essential Endodontics Master Class",
    instructor: "Dr. Hengameh Bakhtiar",
    price: 1500,
    originalPrice: 1750,
    date: "July 6, 2025",
    time: "9:00 AM – 7:00 PM",
    duration: "10 hours",
    location: "York Mills Road & Don Mills Road, North York, Ontario",
    ceCredits: "9 CE Credits",
    status: "sold-out",
    category: "Endodontics",
    format: "In-Person Hands-On",
    image: "/course-root-to-resolution.jpg",
    description:
      "A master class for general dentists focusing on advanced endodontic techniques and real-world complication management. The program integrates didactic sessions with hands-on practice on extracted teeth in a small-group format (2 students per table, 18 participants total), ensuring personalized instruction from an experienced endodontist.",
    highlights: [
      "Integrated didactic and hands-on learning format",
      "Practice on extracted teeth",
      "Small group format: 2 students per table, 18 participants maximum",
      "Advanced complication management strategies",
      "Full day with comprehensive course agenda",
    ],
  },
  {
    slug: "ai-in-modern-dentistry-vancouver",
    title: "AI in Modern Dentistry — Vancouver",
    instructor: "Multiple Speakers: Innovators, Industry Experts & Academia",
    price: 499,
    date: "September 21, 2024",
    location: "Terminal City Club, 837 West Hastings St, Vancouver, BC V6C 1B6",
    ceCredits: "6 CE Credits",
    status: "sold-out",
    category: "Technology & Innovation",
    format: "Seminar",
    image: "/course-ai-dentistry.png",
    description:
      "A forward-looking seminar exploring artificial intelligence's transformative role in modern dentistry. Presentations from innovators, industry leaders, and academics focus on dental procedures using AI — including diagnostic applications, treatment improvement, machine learning for radiology, and AI's evolving role in healthcare delivery.",
    highlights: [
      "AI-powered diagnostics and treatment planning",
      "Machine learning applications in dental radiology",
      "Industry expert and academic panel discussions",
      "AI's evolution in healthcare delivery",
      "Full lecture sessions",
    ],
  },
  {
    slug: "complications-in-implant-dentistry",
    title: "Complications in Implant Dentistry",
    subtitle: "How to Avoid, How to Manage",
    instructor: "Multiple Speakers",
    price: 349,
    date: "May 18",
    location: "S3PACE Business Event Center, 205 Placer Ct Main Level, North York, ON M2H 0A9",
    ceCredits: "5–8 CE Credits",
    status: "sold-out",
    category: "Implant Dentistry",
    format: "Lecture + Workshop",
    image: "/course-complications-implant.jpeg",
    description:
      "A focused program on dental implant complications — how to prevent them and how to manage them when they occur. Through lectures and panel discussions, attendees gain practical strategies for avoiding the most common implant failures, with an optional hands-on workshop component for full CE credit registration.",
    highlights: [
      "Evidence-based implant complication prevention",
      "Panel discussions with experienced clinicians",
      "Prosthetic and surgical complication management",
      "Optional hands-on workshop",
    ],
    priceOptions: [
      { label: "Lecture and Panel Discussion (5 CE Credits)", price: 349 },
      { label: "Full Registration incl. Workshop (8 CE Credits)", price: 799 },
    ],
  },
  {
    slug: "fundamentals-of-implant-dentistry",
    title: "Fundamentals of Implant Dentistry",
    instructor:
      "Dr. Behnam Bohluli, Dr. Mahmood Abu Roja, Dr. Maziar Shahzad Dowlatshahi, Dr. Jaffar Sadegh Pakroo, Dr. Masoud Varshosaz, Dr. Cem Sener",
    price: 9900,
    date: "6 Weekends — January & February",
    location: "Oris Dental Clinic",
    status: "sold-out",
    category: "Implant Dentistry",
    format: "Seminar Series",
    image: "/course-fundamentals-implant.jpg",
    description:
      "A comprehensive 6-weekend implant program covering the full spectrum of implant dentistry from foundational principles to advanced surgical and prosthetic techniques. Taught by a multidisciplinary team of renowned specialists, this intensive series is designed for dentists and dental staff seeking to integrate implant services into their practice.",
    highlights: [
      "Multidisciplinary faculty of six specialist instructors",
      "Six weekends of intensive training",
      "Surgical and prosthetic implant protocols",
      "Case-based learning from beginner to advanced",
      "Designed for dentists and dental staff",
    ],
  },
  {
    slug: "oral-surgery-for-general-dentists",
    title: "Oral Surgery for General Dentists",
    instructor: "Specialist Faculty",
    price: 3000,
    originalPrice: 4000,
    date: "April & May 2024",
    duration: "5 days",
    location: "265 Rimrock Road, Units 209, North York, ON M3J3A6",
    status: "sold-out",
    category: "Oral Surgery",
    format: "In-Person",
    image: "/course-oral-surgery.jpg",
    description:
      "A five-day intensive oral surgery program designed to elevate the surgical competencies of general dentists. Each day targets a distinct area of oral surgery, combining didactic instruction with clinical application.",
    schedule: [
      { day: "Day 1", topic: "Local Anesthesia and Mild Sedation" },
      { day: "Day 2", topic: "Imaging, CBCT, and Radiology" },
      { day: "Day 3", topic: "Basic Surgical Techniques" },
      { day: "Day 4", topic: "Periodontal Surgery" },
      { day: "Day 5", topic: "Wisdom Teeth Extractions Under General Anesthesia Clinical Session" },
    ],
  },
  {
    slug: "the-secret-of-dental-office-management",
    title: "The Secret of Dental Office Management",
    instructor:
      "Linda Anderson, Dr. Chris Swayze, Ozhan Asi, Kimberly Pacula, Ali Basiri, Mona Vahab",
    price: 199,
    date: "March 26, 2023",
    location: "BMO IFL Centre, 3550 Pharmacy Ave, M1W 3Z3",
    ceCredits: "7 CE Points (Category 3)",
    status: "sold-out",
    category: "Practice Management",
    format: "Seminar",
    image: "/course-office-management.jpg",
    description:
      "A multi-speaker seminar uncovering the operational, financial, and human-resource strategies behind a thriving dental practice. Industry leaders and experienced clinicians share real-world insights on team management, patient experience, marketing, and financial performance.",
    highlights: [
      "Multi-speaker format with diverse practice management experts",
      "Team communication and leadership strategies",
      "Patient experience and retention",
      "Practice financial performance",
      "Separate pricing tracks for dentists and staff",
    ],
    priceOptions: [
      { label: "Dentist Registration", price: 249 },
      { label: "Staff Registration", price: 199 },
    ],
  },
  {
    slug: "challenges-of-all-on-4-total-rehabilitation",
    title: "Challenges of All-On-4 Total Rehabilitation",
    instructor: "Professor Paulo Malo",
    price: 999,
    date: "Saturday & Sunday, March 4–5, 2023",
    time: "9:00 AM – 5:00 PM",
    duration: "2 days",
    location: "265 Rimrock Road, Units 209, North York, ON M3J3A6",
    ceCredits: "11 CE Credits",
    status: "sold-out",
    category: "Implant Dentistry",
    format: "Lecture + Hands-On Workshop",
    image: "/course-all-on-4.jpg",
    description:
      "A two-day program with Professor Paulo Malo — the originator of the All-on-4® Treatment Concept — reviewing the evidence-based principles of full-arch rehabilitation. The course covers the evolution of the MALO protocol, new products including zygomatic and short implants, and clinical applications for the most complex edentulous cases.",
    highlights: [
      "Review of All-on-4® principles, advantages, and biomechanics",
      "MALO protocol evolution and current challenges",
      "All-on-4® variants: Standard, Hybrid, Double-Zygoma™, Extreme",
      "New implant products for complex cases",
      "Diagnosis and treatment planning for total rehabilitation",
    ],
  },
  {
    slug: "root-canal-cleaning-and-shaping",
    title: "Root Canal Cleaning and Shaping — Make the Task Simple",
    instructor: "Dr. Farzad Salehipour, FRCD(C)",
    price: 399,
    date: "Sunday, January 29, 2023",
    time: "9:00 AM – 1:30 PM",
    location: "265 Rimrock Road, Units 209/211, North York, ON M3J3A6",
    ceCredits: "4 CE Credits",
    status: "sold-out",
    category: "Endodontics",
    format: "In-Person",
    image: "/course-root-canal.jpg",
    description:
      "A practical half-day seminar with Dr. Farzad Salehipour, FRCD(C) — a certified endodontist and Fellow of the Royal College of Dentists of Canada with specialty training from Tehran University and the Dental Specialty Assessment and Training Program at the University of Toronto. The course simplifies the cleaning and shaping phase of root canal therapy for general dentists.",
    highlights: [
      "Systematic approach to root canal cleaning and shaping",
      "File system selection and sequencing",
      "Practical tips for reducing procedural errors",
      "Taught by a Fellow of the Royal College of Dentists of Canada",
    ],
  },
  {
    slug: "anatomy-and-layering-composite-veneers",
    title: "Anatomy and Layering Technique in Composite Veneers",
    instructor: "Dr. Sandra Khodabandelou",
    price: 1099,
    date: "Sunday, October 23",
    time: "9:00 AM – 5:00 PM",
    duration: "Full day",
    location: "Toronto",
    ceCredits: "7 CE Credits (Category 2)",
    status: "sold-out",
    category: "Cosmetic Dentistry",
    format: "In-Person Hands-On",
    image: "/course-anatomy-layering.jpg",
    description:
      "A full-day hands-on course with Dr. Sandra Khodabandelou exploring the artistic and technical dimensions of composite veneer fabrication. Participants develop a deep understanding of tooth anatomy and master the layering technique to achieve lifelike esthetic results with direct composite materials.",
    highlights: [
      "Dental anatomy principles for composite layering",
      "Step-by-step layering technique demonstration",
      "Hands-on practice with direct composite",
      "Color matching and characterization",
      "Finishing and polishing protocols",
    ],
  },
  {
    slug: "arch-seminar-all-on-x",
    title: "Immediate All-On-X Digital Solution — Full Arch Seminar",
    instructor: "Dr. Ammar Taimish",
    price: 399,
    date: "November 20, 2022",
    time: "8:30 AM – 4:30 PM",
    duration: "8 hours",
    location: "Toronto",
    status: "sold-out",
    category: "Implant Dentistry",
    format: "Lecture + Hands-On",
    image: "/course-arch-seminar.png",
    description:
      "A full-day seminar with Dr. Ammar Taimish — NYU College of Dentistry graduate with 20+ years of implant clinical experience — covering the full arch implant-supported restoration workflow. Learn how digital integration makes full-arch procedures less time-consuming, more predictable, and less traumatic for patients. Includes hands-on practice using a typodont.",
    highlights: [
      "Science and technology of full-arch rehabilitation",
      "Why immediate full arch restorations",
      "Clinical and digital workflow instruction",
      "Hands-on practice using typodont",
      "Q&A and networking session",
    ],
  },
];

export function getCourse(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug);
}

export const categories = [...new Set(courses.map((c) => c.category))];
