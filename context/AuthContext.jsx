"use client";

import { createContext, useContext, useState, useEffect } from "react";
import {
  DEFAULT_CLIENT,
  DEFAULT_VENDOR,
  computeInitials,
} from "../data/defaultUser.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      if (typeof window === "undefined") return null;
      const stored = localStorage.getItem("biohna_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem("biohna_user", JSON.stringify(user));
      } else {
        localStorage.removeItem("biohna_user");
      }
    } catch {
      // localStorage full or unavailable
    }
  }, [user]);

  function login(role) {
    setUser(role === "vendor" ? { ...DEFAULT_VENDOR } : { ...DEFAULT_CLIENT });
  }

  function logout() {
    setUser(null);
  }

  function updateProfile(partial) {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...partial };
      if (partial.firstName !== undefined || partial.lastName !== undefined) {
        next.initials = computeInitials(next.firstName, next.lastName);
      }
      return next;
    });
  }

  function updateAvatar(base64) {
    setUser((prev) => (prev ? { ...prev, avatarUrl: base64 } : prev));
  }

  function updateBanner(base64) {
    setUser((prev) => (prev ? { ...prev, bannerUrl: base64 } : prev));
  }

  function updateSettings(partialSettings) {
    setUser((prev) =>
      prev
        ? {
            ...prev,
            settings: { ...(prev.settings ?? {}), ...partialSettings },
          }
        : prev,
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        updateProfile,
        updateAvatar,
        updateBanner,
        updateSettings,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
