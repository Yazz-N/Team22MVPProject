import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase: any = null;
let supabaseAvailable = false;

try {
  if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    supabaseAvailable = true;
  }
} catch (error) {
  console.warn('Supabase initialisation failed, falling back to localStorage:', error);
  supabaseAvailable = false;
}

export { supabase };
export const isSupabaseAvailable = () => supabaseAvailable;

export type Database = {
  public: {
    Tables: {
      bookings: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          notes: string | null;
          pain_points: {
            workflowChallenge: string;
            sopManagement: string;
            mainGoal: string;
            limitingTools: string;
            demoPreparation: string;
          };
          date: string;
          time: string;
          timezone_selected: string;
          utc_start: string;
          duration_minutes: number;
          created_at: string;
          status: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          email: string;
          notes?: string | null;
          pain_points: {
            workflowChallenge: string;
            sopManagement: string;
            mainGoal: string;
            limitingTools: string;
            demoPreparation: string;
          };
          date: string;
          time: string;
          timezone_selected: string;
          utc_start: string;
          duration_minutes: number;
          created_at?: string;
          status?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          notes?: string | null;
          pain_points?: {
            workflowChallenge: string;
            sopManagement: string;
            mainGoal: string;
            limitingTools: string;
            demoPreparation: string;
          };
          date?: string;
          time?: string;
          timezone_selected?: string;
          utc_start?: string;
          duration_minutes?: number;
          created_at?: string;
          status?: string;
        };
      };
    };
  };
};