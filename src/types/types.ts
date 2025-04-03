
// Agent types
export interface Agent {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: AgentStatus;
  skills: string[];
  avatar?: string;
  createdAt: string;
}

export type AgentStatus = 'available' | 'busy' | 'offline' | 'break';

// Call types
export interface Call {
  id: string;
  callSid: string;
  from: string;
  to: string;
  status: CallStatus;
  direction: CallDirection;
  duration: number;
  recordingUrl?: string;
  agentId?: number;
  createdAt: string;
  notes?: string;
}

export type CallStatus = 'queued' | 'in-progress' | 'completed' | 'failed' | 'busy' | 'no-answer';
export type CallDirection = 'inbound' | 'outbound';

// Dashboard stats
export interface DashboardStats {
  totalCalls: number;
  activeCalls: number;
  availableAgents: number;
  avgWaitTime: number;
  callsToday: number;
  callsPerHour: CallsPerHour[];
  callsPerAgent: CallsPerAgent[];
  callStatuses: CallStatusCount[];
}

export interface CallsPerHour {
  hour: number;
  count: number;
}

export interface CallsPerAgent {
  agentId: number;
  agentName: string;
  count: number;
}

export interface CallStatusCount {
  status: CallStatus;
  count: number;
}

// Settings
export interface DatabaseSettings {
  host: string;
  port: string;
  username: string;
  password: string;
  database: string;
}

export interface TwilioSettings {
  accountSid: string;
  authToken: string;
  phoneNumber: string;
  callbackUrl: string;
}
