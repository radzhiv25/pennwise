"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import { useAuth } from "@/context/AuthContext";

export function SignupPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/app");
    }
  }, [user, loading, router]);

  if (loading || user) {
    return null;
  }

  return (
    <AuthForm
      mode="sign-up"
      onSignUpSuccess={() => router.replace("/login?fromSignup=1")}
    />
  );
}
