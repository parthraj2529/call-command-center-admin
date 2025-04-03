
import { useState } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import DatabaseSettings from '@/components/settings/DatabaseSettings';
import TwilioSettings from '@/components/settings/TwilioSettings';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('database');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-500">Configure your call center system</p>
      </div>
      
      <Tabs defaultValue="database" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="twilio">Twilio</TabsTrigger>
        </TabsList>
        
        <TabsContent value="database">
          <DatabaseSettings />
        </TabsContent>
        
        <TabsContent value="twilio">
          <TwilioSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
