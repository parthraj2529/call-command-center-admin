
import { useState } from 'react';
import { DatabaseSettings as DatabaseSettingsType } from '@/types/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

const DatabaseSettings = () => {
  const [settings, setSettings] = useState<DatabaseSettingsType>({
    host: 'localhost',
    port: '3306',
    username: 'callcenter_user',
    password: '••••••••',
    database: 'callcenter_db',
  });
  
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleTogglePassword = () => {
    setIsEditingPassword(!isEditingPassword);
    if (!isEditingPassword) {
      setSettings((prev) => ({ ...prev, password: '' }));
    } else {
      setSettings((prev) => ({ ...prev, password: '••••••••' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, you would call an API to save the settings
    console.log('Save database settings:', settings);
    
    toast({
      title: "Settings saved",
      description: "Database settings have been updated successfully.",
    });
  };

  return (
    <div className="callcenter-card">
      <h2 className="text-xl font-semibold mb-6">Database Configuration</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="host">Database Host</Label>
            <Input
              id="host"
              name="host"
              value={settings.host}
              onChange={handleChange}
              placeholder="localhost or IP address"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="port">Port</Label>
            <Input
              id="port"
              name="port"
              value={settings.port}
              onChange={handleChange}
              placeholder="3306"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              value={settings.username}
              onChange={handleChange}
              placeholder="Database username"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">
              Password
              <Button
                type="button"
                variant="link"
                className="ml-2 h-auto p-0 text-sm font-normal"
                onClick={handleTogglePassword}
              >
                {isEditingPassword ? 'Hide' : 'Change'}
              </Button>
            </Label>
            <Input
              id="password"
              name="password"
              type={isEditingPassword ? 'text' : 'password'}
              value={settings.password}
              onChange={handleChange}
              placeholder="Database password"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="database">Database Name</Label>
          <Input
            id="database"
            name="database"
            value={settings.database}
            onChange={handleChange}
            placeholder="Database name"
            required
          />
        </div>
        
        <div className="flex justify-end space-x-3">
          <Button type="button" variant="outline">
            Test Connection
          </Button>
          <Button type="submit">
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DatabaseSettings;
