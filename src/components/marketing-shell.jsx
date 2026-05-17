"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useTheme } from "@/hooks/use-theme";

export function MarketingShell({ children }) {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-[50vw] flex-col px-6 py-8 sm:px-10 sm:py-12 max-lg:max-w-xl">
        <Navbar
          variant="minimal"
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleTheme}
        />
        <main className="mt-10 flex flex-1 flex-col">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
