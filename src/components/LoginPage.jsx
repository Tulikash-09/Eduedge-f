"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/lib/authStore";
import api from "@/lib/api";
import { Spinner } from "@/components/ui";
import { BookIcon, ChalkboardIcon } from "@/components/icons";

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
    <div className="min-h-screen flex flex-col lg:flex-row bg-navy-900">
      {/* Left Panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="max-w-md w-full">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="font-display text-3xl sm:text-5xl font-bold text-white mb-4">EduEdge</h1>
            <p className="text-navy-200 text-base sm:text-lg mb-2">AI-Powered Learning Platform for Indian Schools</p>
            <p className="text-navy-300 text-sm italic">"The Education ecosystem your student deserves"</p>
            <p className="text-navy-400 text-xs mt-6">CBSE & ICSE Board Aligned</p>
          </div>
        </div>
      </div>
      
      {/* Right Panel */}
      <div className="flex-1 bg-surface flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
        {/* Geometric Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(30,58,111,0.3) 35px, rgba(30,58,111,0.3) 70px),
                             repeating-linear-gradient(-45deg, transparent, transparent 35px, rgba(30,58,111,0.2) 35px, rgba(30,58,111,0.2) 70px)`,
            backgroundSize: '140px 140px'
          }}></div>
        </div>
        
        <div className="relative z-10 w-full max-w-sm">
          <h2 className="font-display text-xl sm:text-2xl font-semibold text-navy-900 mb-2 text-center">Select Your Role</h2>
          <p className="text-navy-600 text-sm text-center mb-6 sm:mb-8">Choose how you'd like to access EduEdge</p>
          
          <div className="space-y-3 sm:space-y-4">
            <button
              onClick={() => selectRole("student")}
              className="w-full p-4 sm:p-6 rounded-2xl border-2 border-navy-200 bg-card hover:border-green-500 hover:shadow-lg transition-all duration-200 text-left group"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <BookIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-700" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-navy-900 text-base sm:text-lg mb-1">Student</h3>
                  <p className="text-navy-600 text-xs sm:text-sm">AI Tutor & Study Tools</p>
                </div>
              </div>
            </button>
            
            <button
              onClick={() => selectRole("teacher")}
              className="w-full p-4 sm:p-6 rounded-2xl border-2 border-navy-200 bg-card hover:border-green-500 hover:shadow-lg transition-all duration-200 text-left group"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <ChalkboardIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-700" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-navy-900 text-base sm:text-lg mb-1">Teacher</h3>
                  <p className="text-navy-600 text-xs sm:text-sm">Classroom Tools & Analytics</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // ── Login form ───────────────────────────────────────────────────────────
  const isStudent = role === "student";

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleLogin}
          className="bg-card rounded-2xl border border-navy-200 p-6 sm:p-8 shadow-sm"
        >
          {/* Back */}
          <button
            type="button"
            onClick={() => { setRole(null); setError(""); }}
            className="text-navy-500 hover:text-navy-700 text-sm mb-6 flex items-center gap-1 transition-colors"
          >
            ← Back
          </button>

          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              {isStudent ? <BookIcon className="w-6 h-6 sm:w-8 sm:h-8 text-green-700" /> : <ChalkboardIcon className="w-6 h-6 sm:w-8 sm:h-8 text-green-700" />}
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-semibold text-navy-900 mb-2">
              {isStudent ? "Student Login" : "Teacher Login"}
            </h2>
            <p className="text-navy-600 text-sm">
              Enter your credentials to continue
            </p>
          </div>

          {/* Fields */}
          <div className="space-y-4 sm:space-y-5 mb-4 sm:mb-6">
            <div>
              <label className="block text-navy-700 text-sm font-medium mb-2">Email Address</label>
              <input
                className="w-full bg-white border border-navy-200 rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 text-navy-900 text-sm placeholder:text-navy-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                autoFocus
              />
            </div>
            <div>
              <label className="block text-navy-700 text-sm font-medium mb-2">Password</label>
              <input
                className="w-full bg-white border border-navy-200 rounded-lg px-4 py-3 text-navy-900 text-sm placeholder:text-navy-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Submit */}
          <button type="submit" disabled={loading} className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg px-5 py-3 text-sm font-display transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            {loading ? <Spinner size={16} /> : null}
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
