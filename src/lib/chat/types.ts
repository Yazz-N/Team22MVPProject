export type ChatMessage = {
  id: string;
  threadId: string;
  userId: string | null;   // Supabase auth user id if available
  role: "user" | "assistant" | "system";
  content: string;         // limit user input to 250 chars in UI
  createdAt: string;       // ISO
};

export type ChatThread = {
  id: string;
  userId: string | null;
  title: string;           // e.g., "Dashboard help"
  createdAt: string;
  updatedAt: string;
};