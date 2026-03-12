import { useCallback, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { flushSync } from "react-dom";
import { Moon, Sun } from "lucide-react";

import { cn } from "@/lib/utils";

export const AnimatedThemeToggler = ({
  className,
  iconClassName,
  isDarkMode = false,
  onToggleDarkMode = () => {},
}) => {
  const buttonRef = useRef(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const runClipAnimation = useCallback(() => {
    if (!buttonRef.current) return;
    const { top, left, width, height } = buttonRef.current.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const maxRadius = Math.hypot(
      Math.max(left, window.innerWidth - left),
      Math.max(top, window.innerHeight - top)
    );

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 700,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      }
    );
  }, []);

  const handleToggle = useCallback(() => {
    const performToggle = () => {
      flushSync(() => {
        onToggleDarkMode();
      });
    };

    if (typeof document !== "undefined" && typeof document.startViewTransition === "function") {
      const transition = document.startViewTransition(() => {
        performToggle();
      });

      transition.ready.then(runClipAnimation).catch(() => {
        performToggle();
      });
    } else {
      performToggle();
    }
  }, [onToggleDarkMode, runClipAnimation]);

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={handleToggle}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background text-foreground transition-colors hover:bg-muted",
        className
      )}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDarkMode ? <Sun className={iconClassName ?? "h-4 w-4"} /> : <Moon className={iconClassName ?? "h-4 w-4"} />}
    </button>
  );
};

AnimatedThemeToggler.propTypes = {
  className: PropTypes.string,
  iconClassName: PropTypes.string,
  isDarkMode: PropTypes.bool,
  onToggleDarkMode: PropTypes.func,
};
