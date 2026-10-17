import { aestheticTrainingArticles } from "@/lib/articles-aesthetic-training";

/**
 * Dedicated sitemap for the off-site aesthetic-training article collection.
 *
 * These 50 articles are intentionally `unlisted` (see articles.ts): they are
 * not shown in the /articles index, the homepage feed, or navigation. This
 * standalone sitemap lets them be submitted to Search Console / discovered by
 * crawlers *without* surfacing them anywhere in the on-site UI. It is kept
 * separate from any main sitemap on purpose.
 *
 * Served at: https://www.canadent.net/sitemap-aesthetic.xml
 */

const SITE_URL = "https://www.canadent.net";

export const dynamic = "force-static";

export function GET() {
  const urls = aestheticTrainingArticles
    .map((a) => {
      const loc = `${SITE_URL}/articles/${a.slug}`;
      return [
        "  <url>",
        `    <loc>${loc}</loc>`,
        `    <lastmod>${a.publishDate}</lastmod>`,
        "    <changefreq>monthly</changefreq>",
        "    <priority>0.6</priority>",
        "  </url>",
      ].join("\n");
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
