"use client";

// ── Avatar ──────────────────────────────────────────────────────────────────
export function Avatar({ name = "", color = "#5B7FFF", size = 32 }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const fontSize = Math.round(size * 0.36);
  return (
    <div
      className="rounded-full flex items-center justify-center font-bold flex-shrink-0 font-display text-white"
      style={{ width: size, height: size, background: color, fontSize }}
    >
      {initials}
    </div>
  );
}

// ── Badge / Pill ─────────────────────────────────────────────────────────────
const PILL_STYLES = {
  blue:   "bg-blue-500/15 text-blue-400",
  green:  "bg-emerald-500/15 text-emerald-400",
  red:    "bg-red-500/15 text-red-400",
  amber:  "bg-amber-500/15 text-amber-400",
  violet: "bg-violet-500/15 text-violet-400",
  gray:   "bg-slate-500/15 text-slate-400",
};

export function Badge({ label, variant = "blue", className = "" }) {
  return (
    <span className={`pill ${PILL_STYLES[variant] || PILL_STYLES.blue} ${className}`}>
      {label}
    </span>
  );
}

// ── Progress Bar ─────────────────────────────────────────────────────────────
export function ProgressBar({ value, max = 100, color = "#5B7FFF", className = "" }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className={`h-1.5 bg-slate-700 rounded-full overflow-hidden ${className}`}>
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  );
}

// ── Spinner ──────────────────────────────────────────────────────────────────
export function Spinner({ size = 18, color = "white" }) {
  return (
    <div
      className="rounded-full border-2 animate-spin"
      style={{
        width: size,
        height: size,
        borderColor: `${color}33`,
        borderTopColor: color,
      }}
    />
  );
}

// ── Typing indicator ─────────────────────────────────────────────────────────
export function TypingDots() {
  return (
    <div className="flex gap-1.5 items-center px-4 py-3">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2 h-2 rounded-full bg-slate-400 dot-pulse"
          style={{ animationDelay: `${i * 0.18}s` }}
        />
      ))}
    </div>
  );
}

// ── Metric Card ──────────────────────────────────────────────────────────────
export function MetricCard({ icon, label, value, color = "#5B7FFF", bg = "rgba(91,127,255,0.12)" }) {
  return (
    <div className="ee-card p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xl">{icon}</span>
        <span className="pill text-xs font-bold" style={{ background: bg, color }}>{label}</span>
      </div>
      <p className="font-display text-3xl font-black text-[#1c1c1a]">{value}</p>
    </div>
  );
}

// ── Section Header ────────────────────────────────────────────────────────────
export function PageHeader({ title, subtitle, children }) {
  return (
    <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
      <div>
        <h1 className="font-display text-[22px] font-extrabold text-[#1c1c1a]">{title}</h1>
        {subtitle && <p className="text-[#4b5563] text-sm mt-1">{subtitle}</p>}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}
