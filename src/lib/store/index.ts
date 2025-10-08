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
};