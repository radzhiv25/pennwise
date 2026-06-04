"use client";

import Link from "next/link";
import {
  ArrowRightIcon,
  ChartLineIcon,
  ShieldCheckIcon,
  SparkleIcon,
} from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const linkButtonClass =
  "inline-flex h-9 items-center justify-center gap-1.5 px-2.5 text-xs font-medium";

export function LandingContent() {
  return (
    <section
      aria-label="PennWise introduction"
      className="flex w-full max-w-2xl flex-col items-center gap-10 text-center"
    >
      <div className="flex flex-col items-center gap-5">
        <Badge variant="outline" className="w-fit text-[10px]">
          <SparkleIcon data-icon="inline-start" className="size-3" />
          Personal finance copilot
        </Badge>

        <h1 className="font-heading text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
          Master your money with{" "}
          <span className="text-primary">PennWise</span>
        </h1>

        <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
          Capture transactions, stay on top of tasks, and monitor spending with
          charts—all synced securely with Supabase.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          <Button asChild size="lg">
            <Link href="/signup" className={linkButtonClass}>
              Get started
              <ArrowRightIcon data-icon="inline-end" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/login" className={linkButtonClass}>
              Log in
            </Link>
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          Already tracking finances?{" "}
          <Link
            href="/login"
            className="text-primary underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>

      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
        <Card size="sm" className="text-left">
          <CardHeader>
            <CardTitle className="flex items-center gap-1.5 text-sm">
              <ChartLineIcon className="size-3.5 shrink-0 text-primary" />
              Track & visualise
            </CardTitle>
            <CardDescription>
              Log income and expenses, then see trends at a glance on your
              dashboard.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card size="sm" className="text-left">
          <CardHeader>
            <CardTitle className="flex items-center gap-1.5 text-sm">
              <ShieldCheckIcon className="size-3.5 shrink-0 text-primary" />
              Secure by design
            </CardTitle>
            <CardDescription>
              Authentication and storage powered by Supabase—your data stays
              private and in sync.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </section>
  );
}
