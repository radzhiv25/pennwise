"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useTheme } from "@/hooks/use-theme";

export function MarketingShell({ children }) {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      <div className="shell-constrained">
        <Navbar
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleTheme}
        />
        <main className="mt-10 flex flex-1 flex-col">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
