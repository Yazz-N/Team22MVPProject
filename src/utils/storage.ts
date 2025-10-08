// Hybrid storage utility that prefers Supabase but falls back to localStorage
import { supabase, isSupabaseAvailable } from '../lib/supabase';

export interface ProcessFlow {
  id: string;
  filename: string;
  createdAt: string;
  status: 'Draft' | 'Published';
  steps: string[];
}

export interface Activity {
  id: string;
  action: string;
  timestamp: string;
}

// Auth functions
export const checkAuth = async (): Promise<{ isAuthenticated: boolean; email: string }> => {
  if (isSupabaseAvailable()) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        return {
          isAuthenticated: true,
          email: session.user.email || 'user@example.com'
        };
      }
    } catch (error) {
      console.warn('Supabase auth check failed, falling back to localStorage:', error);
    }
  }
  
  // Fallback to localStorage
  const authed = localStorage.getItem('authed');
  return {
    isAuthenticated: authed === '1',
    email: localStorage.getItem('userEmail') || 'user@example.com'
  };
};

export const signOut = async (): Promise<void> => {
  if (isSupabaseAvailable()) {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.warn('Supabase sign out failed, clearing localStorage:', error);
    }
  }
  
  // Always clear localStorage as fallback
  localStorage.removeItem('authed');
  localStorage.removeItem('userEmail');
};

export const signIn = async (email: string): Promise<void> => {
  if (isSupabaseAvailable()) {
    try {
      // In a real implementation, this would handle actual Supabase sign-in
      // For now, we'll just set localStorage as fallback
    } catch (error) {
      console.warn('Supabase sign in failed, using localStorage:', error);
    }
  }
  
  // Set localStorage auth
  localStorage.setItem('authed', '1');
  localStorage.setItem('userEmail', email);
};

// Process Flow functions
export const getProcessFlows = async (): Promise<ProcessFlow[]> => {
  if (isSupabaseAvailable()) {
    try {
      // In a real implementation, this would fetch from Supabase
      // For now, fall back to localStorage
    } catch (error) {
      console.warn('Supabase process flows fetch failed, using localStorage:', error);
    }
  }
  
  // Fallback to localStorage
  return JSON.parse(localStorage.getItem('opsFlows') || '[]');
};

export const saveProcessFlow = async (flow: ProcessFlow): Promise<void> => {
  if (isSupabaseAvailable()) {
    try {
      // In a real implementation, this would save to Supabase
      // For now, fall back to localStorage
    } catch (error) {
      console.warn('Supabase process flow save failed, using localStorage:', error);
    }
  }
  
  // Always save to localStorage as fallback
  const flows = await getProcessFlows();
  const updatedFlows = [...flows, flow];
  localStorage.setItem('opsFlows', JSON.stringify(updatedFlows));
};

export const deleteProcessFlow = async (id: string): Promise<void> => {
  if (isSupabaseAvailable()) {
    try {
      // In a real implementation, this would delete from Supabase
      // For now, fall back to localStorage
    } catch (error) {
      console.warn('Supabase process flow delete failed, using localStorage:', error);
    }
  }
  
  // Always update localStorage as fallback
  const flows = await getProcessFlows();
  const updatedFlows = flows.filter(f => f.id !== id);
  localStorage.setItem('opsFlows', JSON.stringify(updatedFlows));
};

// Activity functions
export const getActivities = async (): Promise<Activity[]> => {
  if (isSupabaseAvailable()) {
    try {
      // In a real implementation, this would fetch from Supabase
      // For now, fall back to localStorage
    } catch (error) {
      console.warn('Supabase activities fetch failed, using localStorage:', error);
    }
  }
  
  // Fallback to localStorage
  return JSON.parse(localStorage.getItem('opsActivity') || '[]');
};

export const saveActivity = async (activity: Activity): Promise<void> => {
  if (isSupabaseAvailable()) {
    try {
      // In a real implementation, this would save to Supabase
      // For now, fall back to localStorage
    } catch (error) {
      console.warn('Supabase activity save failed, using localStorage:', error);
    }
  }
  
  // Always save to localStorage as fallback
  const activities = await getActivities();
  const updatedActivities = [activity, ...activities];
  localStorage.setItem('opsActivity', JSON.stringify(updatedActivities));
};