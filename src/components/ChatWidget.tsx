"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { X, Send, MessageCircle } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const INITIAL_MESSAGE: Message = {
  role: "assistant",
  content:
    "Hi! I'm Denta, CanaDent's virtual assistant 👋 I can help you find the right CE course, answer questions about upcoming workshops, or connect you with our team. What can I help you with today?",
};

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 120);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: "user", content: text };
    const history = [...messages, userMsg];
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok || !res.body) throw new Error("Bad response");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        setMessages([...history, { role: "assistant", content: full }]);
      }
    } catch {
      setMessages([
        ...history,
        {
          role: "assistant",
          content:
            "Sorry, something went wrong. Please try again or reach us at canadent.edu@gmail.com or 1.437.370.0122.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages]);

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
              <div className="text-white font-semibold text-sm leading-none">
                Denta
              </div>
              <div className="text-white/55 text-xs mt-0.5">
                CanaDent Virtual Assistant
              </div>
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
          <div
            className="flex-1 overflow-y-auto p-4 space-y-3"
            style={{ background: "#f8fafc" }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex items-end gap-2 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
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
                  style={
                    msg.role === "user"
                      ? {
                          background: "#1b3a8a",
                          color: "#fff",
                          borderBottomRightRadius: 4,
                        }
                      : {
                          background: "#fff",
                          color: "#1a1a2e",
                          border: "1px solid #e2e8f0",
                          borderBottomLeftRadius: 4,
                        }
                  }
                >
                  {msg.content || (
                    <span
                      className="flex gap-1 items-center"
                      style={{ color: "#1a1a2e60" }}
                    >
                      <span className="animate-bounce" style={{ animationDelay: "0ms" }}>●</span>
                      <span className="animate-bounce" style={{ animationDelay: "150ms" }}>●</span>
                      <span className="animate-bounce" style={{ animationDelay: "300ms" }}>●</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
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
              disabled={loading}
              className="flex-1 rounded-xl px-3.5 py-2 text-sm outline-none"
              style={{
                background: "#f5f7fb",
                color: "#1a1a2e",
                border: "1px solid #e2e8f0",
              }}
            />
            <button
              onClick={send}
              disabled={!input.trim() || loading}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-opacity disabled:opacity-35"
              style={{ background: "#1b3a8a" }}
              aria-label="Send message"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Floating trigger button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-4 sm:right-6 h-14 rounded-full shadow-xl flex items-center gap-2.5 px-5 transition-transform hover:scale-105 active:scale-95"
        style={{
          background: "linear-gradient(135deg, #0f2150, #1b3a8a)",
          zIndex: 1000,
        }}
        aria-label={open ? "Close chat" : "Chat with Denta"}
      >
        <MessageCircle className="w-5 h-5 text-white" />
        <span className="text-white text-sm font-semibold">Ask Denta</span>
      </button>
    </>
  );
}
