"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import { useAuth } from "@/context/AuthContext";

export function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromSignup = searchParams.get("fromSignup") === "1";

  useEffect(() => {
    if (!loading && user) {
      router.replace("/app");
    }
  }, [user, loading, router]);

  if (loading || user) {
    return null;
  }

  return (
    <div className="flex justify-center">
      <div className="space-y-4">
        {fromSignup && (
          <p className="rounded-lg border border-border bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
            Check your inbox for a confirmation email. Once confirmed, sign in
            below.
          </p>
        )}
        <AuthForm onSignInSuccess={() => router.replace("/app")} />
      </div>
    </div>
  );
}
