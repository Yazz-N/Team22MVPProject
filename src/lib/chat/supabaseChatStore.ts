import { supabase } from "../supabaseClient";
import type { ChatMessage, ChatThread } from "./types";

export const supabaseChatStore = {
  async getOrCreateThreadForUser(userId: string | null): Promise<ChatThread> {
    // 1 thread per user for MVP
    const { data: existing } = await supabase.from("chat_threads").select("*").eq("userId", userId).order("updatedAt", { ascending: false }).limit(1);
    if (existing && existing.length) return existing[0] as ChatThread;
    const thread: ChatThread = { id: crypto.randomUUID(), userId, title: "Assistant", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    await supabase.from("chat_threads").insert(thread);
    return thread;
  },
  async listMessages(threadId: string): Promise<ChatMessage[]> {
    const { data } = await supabase.from("chat_messages").select("*").eq("threadId", threadId).order("createdAt", { ascending: true });
    return (data ?? []) as ChatMessage[];
  },
  async addMessage(m: ChatMessage): Promise<void> {
    await supabase.from("chat_messages").insert(m);
    await supabase.from("chat_threads").update({ updatedAt: m.createdAt }).eq("id", m.threadId);
  },
  async clearThread(threadId: string): Promise<void> {
    // For MVP, add a system message instead of deleting
    const clearMessage: ChatMessage = {
      id: crypto.randomUUID(),
      threadId,
      userId: null,
      role: "system",
      content: "Conversation cleared",
      createdAt: new Date().toISOString()
    };
    await this.addMessage(clearMessage);
  }
};