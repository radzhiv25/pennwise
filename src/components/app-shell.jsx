"use client";

import PropTypes from "prop-types";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export function AppShell({
  children,
  isDarkMode,
  onToggleDarkMode,
  selectedCurrency,
  onCurrencyChange,
  onSignOut,
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="shell-constrained">
        <Navbar
          isDarkMode={isDarkMode}
          onToggleDarkMode={onToggleDarkMode}
          selectedCurrency={selectedCurrency}
          onCurrencyChange={onCurrencyChange}
          onSignOut={onSignOut}
          showCurrency
        />
        <main className="mt-10 flex flex-1 flex-col">{children}</main>
        <Footer />
      </div>
    </div>
  );
}

AppShell.propTypes = {
  children: PropTypes.node.isRequired,
  isDarkMode: PropTypes.bool.isRequired,
  onToggleDarkMode: PropTypes.func.isRequired,
  selectedCurrency: PropTypes.string,
  onCurrencyChange: PropTypes.func,
  onSignOut: PropTypes.func,
};
