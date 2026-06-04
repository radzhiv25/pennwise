"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { SparkleIcon } from "@phosphor-icons/react";
import { TbMoneybag } from "react-icons/tb";

const TICKER_LINES = [
  "> syncing transactions...",
  "> categorizing: groceries",
  "> chart updated: weekly",
  "> balance within budget ✓",
];

export function AuthBrandPanel() {
  const tickerRef = useRef(null);

  useEffect(() => {
    const el = tickerRef.current;
    if (!el) return undefined;

    let index = 0;
    const interval = setInterval(() => {
      el.textContent = TICKER_LINES[index % TICKER_LINES.length];
      index += 1;
    }, 2400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="auth-brand-panel relative hidden overflow-hidden bg-black lg:flex lg:flex-col">
      <Image
        src="/auth-hero.png"
        alt=""
        fill
        priority
        sizes="(min-width: 1024px) 50vw, 0px"
        className="object-cover object-center"
      />

      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/25"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent"
        aria-hidden
      />

      <div className="pointer-events-none absolute inset-0 auth-scanline opacity-60" aria-hidden />

      <div className="relative z-10 flex flex-1 flex-col p-10 text-white">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold tracking-tight"
        >
          <TbMoneybag className="size-6 shrink-0" aria-hidden />
          PennWise
        </Link>

        <div className="my-auto space-y-8">
          <div className="space-y-4">
            <p className="inline-flex w-fit items-center gap-1.5 border border-white/20 bg-white/10 px-1.5 py-1 text-xs font-medium backdrop-blur-sm">
              <SparkleIcon className="size-3 animate-pulse" weight="fill" />
              Personal finance copilot
            </p>
            <h1 className="max-w-md text-3xl font-semibold leading-tight tracking-tight xl:text-4xl">
              Your money, one dashboard away.
            </h1>
            <p className="max-w-sm text-sm leading-relaxed text-white/80">
              Track income, expenses, and trends—all in one place.
            </p>
          </div>

          {/* <pre
            className="auth-ascii-reveal hidden max-w-full overflow-hidden rounded border border-white/15 bg-black/20 p-4 font-mono text-[10px] leading-relaxed text-white/90 backdrop-blur-sm sm:block xl:text-[11px]"
            aria-hidden
          >
            {ASCII_LEDGER}
          </pre> */}

          <div className="flex flex-wrap gap-4 text-[10px] font-mono uppercase tracking-widest text-white/60">
            <span className="auth-stat-pulse">live sync</span>
            <span className="auth-stat-pulse [animation-delay:0.4s]">
              encrypted
            </span>
            <span className="auth-stat-pulse [animation-delay:0.8s]">
              multi-currency
            </span>
          </div>
        </div>

        <div className="space-y-2 border-t border-white/15 pt-4 font-mono text-[11px]">
          <p ref={tickerRef} className="auth-ticker-line text-white/75">
            {TICKER_LINES[0]}
          </p>
          <p className="text-white/50">Secured with Supabase Auth</p>
        </div>
      </div>
    </div>
  );
}
