import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllArticles, getArticle } from "@/lib/articles";
import {
  ArrowRight,
  Calendar,
  Clock,
  ChevronLeft,
  User,
} from "lucide-react";

type Props = {
  params: Promise<{ slug: string }>;
};

const SITE_URL = "https://www.canadent.net";

export async function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: "Article Not Found" };

  const url = `${SITE_URL}/articles/${slug}`;
  return {
    title: `${article.title} | CanaDent Education Center`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url,
      type: "article",
      publishedTime: article.publishDate,
      authors: [article.author],
      images: [
        {
          url: `${SITE_URL}${article.heroImage}`,
          width: 1200,
          height: 630,
          alt: article.heroImageAlt,
        },
      ],
    },
  };
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.258 5.63 5.906-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const articleUrl = `${SITE_URL}/articles/${slug}`;
  const encodedUrl = encodeURIComponent(articleUrl);
  const encodedTitle = encodeURIComponent(article.title);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    author: {
      "@type": "Person",
      name: article.author,
      jobTitle: article.authorTitle,
    },
    publisher: {
      "@type": "Organization",
      name: "CanaDent Education Center",
      url: SITE_URL,
    },
    datePublished: article.publishDate,
    image: `${SITE_URL}${article.heroImage}`,
    url: articleUrl,
  };

  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Breadcrumb nav ── */}
      <div style={{ background: "#0f2150" }} className="px-4 py-3">
        <nav className="max-w-4xl mx-auto text-xs text-white/50 flex items-center gap-1.5">
          <Link href="/" className="hover:text-[#c9a84c] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/articles" className="hover:text-[#c9a84c] transition-colors">Articles</Link>
          <span>/</span>
          <span className="text-white/80 line-clamp-1">{article.title}</span>
        </nav>
      </div>

      {/* ── Hero image ── */}
      <div className="w-full relative" style={{ height: "clamp(260px, 45vw, 560px)" }}>
        <Image
          src={article.heroImage}
          alt={article.heroImageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(15,33,80,0.15) 0%, rgba(15,33,80,0.55) 100%)",
          }}
        />
      </div>

      {/* ── Article container ── */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Back link */}
        <Link
          href="/articles"
          className="inline-flex items-center gap-1.5 text-sm font-medium mb-8 transition-colors hover:text-[#0f2150]"
          style={{ color: "#1b3a8a" }}
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Articles
        </Link>

        {/* Category tag */}
        <div className="mb-5">
          <span
            className="rounded-full px-3 py-1 text-[0.65rem] font-bold tracking-wide uppercase"
            style={{ background: "#f5f0e8", color: "#a87219" }}
          >
            {article.category}
          </span>
        </div>

        {/* Title */}
        <h1 className="font-heading text-3xl sm:text-4xl lg:text-[2.6rem] font-bold text-[#0f2150] leading-tight mb-6">
          {article.title}
        </h1>

        {/* Byline */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pb-6 mb-8 border-b border-[#1a1a2e]/10 text-sm text-[#1a1a2e]/55">
          <div className="flex items-center gap-2">
            {article.authorPhoto ? (
              <Image
                src={article.authorPhoto}
                alt={article.author}
                width={32}
                height={32}
                className="rounded-full border border-[#c9a84c]/30 object-cover"
                style={{ width: 32, height: 32 }}
              />
            ) : (
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                style={{ background: "#1b3a8a" }}
              >
                {article.author.charAt(0)}
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-semibold text-[#0f2150] text-sm leading-tight">{article.author}</span>
              <span className="text-xs text-[#1a1a2e]/45 leading-tight">{article.authorTitle}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 shrink-0" style={{ color: "#c9a84c" }} />
            <span>{formatDate(article.publishDate)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 shrink-0" style={{ color: "#c9a84c" }} />
            <span>{article.readTimeMinutes} min read</span>
          </div>
        </div>

        {/* ── Article body ── */}
        <div
          className="article-body"
          dangerouslySetInnerHTML={{ __html: article.bodyHtml }}
        />

        {/* ── Author box ── */}
        <div
          className="mt-14 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start gap-5"
          style={{ background: "#f5f0e8", border: "1px solid rgba(201,168,76,0.2)" }}
        >
          {article.authorPhoto ? (
            <Image
              src={article.authorPhoto}
              alt={article.author}
              width={80}
              height={80}
              className="rounded-full border-2 object-cover shrink-0"
              style={{ borderColor: "#c9a84c", width: 80, height: 80 }}
            />
          ) : (
            <div
              className="w-20 h-20 rounded-full shrink-0 flex items-center justify-center text-2xl font-bold text-white"
              style={{ background: "#1b3a8a" }}
            >
              <User className="h-8 w-8" />
            </div>
          )}
          <div>
            <p className="text-[0.65rem] font-bold tracking-widest uppercase mb-1" style={{ color: "#c9a84c" }}>
              About the Author
            </p>
            <h3 className="font-heading text-xl font-bold text-[#0f2150] mb-0.5">{article.author}</h3>
            <p className="text-xs text-[#1b3a8a] font-medium mb-3">{article.authorTitle}</p>
            <p className="text-sm text-[#1a1a2e]/65 leading-relaxed">{article.authorBio}</p>
          </div>
        </div>

        {/* ── Social share ── */}
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold tracking-widest uppercase text-[#1a1a2e]/40">
            Share this article
          </span>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-85"
            style={{ background: "#0a66c2" }}
            aria-label="Share on LinkedIn"
          >
            <LinkedInIcon className="h-4 w-4" />
            LinkedIn
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-85"
            style={{ background: "#1877f2" }}
            aria-label="Share on Facebook"
          >
            <FacebookIcon className="h-4 w-4" />
            Facebook
          </a>
          <a
            href={`https://x.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-85"
            style={{ background: "#000" }}
            aria-label="Share on X"
          >
            <XIcon className="h-4 w-4" />
            Share on X
          </a>
        </div>

        {/* ── CTA banner ── */}
        <div
          className="mt-14 rounded-2xl px-8 py-10 text-center relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #0f2150 0%, #1b3a8a 100%)" }}
        >
          <div
            className="absolute inset-0 opacity-15 rounded-2xl"
            style={{ backgroundImage: "radial-gradient(circle at 80% 50%, #c9a84c, transparent 65%)" }}
          />
          <div className="relative z-10">
            <span className="section-label mb-2 block">Continuing Education</span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-3 leading-tight">
              Expand Your Skills with a CanaDent CE Course
            </h2>
            <p className="text-white/65 mb-7 max-w-xl mx-auto leading-relaxed text-sm">
              Turn clinical insights into hands-on expertise. Browse our upcoming CE-accredited
              seminars, workshops, and intensives for dental professionals across Canada.
            </p>
            <Link href="/courses" className="btn-primary">
              Explore Courses
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
