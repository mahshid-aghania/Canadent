"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { X, Send, MessageCircle } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

// ── Rules engine ────────────────────────────────────────────────────────────

type Intent = { patterns: RegExp[]; response: string };

const INTENTS: Intent[] = [
  {
    patterns: [/\b(hi|hello|hey|good morning|good afternoon|good evening|howdy|bonjour|salut)\b/i],
    response:
      "Hi there! I'm Denta, CanaDent's virtual assistant 👋\n\nAsk me about our Fall 2026 courses, pricing, registration, or how to reach our team — I'm happy to help!",
  },
  {
    patterns: [/all courses|what courses|upcoming|what do you offer|catalog|list.*course|course.*list/i],
    response:
      "We have two courses enrolling now for Fall 2026:\n\n• Advanced Adhesive Dentistry: The Master Blueprint — Sept 6 · Hybrid: $499 online / $699 in-person Early Bird (reg. $799 until Aug 24) · 6 CE credits · Dr. Amin Asadollahi\n\n• Daily and Unique Orthodontic Techniques — Sept 27 · $799 Early Bird (reg. $999 until Aug 31) · 6 PACE CE credits · Dr. John Voudouris\n\nAll prices exclude 13% HST, which is added at checkout.\n\nAsk me about either one, or browse the full catalog at canadent.net/courses",
  },
  {
    patterns: [/adhesive|composite|bonding|master blueprint|asadollahi|restorative|ids|dme|rubber dam|dentin|amin/i],
    response:
      "Advanced Adhesive Dentistry: The Master Blueprint\n\nInstructor: Dr. Amin Asadollahi\nDate: Sunday, September 6, 2026\nLocation: 265 Rimrock Rd, North York, ON (or attend online)\nFormat: Hybrid — in-person or online · 6 hours · 6 CE credits\nPrice: $499 online · $699 in-person Early Bird (reg. $799) — early bird valid until August 24, 2026. Prices exclude 13% HST, added at checkout.\n\nCovers rubber dam isolation, dentin bonding chemistry, IDS, DME, C-factor, and the progression from direct composite to indirect restorations.\n\nReserve your seat:\ncanadent.net/courses/advanced-adhesive-dentistry-master-blueprint",
  },
  {
    patterns: [/ortho|orthodontic|aligner|voudouris|clear aligner|brackets|biomechanics|deep bite|open bite|class ii|class iii|supercorrection/i],
    response:
      "Daily and Unique Orthodontic Techniques\n\nInstructor: Dr. John C. Voudouris, DDS, D.Ortho, MSc.(D)\nDate: Sunday, September 27, 2026\nLocation: 265 Rimrock Rd, North York, ON\nFormat: In-person + hands-on demos · 6 hours · 6 PACE CE credits\nPrice: $799 Early Bird (reg. $999) — valid until August 31, 2026. Prices exclude 13% HST, added at checkout.\n\nCovers evidence-based aligner therapy, JV Supercorrection Rx, deep bite, open bite, Class II/III, and hands-on auxiliary demos.\n\nReserve your seat:\ncanadent.net/courses/daily-unique-orthodontic-techniques",
  },
  {
    patterns: [/endo|root canal|endodontic|apex|pulp|bakhtiar|hengameh|precision endo/i],
    response:
      "Our Precision Endo: From Access to Apex course with Dr. Hengameh Bakhtiar, FRCD(C) is currently sold out.\n\nTo be added to the waitlist and notified about the next session, reach us at:\n📞 1.437.370.0122\n✉️ canadent.edu@gmail.com",
  },
  {
    patterns: [/early bird|discount|deal|save|promotion|\$200/i],
    response:
      "The Daily and Unique Orthodontic Techniques course has an Early Bird price of $799 (regular $999) — that's $200 off, valid until August 31, 2026. Prices exclude 13% HST, added at checkout.\n\nSecure your spot before the deadline:\ncanadent.net/courses/daily-unique-orthodontic-techniques",
  },
  {
    patterns: [/price|cost|how much|fee|pay|pricing|\$/i],
    response:
      "Fall 2026 course pricing:\n\n• Advanced Adhesive Dentistry — Hybrid: $499 online / $699 in-person Early Bird (reg. $799, until Aug 24)\n• Daily & Unique Orthodontic Techniques — $799 Early Bird (reg. $999, until Aug 31)\n\nAll prices exclude 13% HST, which is added at checkout.\n\nPayment is handled securely online during registration. Questions? Email canadent.edu@gmail.com",
  },
  {
    patterns: [/register|enroll|enrol|sign up|book|reserve|seat|spot/i],
    response:
      "You can register directly on each course page:\n\n• Advanced Adhesive Dentistry (Sept 6):\n  canadent.net/courses/advanced-adhesive-dentistry-master-blueprint\n\n• Orthodontic Techniques (Sept 27):\n  canadent.net/courses/daily-unique-orthodontic-techniques\n\nNeed help? Call 1.437.370.0122 or email canadent.edu@gmail.com",
  },
  {
    patterns: [/where|location|address|venue|rimrock|north york|parking|campus|directions/i],
    response:
      "Both Fall 2026 courses are held at our North York campus:\n\n265 Rimrock Road, Unit 209\nNorth York, ON M3J 3A6\n\nFor parking details or directions, email canadent.edu@gmail.com or call 1.437.370.0122 — we're happy to help!",
  },
  {
    patterns: [/contact|reach|email|phone|call|get in touch|talk to someone|office hour/i],
    response:
      "You can reach our team at:\n\n📞 1.437.370.0122\n✉️ canadent.edu@gmail.com\n🕐 Monday–Friday, 10:00 AM – 4:00 PM (Eastern)\n\nOr visit canadent.net/contact and we'll get back to you the same day.",
  },
  {
    patterns: [/ce credit|credit|cda|pace|rcdc|continuing education|accredited/i],
    response:
      "Both Fall 2026 courses offer 6 CE credits:\n\n• Advanced Adhesive Dentistry — 6 CE credits\n• Orthodontic Techniques — 6 PACE-approved CE credits\n\nCanaDent courses are CE-accredited and designed to meet the continuing education requirements for Canadian dental professionals.",
  },
  {
    patterns: [/instructor|teacher|faculty|who teaches|presenter|speaker|\bdr\b/i],
    response:
      "Our Fall 2026 instructors:\n\n• Dr. Amin Asadollahi — Restorative Specialist\n  (Advanced Adhesive Dentistry, Sept 6)\n\n• Dr. John C. Voudouris, DDS, D.Ortho, MSc.(D)\n  (Orthodontic Techniques, Sept 27)\n\nOur faculty includes FRCD(C)-certified specialists, university professors, and internationally recognized clinicians.",
  },
  {
    patterns: [/cancel|refund|policy|enrolment agreement|withdraw|transfer/i],
    response:
      "For our cancellation policy, refund terms, and enrolment agreement, please visit:\ncanadent.net/enrolment-agreement\n\nIf you have specific questions, our team is happy to help:\n📞 1.437.370.0122 · ✉️ canadent.edu@gmail.com",
  },
  {
    patterns: [/about canadent|who are you|what is canadent|tell me about canadent/i],
    response:
      'CanaDent Education Center is a dental CE provider based in North York, Ontario — "Inspired by Excellence & Innovation."\n\n500+ dentists trained · 14+ courses · 10+ expert instructors · 7+ CE credit categories\n\nWe offer seminars, hands-on workshops, and online lectures across all major dental disciplines.\n\nExplore our courses at canadent.net/courses',
  },
  {
    patterns: [/treat|diagnose|patient|x.?ray|clinical|what should i do|clinical advice/i],
    response:
      "I'm the course assistant, so I can't give clinical advice — but CanaDent courses are a great place to deepen those skills! Our upcoming courses cover adhesive restorations and orthodontic biomechanics in depth.\n\nIs there a course I can tell you more about?",
  },
  {
    patterns: [/merci|je voudrais|en fran|bonjour|comment/i],
    response:
      "Bien sûr ! Je suis Denta, l'assistante virtuelle de CanaDent. Posez-moi vos questions sur nos cours, les prix, les inscriptions ou nos coordonnées — je suis là pour vous aider !\n\nPour toute question, vous pouvez aussi nous joindre au 1.437.370.0122 ou par courriel à canadent.edu@gmail.com.",
  },
];

