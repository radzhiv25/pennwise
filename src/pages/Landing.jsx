import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import LandingCTA from "@/components/LandingCTA";
import { useAuth } from "@/context/AuthContext";
import { AuroraText } from "@/components/ui/aurora-text";

const Landing = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-[calc(100vh-10rem)] flex flex-col">
            <section className="container mx-auto px-4 py-20 flex-1 grid gap-16 lg:grid-cols-2 items-center">
                <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-4 py-1 text-sm text-muted-foreground w-max">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <AuroraText className="text-sm">Your personal finance copilot</AuroraText>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                        Master your money with <AuroraText className="text-primary">PennWise</AuroraText>
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-xl">
                        Capture every transaction, stay on top of to-dos and monitor progress with powerful visualisations—all synced securely with Supabase.
                    </p>
                    <LandingCTA />
                    <p className="text-sm text-muted-foreground">
                        Already tracking finances? <Link to="/login" className="text-primary underline-offset-4 hover:underline">Sign in</Link>.
                    </p>
                </div>
                <div className="space-y-6">
                    <div className="rounded-3xl border border-border bg-background/80 p-6 shadow-lg backdrop-blur">
                        <h2 className="text-xl font-semibold mb-4">Everything you need to stay organised</h2>
                        <p className="text-sm text-muted-foreground mb-4">
                            Head to the dashboard to continue tracking, or sign out from the navbar if you need to switch accounts.
                        </p>
                        {/* <Link to="/app" className="inline-flex items-center gap-2 text-primary font-medium">
                            Go to dashboard
                            <ArrowRight className="h-4 w-4" />
                        </Link> */}
                    </div>

                    <div className="rounded-3xl border border-border bg-muted/30 p-6">
                        <h3 className="text-lg font-medium mb-3">Why PennWise?</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Built with React, Vite, Tailwind, and Supabase, PennWise gives you a friendly interface backed by secure authentication and scalable storage.
                        </p>
                        <Link to={user ? "/app" : "/login"} className="inline-flex items-center gap-2 text-primary font-medium">
                            {user ? "Explore the dashboard" : "Explore the dashboard after signing in"}
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Landing;
