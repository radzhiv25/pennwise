import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import PropTypes from "prop-types";

const currencyOptions = [
  { value: "INR", label: "₹ INR" },
  { value: "USD", label: "$ USD" },
  { value: "GBP", label: "£ GBP" },
];

const Navbar = ({
  isDarkMode,
  onToggleDarkMode,
  selectedCurrency,
  onCurrencyChange,
  onSignOut,
}) => {
  const { user } = useAuth();
  const location = useLocation();

  const isLanding = useMemo(() => location.pathname === "/", [location.pathname]);

  const handleSignOut = () => {
    onSignOut?.();
  };

  return (
    <header className="sticky top-5 z-50">
      <div className="container mx-auto px-4">
        <div className="bg-white-50 backdrop-blur-sm p-3 border border-gray-200 dark:border-gray-700 rounded-md flex flex-wrap gap-3 justify-between items-center">
          <Link to={user ? "/app" : "/"} className="leading-none">
            <h1 className="text-2xl font-semibold leading-none bg-gradient-to-br from-gray-300 via-black dark:from-gray-100 dark:via-white text-transparent bg-clip-text">
              PennWise
            </h1>
            <p className="text-xs text-muted-foreground">manage expense in clicks</p>
          </Link>

          <div className="flex items-center gap-3">
            {user && (
              <div className="hidden md:flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Currency:</span>
                <Select value={selectedCurrency} onValueChange={onCurrencyChange}>
                  <SelectTrigger className="w-32 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencyOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <a href="https://github.com/radzhiv25/expense-tracker">
              <FaGithub className="size-8 hover:text-gray-500 dark:hover:text-gray-400 transition-colors" />
            </a>
            <AnimatedThemeToggler
              isDarkMode={isDarkMode}
              onToggleDarkMode={onToggleDarkMode}
            />
            {user ? (
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                Sign Out
              </Button>
            ) : isLanding ? (
              <div className="flex items-center gap-2">
                <Button asChild variant="ghost" size="sm">
                  <Link to="/login">Log in</Link>
                </Button>
                <Button asChild size="sm">
                  <Link to="/signup">Get Started</Link>
                </Button>
              </div>
            ) : (
              <Button asChild size="sm">
                <Link to="/">Back to Home</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

Navbar.propTypes = {
  isDarkMode: PropTypes.bool,
  onToggleDarkMode: PropTypes.func,
  selectedCurrency: PropTypes.string,
  onCurrencyChange: PropTypes.func,
  onSignOut: PropTypes.func,
};

export default Navbar;
