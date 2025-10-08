import { supabaseConfigured } from "../env";
import { localStore } from "./localStore";
import { supabaseStore } from "./supabaseStore";
import type { DataStore } from "./types";

const primary: DataStore = (supabaseConfigured ? supabaseStore : localStore);
const fallback: DataStore = localStore;

export const store: DataStore = {
  async listFlows() { 
    try { 
      return await primary.listFlows(); 
    } catch { 
      return fallback.listFlows(); 
    } 
  },
  async addFlow(f) { 
    try { 
      return await primary.addFlow(f); 
    } catch { 
      return fallback.addFlow(f); 
    } 
  },
  async deleteFlow(id) { 
    try { 
      return await primary.deleteFlow(id); 
    } catch { 
      return fallback.deleteFlow(id); 
    } 
  },
  async listActivity() { 
    try { 
      return await primary.listActivity(); 
    } catch { 
      return fallback.listActivity(); 
    } 
  },
  async addActivity(a) { 
    try { 
      return await primary.addActivity(a); 
    } catch { 
      return fallback.addActivity(a); 
    } 
  },
  async addBooking(b) { 
    try { 
      return await primary.addBooking(b); 
    } catch { 
      return fallback.addBooking(b); 
    } 
  },
  async listChatThreads(){ try { return await primary.listChatThreads(); } catch { return fallback.listChatThreads(); } },
  async addChatThread(t){ try { return await primary.addChatThread(t); } catch { return fallback.addChatThread(t); } },
  async updateChatThread(id,u){ try { return await primary.updateChatThread(id,u); } catch { return fallback.updateChatThread(id,u); } },
  async deleteChatThread(id){ try { return await primary.deleteChatThread(id); } catch { return fallback.deleteChatThread(id); } },
  async listChatMessages(tid){ try { return await primary.listChatMessages(tid); } catch { return fallback.listChatMessages(tid); } },
  async addChatMessage(m){ try { return await primary.addChatMessage(m); } catch { return fallback.addChatMessage(m); } },
};