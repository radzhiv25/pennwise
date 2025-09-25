import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase URL or anon key is missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const signUpWithEmail = async ({ email, password, metadata }) =>
  supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  });

export const signInWithEmail = async ({ email, password }) =>
  supabase.auth.signInWithPassword({ email, password });

export const signOut = async () => supabase.auth.signOut();
