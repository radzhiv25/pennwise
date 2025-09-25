import { createContext, useContext, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { supabase } from "@/lib/supabaseClient";

const AuthContext = createContext({ session: null, user: null, loading: true });

export const AuthProvider = ({ children }) => {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const initializeAuth = async () => {
            const { data, error } = await supabase.auth.getSession();

            if (error) {
                console.error("Error fetching initial session", error);
            }

            if (isMounted) {
                setSession(data?.session ?? null);
                setLoading(false);
            }
        };

        initializeAuth();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, newSession) => {
            setSession(newSession);
        });

        return () => {
            isMounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const value = useMemo(
        () => ({
            session,
            user: session?.user ?? null,
            loading,
        }),
        [session, loading]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
