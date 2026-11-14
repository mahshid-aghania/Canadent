import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AnnouncementBar, type AnnouncementItem } from "@/components/AnnouncementBar";
import { ChatWidget } from "@/components/ChatWidget";
import { ChromeGate } from "@/components/ChromeGate";
import { getCourseGroups } from "@/lib/course-status";
import { getCourse } from "@/lib/courses";

/** "Tuesday, November 24, 2026" → "Nov 24" (or "Mar 7, 2027" when not this year). */
function shortCourseDate(dateStr: string): string {
  const cleaned = dateStr.replace(/^\s*[A-Za-z]+,\s*/, "").trim();
  const d = new Date(cleaned);
  if (Number.isNaN(d.getTime())) return dateStr;
  const mon = d.toLocaleString("en-US", { month: "short" });
  return d.getFullYear() === new Date().getFullYear()
    ? `${mon} ${d.getDate()}`
    : `${mon} ${d.getDate()}, ${d.getFullYear()}`;
}

export const metadata: Metadata = {
  title: {
    default: "CanaDent Education Center",
    template: "%s | CanaDent Education Center",
  },
  description:
    "CanaDent Education Center — world-class dental continuing education courses in Canada. Endodontics, implants, oral surgery, cosmetic dentistry, and practice management.",
  keywords: ["dental courses Canada", "CE credits dentist", "dental education", "CanaDent"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Real upcoming courses (soonest first); past courses are excluded automatically.
  const announcements: AnnouncementItem[] = getCourseGroups()
    .upcoming.slice(0, 4)
    .map((c) => ({
      slug: c.slug,
      label: getCourse(c.slug)?.navLabel ?? c.title.split(":")[0].trim(),
      dateLabel: shortCourseDate(c.date),
    }));

  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <body className="min-h-full flex flex-col bg-white">
        <ChromeGate>
          <AnnouncementBar items={announcements} />
          <Header />
        </ChromeGate>
        <main className="flex-1">{children}</main>
        <ChromeGate>
          <Footer />
          <ChatWidget />
        </ChromeGate>
      </body>
    </html>
  );
}
