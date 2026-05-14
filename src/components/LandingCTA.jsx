import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const LandingCTA = () => {
    return (
        <div className="flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
                <Link to="/signup" className="inline-flex items-center gap-2">
                    Get started
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
                <Link to="/login">Log in</Link>
            </Button>
        </div>
    );
};

export default LandingCTA;
