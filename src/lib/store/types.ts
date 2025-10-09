export type Flow = { 
  id: string; 
  filename: string; 
  createdat: string; 
  status: "Draft" | "Active" | "Archived" 
};

export type Activity = { 
  id: string; 
  message: string; 
  createdat: string 
};

export type Booking = { 
  id: string; 
  name: string; 
  email: string; 
  timezone: string; 
  startiso: string 
};

export type ChatThread = { 
  id: string; 
  userid?: string; 
  title: string; 
  createdat: string; 
  updatedat: string; 
};

export type ChatMessage = { 
  id: string; 
  threadid: string; 
  userid?: string; 
  role: 'user' | 'assistant' | 'system'; 
  content: string; 
  createdat: string; 
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
  listChatMessages(threadid: string): Promise<ChatMessage[]>;
  addChatMessage(message: ChatMessage): Promise<void>;
}