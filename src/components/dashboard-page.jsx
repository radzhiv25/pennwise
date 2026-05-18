"use client";

import { useEffect, useState, useCallback } from "react";
import { AppShell } from "@/components/app-shell";
import TransactionForm from "@/components/TransactionForm";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/hooks/use-theme";
import { supabase, signOut as supabaseSignOut } from "@/lib/supabaseClient";

export default function Dashboard() {
  const { user } = useAuth();
  const { isDarkMode, applyTheme } = useTheme();
  const [selectedCurrency, setSelectedCurrency] = useState("INR");
  const [prefsLoaded, setPrefsLoaded] = useState(false);

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
      setPrefsLoaded(true);
      return;
    }

    applyTheme(data?.theme === "dark");
    if (data?.currency) {
      setSelectedCurrency(data.currency);
    }
    setPrefsLoaded(true);
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

  const toggleDarkMode = () => {
    const next = !isDarkMode;
    applyTheme(next);
    savePreferences({
      theme: next ? "dark" : "light",
      currency: selectedCurrency,
    });
  };

  const handleCurrencyChange = (currency) => {
    setSelectedCurrency(currency);
    savePreferences({
      theme: isDarkMode ? "dark" : "light",
      currency,
    });
  };

  const handleSignOut = async () => {
    await supabaseSignOut();
  };

  return (
    <AppShell
      isDarkMode={isDarkMode}
      onToggleDarkMode={toggleDarkMode}
      selectedCurrency={selectedCurrency}
      onCurrencyChange={handleCurrencyChange}
      onSignOut={handleSignOut}
    >
      {!prefsLoaded ? (
        <p className="text-sm text-muted-foreground animate-pulse">
          Loading your dashboard…
        </p>
      ) : (
        <TransactionForm selectedCurrency={selectedCurrency} />
      )}
    </AppShell>
  );
}
