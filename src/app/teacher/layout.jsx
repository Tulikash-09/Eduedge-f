"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/lib/authStore";
import Sidebar from "@/components/Sidebar";

export default function TeacherLayout({ children }) {
  const router = useRouter();
  const { user, hydrate } = useAuthStore();

  useEffect(() => {
    hydrate();
  }, []);

  useEffect(() => {
    if (user === null) return;
    if (!user) router.replace("/");
    else if (user.role !== "teacher") router.replace("/student/tutor");
  }, [user]);

  if (!user) return null;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-surface">
        <div className="page-enter">{children}</div>
      </main>
    </div>
  );
}
