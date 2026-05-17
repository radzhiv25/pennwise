"use client";

import { useEffect, useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TransactionForm from "@/components/TransactionForm";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/hooks/use-theme";
import { supabase, signOut as supabaseSignOut } from "@/lib/supabaseClient";

export default function Dashboard() {
  const { user } = useAuth();
  const { isDarkMode, applyTheme } = useTheme();
  const [selectedCurrency, setSelectedCurrency] = useState("INR");

  const loadPreferences = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("user_preferences")
      .select("theme, currency")
      .eq("user_id", user.id)
      .single();

    if (error) {
      console.warn(
        "No preferences found, falling back to defaults",
        error.message
      );
      setSelectedCurrency("INR");
      return;
    }

    applyTheme(data?.theme === "dark");
    if (data?.currency) {
      setSelectedCurrency(data.currency);
    }
  }, [user, applyTheme]);

  const savePreferences = useCallback(
    async (preferences) => {
      if (!user) return;

      const { error } = await supabase.from("user_preferences").upsert(
        {
          user_id: user.id,
          ...preferences,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );

      if (error) {
        console.error("Failed to save preferences", error);
      }
    },
    [user]
  );

  useEffect(() => {
    if (user) {
      loadPreferences();
    }
  }, [user, loadPreferences]);

  const toggleDarkMode = async () => {
    const next = !isDarkMode;
    applyTheme(next);
    await savePreferences({
      theme: next ? "dark" : "light",
      currency: selectedCurrency,
    });
  };

  const handleCurrencyChange = async (currency) => {
    setSelectedCurrency(currency);
    await savePreferences({
      theme: isDarkMode ? "dark" : "light",
      currency,
    });
  };

  const handleSignOut = async () => {
    await supabaseSignOut();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Navbar
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
          selectedCurrency={selectedCurrency}
          onCurrencyChange={handleCurrencyChange}
          onSignOut={handleSignOut}
        />
        <main className="mt-8">
          <TransactionForm selectedCurrency={selectedCurrency} />
        </main>
        <Footer />
      </div>
    </div>
  );
}
