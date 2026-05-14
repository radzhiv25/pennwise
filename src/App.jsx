import { useCallback, useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthGate from "@/components/AuthGate";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";

function PublicShell({ children }) {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const applyTheme = useCallback((shouldUseDark) => {
        setIsDarkMode(shouldUseDark);
        document.documentElement.classList.toggle("dark", shouldUseDark);
    }, []);

    useEffect(() => {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        applyTheme(prefersDark);
    }, [applyTheme]);

    const toggleDarkMode = () => {
        applyTheme(!isDarkMode);
    };

    return (
        <div className="min-h-screen bg-background dark:bg-black flex flex-col">
            <div className="container mx-auto px-4 py-8 md:w-1/2 flex-1 flex flex-col">
                <Navbar
                    isDarkMode={isDarkMode}
                    onToggleDarkMode={toggleDarkMode}
                    selectedCurrency="INR"
                    onCurrencyChange={() => {}}
                />
                <main className="mt-8 flex-1">{children}</main>
                <Footer />
            </div>
        </div>
    );
}

function App() {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <PublicShell>
                        <Landing />
                    </PublicShell>
                }
            />
            <Route
                path="/login"
                element={
                    <PublicShell>
                        <div className="flex justify-center">
                            <Login />
                        </div>
                    </PublicShell>
                }
            />
            <Route
                path="/signup"
                element={
                    <PublicShell>
                        <div className="flex justify-center">
                            <Signup />
                        </div>
                    </PublicShell>
                }
            />
            <Route
                path="/app"
                element={
                    <AuthGate>
                        <Dashboard />
                    </AuthGate>
                }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;
