"use client";
import { useState } from "react";
import api from "@/lib/api";
import { PageHeader, Spinner } from "@/components/ui";

const CLASSES = ["10-A", "10-B", "9-A", "9-B", "8-A"];
const DURATIONS = ["30 min", "45 min", "60 min", "75 min", "90 min"];
const TOPICS = [
  "Chemical Reactions and Equations",
  "Acids, Bases and Salts",
  "Metals and Non-metals",
  "Carbon and its Compounds",
  "Life Processes",
  "Control and Coordination",
  "How do Organisms Reproduce?",
  "Heredity and Evolution",
  "Light — Reflection and Refraction",
  "Human Eye and Colourful World",
  "Electricity",
  "Magnetic Effects of Electric Current",
  "Our Environment",
];

const PACING = {
  "10-A": "Advanced — push beyond textbook with application questions",
  "10-B": "Standard — follow textbook sequence, more worked examples",
  "9-A": "Advanced",
  "9-B": "Standard",
  "8-A": "Standard",
};

export default function LessonGeneratorPage() {
  const [topic, setTopic] = useState(TOPICS[1]);
  const [selectedClass, setSelectedClass] = useState("10-A");
  const [duration, setDuration] = useState("45 min");
  const [includeWorksheet, setIncludeWorksheet] = useState(true);
  const [lessonPlan, setLessonPlan] = useState(null);
  const [worksheet, setWorksheet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("plan");

  const generate = async () => {
    setLoading(true);
    setLessonPlan(null);
    setWorksheet(null);
    try {
      const { data } = await api.post("/api/ai/lesson-plan", {
        topic,
        class: selectedClass,
        duration,
        pacing: PACING[selectedClass],
        includeWorksheet,
      });
      setLessonPlan(data.lessonPlan);
      if (data.worksheet) setWorksheet(data.worksheet);
      setActiveTab("plan");
    } catch {
      alert("Could not generate lesson plan. Check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    const printContent = activeTab === "plan" ? lessonPlan : worksheet;
    const title = activeTab === "plan"
      ? `Lesson Plan — ${topic} — ${selectedClass}`
      : `Worksheet — ${topic} — ${selectedClass}`;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body {
              font-family: 'Georgia', serif;
              font-size: 13px;
              line-height: 1.7;
              color: #1a1a1a;
              padding: 32px 40px;
              max-width: 760px;
              margin: 0 auto;
            }
            .print-header {
              border-bottom: 2px solid #1B2A4A;
              padding-bottom: 12px;
              margin-bottom: 20px;
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
            }
            .print-header h1 { font-size: 18px; color: #1B2A4A; }
            .print-header .meta { font-size: 11px; color: #555; text-align: right; line-height: 1.5; }
            .eduedge-brand { font-size: 11px; font-weight: bold; color: #0F6E56; letter-spacing: 0.5px; }
            h2 { font-size: 14px; color: #1B2A4A; margin: 18px 0 6px; border-left: 3px solid #0F6E56; padding-left: 8px; }
            h3 { font-size: 13px; color: #333; margin: 12px 0 4px; font-weight: bold; }
            p { margin-bottom: 6px; }
            ul, ol { margin-left: 20px; margin-bottom: 8px; }
            li { margin-bottom: 3px; }
            .section { margin-bottom: 16px; }
            .timing-badge {
              display: inline-block;
              background: #E1F5EE;
              color: #0F6E56;
              font-size: 10px;
              font-weight: bold;
              padding: 1px 6px;
              border-radius: 10px;
              margin-left: 6px;
            }
            .answer-line {
              border-bottom: 1px solid #ccc;
              width: 100%;
              display: block;
              margin: 6px 0 14px;
              height: 22px;
            }
            .blank { display: inline-block; border-bottom: 1px solid #333; min-width: 80px; }
            @media print {
              body { padding: 16px 20px; }
            }
          </style>
        </head>
        <body>
          <div class="print-header">
            <div>
              <div class="eduedge-brand">🎓 EduEdge</div>
              <h1>${title}</h1>
            </div>
            <div class="meta">
              Class: ${selectedClass} &nbsp;|&nbsp; Duration: ${duration}<br/>
              Pacing: ${PACING[selectedClass].split("—")[0].trim()}<br/>
              Generated: ${new Date().toLocaleDateString("en-IN")}
            </div>
          </div>
          <div>${renderForPrint(printContent)}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="p-3 sm:p-7">
      <PageHeader
        title="Lesson Plan Generator"
        subtitle="AI-generated lesson plans and worksheets — customised per class"
      >
        <span className="pill pill-green">Teacher Co-Pilot</span>
      </PageHeader>

      {/* Config panel */}
      <div className="ee-card p-4 sm:p-5 mb-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Topic */}
          <div className="lg:col-span-2">
            <label className="block text-[#4b5563] text-xs font-bold mb-2 uppercase tracking-wide">Topic</label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-white border border-[#D1D5DB] rounded-lg px-3 py-2.5 text-[#1c1c1a] text-sm focus:outline-none focus:border-[#0F6E56] focus:ring-1 focus:ring-[#0F6E56] transition-colors"
            >
              {TOPICS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Class */}
          <div>
            <label className="block text-[#4b5563] text-xs font-bold mb-2 uppercase tracking-wide">Class</label>
            <div className="flex flex-wrap gap-1.5">
              {CLASSES.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedClass(c)}
                  className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all ${
                    selectedClass === c
                      ? "bg-[#1B2A4A] text-white border-transparent"
                      : "border-[#D1D5DB] text-[#374151] bg-white hover:border-[#1B2A4A]"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-[#4b5563] text-xs font-bold mb-2 uppercase tracking-wide">Duration</label>
            <div className="flex flex-wrap gap-1.5">
              {DURATIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all ${
                    duration === d
                      ? "bg-[#0F6E56] text-white border-transparent"
                      : "border-[#D1D5DB] text-[#374151] bg-white hover:border-[#0F6E56]"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Pacing note */}
        <div className="flex items-start gap-2 bg-[#E1F5EE] rounded-lg px-3 py-2.5 mb-4">
          <span className="text-base flex-shrink-0">⚙️</span>
          <div>
            <span className="text-[#0F6E56] text-xs font-bold">{selectedClass} Pacing:</span>
            <span className="text-[#374151] text-xs ml-1">{PACING[selectedClass]}</span>
          </div>
        </div>

        {/* Options row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5">
          <label className="flex items-center gap-2 cursor-pointer">
            <div
              onClick={() => setIncludeWorksheet((v) => !v)}
              className="relative w-10 h-6 rounded-full transition-colors cursor-pointer"
              style={{ background: includeWorksheet ? "#0F6E56" : "#D1D5DB" }}
            >
              <div
                className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all"
                style={{ left: includeWorksheet ? 18 : 2 }}
              />
            </div>
            <span className="text-[#374151] text-sm font-medium">Generate worksheet / handout</span>
          </label>

          <button
            onClick={generate}
            disabled={loading}
            className="btn-brand flex items-center gap-2 sm:ml-auto"
          >
            {loading ? <Spinner size={15} /> : "✨"}
            {loading ? "Generating…" : "Generate Lesson Plan"}
          </button>
        </div>
      </div>

      {/* Output */}
      {lessonPlan && (
        <div className="ee-card overflow-hidden">
          {/* Tab bar + print button */}
          <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-white/[0.07] bg-[#fafaf9]">
            <div className="flex gap-1">
              <button
                onClick={() => setActiveTab("plan")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "plan"
                    ? "bg-[#1B2A4A] text-white"
                    : "text-[#4b5563] hover:bg-white"
                }`}
              >
                📋 Lesson Plan
              </button>
              {worksheet && (
                <button
                  onClick={() => setActiveTab("worksheet")}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    activeTab === "worksheet"
                      ? "bg-[#0F6E56] text-white"
                      : "text-[#4b5563] hover:bg-white"
                  }`}
                >
                  📄 Worksheet
                </button>
              )}
            </div>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#D1D5DB] text-[#374151] text-xs font-semibold hover:bg-white transition-colors"
            >
              🖨️ Print / Save PDF
            </button>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 prose-lesson">
            <LessonOutput content={activeTab === "plan" ? lessonPlan : worksheet} />
          </div>
        </div>
      )}
    </div>
  );
}

// Renders the lesson plan / worksheet as structured JSX
function LessonOutput({ content }) {
  if (!content) return null;
  // Split on double newlines for sections, render with basic formatting
  const lines = content.split("\n");
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        if (line.startsWith("## ")) {
          return (
            <h2 key={i} className="font-display font-bold text-[#1B2A4A] text-base mt-5 mb-2 border-l-[3px] border-[#0F6E56] pl-3">
              {line.replace("## ", "")}
            </h2>
          );
        }
        if (line.startsWith("### ")) {
          return (
            <h3 key={i} className="font-semibold text-[#1c1c1a] text-sm mt-3 mb-1">
              {line.replace("### ", "")}
            </h3>
          );
        }
        if (line.startsWith("**") && line.endsWith("**")) {
          return (
            <p key={i} className="font-bold text-[#1c1c1a] text-sm">
              {line.replaceAll("**", "")}
            </p>
          );
        }
        if (line.startsWith("- ") || line.startsWith("• ")) {
          return (
            <li key={i} className="text-[#374151] text-sm ml-4 list-disc">
              {line.replace(/^[-•]\s/, "")}
            </li>
          );
        }
        if (line.match(/^\d+\.\s/)) {
          return (
            <li key={i} className="text-[#374151] text-sm ml-4 list-decimal">
              {line.replace(/^\d+\.\s/, "")}
            </li>
          );
        }
        if (line.startsWith("⏱") || line.startsWith("🎯") || line.startsWith("📚") || line.startsWith("✅") || line.startsWith("🔑")) {
          return (
            <p key={i} className="text-[#374151] text-sm bg-[#F5F0E8] rounded-lg px-3 py-2 my-1">
              {line}
            </p>
          );
        }
        if (line.trim() === "") return <div key={i} className="h-1" />;
        return (
          <p key={i} className="text-[#374151] text-sm leading-relaxed">
            {line}
          </p>
        );
      })}
    </div>
  );
}

// Converts markdown-ish content to basic HTML for print window
function renderForPrint(content) {
  if (!content) return "";
  return content
    .split("\n")
    .map((line) => {
      if (line.startsWith("## ")) return `<h2>${line.replace("## ", "")}</h2>`;
      if (line.startsWith("### ")) return `<h3>${line.replace("### ", "")}</h3>`;
      if (line.startsWith("**") && line.endsWith("**")) return `<p><strong>${line.replaceAll("**", "")}</strong></p>`;
      if (line.startsWith("- ") || line.startsWith("• ")) return `<ul><li>${line.replace(/^[-•]\s/, "")}</li></ul>`;
      if (line.match(/^\d+\.\s/)) return `<ol><li>${line.replace(/^\d+\.\s/, "")}</li></ol>`;
      if (line.trim() === "") return "<br/>";
      return `<p>${line}</p>`;
    })
    .join("");
}