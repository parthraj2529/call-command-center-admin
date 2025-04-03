
import { useState } from 'react';
import { TwilioSettings as TwilioSettingsType } from '@/types/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';

const TwilioSettings = () => {
  const [settings, setSettings] = useState<TwilioSettingsType>({
    accountSid: 'AC********************************',
    authToken: '••••••••••••••••••••••••••••••••',
    phoneNumber: '+15551234567',
    callbackUrl: 'https://your-server.com/twilio/webhook',
  });
  
  const [isEditingToken, setIsEditingToken] = useState(false);
  const [enableRecording, setEnableRecording] = useState(true);
  const [enableTranscriptions, setEnableTranscriptions] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleToken = () => {
    setIsEditingToken(!isEditingToken);
    if (!isEditingToken) {
      setSettings((prev) => ({ ...prev, authToken: '' }));
    } else {
      setSettings((prev) => ({ ...prev, authToken: '••••••••••••••••••••••••••••••••' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, you would call an API to save the settings
    console.log('Save Twilio settings:', {
      ...settings,
      enableRecording,
      enableTranscriptions,
    });
    
    toast({
      title: "Settings saved",
      description: "Twilio settings have been updated successfully.",
    });
  };

  return (
    <div className="callcenter-card">
      <h2 className="text-xl font-semibold mb-6">Twilio Integration</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="accountSid">Account SID</Label>
          <Input
            id="accountSid"
            name="accountSid"
            value={settings.accountSid}
            onChange={handleChange}
            placeholder="Twilio Account SID"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="authToken">
            Auth Token
            <Button
              type="button"
              variant="link"
              className="ml-2 h-auto p-0 text-sm font-normal"
              onClick={handleToggleToken}
            >
              {isEditingToken ? 'Hide' : 'Change'}
            </Button>
          </Label>
          <Input
            id="authToken"
            name="authToken"
            type={isEditingToken ? 'text' : 'password'}
            value={settings.authToken}
            onChange={handleChange}
            placeholder="Twilio Auth Token"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            value={settings.phoneNumber}
            onChange={handleChange}
            placeholder="+15551234567"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            Must be a valid Twilio phone number in E.164 format
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="callbackUrl">Webhook URL</Label>
          <Input
            id="callbackUrl"
            name="callbackUrl"
            value={settings.callbackUrl}
            onChange={handleChange}
            placeholder="https://your-server.com/twilio/webhook"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            Twilio will send call events to this URL
          </p>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Call Settings</h3>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="enableRecording" className="text-base">
                Call Recording
              </Label>
              <p className="text-sm text-gray-500">
                Record all incoming and outgoing calls
              </p>
            </div>
            <Switch
              id="enableRecording"
              checked={enableRecording}
              onCheckedChange={setEnableRecording}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="enableTranscriptions" className="text-base">
                Call Transcriptions
              </Label>
              <p className="text-sm text-gray-500">
                Generate text transcripts of calls using AI
              </p>
            </div>
            <Switch
              id="enableTranscriptions"
              checked={enableTranscriptions}
              onCheckedChange={setEnableTranscriptions}
            />
          </div>
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

export default TwilioSettings;
