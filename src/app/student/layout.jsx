"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/lib/authStore";
import Sidebar from "@/components/Sidebar";

export default function StudentLayout({ children }) {
  const router = useRouter();
  const { user, hydrate } = useAuthStore();

  useEffect(() => {
    hydrate();
  }, []);

  useEffect(() => {
    if (user === null) return; // still hydrating
    if (!user) router.replace("/");
    else if (user.role !== "student") router.replace("/teacher/dashboard");
  }, [user]);

  if (!user) return null;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-surface lg:ml-0">
        <div className="page-enter">{children}</div>
      </main>
    </div>
  );
}
