export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  authorTitle: string;
  authorBio: string;
  authorPhoto?: string;
  publishDate: string; // "YYYY-MM-DD"
  category: string;
  heroImage: string;
  heroImageAlt: string;
  bodyHtml: string;
};

export type ArticleWithMeta = Article & { readTimeMinutes: number };

function estimateReadTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

// ── Add new articles to the top of this array (newest first) ──────────────
export const articles: Article[] = [
  {
    slug: "digital-marketing-strategies-dental-practices",
    title: "Digital Marketing Strategies in Modern Dental Practices",
    excerpt:
      "Social media, local SEO, online reviews, and content marketing have become essential channels between dental professionals and their communities. We examine the strategies driving patient acquisition today — and the ethical boundaries every practice must respect.",
    author: "CanaDent Education Team",
    authorTitle: "CanaDent Education Center",
    authorBio:
      "The CanaDent Education Team produces evidence-informed articles on clinical practice, practice management, and continuing education for dental professionals across Canada.",
    publishDate: "2026-08-04",
    category: "Practice Marketing",
    heroImage: "/article-digital-marketing-hero.png",
    heroImageAlt:
      "Digital Marketing Strategies in Modern Dental Practices — analytics and social media on a dental clinic front desk",
    bodyHtml: `
<h2>Social Media Marketing in Dentistry</h2>
<p>One of the most powerful tools available to clinics today is social media marketing. In recent years, dental clinics have increasingly used social media platforms to promote and advertise their services, educate the public, and attract new patients. Platforms such as Instagram, Facebook, and TikTok have become essential communication channels between dental professionals and their communities. As <em>Oral Health</em> suggests, "Facebook remains the go-to social platform for dental practices." However, Instagram and TikTok have also spread significantly among Canadians, especially among younger people. These platforms allow dental clinics to create visually engaging content, such as before-and-after treatment results, educational videos, and demonstrations of dental procedures.</p>

<h2>Ethical Issues Surrounding Social Media in Dentistry</h2>
<p>The main problem with social media in dentistry is patient privacy. It is critically important for patients to consent to the use of their face, smile, and medical details. Without that consent, their right to privacy is violated and they may pursue legal action. Moreover, misrepresentation and alteration — meaning enhancing or exaggerating photos to make a final result look more dramatic or flawless — stands as the second most significant ethical issue surrounding the use of social media for advertising in dentistry. Dental professionals have a responsibility to ensure that their online content accurately represents their services and treatment results.</p>

<h2>Search Engine Optimization (SEO), Online Reviews, and Reputation Management</h2>
<p>Local SEO is the most critical digital marketing strategy, as patients usually look for a clinic in or near their neighbourhood. A Google Business Profile, for instance, holds a very important key to successful advertising, since prospective patients rely heavily on Google ratings. Furthermore, on-page SEO also plays a significant role for clinics. On-page SEO means structuring your website's content so that your services and location are easily understood by search engines. By being accessible and offering excellent service, clinics can achieve substantial patient acquisition.</p>

<p>As for maintaining a good reputation, clinics should observe three practices when responding to reviews:</p>
<ul>
  <li><strong>Respond promptly</strong> — aim to reply within a few days.</li>
  <li><strong>Express genuine gratitude</strong> — thank the patient for taking the time to comment.</li>
  <li><strong>Personalize the response</strong> — refer to the patient directly without revealing any health information.</li>
</ul>

<h2>Content Marketing</h2>
<p>Content marketing is another effective strategy used by modern dental practices. Creating educational content — such as blogs, articles, and videos explaining dental procedures — serves immensely to attract more people. In doing so, people get to see and learn about dentistry and its procedures. This approach helps patients become more informed and comfortable with dental treatments. When individuals understand procedures and their benefits, they tend to feel more confident and at ease. Additionally, providing reliable educational resources helps establish a dental practice as a trustworthy source of information and strengthens the relationship between patients and dental professionals.</p>

<h2>Patient Relationship Management</h2>
<p>Beyond attracting new patients, maintaining strong relationships with existing patients is a crucial aspect of successful dental marketing. Patient relationship management focuses on creating positive experiences and building long-term trust between the clinic and its patients. Patient satisfaction remains one of the most important factors in the success of any healthcare practice. By providing excellent service, communicating effectively, and demonstrating genuine care, dental clinics can create lasting relationships with their patients. A satisfied patient is more likely to return for future treatment and to recommend the clinic to family members, friends, and colleagues.</p>

<h2>Conclusion</h2>
<p>In modern dentistry, digital marketing is not only about advertising services; it is about building trust, educating patients, and creating meaningful connections. By combining social media marketing, ethical online practices, SEO strategies, valuable content creation, and strong patient relationships, dental practices can successfully adapt to the digital age while maintaining professional integrity.</p>
`,
  },
  {
    slug: "reinventing-instead-of-retiring",
    title:
      "Reinventing Instead of Retiring: Lessons from Two Dentists Who Rebuilt at 61",
    excerpt:
      "In episode 69 of the Dental CEO Podcast, Dr. Scott Leune interviews Dr. Ramin Tabib and Dr. Elisa Mello — a couple who, after 32 years of practising together in New York City, chose to completely reinvent their practice instead of preparing for retirement.",
    author: "CanaDent Education Team",
    authorTitle: "CanaDent Education Center",
    authorBio:
      "The CanaDent Education Team produces evidence-informed articles on clinical practice, practice management, and continuing education for dental professionals across Canada.",
    publishDate: "2026-08-02",
    category: "Practice Management",
    heroImage: "/article-reinventing-practice-hero.png",
    heroImageAlt:
      "Reinventing Instead of Retiring — a newly renovated, modern upscale dental practice interior",
    bodyHtml: `
<p>In the 69th episode of the <em>Dental CEO Podcast</em>, Dr. Scott Leune interviews Dr. Ramin Tabib and Dr. Elisa Mello, a dental team and couple who have worked together for over 32 years in New York City. Instead of slowing down and preparing for retirement, this couple chose to completely reinvent their practice at the age of 61. They relocated to a larger facility and rebranded their practice as The Smile Code.</p>

<h2>Reinventing Instead of Retiring</h2>
<p>Although financially stable and successful, the couple felt their old 700-square-foot clinic no longer reflected the quality of care they provide. Rather than becoming comfortable with the status quo, they chose to make significant changes by relocating. They invested in a new 2,500-square-foot practice to create a better patient experience and renew their passion for dentistry. They explained that the new practice allowed them to work in an environment that better represented their professional values and clinical standards.</p>

<h2>The Importance of Branding</h2>
<p>The podcast emphasises that successful branding extends far beyond a logo or a practice name. Dr. Tabib and Dr. Mello stress that a dental practice's brand, office design, website, and patient experience must all align. Patients often judge quality before treatment begins, so the environment should reflect the level of dentistry being delivered. Their rebranding effort included changing the practice's name, redesigning the office, improving their marketing, and creating an identity that reflected the type of dentistry they wanted to provide. They argue that consistent branding helps establish trust and communicates the quality of care patients can expect — and that patients begin evaluating a dental practice before treatment even starts, often based on its appearance.</p>

<h2>Commitment to Fee-for-Service Dentistry</h2>
<p>Throughout the podcast, Dr. Tabib and Dr. Mello discuss their long-standing commitment to fee-for-service care. They intentionally chose not to participate in insurance PPO networks, even when doing so would have made it easier to increase patient volume. They believed that remaining independent would allow them to prioritise patients' needs instead of insurance requirements. Although this decision created financial challenges early in their careers, they remained committed to their philosophy. They explained that fee-for-service requires patients to recognise the value of exceptional care, which is why they focused heavily on building trust and delivering an outstanding, high-quality patient experience.</p>

<h2>Working as Spouses</h2>
<p>The podcast also explores the challenges and advantages of operating a dental practice as a married couple, since managing work and a relationship at the same time has always been a complex task. This couple, however, was able to manage it well. Dr. Tabib describes himself as the visionary and risk-taker, while Dr. Mello is more cautious and detail-oriented. In other words, one partner is more entrepreneurial, optimistic, and willing to take risks, while the other is more cautious, analytical, and detail-oriented. Rather than allowing these personality differences to create conflict, they learned to view them as strengths when making business decisions. They emphasised that open communication, mutual respect, and shared long-term goals have enabled them to successfully manage both their marriage and their dental practice for more than three decades.</p>

<h2>Continuous Improvement</h2>
<p>A recurring message throughout the episode is the importance of lifelong learning. The couple believes dentists should never stop improving their clinical skills or business knowledge, regardless of their experience. Throughout their career, they have continually updated their clinical techniques, invested in new technology, refreshed their website and marketing, and adapted to changing patient expectations. They stress that a successful dental practice must continue evolving rather than staying stagnant.</p>

<h2>Main Lesson</h2>
<p>The central message of this podcast is that professional growth does not have an expiration date. Dr. Tabib and Dr. Mello demonstrate that dentists can successfully reinvent themselves even after decades in practice. Instead of viewing their sixties as the end of their careers, the couple saw it as an opportunity to create the practice they had always envisioned. Their journey shows that investing in branding, modern facilities, patient experience, and continuous education can revitalize both a practice and a career. They encourage dentists not to fear change or assume that innovation is only for the young. Their story reinforces the idea that dedication, adaptability, and a commitment to quality can lead to long-term success.</p>

<h2>Reference</h2>
<ol>
  <li><em>Dental CEO Podcast</em>, Episode 69: The Husband-and-Wife Dentists Reinventing Themselves at 61.</li>
</ol>
`,
  },
  {
    slug: "kaizen-in-dentistry",
    title:
      "What Dental Practices Can Learn from Toyota Production System",
    excerpt:
      "\"Lean production\" — or Kaizen — has driven Toyota's success for decades and transformed industries worldwide. In this article, we explore how Canadian dental practices can apply the same philosophy to reduce waste, shorten wait times, and build a more patient-centred clinic.",
    author: "CanaDent Education Team",
    authorTitle: "CanaDent Education Center",
    authorBio:
      "The CanaDent Education Team produces evidence-informed articles on clinical practice, practice management, and continuing education for dental professionals across Canada.",
    publishDate: "2026-07-28",
    category: "Practice Management",
    heroImage: "/article-kaizen-image1.png",
    heroImageAlt:
      "What Dental Practices Can Learn from Toyota Production System — Kaizen in Dentistry",
    bodyHtml: `
<p>"Lean production," also known as "Kaizen" in Japanese, refers to a management philosophy that was pioneered at the Toyota Motor Company. This approach contributed a significant success to the Toyota company and later became a field of study for scholars, as well as a guaranteed success formula for companies. Over the years, this technique began to be adapted across a wide range of industries and organizations. From healthcare institutions to a newly funded start-up, the influence of this methodology can be observed in numerous sectors due to its emphasis on efficiency. In this article, drawing upon previous studies and reports done by scholars and journalists, we seek to discover whether this "Lean" technique achieves similar benefits in the field of dentistry as it has in other sectors.</p>

<figure>
  <img src="/article-kaizen-image3.jpeg" alt="The Kaizen Cycle: Identify problems, Analyze root causes, Improve and standardize, Evaluate results, Sustain progress — applied to dental practice" loading="lazy" />
  <figcaption>The Kaizen Cycle applied to dental practice: five continuous steps driving patient-focused improvement.</figcaption>
</figure>

<h2>Statistics</h2>
<p>According to the 2023 NextHealth report, 85% of patients value clear and transparent communications. Implementing "Kaizen" can continuously improve communication strategies and help clinics meet these expectations. Moreover, patients are also increasingly expecting personalized care. By seeking feedback and refining care protocols, dental practices can better meet individual patient expectations while reducing inefficiencies. The report also indicates that 70% of patients prefer personalized dental care.</p>

<p>Also, based on <em>"Improving a Dental School's Clinic Operations Using Lean Process Improvement,"</em> written by Fonda et al., there is a waste of $700 billion in the healthcare industry annually: <em>"The complexity of such systems increases the chances for errors of omission or commission. Such errors endanger patient welfare and accelerate health care costs. It has been estimated that the health care industry wastes nearly $700 billion annually."</em> This shows that waste management in dental practices can identify opportunities for improvement in order to apply appropriate measures — a process that will most likely produce better patient satisfaction in dentistry.</p>

<h2>Kaizen in Action: Key Problems and Solutions</h2>
<p>The table below outlines the most common operational challenges facing dental practices today, and the specific Lean methodology that addresses each one.</p>

<table class="article-table">
  <thead>
    <tr>
      <th>Main Problem / Area for Improvement</th>
      <th>Kaizen-Based Solution</th>
      <th>Explanation</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Long waiting times</td>
      <td><span class="article-badge">Process Simplification</span></td>
      <td>Begin by identifying peak periods. Analyze waiting-time data and standardize methods that have previously produced positive results.</td>
    </tr>
    <tr>
      <td>Ineffective communication and lack of transparency with patients</td>
      <td><span class="article-badge">Process Simplification</span></td>
      <td>Regularly collect and analyze patient feedback to identify areas for improvement. Develop and implement targeted communication strategies to better understand and meet patient expectations.</td>
    </tr>
    <tr>
      <td>Lack of personalized care</td>
      <td><span class="article-badge">Process Simplification</span></td>
      <td>Regularly gather and review patient feedback to identify opportunities for improving individualized care and addressing patient needs more effectively.</td>
    </tr>
    <tr>
      <td>Complex and inefficient processes</td>
      <td><span class="article-badge">Process Simplification</span></td>
      <td>Eliminate unnecessary steps and reduce complexity throughout all processes. This increases operational efficiency and improves workflow.</td>
    </tr>
    <tr>
      <td>Inefficient administrative procedures</td>
      <td><span class="article-badge">Process Simplification</span></td>
      <td>Use digital tools such as Electronic Health Records (EHRs) and patient-management software to simplify administrative tasks, reduce paperwork, improve data accuracy, and enhance coordination of patient care.</td>
    </tr>
    <tr>
      <td>Waste in daily activities</td>
      <td><span class="article-badge article-badge--green">5S</span></td>
      <td>Implement the 5S methodology (Sort, Set in Order, Shine, Standardize, Sustain) to organize workspaces and reduce disorder. This minimizes waste and improves workflow efficiency.</td>
    </tr>
    <tr>
      <td>Excess inventory and high storage costs</td>
      <td><span class="article-badge article-badge--blue">Just-in-Time (JIT)</span></td>
      <td>Adopt JIT inventory management to maintain optimal stock levels and reduce storage costs. This ensures that necessary supplies are available when needed while minimizing waste associated with excess inventory.</td>
    </tr>
  </tbody>
</table>

<p>Furthermore, as the table indicates, the "Lean" approach can significantly improve clinic operations. "Process Simplification" helps clinics to enhance their performance and meet their patients' expectations. It can also help clinics improve their communication and transparency with patients. In addition, Lean supports the delivery of more personalized care and streamlines administrative procedures, leading to greater efficiency and improved patient satisfaction. Moreover, the implementation of 5S principles helps reduce waste in daily activities by organizing workspaces, standardizing procedures, and creating a more efficient workflow. Lean also promotes Just-in-Time (JIT) inventory management, which minimizes excess inventory and storage costs while ensuring that essential supplies are available when needed. Thus, clinics can optimize resource utilization, reduce operational expenses, and provide higher-quality patient care.</p>

<figure>
  <img src="/article-kaizen-image4.jpeg" alt="Lean Principles Applied in Dental Practice: Eliminate Waste, Improve Flow, Respect People, Focus on Quality, Continuous Improvement" loading="lazy" />
  <figcaption>Lean principles applied to dental practice, and the proven benefits of Kaizen adoption.</figcaption>
</figure>

<h2>Conclusion</h2>
<p>As discussed in this article, the "Kaizen" or "Lean" technique immensely improves the quality of dental clinic operations. It significantly improves communication, enhances administrative procedures, improves the transparency of a dental clinic with its patients, and reduces waste. Ultimately, the "Lean Approach" will contribute to a more patient-centred healthcare environment, which builds a stronger relationship between healthcare providers and their patients. Improving service delivery in an institution such as a health clinic remains a vital component — for without transparency, high-quality communication, and effective service delivery, patients will lose faith in their healthcare provider.</p>

<h2>References</h2>
<ol>
  <li>2023 NextHealth Report.</li>
  <li><em>Lean Thinking</em> (1996). James P. Womack &amp; Daniel T. Jones.</li>
  <li>Robinson, F. G., Cunningham, L. L., Turner, S. P., Lindroth, J., Ray, D., &amp; Khan, T. (2014). Improving a dental school's clinic operations using lean process improvement. <em>Journal of Dental Education, 78</em>(3), 437–444.</li>
</ol>
`,
  },
];

// ─────────────────────────────────────────────────────────────────────────────

export function getArticle(slug: string): ArticleWithMeta | undefined {
  const article = articles.find((a) => a.slug === slug);
  if (!article) return undefined;
  return { ...article, readTimeMinutes: estimateReadTime(article.bodyHtml) };
}

export function getAllArticles(): ArticleWithMeta[] {
  return articles
    .map((a) => ({ ...a, readTimeMinutes: estimateReadTime(a.bodyHtml) }))
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
}
