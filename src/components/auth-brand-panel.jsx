"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { SparkleIcon } from "@phosphor-icons/react";
import { TbMoneybag } from "react-icons/tb";

const ASCII_LEDGER = `┌─ PENNWISE LEDGER ─────────┐
│ INCOME      ▲ +12,400.00  │
│ EXPENSES    ▼  -8,230.50  │
│ BALANCE     ●  +4,169.50  │
└───────────────────────────┘`;

const TICKER_LINES = [
  "> syncing transactions...",
  "> categorizing: groceries",
  "> chart updated: weekly",
  "> balance within budget ✓",
];

function DotMatrixCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    let frameId = 0;
    let tick = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = window.devicePixelRatio || 1;
      const { width, height } = parent.getBoundingClientRect();
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas.parentElement);

    const cols = 28;
    const rows = 18;

    const draw = () => {
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);
      ctx.clearRect(0, 0, w, h);

      const gapX = w / (cols + 1);
      const gapY = h / (rows + 1);
      tick += 0.04;

      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          const x = gapX * (col + 1);
          const y = gapY * (row + 1);

          const wave =
            Math.sin(col * 0.35 + tick) * Math.cos(row * 0.28 + tick * 0.8);
          const pulse = (wave + 1) / 2;
          const chartBoost =
            row > rows * 0.45 && row < rows * 0.85
              ? Math.sin(col * 0.5 + tick * 1.2) * 0.35 + 0.35
              : 0;
          const alpha = Math.min(1, pulse * 0.45 + chartBoost);

          if (alpha < 0.08) continue;

          const size = 1.5 + pulse * 1.2;
          ctx.beginPath();
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.85})`;
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      frameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full opacity-70"
      aria-hidden
    />
  );
}

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
    <div className="auth-brand-panel relative hidden overflow-hidden bg-primary lg:flex lg:flex-col">
      <DotMatrixCanvas />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, transparent, rgba(0,0,0,0.4))",
        }}
        aria-hidden
      />

      <div className="pointer-events-none absolute inset-0 auth-scanline" aria-hidden />

      <div className="relative z-10 flex flex-1 flex-col p-10 text-primary-foreground">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold tracking-tight"
        >
          <TbMoneybag className="size-6 shrink-0" aria-hidden />
          PennWise
        </Link>

        <div className="my-auto space-y-8">
          <div className="space-y-4">
            <p className="inline-flex w-fit items-center gap-1.5 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1 text-xs font-medium backdrop-blur-sm">
              <SparkleIcon className="size-3.5 animate-pulse" weight="fill" />
              Personal finance copilot
            </p>
            <h1 className="max-w-md text-3xl font-semibold leading-tight tracking-tight xl:text-4xl">
              Your money, one dashboard away.
            </h1>
            <p className="max-w-sm text-sm leading-relaxed text-primary-foreground/80">
              Track income, expenses, and trends—all in one place.
            </p>
          </div>

          <pre
            className="auth-ascii-reveal hidden max-w-full overflow-hidden rounded border border-primary-foreground/15 bg-black/20 p-4 font-mono text-[10px] leading-relaxed text-primary-foreground/90 backdrop-blur-sm sm:block xl:text-[11px]"
            aria-hidden
          >
            {ASCII_LEDGER}
          </pre>

          <div className="flex flex-wrap gap-4 text-[10px] font-mono uppercase tracking-widest text-primary-foreground/60">
            <span className="auth-stat-pulse">● live sync</span>
            <span className="auth-stat-pulse [animation-delay:0.4s]">
              ● encrypted
            </span>
            <span className="auth-stat-pulse [animation-delay:0.8s]">
              ● multi-currency
            </span>
          </div>
        </div>

        <div className="space-y-2 border-t border-primary-foreground/15 pt-4 font-mono text-[11px]">
          <p ref={tickerRef} className="auth-ticker-line text-primary-foreground/75">
            {TICKER_LINES[0]}
          </p>
          <p className="text-primary-foreground/50">Secured with Supabase Auth</p>
        </div>
      </div>
    </div>
  );
}
