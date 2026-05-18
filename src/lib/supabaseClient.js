import { createClient } from "@supabase/supabase-js";

let client = null;

// Next.js only inlines NEXT_PUBLIC_* when accessed with literal property names.
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.VITE_SUPABASE_ANON_KEY;

export function isSupabaseConfigured() {
  return Boolean(supabaseUrl?.trim() && supabaseAnonKey?.trim());
}

export function getSupabase() {
  if (client) return client;

  if (!isSupabaseConfigured()) {
    return null;
  }

  client = createClient(supabaseUrl, supabaseAnonKey);
  return client;
}

if (typeof window === "undefined" && !isSupabaseConfigured()) {
  console.warn(
    "Supabase URL or anon key is missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local or .env, then restart the dev server."
  );
}

export const supabase = new Proxy(
  {},
  {
    get(_target, prop) {
      const instance = getSupabase();
      if (!instance) {
        throw new Error(
          "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local or .env, then restart the dev server."
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
