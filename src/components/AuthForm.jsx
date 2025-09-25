import { useState } from "react";
import PropTypes from "prop-types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signInWithEmail, signUpWithEmail } from "@/lib/supabaseClient";

const AuthForm = ({ onAuthSuccess }) => {
    const [mode, setMode] = useState("sign-in");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const resetMessages = () => {
        setError(null);
        setSuccessMessage(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        resetMessages();

        if (mode === "sign-up" && password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            if (mode === "sign-in") {
                const { error } = await signInWithEmail({ email, password });
                if (error) throw error;
                onAuthSuccess?.();
            } else {
                const { error } = await signUpWithEmail({ email, password });
                if (error) throw error;
                setSuccessMessage("Check your inbox for a confirmation email. Once confirmed, sign in to continue.");
                setMode("sign-in");
            }
        } catch (authError) {
            console.error("Auth error", authError);
            setError(authError.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="max-w-md mx-auto">
            <CardHeader>
                <CardTitle>{mode === "sign-in" ? "Welcome Back" : "Create an Account"}</CardTitle>
                <CardDescription>
                    {mode === "sign-in"
                        ? "Sign in with your email and password to access your transactions."
                        : "Sign up with your email and a secure password to start tracking expenses."}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="auth-email">Email</Label>
                        <Input
                            id="auth-email"
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                            autoComplete="email"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="auth-password">Password</Label>
                        <Input
                            id="auth-password"
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required
                            autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
                        />
                    </div>
                    {mode === "sign-up" && (
                        <div className="space-y-2">
                            <Label htmlFor="auth-confirm-password">Confirm Password</Label>
                            <Input
                                id="auth-confirm-password"
                                type="password"
                                value={confirmPassword}
                                onChange={(event) => setConfirmPassword(event.target.value)}
                                required
                                autoComplete="new-password"
                            />
                        </div>
                    )}
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    {successMessage && <p className="text-sm text-green-600">{successMessage}</p>}
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Please wait..." : mode === "sign-in" ? "Sign In" : "Sign Up"}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
                <Button
                    type="button"
                    variant="ghost"
                    className="text-sm"
                    onClick={() => {
                        resetMessages();
                        setMode((prev) => (prev === "sign-in" ? "sign-up" : "sign-in"));
                    }}
                >
                    {mode === "sign-in" ? "Need an account? Sign up" : "Already have an account? Sign in"}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                    We currently support email/password authentication powered by Supabase.
                </p>
            </CardFooter>
        </Card>
    );
};

AuthForm.propTypes = {
    onAuthSuccess: PropTypes.func,
};

export default AuthForm;
