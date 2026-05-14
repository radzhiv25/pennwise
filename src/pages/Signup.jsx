import { Navigate, useNavigate } from "react-router-dom";
import AuthForm from "@/components/AuthForm";
import { useAuth } from "@/context/AuthContext";

const Signup = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    if (user) {
        return <Navigate to="/app" replace />;
    }

    return (
        <AuthForm
            initialMode="sign-up"
            onSignUpSuccess={() =>
                navigate("/login", { replace: true, state: { fromSignup: true } })
            }
        />
    );
};

export default Signup;
