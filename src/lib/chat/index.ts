import { supabase } from "../supabaseClient";
import { supabaseConfigured } from "../env";
import { supabaseChatStore } from "./supabaseChatStore";
import { localChatStore } from "./localChatStore";
import type { ChatMessage, ChatThread } from "./types";

const primary = (supabaseConfigured && supabase) ? supabaseChatStore : localChatStore;
const fallback = localChatStore;

export const chatStore = {
  async getOrCreateThreadForUser(userId: string | null): Promise<ChatThread> {
    try { return await primary.getOrCreateThreadForUser(userId); } catch { return fallback.getOrCreateThreadForUser(userId); }
  },
  async listMessages(threadId: string): Promise<ChatMessage[]> {
    try { return await primary.listMessages(threadId); } catch { return fallback.listMessages(threadId); }
  },
  async addMessage(m: ChatMessage): Promise<void> {
    try { return await primary.addMessage(m); } catch { return fallback.addMessage(m); }
  },
  async clearThread(threadId: string): Promise<void> {
    try { return await primary.clearThread(threadId); } catch { return fallback.clearThread(threadId); }
  }
};