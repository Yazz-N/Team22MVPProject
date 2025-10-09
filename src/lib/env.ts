export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
export const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
export const EMAIL_PROVIDER = import.meta.env.VITE_EMAIL_PROVIDER as string | undefined;
export const EMAIL_API_KEY = import.meta.env.VITE_EMAIL_API_KEY as string | undefined;
export const EMAIL_FROM = import.meta.env.VITE_EMAIL_FROM as string | undefined;
export const supabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON);
export const isDevBypass = String(import.meta.env.VITE_AUTH_BYPASS).toLowerCase() === 'true';