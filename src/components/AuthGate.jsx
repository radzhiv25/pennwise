import PropTypes from "prop-types";
import { useAuth } from "@/context/AuthContext";
import AuthForm from "@/components/AuthForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AuthGate = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="max-w-md w-full mx-4">
                    <CardHeader>
                        <CardTitle>Loading...</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Checking your session, please wait.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <AuthForm />
            </div>
        );
    }

    return children;
};

AuthGate.propTypes = {
    children: PropTypes.node,
};

export default AuthGate;
