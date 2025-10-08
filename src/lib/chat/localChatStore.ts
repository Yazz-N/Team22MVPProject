import type { ChatMessage, ChatThread } from "./types";

const TKEY = "opsChatThreads";
const MKEY = "opsChatMessages";

const read = <T>(k:string,d:T)=>JSON.parse(localStorage.getItem(k) ?? JSON.stringify(d)) as T;
const write=(k:string,v:unknown)=>localStorage.setItem(k, JSON.stringify(v));

export const localChatStore = {
  async getOrCreateThreadForUser(userId: string | null): Promise<ChatThread> {
    const threads = read<ChatThread[]>(TKEY, []);
    let th = threads.find(t => t.userId === userId) ?? threads[0];
    if (!th) {
      th = { id: crypto.randomUUID(), userId, title: "Assistant", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      threads.unshift(th); write(TKEY, threads);
    }
    return th;
  },
  async listMessages(threadId: string): Promise<ChatMessage[]> {
    const all = read<ChatMessage[]>(MKEY, []);
    return all.filter(m => m.threadId === threadId).sort((a,b)=>a.createdAt.localeCompare(b.createdAt));
  },
  async addMessage(m: ChatMessage): Promise<void> {
    const all = read<ChatMessage[]>(MKEY, []); all.push(m); write(MKEY, all);
    const threads = read<ChatThread[]>(TKEY, []);
    const idx = threads.findIndex(t=>t.id===m.threadId);
    if (idx>=0){ threads[idx].updatedAt = m.createdAt; write(TKEY, threads); }
  },
  async clearThread(threadId: string): Promise<void> {
    const messages = read<ChatMessage[]>(MKEY, []).filter(m => m.threadId !== threadId);
    write(MKEY, messages);
  }
};