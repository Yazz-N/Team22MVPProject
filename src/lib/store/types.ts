export type Flow = { 
  id: string; 
  filename: string; 
  createdAt: string; 
  status: "Draft" | "Active" | "Archived" 
};

export type Activity = { 
  id: string; 
  message: string; 
  createdAt: string 
};

export type Booking = { 
  id: string; 
  name: string; 
  email: string; 
  timezone: string; 
  startIso: string 
};

export type ChatThread = { 
  id: string; 
  userId?: string; 
  title: string; 
  createdAt: string; 
  updatedAt: string; 
};

export type ChatMessage = { 
  id: string; 
  threadId: string; 
  userId?: string; 
  role: 'user' | 'assistant' | 'system'; 
  content: string; 
  createdAt: string; 
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
  listChatMessages(threadId: string): Promise<ChatMessage[]>;
  addChatMessage(message: ChatMessage): Promise<void>;
}