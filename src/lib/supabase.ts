import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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