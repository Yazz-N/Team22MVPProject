import { supabase } from "../supabaseClient";
import type { ChatMessage, ChatThread } from "./types";

export const supabaseChatStore = {
  async getOrCreateThreadForUser(user_id: string | null): Promise<ChatThread> {
    // 1 thread per user for MVP
    const { data: existing } = await supabase.from("chat_threads").select("*").eq("user_id", user_id).order("updated_at", { ascending: false }).limit(1);
    if (existing && existing.length) return existing[0] as ChatThread;
    const thread: ChatThread = { id: crypto.randomUUID(), user_id, title: "Assistant", created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    await supabase.from("chat_threads").insert(thread);
    return thread;
  },
  async listMessages(thread_id: string): Promise<ChatMessage[]> {
    const { data } = await supabase.from("chat_messages").select("*").eq("thread_id", thread_id).order("created_at", { ascending: true });
    return (data ?? []) as ChatMessage[];
  },
  async addMessage(m: ChatMessage): Promise<void> {
    await supabase.from("chat_messages").insert(m);
    await supabase.from("chat_threads").update({ updated_at: m.created_at }).eq("id", m.thread_id);
  },
  async clearThread(thread_id: string): Promise<void> {
    // For MVP, add a system message instead of deleting
    const clearMessage: ChatMessage = {
      id: crypto.randomUUID(),
      thread_id,
      user_id: null,
      role: "system",
      content: "Conversation cleared",
      created_at: new Date().toISOString()
    };
    await this.addMessage(clearMessage);
  }
};