import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import TransactionForm from "./components/TransactionForm";

function App({ amount }) {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState('INR');

    useEffect(() => {
        // Check for saved theme preference or default to light mode
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const shouldUseDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
        
        setIsDarkMode(shouldUseDark);
        document.documentElement.classList.toggle('dark', shouldUseDark);

        // Check for saved currency preference
        const savedCurrency = localStorage.getItem('selectedCurrency');
        if (savedCurrency) {
            setSelectedCurrency(savedCurrency);
        }
    }, []);

    const toggleDarkMode = () => {
        const newDarkMode = !isDarkMode;
        setIsDarkMode(newDarkMode);
        document.documentElement.classList.toggle('dark', newDarkMode);
        localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
    };

    const handleCurrencyChange = (currency) => {
        setSelectedCurrency(currency);
        localStorage.setItem('selectedCurrency', currency);
    };

    return (
        <div className="min-h-screen bg-background dark:bg-black">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <Navbar 
                    isDarkMode={isDarkMode} 
                    onToggleDarkMode={toggleDarkMode}
                    selectedCurrency={selectedCurrency}
                    onCurrencyChange={handleCurrencyChange}
                />
                <main className="mt-8">
                    <TransactionForm selectedCurrency={selectedCurrency} />
                </main>
                <Footer />
            </div>
        </div>
    );
}

export default App;