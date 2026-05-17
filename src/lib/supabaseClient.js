import { createClient } from "@supabase/supabase-js";

let client = null;

function getEnv(name, legacyName) {
  return process.env[name] || process.env[legacyName];
}

export function getSupabase() {
  if (client) return client;

  const supabaseUrl = getEnv(
    "NEXT_PUBLIC_SUPABASE_URL",
    "VITE_SUPABASE_URL"
  );
  const supabaseAnonKey = getEnv(
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "VITE_SUPABASE_ANON_KEY"
  );

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  client = createClient(supabaseUrl, supabaseAnonKey);
  return client;
}

if (
  typeof window === "undefined" &&
  !getEnv("NEXT_PUBLIC_SUPABASE_URL", "VITE_SUPABASE_URL")
) {
  console.warn(
    "Supabase URL or anon key is missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment."
  );
}

export const supabase = new Proxy(
  {},
  {
    get(_target, prop) {
      const instance = getSupabase();
      if (!instance) {
        throw new Error(
          "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
        );
      }
      const value = instance[prop];
      return typeof value === "function" ? value.bind(instance) : value;
    },
  }
);

export const signUpWithEmail = async ({ email, password, metadata }) => {
  const sb = getSupabase();
  if (!sb) throw new Error("Supabase is not configured.");
  return sb.auth.signUp({
    email,
    password,
    options: { data: metadata },
  });
};

export const signInWithEmail = async ({ email, password }) => {
  const sb = getSupabase();
  if (!sb) throw new Error("Supabase is not configured.");
  return sb.auth.signInWithPassword({ email, password });
};

export const signOut = async () => {
  const sb = getSupabase();
  if (!sb) return { error: new Error("Supabase is not configured.") };
  return sb.auth.signOut();
};
