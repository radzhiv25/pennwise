"use client";

import PropTypes from "prop-types";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

const AuthGate = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground animate-pulse">
          Opening dashboard…
        </p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return children;
};

AuthGate.propTypes = {
  children: PropTypes.node,
};

export default AuthGate;
