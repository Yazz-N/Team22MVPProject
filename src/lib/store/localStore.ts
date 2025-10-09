import { DataStore, Flow, Activity, Booking, ChatThread, ChatMessage } from "./types";

const FKEY = "opsFlows";
const AKEY = "opsActivity"; 
const BKEY = "opsBookings";
const TKEY = "opsChatThreads";
const MKEY = "opsChatMessages";

const read = <T>(k: string, d: T) => JSON.parse(localStorage.getItem(k) ?? JSON.stringify(d)) as T;
const write = (k: string, v: unknown) => localStorage.setItem(k, JSON.stringify(v));

export const localStore: DataStore = {
  async listFlows() { 
    return read<Flow[]>(FKEY, []); 
  },
  async addFlow(flow) { 
    const all = read<Flow[]>(FKEY, []); 
    all.unshift(flow); 
    write(FKEY, all); 
  },
  async deleteFlow(id) { 
    const all = read<Flow[]>(FKEY, []).filter(f => f.id !== id); 
    write(FKEY, all); 
  },
  async listActivity() { 
    return read<Activity[]>(AKEY, []); 
  },
  async addActivity(it) { 
    const all = read<Activity[]>(AKEY, []); 
    all.unshift(it); 
    write(AKEY, all); 
  },
  async addBooking(b) { 
    const all = read<Booking[]>(BKEY, []); 
    all.unshift(b); 
    write(BKEY, all); 
  },
  async listChatThreads() {
    return read<ChatThread[]>(TKEY, []);
  },
  async addChatThread(thread) {
    const all = read<ChatThread[]>(TKEY, []);
    all.unshift(thread);
    write(TKEY, all);
  },
  async deleteChatThread(id) {
    const threads = read<ChatThread[]>(TKEY, []).filter(t => t.id !== id);
    write(TKEY, threads);
    // Also delete messages for this thread
    const messages = read<ChatMessage[]>(MKEY, []).filter(m => m.thread_id !== id);
    write(MKEY, messages);
  },
  async listChatMessages(thread_id) {
    const all = read<ChatMessage[]>(MKEY, []);
    return all.filter(m => m.thread_id === thread_id);
  },
  async addChatMessage(message) {
    const all = read<ChatMessage[]>(MKEY, []);
    all.push(message);
    write(MKEY, all);
  }
};