import { DataStore, Flow, Activity, Booking } from "./types";

const FKEY = "opsFlows";
const AKEY = "opsActivity"; 
const BKEY = "opsBookings";

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
};