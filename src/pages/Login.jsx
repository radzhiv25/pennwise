import { Navigate, useNavigate, useLocation } from "react-router-dom";
import AuthForm from "@/components/AuthForm";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const fromSignup = Boolean(location.state?.fromSignup);

    if (user) {
        return <Navigate to="/app" replace />;
    }

    return (
        <div className="space-y-4">
            {fromSignup && (
                <p className="rounded-lg border border-border bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
                    Check your inbox for a confirmation email. Once confirmed, sign in below.
                </p>
            )}
            <AuthForm onSignInSuccess={() => navigate("/app", { replace: true })} />
        </div>
    );
};

export default Login;
