
import { Agent } from '@/types/types';
import { useCall } from '@/context/CallContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AgentStatusProps {
  agents: Agent[];
}

const AgentStatus = ({ agents }: AgentStatusProps) => {
  const { updateAgentStatus } = useCall();

  const handleStatusChange = (agentId: number, status: string) => {
    updateAgentStatus(agentId, status as any);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-success-500';
      case 'busy':
        return 'bg-warning-500';
      case 'offline':
        return 'bg-gray-400';
      case 'break':
        return 'bg-brand-400';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="callcenter-card">
      <h2 className="text-xl font-semibold mb-4">Agent Status</h2>
      
      <div className="space-y-4">
        {agents.map((agent) => (
          <div key={agent.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div className={`h-3 w-3 rounded-full ${getStatusColor(agent.status)} mr-3`}></div>
              <div>
                <p className="font-medium text-gray-900">{agent.name}</p>
                <p className="text-sm text-gray-500">{agent.email}</p>
              </div>
            </div>
            
            <Select 
              defaultValue={agent.status} 
              onValueChange={(value) => handleStatusChange(agent.id, value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="busy">Busy</SelectItem>
                <SelectItem value="break">Break</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgentStatus;
