import PropTypes from "prop-types";
import { FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

const Navbar = ({ isDarkMode, onToggleDarkMode }) => {
  return (
    <div className="my-5 p-3 border border-gray-200 dark:border-gray-700 rounded-md flex justify-between items-center">
      <span className="leading-none">
        <h1 className="text-2xl font-semibold leading-none bg-gradient-to-br from-gray-300 via-black dark:from-gray-100 dark:via-white text-transparent bg-clip-text">
          PennWise
        </h1>
        <p className="text-xs text-muted-foreground">manage expense in clicks</p>
      </span>
      <div className="flex items-center gap-3">
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
      </div>
    </div>
  );
};

Navbar.propTypes = {
  isDarkMode: PropTypes.bool.isRequired,
  onToggleDarkMode: PropTypes.func.isRequired,
};

export default Navbar;
