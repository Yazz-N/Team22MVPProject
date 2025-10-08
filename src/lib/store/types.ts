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

export interface DataStore {
  listFlows(): Promise<Flow[]>;
  addFlow(flow: Flow): Promise<void>;
  deleteFlow(id: string): Promise<void>;
  listActivity(): Promise<Activity[]>;
  addActivity(item: Activity): Promise<void>;
  addBooking(b: Booking): Promise<void>;
}