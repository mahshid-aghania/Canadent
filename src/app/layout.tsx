import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { ChatWidget } from "@/components/ChatWidget";

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
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <body className="min-h-full flex flex-col bg-white">
        <AnnouncementBar />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}
