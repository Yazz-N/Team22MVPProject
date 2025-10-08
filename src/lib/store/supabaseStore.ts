import { supabase } from "../supabaseClient";
import { DataStore, Flow, Activity, Booking, ChatThread, ChatMessage } from "./types";

export const supabaseStore: DataStore = {
  async listFlows() { 
    const { data } = await supabase.from("flows").select("*").order("created_at", { ascending: false }); 
    return (data ?? []) as Flow[]; 
  },
  async addFlow(flow) { 
    await supabase.from("flows").insert(flow); 
  },
  async deleteFlow(id) { 
    await supabase.from("flows").delete().eq("id", id); 
  },
  async listActivity() { 
    const { data } = await supabase.from("activity").select("*").order("created_at", { ascending: false }); 
    return (data ?? []) as Activity[]; 
  },
  async addActivity(item) { 
    await supabase.from("activity").insert(item); 
  },
  async addBooking(b) { 
    await supabase.from("bookings").insert(b); 
  },
  async listChatThreads(){ const { data } = await supabase.from("chat_threads").select("*").order("updated_at",{ascending:false}); return (data??[]) as ChatThread[]; },
  async addChatThread(thread){ await supabase.from("chat_threads").insert(thread); },
  async updateChatThread(id, updates){ await supabase.from("chat_threads").update({...updates,updated_at:new Date().toISOString()}).eq("id", id); },
  async deleteChatThread(id){ await supabase.from("chat_threads").delete().eq("id", id); },
  async listChatMessages(thread_id){ const { data } = await supabase.from("chat_messages").select("*").eq("thread_id",thread_id).order("created_at",{ascending:true}); return (data??[]) as ChatMessage[]; },
  async addChatMessage(message){ await supabase.from("chat_messages").insert(message); },
};