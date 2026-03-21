"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Avatar, ProgressBar, PageHeader } from "@/components/ui";

const STATUS = {
  P: { bg: "rgba(16,185,129,0.12)",  color: "#166534", label: "Present" },
  A: { bg: "rgba(239,68,68,0.12)",   color: "#991b1b", label: "Absent"  },
  L: { bg: "rgba(245,158,11,0.12)",  color: "#92400e", label: "Late"    },
};

const AVATAR_COLORS = [
  "#5B7FFF","#10B981","#F59E0B","#EF4444","#8B5CF6",
  "#06B6D4","#F97316","#84CC16","#EC4899","#14B8A6",
  "#3B82F6","#A78BFA","#D946EF","#0EA5E9","#22D3EE",
];

export default function AttendancePage() {
  const [students, setStudents] = useState([]);
  const [summary,  setSummary]  = useState({});
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    api.get("/api/erp/attendance")
      .then(({ data }) => { setStudents(data.students); setSummary(data.summary); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const today = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });

  return (
    <div className="p-3 sm:p-7">
      <PageHeader title="Attendance Register" subtitle={`Class 10-A · ${today} · ERP View`}>
        {Object.keys(summary).length > 0 && (
          <div className="flex gap-1 sm:gap-2 flex-wrap">
            {[
              [summary.present, "Present", "#34d399", "rgba(16,185,129,0.12)"],
              [summary.absent,  "Absent",  "#f87171", "rgba(239,68,68,0.12)"],
              [summary.late,    "Late",    "#fbbf24", "rgba(245,158,11,0.12)"],
            ].map(([val, label, c, bg]) => (
              <div key={label} className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg" style={{ background: bg }}>
                <span className="font-display font-black text-lg" style={{ color: c }}>{val}</span>
                <span className="text-xs font-normal" style={{ color: c }}>{label}</span>
              </div>
            ))}
          </div>
        )}
      </PageHeader>

      <div className="ee-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-40 sm:h-52 text-slate-500 text-sm">Loading attendance…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="bg-[#374151] border-b border-white/[0.07]">
                  {["Roll No.", "Student", "Today", "Monthly %", "Risk"].map((h) => (
                    <th key={h} className="px-2 sm:px-4 py-3 text-left text-[10px] sm:text-[11px] font-bold text-white uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map((s, i) => {
                  const si = STATUS[s.today] || STATUS.P;
                  const riskColor = s.monthly >= 85 ? "#34d399" : s.monthly >= 75 ? "#fbbf24" : "#f87171";
                  const riskBg    = s.monthly >= 85 ? "rgba(16,185,129,0.12)" : s.monthly >= 75 ? "rgba(245,158,11,0.12)" : "rgba(239,68,68,0.12)";
                  const riskLabel = s.monthly >= 85 ? "Good" : s.monthly >= 75 ? "At Risk" : "Low";

                  return (
                    <tr key={i} className="border-b border-white/[0.05] hover:bg-white/[0.02] transition-colors">
                      <td className="px-2 sm:px-4 py-3 text-[#1c1c1a] text-xs">{s.roll}</td>
                      <td className="px-2 sm:px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <Avatar name={s.name} color={AVATAR_COLORS[i % AVATAR_COLORS.length]} size={28} />
                          <span className="text-[#1c1c1a] text-sm font-medium truncate max-w-[100px] sm:max-w-none">{s.name}</span>
                        </div>
                      </td>
                      <td className="px-2 sm:px-4 py-3">
                        <span className="pill text-xs font-bold" style={{ background: si.bg, color: si.color }}>
                          {si.label}
                        </span>
                      </td>
                      <td className="px-2 sm:px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <ProgressBar value={s.monthly} color={riskColor} className="w-12 sm:w-16" />
                          <span className="font-semibold text-[#1c1c1a] text-xs min-w-[28px] sm:min-w-[32px] text-right">{s.monthly}%</span>
                        </div>
                      </td>
                      <td className="px-2 sm:px-4 py-3">
                        <span className="pill text-xs font-bold" style={{ background: riskBg, color: riskColor }}>
                          {riskLabel}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
