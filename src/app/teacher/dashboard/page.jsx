"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { MetricCard, ProgressBar, PageHeader } from "@/components/ui";

const LEVEL_STYLE = {
  high:   { bg: "rgba(239,68,68,0.12)",   color: "#f87171", label: "🔴 High" },
  medium: { bg: "rgba(245,158,11,0.12)",  color: "#fbbf24", label: "🟡 Medium" },
  low:    { bg: "rgba(16,185,129,0.12)",  color: "#34d399", label: "🟢 Low" },
};

export default function DashboardPage() {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/erp/struggle-signals")
      .then(({ data }) => setSignals(data.signals))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalFlagged = signals.reduce((s, t) => s + t.flagged, 0);

  return (
    <div className="p-7">
      <PageHeader
        title="Struggle Signals"
        subtitle="Class 10-A · Science · AI-powered live monitoring"
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-500 text-xs">Live · updated 2 min ago</span>
        </div>
      </PageHeader>

      {/* Metrics */}
      <div className="grid grid-cols-4 gap-4 mb-7">
        <MetricCard icon="👥" label="Total Students" value={38}        color="#5B7FFF"  bg="rgba(91,127,255,0.12)" />
        <MetricCard icon="🔴" label="Need Help"      value={loading ? "…" : totalFlagged} color="#f87171"  bg="rgba(239,68,68,0.12)" />
        <MetricCard icon="🟡" label="At Risk"        value={8}         color="#fbbf24"  bg="rgba(245,158,11,0.12)" />
        <MetricCard icon="🟢" label="On Track"       value={5}         color="#34d399"  bg="rgba(16,185,129,0.12)" />
      </div>

      {/* Table */}
      <div className="ee-card overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.07] flex items-center justify-between">
          <h2 className="font-display font-bold text-slate-200 text-base">Topics by Struggle Level</h2>
          <span className="text-slate-500 text-xs">Ranked by % flagging difficulty</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40 text-slate-500 text-sm">Loading signals…</div>
        ) : (
          signals.map((item, i) => {
            const info = LEVEL_STYLE[item.level];
            const pct  = Math.round((item.flagged / item.total) * 100);
            return (
              <div
                key={i}
                className="px-5 py-4 border-b border-white/[0.05] last:border-0 flex gap-4 items-start hover:bg-white/[0.02] transition-colors"
              >
                <span className="text-xl flex-shrink-0 mt-0.5">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  {/* Row 1: topic + level + trend */}
                  <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-200 font-semibold text-sm">{item.topic}</span>
                      <span className="text-slate-600 text-xs">{item.chapter}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-slate-500 text-xs">{item.flagged}/{item.total}</span>
                      <span
                        className="pill text-xs font-bold"
                        style={{ background: info.bg, color: info.color }}
                      >
                        {info.label}
                      </span>
                      <span
                        className="text-xs font-bold min-w-[28px] text-right"
                        style={{ color: item.trend.startsWith("+") ? "#f87171" : item.trend === "0" ? "#64748b" : "#34d399" }}
                      >
                        {item.trend}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="flex items-center gap-3 mb-2.5">
                    <ProgressBar value={pct} color={info.color} className="flex-1" />
                    <span className="text-xs font-bold text-slate-300 min-w-[32px] text-right">{pct}%</span>
                  </div>

                  {/* Student pills */}
                  <div className="flex flex-wrap gap-1.5">
                    {item.students.slice(0, 6).map((s, j) => (
                      <span
                        key={j}
                        className="text-[11px] text-slate-400 bg-surface border border-white/[0.07] px-2 py-0.5 rounded-full"
                      >
                        {s}
                      </span>
                    ))}
                    {item.students.length > 6 && (
                      <span className="text-[11px] text-brand font-semibold">
                        +{item.students.length - 6} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
