"use client";
import { PageHeader } from "@/components/ui";

const NOTIFICATIONS = [
  { label: "Weekly Progress Digest",   desc: "Every Sunday, 8:00 AM",            on: true  },
  { label: "Low Attendance Alert",     desc: "Triggered when below 75%",          on: true  },
  { label: "Test Score Notification",  desc: "Sent after each assessment",        on: true  },
  { label: "Tutor Inactivity Alert",   desc: "After 3 days without AI session",   on: false },
];

export default function ParentPage() {
  return (
    <div className="p-7">
      <PageHeader
        title="Parent Digest"
        subtitle="Weekly WhatsApp report sent automatically every Sunday at 8:00 AM"
      >
        <span className="pill pill-amber">Demo Mockup</span>
      </PageHeader>

      <div className="grid grid-cols-2 gap-6">
        {/* WhatsApp mockup */}
        <div>
          <p className="text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-3">
            What Parents Receive
          </p>
          <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ background: "#E5DDD5", maxWidth: 340 }}>
            {/* WA header */}
            <div style={{ background: "#075E54" }} className="px-4 py-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-700 flex items-center justify-center text-lg">🎓</div>
              <div>
                <p className="text-white font-bold text-sm">EduEdge School</p>
                <p className="text-white/60 text-xs">Official Channel · 38 members</p>
              </div>
            </div>

            {/* Messages */}
            <div className="p-3 flex flex-col gap-3">
              <div className="text-center">
                <span className="bg-black/10 text-gray-600 text-xs px-3 py-0.5 rounded-full">
                  Sunday, 9 March 2026
                </span>
              </div>

              {[
                {
                  title: "📊 Weekly Progress Report",
                  body: "Namaste! Here's Arjun's weekly summary:\n\n✅ AI Tutor Sessions: 6\n📚 Topics: Light & Electricity\n⏱️ Learning Time: 2h 40min\n💪 Strongest: Electricity (87%)\n⚠️ Focus Area: Acids & Bases\n\nNext test: Ch. 2 on 14 March",
                  time: "8:02 AM",
                },
                {
                  title: "🏫 Attendance Update",
                  body: "Present all 5 days this week! 🎉\nMonthly attendance: 89%\n(Target: 85%+) — Great work!",
                  time: "8:02 AM",
                },
              ].map((msg, i) => (
                <div key={i} className="bg-white rounded-tl-none rounded-xl p-3 shadow-sm">
                  <p className="font-bold text-xs mb-1.5" style={{ color: "#075E54" }}>{msg.title}</p>
                  <p className="text-gray-800 text-xs leading-relaxed whitespace-pre-wrap">{msg.body}</p>
                  <p className="text-gray-400 text-[10px] text-right mt-1.5">{msg.time} ✓✓</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-3">
              Notification Settings
            </p>
            <div className="ee-card divide-y divide-white/[0.07]">
              {NOTIFICATIONS.map((n, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-4">
                  <div>
                    <p className="text-[#1c1c1a] font-semibold text-sm">{n.label}</p>
                    <p className="text-[#4b5563] text-xs mt-0.5">{n.desc}</p>
                  </div>
                  <div
                    className="relative flex-shrink-0 ml-4 rounded-full transition-colors"
                    style={{ width: 40, height: 22, background: n.on ? "#10B981" : "#374151" }}
                  >
                    <div
                      className="absolute top-0.5 w-[18px] h-[18px] bg-white rounded-full shadow transition-all"
                      style={{ left: n.on ? 20 : 2 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Implementation note */}
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/8 p-4 flex gap-3">
            <span className="text-lg flex-shrink-0">💡</span>
            <div>
              <p className="text-[#f5a623] font-semibold text-sm mb-1">Production Implementation</p>
              <p className="text-[#374151] text-xs leading-relaxed">
                Full pipeline uses MSG91 WhatsApp Business API with a weekly cron job
                (Sunday 7:55 AM). This screen is a static demo mockup — the backend
                integration is documented and ready for Phase 2.
              </p>
            </div>
          </div>

          {/* Channel stats */}
          <div className="ee-card p-4">
            <p className="text-slate-500 text-xs font-semibold mb-3">Channel Stats (Demo)</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { val: "38", label: "Subscribers" },
                { val: "94%", label: "Open Rate" },
                { val: "12s", label: "Avg. Read Time" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="font-display font-black text-xl text-slate-100">{s.val}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
