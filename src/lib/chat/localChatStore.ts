import type { ChatMessage, ChatThread } from "./types";

const TKEY = "opsChatThreads";
const MKEY = "opsChatMessages";

const read = <T>(k:string,d:T)=>JSON.parse(localStorage.getItem(k) ?? JSON.stringify(d)) as T;
const write=(k:string,v:unknown)=>localStorage.setItem(k, JSON.stringify(v));

export const localChatStore = {
  async getOrCreateThreadForUser(userid: string | null): Promise<ChatThread> {
    const threads = read<ChatThread[]>(TKEY, []);
    let th = threads.find(t => t.userid === userid) ?? threads[0];
    if (!th) {
      th = { id: crypto.randomUUID(), userid, title: "Assistant", createdat: new Date().toISOString(), updatedat: new Date().toISOString() };
      threads.unshift(th); write(TKEY, threads);
    }
    return th;
  },
  async listMessages(threadid: string): Promise<ChatMessage[]> {
    const all = read<ChatMessage[]>(MKEY, []);
    return all.filter(m => m.threadid === threadid).sort((a,b)=>a.createdat.localeCompare(b.createdat));
  },
  async addMessage(m: ChatMessage): Promise<void> {
    const all = read<ChatMessage[]>(MKEY, []); all.push(m); write(MKEY, all);
    const threads = read<ChatThread[]>(TKEY, []);
    const idx = threads.findIndex(t=>t.id===m.threadid);
    if (idx>=0){ threads[idx].updatedat = m.createdat; write(TKEY, threads); }
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
  },
  async clearThread(threadId: string): Promise<void> {
    const messages = read<ChatMessage[]>(MKEY, []).filter(m => m.threadid !== threadId);
    write(MKEY, messages);
  }
};