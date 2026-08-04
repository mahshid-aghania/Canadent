import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getAllArticles } from "@/lib/articles";
import { ArrowRight, Calendar, Clock, User } from "lucide-react";

export const metadata: Metadata = {
  title: "Articles & Insights | CanaDent Education Center",
  description:
    "Clinical insights, education news, and updates from the CanaDent faculty. Read the latest articles on dental continuing education in Canada.",
  openGraph: {
    title: "Articles & Insights | CanaDent Education Center",
    description:
      "Clinical insights, education news, and updates from the CanaDent faculty.",
    url: "https://www.canadent.net/articles",
  },
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ArticlesPage() {
  const articles = getAllArticles();

  return (
    <>
      {/* ── Page Header ── */}
      <section
        className="py-16 px-4"
        style={{ background: "linear-gradient(135deg, #0f2150, #1b3a8a)" }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <span className="section-label mb-3 block">From Our Faculty</span>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
            Articles &amp; Insights
          </h1>
          <p className="text-white/65 text-lg max-w-2xl mx-auto leading-relaxed">
            Clinical insights, education news, and updates from the CanaDent faculty.
          </p>
        </div>
      </section>

      {/* ── Articles Grid ── */}
      <section className="py-20 px-4" style={{ background: "#faf8f3" }}>
        <div className="max-w-7xl mx-auto">
          {articles.length === 0 ? (
            <p className="text-center text-[#1a1a2e]/50 py-24">No articles published yet.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <article key={article.slug} className="card overflow-hidden flex flex-col group">
                  <Link href={`/articles/${article.slug}`} className="block relative w-full aspect-[16/9] overflow-hidden bg-[#f0ece2]">
                    <Image
                      src={article.heroImage}
                      alt={article.heroImageAlt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>

                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className="rounded-full px-3 py-1 text-[0.65rem] font-bold tracking-wide uppercase"
                        style={{ background: "#f5f0e8", color: "#a87219" }}
                      >
                        {article.category}
                      </span>
                    </div>

                    <Link href={`/articles/${article.slug}`}>
                      <h2 className="font-heading text-lg font-bold text-[#0f2150] leading-snug mb-2 group-hover:text-[#1b3a8a] transition-colors line-clamp-3">
                        {article.title}
                      </h2>
                    </Link>

                    <p className="text-sm text-[#1a1a2e]/60 leading-relaxed mb-4 line-clamp-2 flex-1">
                      {article.excerpt}
                    </p>

                    <div className="border-t border-[#1a1a2e]/8 pt-4 flex items-center justify-between gap-3 text-xs text-[#1a1a2e]/50">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <User className="h-3.5 w-3.5 shrink-0" style={{ color: "#c9a84c" }} />
                          <span className="truncate">{article.author}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" style={{ color: "#c9a84c" }} />
                          <span className="hidden sm:inline">{formatDate(article.publishDate)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" style={{ color: "#c9a84c" }} />
                          <span>{article.readTimeMinutes} min</span>
                        </div>
                      </div>
                    </div>

                    <Link
                      href={`/articles/${article.slug}`}
                      className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold transition-all hover:gap-2.5"
                      style={{ color: "#1b3a8a" }}
                    >
                      Read Article
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA Band ── */}
      <section
        className="py-20 px-4 text-center relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0f2150 0%, #1b3a8a 100%)" }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 70% 50%, #c9a84c, transparent 60%)" }}
        />
        <div className="relative z-10 max-w-2xl mx-auto">
          <span className="section-label mb-3 block">Continuing Education</span>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-4">
            Expand Your Skills with a CanaDent CE Course
          </h2>
          <p className="text-white/65 mb-8 leading-relaxed">
            Put clinical knowledge into practice. Browse our upcoming CE-accredited courses for
            dental professionals across Canada.
          </p>
          <Link href="/courses" className="btn-primary">
            Explore Courses
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
