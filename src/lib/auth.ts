import { supabase } from "./supabaseClient";
import { supabaseConfigured } from "./env";

const KEY = "authed";

export async function isAuthed(): Promise<boolean> {
  if (supabaseConfigured && supabase) {
    const { data } = await supabase.auth.getSession();
    return Boolean(data?.session);
  }
  return localStorage.getItem(KEY) === "1";
}

export async function signInWithEmail(email: string, password: string) {
  if (supabaseConfigured && supabase) {
    return supabase.auth.signInWithPassword({ email, password });
  }
  localStorage.setItem(KEY, "1");
  return { data: { user: { email } }, error: null };
}

export async function signOut() {
  if (supabaseConfigured && supabase) await supabase.auth.signOut();
  localStorage.removeItem(KEY);
}