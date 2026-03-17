"use client";
import { PageHeader, ProgressBar } from "@/components/ui";

const CAREERS = [
  {
    title: "Chartered Accountant",
    icon: "📊",
    duration: "5 yrs · CA Foundation → Intermediate → Final",
    salary: "₹6 – 25 LPA",
    skills: ["Financial Analysis", "Tax Law", "Audit", "Tally ERP"],
    color: "#5B7FFF",
    match: 94,
    desc: "High demand across all industries. ICAI qualification is globally recognised.",
  },
  {
    title: "Business Analyst",
    icon: "📈",
    duration: "4 yrs · B.Com + MBA",
    salary: "₹5 – 18 LPA",
    skills: ["Excel", "SQL", "Power BI", "Communication"],
    color: "#10B981",
    match: 87,
    desc: "Bridge between business and technology. Fast-growing role in BFSI and IT sectors.",
  },
  {
    title: "Digital Marketing",
    icon: "📱",
    duration: "3 yrs · BBA + Certifications",
    salary: "₹4 – 15 LPA",
    skills: ["SEO / SEM", "Analytics", "Content Strategy", "Social Media"],
    color: "#F59E0B",
    match: 82,
    desc: "Fastest growing field. Google & Meta certifications can fast-track your career.",
  },
  {
    title: "Investment Banker",
    icon: "🏦",
    duration: "6 yrs · B.Com + MBA Finance",
    salary: "₹10 – 50 LPA",
    skills: ["Fin. Modeling", "Valuation", "Excel", "CFA (optional)"],
    color: "#EF4444",
    match: 76,
    desc: "Highly competitive but very rewarding. Top IIMs and IITs are preferred pipelines.",
  },
];

export default function CareerPage() {
  return (
    <div className="p-7">
      <PageHeader
        title="Career Intelligence"
        subtitle="AI-matched career paths · Commerce Stream · Based on Class 10 profile"
      >
        <span className="pill pill-violet">Static Demo</span>
      </PageHeader>

      <div className="grid grid-cols-2 gap-5">
        {CAREERS.map((c, i) => (
          <div
            key={i}
            className="ee-card p-5 flex flex-col gap-4 hover:-translate-y-1 transition-transform duration-200"
            style={{ borderTop: `3px solid ${c.color}` }}
          >
            {/* Title row */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{c.icon}</span>
                <div>
                  <p className="font-display font-bold text-slate-100 text-sm">{c.title}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{c.duration}</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-2">
                <p className="font-display font-black text-xl" style={{ color: c.color }}>{c.match}%</p>
                <p className="text-slate-600 text-[10px]">match</p>
              </div>
            </div>

            {/* Match bar */}
            <ProgressBar value={c.match} color={c.color} />

            {/* Description */}
            <p className="text-slate-400 text-xs leading-relaxed">{c.desc}</p>

            {/* Skills */}
            <div className="flex flex-wrap gap-1.5">
              {c.skills.map((s, j) => (
                <span
                  key={j}
                  className="text-[11px] px-2.5 py-0.5 rounded-full font-semibold"
                  style={{ background: `${c.color}18`, color: c.color }}
                >
                  {s}
                </span>
              ))}
            </div>

            {/* Salary */}
            <div className="flex items-center justify-between bg-surface rounded-lg px-3 py-2 border border-white/[0.07]">
              <span className="text-slate-500 text-xs">Average Salary</span>
              <span className="font-display font-bold text-slate-200 text-sm">{c.salary}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
