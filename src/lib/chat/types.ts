export type ChatMessage = {
  id: string;
  threadid: string;
  userid: string | null;   // Supabase auth user id if available
  role: "user" | "assistant" | "system";
  content: string;         // limit user input to 250 chars in UI
  createdat: string;       // ISO
};

export type ChatThread = {
  id: string;
  userid: string | null;
  title: string;           // e.g., "Dashboard help"
  createdat: string;
  updatedat: string;
};