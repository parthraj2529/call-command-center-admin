
import { useState } from 'react';
import { Agent } from '@/types/types';
import { formatDistanceToNow } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Edit, MoreVertical, Trash2 } from 'lucide-react';

interface AgentListProps {
  agents: Agent[];
  onEdit: (agent: Agent) => void;
}

const AgentList = ({ agents, onEdit }: AgentListProps) => {
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ open: boolean; agent: Agent | null }>({
    open: false,
    agent: null,
  });

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

  const handleDelete = () => {
    // In a real app, you would call an API to delete the agent
    console.log('Delete agent:', deleteConfirmation.agent);
    setDeleteConfirmation({ open: false, agent: null });
  };

  return (
    <>
      <div className="callcenter-card">
        <h2 className="text-xl font-semibold mb-4">Agent List</h2>
        
        <div className="relative overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Skills</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Added</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agents.map((agent) => (
                <TableRow key={agent.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-3">
                        <AvatarFallback className="bg-brand-100 text-brand-700">
                          {agent.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="font-medium">{agent.name}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div className={`h-2.5 w-2.5 rounded-full ${getStatusColor(agent.status)} mr-2`}></div>
                      <span className="capitalize">{agent.status}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {agent.skills.map((skill) => (
                        <span key={skill} className="px-2 py-1 text-xs bg-gray-100 rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm">{agent.email}</div>
                      <div className="text-sm text-gray-500">{agent.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>{formatDistanceToNow(new Date(agent.createdAt), { addSuffix: true })}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(agent)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDeleteConfirmation({ open: true, agent })}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={deleteConfirmation.open} onOpenChange={(open) => setDeleteConfirmation({ open, agent: deleteConfirmation.agent })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {deleteConfirmation.agent?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmation({ open: false, agent: null })}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AgentList;