const FALLBACK =
  "That's a great question! I don't have that specific information on hand, but our team does.\n\n📞 1.437.370.0122\n✉️ canadent.edu@gmail.com\n🕐 Monday–Friday, 10:00 AM – 4:00 PM\n\nOr visit canadent.net/contact — we typically respond the same day.";

function getResponse(input: string): string {
  for (const intent of INTENTS) {
    if (intent.patterns.some((p) => p.test(input))) {
      return intent.response;
    }
  }
  return FALLBACK;
}

// ── Component ────────────────────────────────────────────────────────────────

const INITIAL_MESSAGE: Message = {
  role: "assistant",
  content:
    "Hi! I'm Denta, CanaDent's virtual assistant 👋\n\nI can help you find the right CE course, answer questions about upcoming workshops, or connect you with our team. What can I help you with today?",
};

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 120);
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = useCallback(() => {
    const text = input.trim();
    if (!text || typing) return;

    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      const response = getResponse(text);
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
      setTyping(false);
    }, 650);
  }, [input, typing]);

  return (
    <>
      {open && (
        <div
          className="fixed bottom-24 right-4 sm:right-6 flex flex-col rounded-2xl shadow-2xl overflow-hidden"
          style={{
            zIndex: 1000,
            width: "min(calc(100vw - 2rem), 24rem)",
            maxHeight: "75dvh",
            background: "#fff",
            border: "1px solid #e2e8f0",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-3 px-4 py-3 shrink-0"
            style={{ background: "linear-gradient(135deg, #0f2150, #1b3a8a)" }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
              style={{ background: "#c9a84c", color: "#0f2150" }}
            >
              D
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white font-semibold text-sm leading-none">Denta</div>
              <div className="text-white/55 text-xs mt-0.5">CanaDent Virtual Assistant</div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white/50 hover:text-white transition-colors p-1"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ background: "#f8fafc" }}>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex items-end gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div
                    className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold"
                    style={{ background: "#c9a84c", color: "#0f2150" }}
                  >
                    D
                  </div>
                )}
                <div
                  className="max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed"
                  style={{
                    whiteSpace: "pre-line",
                    ...(msg.role === "user"
                      ? { background: "#1b3a8a", color: "#fff", borderBottomRightRadius: 4 }
                      : { background: "#fff", color: "#1a1a2e", border: "1px solid #e2e8f0", borderBottomLeftRadius: 4 }),
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {typing && (
              <div className="flex items-end gap-2 justify-start">
                <div
                  className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold"
                  style={{ background: "#c9a84c", color: "#0f2150" }}
                >
                  D
                </div>
                <div
                  className="rounded-2xl px-4 py-3 flex gap-1 items-center"
                  style={{ background: "#fff", border: "1px solid #e2e8f0", borderBottomLeftRadius: 4 }}
                >
                  {[0, 150, 300].map((delay) => (
                    <span
                      key={delay}
                      className="w-1.5 h-1.5 rounded-full animate-bounce"
                      style={{ background: "#1b3a8a", animationDelay: `${delay}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div
            className="shrink-0 flex gap-2 p-3"
            style={{ borderTop: "1px solid #e2e8f0", background: "#fff" }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Ask about our courses…"
              disabled={typing}
              className="flex-1 rounded-xl px-3.5 py-2 text-sm outline-none"
              style={{ background: "#f5f7fb", color: "#1a1a2e", border: "1px solid #e2e8f0" }}
            />
            <button
              onClick={send}
              disabled={!input.trim() || typing}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-opacity disabled:opacity-35"
              style={{ background: "#1b3a8a" }}
              aria-label="Send message"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Floating trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-4 sm:right-6 h-14 rounded-full shadow-xl flex items-center gap-2.5 px-5 transition-transform hover:scale-105 active:scale-95"
        style={{ background: "linear-gradient(135deg, #0f2150, #1b3a8a)", zIndex: 1000 }}
        aria-label={open ? "Close chat" : "Chat with Denta"}
      >
        <MessageCircle className="w-5 h-5 text-white" />
        <span className="text-white text-sm font-semibold">Ask Denta</span>
      </button>
    </>
  );
}
