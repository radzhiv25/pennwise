"use client";

import Link from "next/link";
import PropTypes from "prop-types";
import { TbMoneybag } from "react-icons/tb";
import { AuthBrandPanel } from "@/components/auth-brand-panel";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTheme } from "@/hooks/use-theme";
import { isSupabaseConfigured } from "@/lib/supabaseClient";

export function AuthShell({ children }) {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <AuthBrandPanel />

      <div className="relative flex min-h-screen flex-col bg-background px-6 py-8 sm:px-10 lg:px-14">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold lg:hidden"
          >
            <TbMoneybag className="size-5" aria-hidden />
            PennWise
          </Link>
          <div className="ml-auto">
            <ThemeToggle isDarkMode={isDarkMode} onToggle={toggleTheme} />
          </div>
        </div>

        {!isSupabaseConfigured() && (
          <div
            role="alert"
            className="mt-6 rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            Supabase is not configured. Add{" "}
            <code className="text-xs">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
            <code className="text-xs">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to{" "}
            <code className="text-xs">.env</code>, then restart{" "}
            <code className="text-xs">npm run dev</code>.
          </div>
        )}

        <div className="flex flex-1 flex-col items-center justify-center py-8">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>
    </div>
  );
}

AuthShell.propTypes = {
  children: PropTypes.node.isRequired,
};
