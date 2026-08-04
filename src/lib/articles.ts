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
