import PropTypes from "prop-types";
import { FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Moon, Sun } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "@/lib/supabaseClient";

const Navbar = ({ isDarkMode, onToggleDarkMode, selectedCurrency, onCurrencyChange, onSignOut }) => {
  const { user } = useAuth();

  const handleSignOut = async () => {
    if (onSignOut) {
      await onSignOut();
    } else {
      await signOut();
    }
  };

  return (
    <div className="sticky top-5 bg-white-50 z-50 backdrop-blur-sm p-3 border border-gray-200 dark:border-gray-700 rounded-md flex justify-between items-center">
      <span className="leading-none">
        <h1 className="text-2xl font-semibold leading-none bg-gradient-to-br from-gray-300 via-black dark:from-gray-100 dark:via-white text-transparent bg-clip-text">
          PennWise
        </h1>
        <p className="text-xs text-muted-foreground">manage expense in clicks</p>
      </span>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Currency:</span>
          <Select value={selectedCurrency} onValueChange={onCurrencyChange}>
            <SelectTrigger className="w-320 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INR">₹ INR</SelectItem>
              <SelectItem value="USD">$ USD</SelectItem>
              <SelectItem value="GBP">£ GBP</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <a href="https://github.com/radzhiv25/expense-tracker">
          <FaGithub className="size-8 hover:text-gray-500 dark:hover:text-gray-400 transition-colors" />
        </a>
        <Button
          variant="outline"
          size="icon"
          onClick={onToggleDarkMode}
          className="h-8 w-8"
        >
          {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        {user && (
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            Sign Out
          </Button>
        )}
      </div>
    </div>
  );
};

Navbar.propTypes = {
  isDarkMode: PropTypes.bool.isRequired,
  onToggleDarkMode: PropTypes.func.isRequired,
  selectedCurrency: PropTypes.string.isRequired,
  onCurrencyChange: PropTypes.func.isRequired,
  onSignOut: PropTypes.func,
};

Navbar.defaultProps = {
  onSignOut: undefined,
};

export default Navbar;
