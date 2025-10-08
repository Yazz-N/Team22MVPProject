import { supabase } from "../supabaseClient";
import { DataStore, Flow, Activity, Booking } from "./types";

export const supabaseStore: DataStore = {
  async listFlows() { 
    const { data } = await supabase.from("flows").select("*").order("createdAt", { ascending: false }); 
    return (data ?? []) as Flow[]; 
  },
  async addFlow(flow) { 
    await supabase.from("flows").insert(flow); 
  },
  async deleteFlow(id) { 
    await supabase.from("flows").delete().eq("id", id); 
  },
  async listActivity() { 
    const { data } = await supabase.from("activity").select("*").order("createdAt", { ascending: false }); 
    return (data ?? []) as Activity[]; 
  },
  async addActivity(item) { 
    await supabase.from("activity").insert(item); 
  },
  async addBooking(b) { 
    await supabase.from("bookings").insert(b); 
  },
};