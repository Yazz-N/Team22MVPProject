import { supabase } from "./supabaseClient";
import { supabaseConfigured } from "./env";

const KEY = "authed";

// Dev-only bypass check
const isDevBypass = () => import.meta.env.VITE_AUTH_BYPASS === 'true';

export async function isAuthed(): Promise<boolean> {
  // Dev bypass for dashboard preview
  if (isDevBypass()) {
    return true;
  }
  
  if (supabaseConfigured && supabase) {
    const { data } = await supabase.auth.getSession();
    return Boolean(data?.session);
  }
  return localStorage.getItem(KEY) === "1";
}

export async function signInWithEmail(email: string, password: string) {
  // Dev bypass - simulate successful sign-in
  if (isDevBypass()) {
    localStorage.setItem(KEY, "1");
    return Promise.resolve({ data: { user: { email: "dev@example.com" } }, error: null });
  }
  
  if (supabaseConfigured && supabase) {
    return supabase.auth.signInWithPassword({ email, password });
  }
  localStorage.setItem(KEY, "1");
  return { data: { user: { email } }, error: null };
}

export async function signOut() {
  // Dev bypass - clear local flag
  if (isDevBypass()) {
    localStorage.removeItem(KEY);
    return;
  }
  
  if (supabaseConfigured && supabase) await supabase.auth.signOut();
  localStorage.removeItem(KEY);
}