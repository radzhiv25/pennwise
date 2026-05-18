"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "pennwise-theme";

export function useTheme() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const applyTheme = useCallback((shouldUseDark) => {
    setIsDarkMode(shouldUseDark);
    document.documentElement.classList.toggle("dark", shouldUseDark);
    localStorage.setItem(STORAGE_KEY, shouldUseDark ? "dark" : "light");
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "dark" || stored === "light") {
      applyTheme(stored === "dark");
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      applyTheme(prefersDark);
    }
    setIsReady(true);
  }, [applyTheme]);

  const toggleTheme = useCallback(() => {
    applyTheme(!isDarkMode);
  }, [applyTheme, isDarkMode]);

  return { isDarkMode, isReady, applyTheme, toggleTheme };
}
