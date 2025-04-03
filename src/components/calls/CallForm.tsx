
import { useState } from 'react';
import { useCall } from '@/context/CallContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Phone, PhoneOff } from 'lucide-react';

const CallForm = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const { initializeCall, endCall, isCallInProgress, currentCall } = useCall();

  const handleInitiateCall = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber) {
      initializeCall(phoneNumber);
    }
  };

  const handleEndCall = () => {
    endCall();
  };

  return (
    <div className="callcenter-card mb-6">
      <h2 className="text-xl font-semibold mb-4">Make a Call</h2>
      
      {isCallInProgress ? (
        <div className="space-y-4">
          <div className="p-4 bg-primary-50 rounded-lg">
            <h3 className="font-medium text-gray-900">Call in Progress</h3>
            <div className="mt-2 text-sm text-gray-600">
              <p>From: {currentCall?.from}</p>
              <p>To: {currentCall?.to}</p>
              <p>Status: Active</p>
            </div>
          </div>
          
          <Button 
            onClick={handleEndCall} 
            className="w-full text-white font-semibold bg-error-600 hover:bg-error-700"
          >
            <PhoneOff className="mr-2 h-4 w-4" />
            End Call
          </Button>
        </div>
      ) : (
        <form onSubmit={handleInitiateCall} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              placeholder="+1 (555) 123-4567"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full text-white font-semibold"
          >
            <Phone className="mr-2 h-4 w-4" />
            Start Call
          </Button>
        </form>
      )}
    </div>
  );
};

export default CallForm;
