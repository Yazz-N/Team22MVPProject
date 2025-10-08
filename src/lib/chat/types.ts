export type ChatMessage = {
  id: string;
  thread_id: string;
  user_id: string | null;   // Supabase auth user id if available
  role: "user" | "assistant" | "system";
  content: string;         // limit user input to 250 chars in UI
  created_at: string;       // ISO
};

export type ChatThread = {
  id: string;
  user_id: string | null;
  title: string;           // e.g., "Dashboard help"
  created_at: string;
  updated_at: string;
};