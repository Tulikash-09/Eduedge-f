"use client";
import { useState } from "react";
import api from "@/lib/api";
import { PageHeader, Spinner } from "@/components/ui";

const TOPICS = ["Acids, Bases and Salts", "Electricity", "Light"];

export default function AssessmentsPage() {
  const [topic,     setTopic]     = useState(TOPICS[0]);
  const [questions, setQuestions] = useState(null);
  const [loading,   setLoading]   = useState(false);
  const [selected,  setSelected]  = useState({});
  const [submitted, setSubmitted] = useState(false);

  const generate = async () => {
    setLoading(true);
    setSelected({});
    setSubmitted(false);
    try {
      const { data } = await api.post("/api/ai/generate-questions", { topic });
      setQuestions(data.questions);
    } catch {
      alert("Could not generate questions. Check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  const score = questions
    ? Object.entries(selected).filter(([qi, ai]) => questions[+qi].ans === +ai).length
    : 0;

  return (
    <div className="p-7">
      <PageHeader title="Assessment Creator" subtitle="Generate a 5-question quiz · Preview as a student">
        <span className="pill pill-violet">AI-Generated</span>
      </PageHeader>

      {/* Topic selector */}
      <div className="ee-card p-5 mb-6">
        <p className="text-slate-400 text-sm font-semibold mb-3">Select Topic</p>
        <div className="flex gap-3 flex-wrap mb-4">
          {TOPICS.map((t) => (
            <button
              key={t}
              onClick={() => { setTopic(t); setQuestions(null); setSelected({}); setSubmitted(false); }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${
                topic === t
                  ? "bg-brand/15 border-brand text-brand"
                  : "border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-300"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <button
          onClick={generate}
          disabled={loading}
          className="btn-brand flex items-center gap-2"
        >
          {loading ? <Spinner size={15} /> : "✨"}
          {loading ? "Generating…" : "Generate 5 Questions"}
        </button>
      </div>

      {/* Questions */}
      {questions && (
        <>
          <div className="flex flex-col gap-4 mb-5">
            {questions.map((q, qi) => (
              <div key={qi} className="ee-card p-5">
                <div className="flex gap-3 items-start">
                  <div className="w-7 h-7 rounded-full bg-brand/15 flex items-center justify-center text-brand text-xs font-bold flex-shrink-0 mt-0.5">
                    Q{qi + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-200 font-semibold text-sm mb-3">{q.q}</p>
                    <div className="grid grid-cols-2 gap-2.5">
                      {q.opts.map((opt, oi) => {
                        const isSel    = selected[qi] === oi;
                        const isRight  = submitted && oi === q.ans;
                        const isWrong  = submitted && isSel && oi !== q.ans;
                        return (
                          <button
                            key={oi}
                            onClick={() => !submitted && setSelected((s) => ({ ...s, [qi]: oi }))}
                            disabled={submitted}
                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border text-left text-sm transition-all"
                            style={{
                              borderColor: isRight ? "#10B981" : isWrong ? "#EF4444" : isSel ? "#5B7FFF" : "rgba(255,255,255,0.08)",
                              background: isRight ? "rgba(16,185,129,0.12)" : isWrong ? "rgba(239,68,68,0.12)" : isSel ? "rgba(91,127,255,0.12)" : "#182035",
                            }}
                          >
                            <div
                              className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 text-[10px] text-white"
                              style={{
                                borderColor: isSel ? "#5B7FFF" : "rgba(255,255,255,0.2)",
                                background: isSel ? "#5B7FFF" : "transparent",
                              }}
                            >
                              {isSel ? "✓" : ""}
                            </div>
                            <span className="text-slate-300 text-xs">
                              {String.fromCharCode(65 + oi)}. {opt}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {!submitted ? (
            <div className="flex gap-3">
              <button onClick={() => setSubmitted(true)} className="btn-brand">
                Preview as Student →
              </button>
              <button className="btn-outline">Share with Class 10-A</button>
            </div>
          ) : (
            <div className="p-5 rounded-xl border border-emerald-500/25 bg-emerald-500/10">
              <p className="font-display font-bold text-emerald-400 text-lg">
                Score: {score} / {questions.length}
                {score === questions.length ? " — Perfect! 🎉" : score >= 3 ? " — Good job 👍" : " — Needs revision 📚"}
              </p>
              <p className="text-emerald-600 text-sm mt-1">
                Assessment preview complete. Ready to publish to Class 10-A.
              </p>
              <button
                onClick={() => { setSubmitted(false); setSelected({}); }}
                className="mt-3 text-sm text-emerald-400 underline hover:text-emerald-300"
              >
                Reset & try again
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
