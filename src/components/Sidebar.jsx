"use client";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import useAuthStore from "@/lib/authStore";
import { Avatar } from "@/components/ui";

const STUDENT_NAV = [
  { href: "/student/tutor",      icon: "🤖", label: "AI Tutor" },
  { href: "/student/flashcards", icon: "📇", label: "Flashcards" },
  { href: "/student/career",     icon: "🎯", label: "Career Intel" },
];

const TEACHER_NAV = [
  { href: "/teacher/dashboard",   icon: "📊", label: "Struggle Signals" },
  { href: "/teacher/assessments", icon: "📝", label: "Assessments" },
  { href: "/teacher/attendance",  icon: "✅", label: "Attendance" },
  { href: "/teacher/parent",      icon: "💬", label: "Parent Digest" },
];

export default function Sidebar() {
  const router   = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!user) return null;

  const nav    = user.role === "student" ? STUDENT_NAV : TEACHER_NAV;
  const accent = user.role === "student" ? "#1e3260" : "#1a3a2e";
  const border = user.role === "student" ? "#2d56a0" : "#2d6b4f";
  const avatarColor = user.role === "student"
    ? "linear-gradient(135deg,#5B7FFF,#7C3AED)"
    : "linear-gradient(135deg,#10B981,#0891b2)";

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-sidebar border border-white/[0.1] rounded-lg p-3 text-white"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-52 flex flex-col flex-shrink-0 border-r border-white/[0.06] transform transition-transform duration-300 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
        style={{ background: "#0D1220" }}
      >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-5">
        <span className="text-2xl">🎓</span>
        <span className="font-display text-xl font-black text-slate-100">EduEdge</span>
      </div>

      {/* User context chip */}
      <div
        className="mx-3 mb-4 rounded-lg px-3 py-2.5 border text-sm"
        style={{ background: accent, borderColor: border }}
      >
        <p className="text-slate-500 text-[10px] uppercase tracking-widest mb-1">
          {user.role === "student" ? user.class : user.subject}
        </p>
        <p className="text-slate-200 font-semibold truncate">{user.name}</p>
      </div>

      {/* Nav */}
      <p className="px-4 text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">
        Navigation
      </p>
      <nav className="flex flex-col gap-0.5 px-2 flex-1">
        {nav.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={`nav-item ${active ? "active" : ""}`}
            >
              <span className="text-base leading-none">{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/[0.06] p-3 mt-2">
        <div className="flex items-center gap-2.5 mb-3">
          <Avatar name={user.name} color={avatarColor} size={30} />
          <div className="min-w-0">
            <p className="text-slate-300 text-xs font-semibold truncate">{user.name}</p>
            <p className="text-slate-600 text-[11px]">Demo Account</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full bg-red-500/10 border border-red-500/20 rounded-lg
                     py-1.5 text-red-400 text-xs font-semibold hover:bg-red-500/20 transition-colors"
        >
          Sign Out
        </button>
      </div>
      </aside>
    </>
  );
}
