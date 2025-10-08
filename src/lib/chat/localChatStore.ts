import type { ChatMessage, ChatThread } from "./types";

const TKEY = "opsChatThreads";
const MKEY = "opsChatMessages";

const read = <T>(k:string,d:T)=>JSON.parse(localStorage.getItem(k) ?? JSON.stringify(d)) as T;
const write=(k:string,v:unknown)=>localStorage.setItem(k, JSON.stringify(v));

export const localChatStore = {
  async getOrCreateThreadForUser(user_id: string | null): Promise<ChatThread> {
    const threads = read<ChatThread[]>(TKEY, []);
    let th = threads.find(t => t.user_id === user_id) ?? threads[0];
    if (!th) {
      th = { id: crypto.randomUUID(), user_id, title: "Assistant", created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
      threads.unshift(th); write(TKEY, threads);
    }
    return th;
  },
  async listMessages(thread_id: string): Promise<ChatMessage[]> {
    const all = read<ChatMessage[]>(MKEY, []);
    return all.filter(m => m.thread_id === thread_id).sort((a,b)=>a.created_at.localeCompare(b.created_at));
  },
  async addMessage(m: ChatMessage): Promise<void> {
    const all = read<ChatMessage[]>(MKEY, []); all.push(m); write(MKEY, all);
    const threads = read<ChatThread[]>(TKEY, []);
    const idx = threads.findIndex(t=>t.id===m.thread_id);
    if (idx>=0){ threads[idx].updated_at = m.created_at; write(TKEY, threads); }
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
  },
  async clearThread(threadId: string): Promise<void> {
    const messages = read<ChatMessage[]>(MKEY, []).filter(m => m.threadId !== threadId);
    write(MKEY, messages);
  }
};