
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Call, Agent, AgentStatus } from '@/types/types';

interface CallContextType {
  currentCall: Call | null;
  callHistory: Call[];
  agents: Agent[];
  initializeCall: (phoneNumber: string) => void;
  endCall: () => void;
  updateAgentStatus: (agentId: number, status: AgentStatus) => void;
  isCallInProgress: boolean;
}

const CallContext = createContext<CallContextType | undefined>(undefined);

export const CallProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentCall, setCurrentCall] = useState<Call | null>(null);
  const [callHistory, setCallHistory] = useState<Call[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isCallInProgress, setIsCallInProgress] = useState(false);

  // Simulated data loading
  useEffect(() => {
    // Load mock agents data
    const mockAgents: Agent[] = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        status: 'available',
        skills: ['sales', 'support'],
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone: '+1987654321',
        status: 'busy',
        skills: ['technical', 'billing'],
        createdAt: new Date().toISOString(),
      },
      {
        id: 3,
        name: 'Robert Johnson',
        email: 'robert.j@example.com',
        phone: '+1122334455',
        status: 'offline',
        skills: ['support', 'onboarding'],
        createdAt: new Date().toISOString(),
      },
    ];
    
    setAgents(mockAgents);
    
    // Load mock call history
    const mockCalls: Call[] = [
      {
        id: '1',
        callSid: 'CA123456789',
        from: '+1234567890',
        to: '+9876543210',
        status: 'completed',
        direction: 'inbound',
        duration: 120,
        agentId: 1,
        createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      },
      {
        id: '2',
        callSid: 'CA987654321',
        from: '+9876543210',
        to: '+1234567890',
        status: 'completed',
        direction: 'outbound',
        duration: 300,
        agentId: 2,
        createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
      },
      {
        id: '3',
        callSid: 'CA567891234',
        from: '+5678912345',
        to: '+9876543210',
        status: 'failed',
        direction: 'inbound',
        duration: 0,
        createdAt: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
      },
    ];
    
    setCallHistory(mockCalls);
  }, []);

  const initializeCall = (phoneNumber: string) => {
    // In a real application, this would interact with Twilio API
    // For now, we'll simulate a call
    if (isCallInProgress) {
      toast({
        title: "Call already in progress",
        description: "Please end the current call before starting a new one.",
        variant: "destructive",
      });
      return;
    }

    // Find an available agent
    const availableAgent = agents.find(agent => agent.status === 'available');
    
    if (!availableAgent) {
      toast({
        title: "No available agents",
        description: "All agents are currently busy or offline.",
        variant: "destructive",
      });
      return;
    }

    // Create a new call
    const newCall: Call = {
      id: `call-${Date.now()}`,
      callSid: `CA${Math.floor(Math.random() * 1000000000)}`,
      from: availableAgent.phone,
      to: phoneNumber,
      status: 'in-progress',
      direction: 'outbound',
      duration: 0,
      agentId: availableAgent.id,
      createdAt: new Date().toISOString(),
    };

    // Update the agent's status
    updateAgentStatus(availableAgent.id, 'busy');
    
    setCurrentCall(newCall);
    setIsCallInProgress(true);
    
    toast({
      title: "Call initiated",
      description: `Calling ${phoneNumber} with agent ${availableAgent.name}`,
    });
  };

  const endCall = () => {
    if (!currentCall) {
      return;
    }

    // Update the call in history
    const updatedCall = {
      ...currentCall,
      status: 'completed' as CallStatus,
      duration: Math.floor(Math.random() * 300) + 30, // Random duration between 30 and 330 seconds
    };

    setCallHistory(prev => [updatedCall, ...prev]);
    
    // Release the agent
    if (currentCall.agentId) {
      updateAgentStatus(currentCall.agentId, 'available');
    }
    
    setCurrentCall(null);
    setIsCallInProgress(false);
    
    toast({
      title: "Call ended",
      description: `Call to ${updatedCall.to} has ended.`,
    });
  };

  const updateAgentStatus = (agentId: number, status: AgentStatus) => {
    setAgents(prev => 
      prev.map(agent => 
        agent.id === agentId ? { ...agent, status } : agent
      )
    );
  };

  return (
    <CallContext.Provider
      value={{
        currentCall,
        callHistory,
        agents,
        initializeCall,
        endCall,
        updateAgentStatus,
        isCallInProgress,
      }}
    >
      {children}
    </CallContext.Provider>
  );
};

export const useCall = () => {
  const context = useContext(CallContext);
  if (context === undefined) {
    throw new Error('useCall must be used within a CallProvider');
  }
  return context;
};
