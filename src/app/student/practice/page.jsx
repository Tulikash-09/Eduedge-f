"use client";
import { useState, useEffect, useRef } from "react";
import api from "@/lib/api";
import { PageHeader, Spinner, ProgressBar } from "@/components/ui";

const TOPICS = [
  { id: "acids", label: "Acids, Bases & Salts", chapter: "Ch.2", icon: "🧪" },
  { id: "electricity", label: "Electricity", chapter: "Ch.12", icon: "⚡" },
  { id: "light", label: "Light — Reflection & Refraction", chapter: "Ch.10", icon: "💡" },
  { id: "chemical", label: "Chemical Reactions", chapter: "Ch.1", icon: "⚗️" },
  { id: "life", label: "Life Processes", chapter: "Ch.6", icon: "🌱" },
];

const TOPIC_API_MAP = {
  acids: "Acids, Bases and Salts",
  electricity: "Electricity",
  light: "Light",
  chemical: "Acids, Bases and Salts", // fallback — expand in backend later
  life: "Acids, Bases and Salts",
};

const TIMED_SECONDS = 10 * 60; // 10 minutes per session

// ── Helpers for local weak-topic tracking ──────────────────────────────────
const STORAGE_KEY = "ee_weak_topics";

function loadWeakTopics() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveWeakTopics(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

function updateWeakTopics(topicId, correct, total) {
  const weak = loadWeakTopics();
  const prev = weak[topicId] || { correct: 0, total: 0, attempts: 0 };
  weak[topicId] = {
    correct: prev.correct + correct,
    total: prev.total + total,
    attempts: prev.attempts + 1,
    lastAttempt: Date.now(),
  };
  saveWeakTopics(weak);
  return weak;
}

// ── Main component ──────────────────────────────────────────────────────────
export default function PracticePage() {
  const [screen, setScreen] = useState("select"); // select | quiz | results
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [timedMode, setTimedMode] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIMED_SECONDS);
  const [weakTopics, setWeakTopics] = useState({});
  const timerRef = useRef(null);

  useEffect(() => {
    setWeakTopics(loadWeakTopics());
  }, []);

  // Countdown timer
  useEffect(() => {
    if (screen === "quiz" && timedMode && !submitted) {
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            handleSubmit();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [screen, timedMode, submitted]);

  const startQuiz = async () => {
    if (!selectedTopic) return;
    setLoading(true);
    try {
      const apiTopic = TOPIC_API_MAP[selectedTopic.id];
      const { data } = await api.post("/api/ai/generate-questions", { topic: apiTopic });
      setQuestions(data.questions);
      setAnswers({});
      setSubmitted(false);
      setTimeLeft(TIMED_SECONDS);
      setScreen("quiz");
    } catch {
      alert("Could not load questions. Check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    clearInterval(timerRef.current);
    setSubmitted(true);
    const score = questions.filter((q, i) => answers[i] === q.ans).length;
    const updated = updateWeakTopics(selectedTopic.id, score, questions.length);
    setWeakTopics(updated);
    setScreen("results");
  };

  const allAnswered = questions.length > 0 && Object.keys(answers).length === questions.length;
  const score = questions.filter((q, i) => answers[i] === q.ans).length;
  const pct = questions.length ? Math.round((score / questions.length) * 100) : 0;

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  // ── Topic Selection screen ──────────────────────────────────────────────
  if (screen === "select") {
    return (
      <div className="p-3 sm:p-7">
        <PageHeader
          title="MCQ Practice"
          subtitle="Topic-wise practice with score tracking and weak topic detection"
        />

        {/* Weak topics alert */}
        {Object.keys(weakTopics).length > 0 && (
          <WeakTopicsAlert weakTopics={weakTopics} topics={TOPICS} onSelect={(t) => { setSelectedTopic(t); }} />
        )}

        <p className="text-[#4b5563] text-xs font-bold uppercase tracking-widest mb-3">Choose a Topic</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          {TOPICS.map((t) => {
            const wt = weakTopics[t.id];
            const accuracy = wt ? Math.round((wt.correct / wt.total) * 100) : null;
            const isWeak = accuracy !== null && accuracy < 60;

            return (
              <button
                key={t.id}
                onClick={() => setSelectedTopic(selectedTopic?.id === t.id ? null : t)}
                className={`text-left p-4 rounded-xl border-2 transition-all ${
                  selectedTopic?.id === t.id
                    ? "border-[#0F6E56] bg-[#E1F5EE]"
                    : "border-[#E2E0D8] bg-white hover:border-[#0F6E56]/50"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{t.icon}</span>
                    <div>
                      <p className="font-semibold text-[#1c1c1a] text-sm leading-tight">{t.label}</p>
                      <p className="text-[#6b7280] text-xs">{t.chapter}</p>
                    </div>
                  </div>
                  {isWeak && (
                    <span className="pill pill-red text-[10px] flex-shrink-0 ml-1">Weak</span>
                  )}
                </div>

                {accuracy !== null && (
                  <div className="mt-2">
                    <div className="flex justify-between text-[10px] text-[#6b7280] mb-1">
                      <span>Last accuracy</span>
                      <span className="font-bold" style={{ color: accuracy >= 80 ? "#166534" : accuracy >= 60 ? "#92400e" : "#991b1b" }}>
                        {accuracy}%
                      </span>
                    </div>
                    <ProgressBar
                      value={accuracy}
                      color={accuracy >= 80 ? "#10B981" : accuracy >= 60 ? "#F59E0B" : "#EF4444"}
                    />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Mode + start */}
        {selectedTopic && (
          <div className="ee-card p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div>
              <p className="text-[#1c1c1a] font-semibold text-sm">Selected: <span className="text-[#0F6E56]">{selectedTopic.label}</span></p>
              <p className="text-[#4b5563] text-xs mt-0.5">5 questions · CBSE Class 10</p>
            </div>

            <label className="flex items-center gap-2 cursor-pointer sm:ml-4">
              <div
                onClick={() => setTimedMode((v) => !v)}
                className="relative w-10 h-6 rounded-full transition-colors cursor-pointer"
                style={{ background: timedMode ? "#F59E0B" : "#D1D5DB" }}
              >
                <div
                  className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all"
                  style={{ left: timedMode ? 18 : 2 }}
                />
              </div>
              <span className="text-[#374151] text-sm">Timed Mode (10 min)</span>
            </label>

            <button
              onClick={startQuiz}
              disabled={loading}
              className="btn-brand flex items-center gap-2 sm:ml-auto"
            >
              {loading ? <Spinner size={15} /> : "▶"}
              {loading ? "Loading…" : "Start Practice"}
            </button>
          </div>
        )}
      </div>
    );
  }

  // ── Quiz screen ─────────────────────────────────────────────────────────
  if (screen === "quiz") {
    const progressPct = (Object.keys(answers).length / questions.length) * 100;

    return (
      <div className="p-3 sm:p-7">
        {/* Header with timer */}
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{selectedTopic.icon}</span>
              <h1 className="font-display text-[18px] font-extrabold text-[#1c1c1a]">{selectedTopic.label}</h1>
            </div>
            <p className="text-[#4b5563] text-sm">
              {Object.keys(answers).length} of {questions.length} answered
            </p>
          </div>

          <div className="flex items-center gap-3">
            {timedMode && (
              <div
                className={`font-display font-black text-2xl tabular-nums px-4 py-2 rounded-xl border-2 ${
                  timeLeft < 60
                    ? "text-[#991b1b] bg-[#fee2e2] border-[#fca5a5]"
                    : timeLeft < 180
                    ? "text-[#92400e] bg-[#fef3c7] border-[#fcd34d]"
                    : "text-[#1c1c1a] bg-[#f3f4f6] border-[#D1D5DB]"
                }`}
              >
                ⏱ {formatTime(timeLeft)}
              </div>
            )}
            <button
              onClick={() => { clearInterval(timerRef.current); setScreen("select"); }}
              className="text-[#4b5563] text-xs hover:text-[#1c1c1a] transition-colors"
            >
              ✕ Exit
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-5">
          <ProgressBar value={progressPct} color="#0F6E56" />
        </div>

        {/* Questions */}
        <div className="flex flex-col gap-4 mb-6">
          {questions.map((q, qi) => (
            <QuestionCard
              key={qi}
              question={q}
              index={qi}
              selected={answers[qi]}
              submitted={false}
              onSelect={(ai) => setAnswers((a) => ({ ...a, [qi]: ai }))}
            />
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!allAnswered}
          className="btn-brand w-full sm:w-auto disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Submit Answers →
        </button>
        {!allAnswered && (
          <p className="text-[#6b7280] text-xs mt-2">
            Answer all {questions.length} questions to submit
          </p>
        )}
      </div>
    );
  }

  // ── Results screen ───────────────────────────────────────────────────────
  if (screen === "results") {
    const isStrong = pct >= 80;
    const isMedium = pct >= 60 && pct < 80;
    const isWeak = pct < 60;
    const resultColor = isStrong ? "#166534" : isMedium ? "#92400e" : "#991b1b";
    const resultBg = isStrong ? "rgba(16,185,129,0.1)" : isMedium ? "rgba(245,158,11,0.1)" : "rgba(239,68,68,0.1)";
    const resultEmoji = isStrong ? "🎉" : isMedium ? "👍" : "📚";
    const resultMsg = isStrong ? "Excellent work!" : isMedium ? "Good effort — keep going!" : "Needs more revision";

    const wt = weakTopics[selectedTopic.id];
    const allTimeAccuracy = wt ? Math.round((wt.correct / wt.total) * 100) : pct;

    return (
      <div className="p-3 sm:p-7">
        <PageHeader title="Practice Results" subtitle={`${selectedTopic.icon} ${selectedTopic.label}`} />

        {/* Score card */}
        <div className="ee-card p-5 mb-5" style={{ borderTop: `4px solid ${resultColor}` }}>
          <div className="flex items-center gap-4 flex-wrap">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: resultBg }}
            >
              <span className="font-display font-black text-3xl" style={{ color: resultColor }}>{pct}%</span>
            </div>
            <div>
              <p className="font-display font-bold text-[#1c1c1a] text-xl">{resultEmoji} {resultMsg}</p>
              <p className="text-[#4b5563] text-sm mt-1">
                {score} correct out of {questions.length} questions
              </p>
              {wt && wt.attempts > 1 && (
                <p className="text-[#6b7280] text-xs mt-1">
                  All-time accuracy on this topic: <strong style={{ color: resultColor }}>{allTimeAccuracy}%</strong> ({wt.attempts} attempts)
                </p>
              )}
            </div>
          </div>

          {isWeak && (
            <div className="mt-4 flex items-start gap-2 bg-[#fee2e2] rounded-lg px-3 py-2.5">
              <span className="text-base flex-shrink-0">⚠️</span>
              <p className="text-[#991b1b] text-xs">
                This topic is flagged as <strong>weak</strong>. It will appear in your spaced repetition schedule for extra revision before your next exam.
              </p>
            </div>
          )}
        </div>

        {/* Review answers */}
        <p className="text-[#4b5563] text-xs font-bold uppercase tracking-widest mb-3">Review Answers</p>
        <div className="flex flex-col gap-3 mb-6">
          {questions.map((q, qi) => (
            <QuestionCard
              key={qi}
              question={q}
              index={qi}
              selected={answers[qi]}
              submitted={true}
              onSelect={() => {}}
            />
          ))}
        </div>

        {/* Spaced repetition nudge */}
        <div className="ee-card p-4 flex gap-3 items-start mb-5">
          <span className="text-xl flex-shrink-0">📅</span>
          <div>
            <p className="font-display font-bold text-[#1c1c1a] text-sm">Added to Revision Schedule</p>
            <p className="text-[#374151] text-xs mt-1">
              {isStrong
                ? `Great score! ${selectedTopic.label} will next appear in your flashcard deck in 7 days (SM-2 spacing).`
                : isWeak
                ? `Low score detected. ${selectedTopic.label} will appear in your flashcard deck tomorrow and every 2 days until accuracy improves.`
                : `${selectedTopic.label} scheduled for revision in 3 days.`}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => { setAnswers({}); setSubmitted(false); startQuiz(); }}
            className="btn-outline"
          >
            🔄 Retry This Topic
          </button>
          <button
            onClick={() => { setScreen("select"); setSelectedTopic(null); }}
            className="btn-brand"
          >
            ← Back to Topics
          </button>
        </div>
      </div>
    );
  }

  return null;
}

// ── Question Card component ────────────────────────────────────────────────
function QuestionCard({ question, index, selected, submitted, onSelect }) {
  return (
    <div className="ee-card p-4">
      <div className="flex gap-3 items-start">
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
          style={{
            background: submitted
              ? (selected === question.ans ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.12)")
              : "rgba(91,127,255,0.12)",
            color: submitted
              ? (selected === question.ans ? "#166534" : "#991b1b")
              : "#1a3c6e",
          }}
        >
          Q{index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[#1c1c1a] font-medium text-sm mb-3 leading-relaxed">{question.q}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {question.opts.map((opt, oi) => {
              const isSel = selected === oi;
              const isRight = submitted && oi === question.ans;
              const isWrong = submitted && isSel && oi !== question.ans;
              const isMissed = submitted && !isSel && oi === question.ans;

              return (
                <button
                  key={oi}
                  onClick={() => !submitted && onSelect(oi)}
                  disabled={submitted}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border text-left text-sm transition-all"
                  style={{
                    borderColor: isRight || isMissed ? "#10B981" : isWrong ? "#EF4444" : isSel ? "#0F6E56" : "#E2E0D8",
                    background: isRight || isMissed ? "rgba(16,185,129,0.10)" : isWrong ? "rgba(239,68,68,0.10)" : isSel ? "rgba(15,110,86,0.08)" : "#fafaf9",
                  }}
                >
                  <div
                    className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 text-[10px] text-white"
                    style={{
                      borderColor: isSel ? "#0F6E56" : "#D1D5DB",
                      background: isSel ? "#0F6E56" : "transparent",
                    }}
                  >
                    {isSel && !submitted && "✓"}
                    {isRight && "✓"}
                    {isWrong && "✗"}
                  </div>
                  <span className="text-[#374151] text-xs">
                    {String.fromCharCode(65 + oi)}. {opt}
                  </span>
                  {isMissed && (
                    <span className="text-[10px] text-[#166534] font-bold ml-auto flex-shrink-0">Correct</span>
                  )}
                </button>
              );
            })}
          </div>
          {submitted && (
            <p className="text-xs text-[#4b5563] mt-2">
              {selected === question.ans
                ? "✅ Correct!"
                : `❌ Incorrect — correct answer: ${String.fromCharCode(65 + question.ans)}. ${question.opts[question.ans]}`}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Weak Topics Alert ───────────────────────────────────────────────────────
function WeakTopicsAlert({ weakTopics, topics, onSelect }) {
  const weakList = topics.filter((t) => {
    const wt = weakTopics[t.id];
    return wt && Math.round((wt.correct / wt.total) * 100) < 60;
  });

  if (weakList.length === 0) return null;

  return (
    <div className="rounded-xl border border-[#fca5a5] bg-[#fff1f1] p-4 mb-5">
      <div className="flex items-start gap-2">
        <span className="text-lg flex-shrink-0">⚠️</span>
        <div>
          <p className="text-[#991b1b] font-bold text-sm mb-1">Weak Topics Detected</p>
          <p className="text-[#374151] text-xs mb-3">
            Based on your practice history, these topics need more attention:
          </p>
          <div className="flex flex-wrap gap-2">
            {weakList.map((t) => (
              <button
                key={t.id}
                onClick={() => onSelect(t)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#fca5a5] text-[#991b1b] text-xs font-semibold hover:bg-[#fee2e2] transition-colors"
              >
                {t.icon} {t.label}
                <span className="text-[10px] opacity-70">
                  ({Math.round((weakTopics[t.id].correct / weakTopics[t.id].total) * 100)}%)
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}