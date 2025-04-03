
import { useCall } from '@/context/CallContext';
import CallForm from '@/components/calls/CallForm';
import CallHistory from '@/components/calls/CallHistory';
import AgentStatus from '@/components/calls/AgentStatus';

const Calls = () => {
  const { callHistory, agents } = useCall();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold">Call Management</h1>
        <p className="text-gray-500">Make calls and monitor call activity</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CallForm />
          <CallHistory calls={callHistory} />
        </div>
        
        <div className="lg:col-span-1">
          <AgentStatus agents={agents} />
        </div>
      </div>
    </div>
  );
};

export default Calls;
