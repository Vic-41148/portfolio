"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";

type Theme = "light" | "dark";

const ThemeContext = createContext<{
  theme: Theme;
  toggle: () => void;
} | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored) {
      setTheme(stored);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light");
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    const wasDark = root.classList.contains("dark");

    if (theme === "dark" && !wasDark) {
      root.classList.add("theme-transition");
      root.classList.add("dark");
    } else if (theme === "light" && wasDark) {
      root.classList.add("theme-transition");
      root.classList.remove("dark");
    }

    const timeout = setTimeout(() => {
      root.classList.remove("theme-transition");
    }, 300);

    localStorage.setItem("theme", theme);
    return () => clearTimeout(timeout);
  }, [theme, mounted]);

  const toggle = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be inside ThemeProvider");
  return ctx;
}
