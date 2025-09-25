import { useEffect, useState, useCallback } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import TransactionForm from "./components/TransactionForm";
import AuthGate from "./components/AuthGate";
import { useAuth } from "@/context/AuthContext";
import { supabase, signOut as supabaseSignOut } from "@/lib/supabaseClient";

function App() {
    const { user } = useAuth();
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState("INR");

    const applyTheme = useCallback((shouldUseDark) => {
        setIsDarkMode(shouldUseDark);
        document.documentElement.classList.toggle("dark", shouldUseDark);
    }, []);

    const loadPreferences = useCallback(async () => {
        if (!user) return;

        const { data, error } = await supabase
            .from("user_preferences")
            .select("theme, currency")
            .eq("user_id", user.id)
            .single();

        if (error) {
            console.warn("No preferences found, falling back to defaults", error.message);
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            applyTheme(prefersDark);
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

    useEffect(() => {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        applyTheme(prefersDark);
    }, [applyTheme]);

    const toggleDarkMode = async () => {
        const newDarkMode = !isDarkMode;
        applyTheme(newDarkMode);
        await savePreferences({ theme: newDarkMode ? "dark" : "light", currency: selectedCurrency });
    };

    const handleCurrencyChange = async (currency) => {
        setSelectedCurrency(currency);
        await savePreferences({ theme: isDarkMode ? "dark" : "light", currency });
    };

    const handleSignOut = async () => {
        await supabaseSignOut();
    };

    return (
        <AuthGate>
            <div className="min-h-screen bg-background dark:bg-black">
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
        </AuthGate>
    );
}

export default App;