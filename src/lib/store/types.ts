export type Flow = { 
  id: string; 
  filename: string; 
  created_at: string; 
  status: "Draft" | "Active" | "Archived" 
};

export type Activity = { 
  id: string; 
  message: string; 
  created_at: string 
};

export type Booking = { 
  id: string; 
  name: string; 
  email: string; 
  timezone: string; 
  start_iso: string 
};

export type ChatThread = { 
  id: string; 
  user_id?: string; 
  title: string; 
  created_at: string; 
  updated_at: string; 
};

export type ChatMessage = { 
  id: string; 
  thread_id: string; 
  user_id?: string; 
  role: 'user' | 'assistant' | 'system'; 
  content: string; 
  created_at: string; 
};

export interface DataStore {
  listFlows(): Promise<Flow[]>;
  addFlow(flow: Flow): Promise<void>;
  deleteFlow(id: string): Promise<void>;
  listActivity(): Promise<Activity[]>;
  addActivity(item: Activity): Promise<void>;
  addBooking(b: Booking): Promise<void>;
  listChatThreads(): Promise<ChatThread[]>;
  addChatThread(thread: ChatThread): Promise<void>;
  updateChatThread(id: string, updates: Partial<ChatThread>): Promise<void>;
  deleteChatThread(id: string): Promise<void>;
  listChatMessages(thread_id: string): Promise<ChatMessage[]>;
  addChatMessage(message: ChatMessage): Promise<void>;
}