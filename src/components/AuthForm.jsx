"use client";

import { useState } from "react";
import Link from "next/link";
import PropTypes from "prop-types";
import { EyeIcon, EyeSlashIcon } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { signInWithEmail, signUpWithEmail } from "@/lib/supabaseClient";

const AuthForm = ({
  mode = "sign-in",
  onAuthSuccess,
  onSignInSuccess,
  onSignUpSuccess,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const { syncSession } = useAuth();
  const isSignIn = mode === "sign-in";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!isSignIn && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      if (isSignIn) {
        const { error: authError } = await signInWithEmail({ email, password });
        if (authError) throw authError;
        await syncSession();
        await (onSignInSuccess ?? onAuthSuccess)?.();
      } else {
        const { error: authError } = await signUpWithEmail({ email, password });
        if (authError) throw authError;
        onSignUpSuccess?.();
      }
    } catch (authError) {
      console.error("Auth error", authError);
      setError(
        authError.message || "Something went wrong. Please try again."
      );
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-8 border p-4">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          {isSignIn ? "Welcome back" : "Create your account"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isSignIn
            ? "Sign in with your email to open your dashboard."
            : "Sign up with your email and a secure password to start tracking."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <FormField label="Email" htmlFor="auth-email">
          <Input
            id="auth-email"
            type="email"
            placeholder="you@email.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoComplete="email"
          />
        </FormField>

        <FormField label="Password" htmlFor="auth-password">
          <div className="relative">
            <Input
              id="auth-password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete={isSignIn ? "current-password" : "new-password"}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeSlashIcon className="size-4" />
              ) : (
                <EyeIcon className="size-4" />
              )}
            </button>
          </div>
        </FormField>

        {!isSignIn && (
          <FormField label="Confirm password" htmlFor="auth-confirm-password">
            <Input
              id="auth-confirm-password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
              autoComplete="new-password"
            />
          </FormField>
        )}

        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        {successMessage && (
          <p className="text-sm text-income">{successMessage}</p>
        )}

        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading
            ? isSignIn
              ? "Signing in…"
              : "Creating account…"
            : isSignIn
              ? "Sign in"
              : "Create account"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        {isSignIn ? (
          <>
            New here?{" "}
            <Link
              href="/signup"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Create an account
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </>
        )}
      </p>
    </div>
  );
};

AuthForm.propTypes = {
  mode: PropTypes.oneOf(["sign-in", "sign-up"]),
  onAuthSuccess: PropTypes.func,
  onSignInSuccess: PropTypes.func,
  onSignUpSuccess: PropTypes.func,
};

export default AuthForm;
