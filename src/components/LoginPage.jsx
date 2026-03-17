"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/lib/authStore";
import api from "@/lib/api";
import { Spinner } from "@/components/ui";

const DEMO = {
  student: { email: "arjun@demo.school",  pass: "demo123" },
  teacher: { email: "teacher@demo.school", pass: "demo123" },
};

export default function LoginPage() {
  const router = useRouter();
  const { setAuth, hydrate, user } = useAuthStore();

  const [role,     setRole]     = useState(null);   // null | "student" | "teacher"
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    hydrate();
  }, []);

  useEffect(() => {
    if (user) {
      router.replace(user.role === "student" ? "/student/tutor" : "/teacher/dashboard");
    }
  }, [user]);

  const fillDemo = (r) => {
    setEmail(DEMO[r].email);
    setPassword(DEMO[r].pass);
    setError("");
  };

  const selectRole = (r) => {
    setRole(r);
    fillDemo(r);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/login", { email, password });
      // Handle response without token
      if (data.user) {
        setAuth(null, data.user); // No token needed
        router.push(data.user.role === "student" ? "/student/tutor" : "/teacher/dashboard");
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Role picker ──────────────────────────────────────────────────────────
  if (!role) return (
    <div className="min-h-screen w-full flex items-center justify-center p-6"
         style={{ background: "linear-gradient(145deg,#0d1220 0%,#162040 100%)" }}>
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="text-center mb-10">
          <div className="text-5xl mb-3">🎓</div>
          <h1 className="font-display text-4xl font-black text-slate-100 tracking-tight">EduEdge</h1>
          <p className="text-slate-500 text-sm mt-2">AI-Powered Learning Platform for Indian Schools</p>
        </div>

        {/* Role cards */}
        <p className="text-slate-400 text-sm text-center mb-4">Sign in as</p>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {[
            { role: "student", icon: "📚", title: "Student",  desc: "AI Tutor & Study Tools",    color: "#5B7FFF" },
            { role: "teacher", icon: "🏫", title: "Teacher",  desc: "Dashboard & Class Tools",   color: "#10B981" },
          ].map((r) => (
            <button
              key={r.role}
              onClick={() => selectRole(r.role)}
              className="p-5 rounded-xl border transition-all duration-200 text-center group"
              style={{
                background: "rgba(255,255,255,0.04)",
                borderColor: "rgba(255,255,255,0.08)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `${r.color}1a`;
                e.currentTarget.style.borderColor = r.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
              }}
            >
              <div className="text-3xl mb-3">{r.icon}</div>
              <p className="font-display font-bold text-slate-200 text-base mb-1">{r.title}</p>
              <p className="text-slate-500 text-xs">{r.desc}</p>
            </button>
          ))}
        </div>

        {/* Demo hint */}
        <div className="rounded-xl border border-brand/20 bg-brand/5 p-3 text-center">
          <p className="text-blue-400 text-xs leading-relaxed">
            Demo credentials — Password: <span className="font-bold">demo123</span><br/>
            Student: <span className="font-mono">arjun@demo.school</span><br/>
            Teacher: <span className="font-mono">teacher@demo.school</span>
          </p>
        </div>
      </div>
    </div>
  );

  // ── Login form ───────────────────────────────────────────────────────────
  const isStudent = role === "student";
  const accentColor = isStudent ? "#5B7FFF" : "#10B981";

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6"
         style={{ background: "linear-gradient(145deg,#0d1220 0%,#162040 100%)" }}>
      <div className="w-full max-w-sm">
        <form
          onSubmit={handleLogin}
          className="rounded-2xl border border-white/10 p-8"
          style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)" }}
        >
          {/* Back */}
          <button
            type="button"
            onClick={() => { setRole(null); setError(""); }}
            className="text-slate-500 hover:text-slate-300 text-sm mb-6 flex items-center gap-1 transition-colors"
          >
            ← Back
          </button>

          {/* Header */}
          <div className="text-center mb-7">
            <div className="text-4xl mb-3">{isStudent ? "📚" : "🏫"}</div>
            <h2 className="font-display text-2xl font-black text-slate-100">
              {isStudent ? "Student Login" : "Teacher Login"}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Use demo credentials below
            </p>
          </div>

          {/* Fields */}
          <div className="space-y-4 mb-2">
            <div>
              <label className="block text-slate-400 text-xs mb-1.5 font-medium">Email Address</label>
              <input
                className="ee-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={DEMO[role].email}
                required
                autoFocus
              />
            </div>
            <div>
              <label className="block text-slate-400 text-xs mb-1.5 font-medium">Password</label>
              <input
                className="ee-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {/* Quick fill hint */}
          <p className="text-xs text-slate-600 mb-5">
            Fill automatically:{" "}
            <button
              type="button"
              className="underline transition-colors"
              style={{ color: accentColor }}
              onClick={() => fillDemo(role)}
            >
              use demo credentials
            </button>
          </p>

          {/* Error */}
          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Submit */}
          <button type="submit" disabled={loading} className="btn-brand w-full flex items-center justify-center gap-2">
            {loading ? <Spinner size={16} /> : null}
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </form>
      </div>
    </div>
  );
}
