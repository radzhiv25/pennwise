"use client";

import PropTypes from "prop-types";
import { MoonIcon, SunIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ThemeToggle({ isDarkMode, onToggle, className }) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      onClick={onToggle}
      className={cn("text-muted-foreground hover:text-foreground", className)}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDarkMode ? (
        <SunIcon className="size-4" weight="regular" />
      ) : (
        <MoonIcon className="size-4" weight="regular" />
      )}
    </Button>
  );
}

ThemeToggle.propTypes = {
  isDarkMode: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  className: PropTypes.string,
};
