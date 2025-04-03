
import { useState } from 'react';
import { useCall } from '@/context/CallContext';
import { Agent } from '@/types/types';
import AgentList from '@/components/agents/AgentList';
import AgentForm from '@/components/agents/AgentForm';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const Agents = () => {
  const { agents } = useCall();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | undefined>(undefined);

  const handleAddAgent = () => {
    setEditingAgent(undefined);
    setIsFormOpen(true);
  };

  const handleEditAgent = (agent: Agent) => {
    setEditingAgent(agent);
    setIsFormOpen(true);
  };

  const handleSaveAgent = (agentData: Partial<Agent>) => {
    // In a real app, you would call an API to create/update the agent
    
    if (editingAgent) {
      console.log('Update agent:', { ...editingAgent, ...agentData });
      toast({
        title: "Agent updated",
        description: `${agentData.name} has been updated successfully.`,
      });
    } else {
      console.log('Create agent:', agentData);
      toast({
        title: "Agent added",
        description: `${agentData.name} has been added successfully.`,
      });
    }
    
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold">Agent Management</h1>
        <Button onClick={handleAddAgent} className="mt-2 md:mt-0">
          <Plus className="mr-2 h-4 w-4" />
          Add Agent
        </Button>
      </div>
      
      <AgentList
        agents={agents}
        onEdit={handleEditAgent}
      />
      
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingAgent ? 'Edit Agent' : 'Add New Agent'}
            </DialogTitle>
          </DialogHeader>
          <AgentForm
            agent={editingAgent}
            onSave={handleSaveAgent}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Agents;
