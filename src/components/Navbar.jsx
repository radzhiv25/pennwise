"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TbMoneybag } from "react-icons/tb";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/context/AuthContext";
import PropTypes from "prop-types";

const currencyOptions = [
  { value: "INR", label: "₹ INR" },
  { value: "USD", label: "$ USD" },
  { value: "GBP", label: "£ GBP" },
];

const Navbar = ({
  variant = "minimal",
  isDarkMode,
  onToggleDarkMode,
  selectedCurrency,
  onCurrencyChange,
  onSignOut,
  showCurrency = false,
}) => {
  const { user } = useAuth();
  const pathname = usePathname();
  const isLanding = useMemo(() => pathname === "/", [pathname]);

  return (
    <header className="flex items-center justify-between gap-4">
      <Link
        href={user ? "/app" : "/"}
        className="text-sm font-semibold tracking-tight text-foreground flex items-center gap-1"
      >
        <TbMoneybag className="size-4 shrink-0" aria-hidden />
        PennWise
      </Link>

      <nav className="flex items-center gap-1">
        {user && showCurrency && onCurrencyChange && (
          <Select value={selectedCurrency} onValueChange={onCurrencyChange}>
            <SelectTrigger className="h-8 w-[5.5rem] border-0 bg-transparent px-2 text-xs shadow-none">
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
        )}
        <ThemeToggle isDarkMode={isDarkMode} onToggle={onToggleDarkMode} />
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
};

Navbar.propTypes = {
  variant: PropTypes.oneOf(["minimal", "default"]),
  isDarkMode: PropTypes.bool,
  onToggleDarkMode: PropTypes.func,
  selectedCurrency: PropTypes.string,
  onCurrencyChange: PropTypes.func,
  onSignOut: PropTypes.func,
  showCurrency: PropTypes.bool,
};

export default Navbar;
