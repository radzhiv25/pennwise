"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import PropTypes from "prop-types";
import { getSupabase } from "@/lib/supabaseClient";

const AuthContext = createContext({
  session: null,
  user: null,
  loading: true,
  syncSession: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const syncSession = useCallback(async () => {
    const supabase = getSupabase();
    if (!supabase) {
      setSession(null);
      setLoading(false);
      return null;
    }

    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error("Error syncing session", error);
    }

    const nextSession = data?.session ?? null;
    setSession(nextSession);
    setLoading(false);
    return nextSession;
  }, []);

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      await syncSession();
      if (!isMounted) return;
    };

    initializeAuth();

    const supabase = getSupabase();
    if (!supabase) {
      return undefined;
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!isMounted) return;
      setSession(newSession);
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [syncSession]);

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
      syncSession,
    }),
    [session, loading, syncSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
