"use client";
import { useState, useRef, useEffect } from "react";
import api from "@/lib/api";
import { Spinner, TypingDots } from "@/components/ui";
import useAuthStore from "@/lib/authStore";

const WELCOME_EN = `Namaste! 🙏 I'm your EduEdge AI Tutor for CBSE Class 10 Science.

I won't just give you answers — I'll guide you to discover them yourself through questions. That's the Socratic method, and it makes learning stick.

What topic would you like to explore today?`;

const WELCOME_HI = `नमस्ते! 🙏 मैं आपका EduEdge AI Tutor हूँ — CBSE कक्षा 10 विज्ञान के लिए।

मैं सीधे उत्तर नहीं दूँगा — बल्कि प्रश्नों के माध्यम से आपको स्वयं उत्तर खोजने में मदद करूँगा। यही सुकराती पद्धति है।

आज आप कौन सा विषय पढ़ना चाहते हैं?`;

const SUGGESTIONS = [
  "How does photosynthesis work?",
  "What is Ohm's Law?",
  "Explain refraction of light",
  "Tell me about heredity and genes",
  "What happens in a neutralisation reaction?",
];

export default function TutorPage() {
  const { user } = useAuthStore();
  const [lang, setLang] = useState("en");
  const [messages, setMessages] = useState([{ role: "assistant", content: WELCOME_EN }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Switch language while preserving chat history
  const toggleLang = () => {
    const next = lang === "en" ? "hi" : "en";
    setLang(next);
    
    // Only update the welcome message if it's the only message in chat
    if (messages.length === 1 && messages[0].role === "assistant") {
      setMessages([{ role: "assistant", content: next === "hi" ? WELCOME_HI : WELCOME_EN }]);
    }
    // Keep existing session ID to maintain conversation context
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userText = input.trim();
    setInput("");

    const updatedMsgs = [...messages, { role: "user", content: userText }];
    setMessages(updatedMsgs);
    setLoading(true);

    try {
      const { data } = await api.post("/api/ai/chat", {
        messages: updatedMsgs,
        lang,
        sessionId,
      });
      setMessages((m) => [...m, { role: "assistant", content: data.message }]);
      if (data.sessionId && !sessionId) setSessionId(data.sessionId);
    } catch (err) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Connection error. Please check that the backend is running." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* ── Header ── */}
      <header className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 border-b border-white/[0.07] bg-card flex-shrink-0">
        <div className="min-w-0">
          <h1 className="font-display text-lg sm:text-lg font-extrabold text-slate-100">AI Tutor</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="pill pill-blue text-xs">CBSE Class 10</span>
            <span className="text-slate-500 text-xs hidden sm:inline">Science · Socratic Method</span>
          </div>
        </div>

        {/* Hindi / English toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          <span className={`text-sm font-semibold ${lang === "en" ? "text-[#374151]" : "text-[#374151]"}`}>EN</span>
          <button
            onClick={toggleLang}
            className="relative w-10 h-6 sm:w-11 sm:h-6 rounded-full transition-colors duration-300 flex-shrink-0"
            style={{ background: lang === "hi" ? "#10B981" : "#374151" }}
          >
            <span
              className="absolute top-0.5 w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full shadow transition-all duration-300"
              style={{ left: lang === "hi" ? "20px" : "2px" }}
            />
          </button>
          <span className={`text-sm font-semibold ${lang === "hi" ? "text-[#374151]" : "text-[#374151]"}`}>हिं</span>
          {lang === "hi" && (
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/25 px-2 py-0.5 rounded-md hidden sm:inline">
              हिंदी Active
            </span>
          )}
        </div>
      </header>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-3 sm:py-5 flex flex-col gap-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 items-end ${m.role === "user" ? "flex-row-reverse" : ""}`}>
            {m.role === "assistant" && (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand to-violet-600 flex items-center justify-center text-lg flex-shrink-0 mb-0.5">
                🤖
              </div>
            )}
            <div
              className={`max-w-[85%] sm:max-w-[72%] px-3 py-2 sm:px-4 sm:py-3 text-[13px] sm:text-[15px] leading-relaxed whitespace-pre-wrap ${
                m.role === "user"
                  ? "bg-gradient-to-br from-brand to-violet-600 text-white rounded-2xl rounded-br-sm"
                  : "ee-card text-[#1c1c1a] rounded-2xl rounded-bl-sm"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 items-end">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand to-violet-600 flex items-center justify-center text-lg flex-shrink-0">
              🤖
            </div>
            <div className="ee-card rounded-2xl rounded-bl-sm">
              <TypingDots />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* ── Suggestion chips (first message only) ── */}
      {messages.length === 1 && (
        <div className="px-3 sm:px-6 pb-3 flex flex-wrap gap-2 flex-shrink-0">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setInput(s)}
              className="px-2 py-1.5 sm:px-3 sm:py-1.5 rounded-full border border-[#bfdbfe] bg-[#eff6ff] text-[#1a3c6e] text-xs
                         font-medium hover:bg-[#1a3c6e]/10 hover:border-[#1a3c6e]/40 transition-all"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* ── Input bar ── */}
      <div className="px-3 sm:px-6 py-3 sm:py-4 border-t border-white/[0.07] bg-card flex gap-2 sm:gap-3 items-center flex-shrink-0">
        <input
          className="flex-1 bg-surface border border-white/10 rounded-xl px-3 py-2 sm:px-4 sm:py-3 text-sm
                     text-[#1c1c1a] placeholder:text-[#4b5563] focus:outline-none focus:border-brand transition-colors"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder={
            lang === "hi"
              ? "अपना प्रश्न यहाँ लिखें..."
              : "Ask any CBSE Class 10 Science question..."
          }
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-white
                     bg-gradient-to-br from-brand to-violet-600 disabled:opacity-40
                     disabled:cursor-not-allowed hover:opacity-90 transition-opacity flex-shrink-0"
        >
          {loading ? <Spinner size={14} /> : <span className="text-lg">↑</span>}
        </button>
      </div>
    </div>
  );
}
