import { supabase } from "../supabaseClient";
import { DataStore, Flow, Activity, Booking, ChatThread, ChatMessage } from "./types";

export const supabaseStore: DataStore = {
  async listFlows() { 
    const { data } = await supabase.from("flows").select("*").order("createdat", { ascending: false }); 
    return (data ?? []) as Flow[]; 
  },
  async addFlow(flow) { 
    await supabase.from("flows").insert(flow); 
  },
  async deleteFlow(id) { 
    await supabase.from("flows").delete().eq("id", id); 
  },
  async listActivity() { 
    const { data } = await supabase.from("activity").select("*").order("createdat", { ascending: false }); 
    return (data ?? []) as Activity[]; 
  },
  async addActivity(item) { 
    await supabase.from("activity").insert(item); 
  },
  async addBooking(b) { 
    await supabase.from("bookings").insert(b); 
  },
  async listChatThreads(){ const { data } = await supabase.from("chat_threads").select("*").order("updatedat",{ascending:false}); return (data??[]) as ChatThread[]; },
  async addChatThread(thread){ await supabase.from("chat_threads").insert(thread); },
  async updateChatThread(id, updates){ await supabase.from("chat_threads").update({...updates,updatedat:new Date().toISOString()}).eq("id", id); },
  async deleteChatThread(id){ await supabase.from("chat_threads").delete().eq("id", id); },
  async listChatMessages(threadid){ const { data } = await supabase.from("chat_messages").select("*").eq("threadid",threadid).order("createdat",{ascending:true}); return (data??[]) as ChatMessage[]; },
  async addChatMessage(message){ await supabase.from("chat_messages").insert(message); },
};