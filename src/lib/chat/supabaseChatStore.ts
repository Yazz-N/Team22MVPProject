import { supabase } from "../supabaseClient";
import type { ChatMessage, ChatThread } from "./types";

export const supabaseChatStore = {
  async getOrCreateThreadForUser(userid: string | null): Promise<ChatThread> {
    // 1 thread per user for MVP
    const { data: existing } = await supabase.from("chat_threads").select("*").eq("userid", userid).order("updatedat", { ascending: false }).limit(1);
    if (existing && existing.length) return existing[0] as ChatThread;
    const thread: ChatThread = { id: crypto.randomUUID(), userid, title: "Assistant", createdat: new Date().toISOString(), updatedat: new Date().toISOString() };
    await supabase.from("chat_threads").insert(thread);
    return thread;
  },
  async listMessages(threadid: string): Promise<ChatMessage[]> {
    const { data } = await supabase.from("chat_messages").select("*").eq("threadid", threadid).order("createdat", { ascending: true });
    return (data ?? []) as ChatMessage[];
  },
  async addMessage(m: ChatMessage): Promise<void> {
    await supabase.from("chat_messages").insert(m);
    await supabase.from("chat_threads").update({ updatedat: m.createdat }).eq("id", m.threadid);
  },
  async clearThread(threadid: string): Promise<void> {
    // For MVP, add a system message instead of deleting
    const clearMessage: ChatMessage = {
      id: crypto.randomUUID(),
      threadid,
      userid: null,
      role: "system",
      content: "Conversation cleared",
      createdat: new Date().toISOString()
    };
    await this.addMessage(clearMessage);
  }
};