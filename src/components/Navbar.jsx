"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaGithub } from "react-icons/fa";
import { TbMoneybag } from "react-icons/tb";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/context/AuthContext";
import PropTypes from "prop-types";

const currencyOptions = [
  { value: "INR", label: "₹ INR" },
  { value: "USD", label: "$ USD" },
  { value: "GBP", label: "£ GBP" },
];

const Navbar = ({
  variant = "default",
  isDarkMode,
  onToggleDarkMode,
  selectedCurrency,
  onCurrencyChange,
  onSignOut,
}) => {
  const { user } = useAuth();
  const pathname = usePathname();
  const isMinimal = variant === "minimal";
  const isLanding = useMemo(() => pathname === "/", [pathname]);

  if (isMinimal) {
    return (
      <header className="flex items-center justify-between gap-4">
        <Link
          href={user ? "/app" : "/"}
          className="text-sm font-semibold tracking-tight text-foreground"
        >
          PennWise
        </Link>

        <nav className="flex items-center gap-1">
          <ThemeToggle
            isDarkMode={isDarkMode}
            onToggle={onToggleDarkMode}
          />
          {user ? (
            <Button variant="ghost" size="sm" onClick={onSignOut}>
              Sign out
            </Button>
          ) : isLanding ? (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/signup">Sign up</Link>
              </Button>
            </>
          ) : (
            <Button asChild variant="ghost" size="sm">
              <Link href="/">Home</Link>
            </Button>
          )}
        </nav>
      </header>
    );
  }

  return (
    <header className="sticky top-5 z-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border border-border bg-background/80 p-3 backdrop-blur-sm">
          <Link
            href={user ? "/app" : "/"}
            className="grid grid-cols-[auto_1fr] items-center gap-x-2.5 gap-y-0.5 leading-none"
          >
            <TbMoneybag
              className="row-span-2 size-9 shrink-0 self-center text-foreground"
              aria-hidden
            />
            <span className="col-start-2 text-2xl font-semibold bg-gradient-to-br from-gray-300 via-black dark:from-gray-100 dark:via-white bg-clip-text text-transparent">
              PennWise
            </span>
            <span className="col-start-2 text-xs text-muted-foreground">
              manage expense in clicks
            </span>
          </Link>

          <div className="flex items-center gap-2">
            {user && (
              <div className="hidden md:flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Currency:</span>
                <Select
                  value={selectedCurrency}
                  onValueChange={onCurrencyChange}
                >
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
            <a
              href="https://github.com/radzhiv25/expense-tracker"
              aria-label="GitHub repository"
            >
              <FaGithub className="size-8 hover:text-muted-foreground transition-colors" />
            </a>
            <ThemeToggle
              isDarkMode={isDarkMode}
              onToggle={onToggleDarkMode}
            />
            {user ? (
              <Button variant="ghost" size="sm" onClick={onSignOut}>
                Sign Out
              </Button>
            ) : (
              <Button asChild size="sm">
                <Link href="/">Back to Home</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

Navbar.propTypes = {
  variant: PropTypes.oneOf(["default", "minimal"]),
  isDarkMode: PropTypes.bool,
  onToggleDarkMode: PropTypes.func,
  selectedCurrency: PropTypes.string,
  onCurrencyChange: PropTypes.func,
  onSignOut: PropTypes.func,
};

export default Navbar;
