"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import { useAuth } from "@/context/AuthContext";

function SigningInState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="size-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      <p className="text-sm text-muted-foreground">Signing you in…</p>
    </div>
  );
}

export function LoginPage() {
  const { user, loading, syncSession } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromSignup = searchParams.get("fromSignup") === "1";
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace("/app");
    }
  }, [user, loading, router]);

  const handleSignInSuccess = async () => {
    setIsRedirecting(true);
    await syncSession();
    router.replace("/app");
  };

  if (isRedirecting || (!loading && user)) {
    return <SigningInState />;
  }

  if (loading) {
    return null;
  }

  return (
    <div className="space-y-6">
      {fromSignup && (
        <p className="rounded-md border border-border bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
          Check your inbox for a confirmation email. Once confirmed, sign in
          below.
        </p>
      )}
      <AuthForm mode="sign-in" onSignInSuccess={handleSignInSuccess} />
    </div>
  );
}
