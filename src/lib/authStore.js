"use client";
import { create } from "zustand";

const useAuthStore = create((set) => ({
  token: null,
  user:  null,

  setAuth: (token, user) => {
    if (typeof window !== "undefined") {
      // Store user without requiring token
      localStorage.setItem("ee_user", JSON.stringify(user));
      if (token) {
        localStorage.setItem("ee_token", token);
      }
    }
    set({ token, user });
  },

  setUser: (user) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("ee_user", JSON.stringify(user));
    }
    set({ user });
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("ee_token");
      localStorage.removeItem("ee_user");
    }
    set({ token: null, user: null });
  },

  hydrate: () => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("ee_token");
    const user  = localStorage.getItem("ee_user");
    if (user) {
      set({ token, user: JSON.parse(user) });
    }
  },
}));

export default useAuthStore;
