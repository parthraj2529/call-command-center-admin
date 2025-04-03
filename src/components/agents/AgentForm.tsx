
import { useState, useEffect } from 'react';
import { Agent, AgentStatus } from '@/types/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from '@/components/ui/use-toast';

interface AgentFormProps {
  agent?: Agent;
  onSave: (agent: Partial<Agent>) => void;
  onCancel: () => void;
}

const SKILLS = ['sales', 'support', 'technical', 'billing', 'onboarding'];

const AgentForm = ({ agent, onSave, onCancel }: AgentFormProps) => {
  const [formData, setFormData] = useState<Partial<Agent>>({
    name: '',
    email: '',
    phone: '',
    status: 'available',
    skills: [],
  });

  useEffect(() => {
    if (agent) {
      setFormData(agent);
    }
  }, [agent]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (status: string) => {
    setFormData((prev) => ({ ...prev, status: status as AgentStatus }));
  };

  const handleSkillToggle = (skill: string) => {
    setFormData((prev) => {
      const currentSkills = prev.skills || [];
      return {
        ...prev,
        skills: currentSkills.includes(skill)
          ? currentSkills.filter((s) => s !== skill)
          : [...currentSkills, skill],
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || !formData.phone) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }
    
    // Save agent
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john.doe@example.com"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 (555) 123-4567"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="busy">Busy</SelectItem>
              <SelectItem value="break">Break</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-3">
        <Label>Skills</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {SKILLS.map((skill) => (
            <div key={skill} className="flex items-center space-x-2">
              <Checkbox
                id={`skill-${skill}`}
                checked={(formData.skills || []).includes(skill)}
                onCheckedChange={() => handleSkillToggle(skill)}
              />
              <Label htmlFor={`skill-${skill}`} className="capitalize cursor-pointer">
                {skill}
              </Label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {agent ? 'Update Agent' : 'Add Agent'}
        </Button>
      </div>
    </form>
  );
};

export default AgentForm;
