
import { useState, useEffect } from 'react';
import { DashboardStats, CallsPerHour, CallsPerAgent, CallStatusCount } from '@/types/types';
import { useCall } from '@/context/CallContext';
import StatCard from '@/components/dashboard/StatCard';
import CallsChart from '@/components/dashboard/CallsChart';
import AgentPerformance from '@/components/dashboard/AgentPerformance';
import { 
  PhoneCall, 
  Phone, 
  Users, 
  Clock,
  BarChart3
} from 'lucide-react';

const Dashboard = () => {
  const { callHistory, agents } = useCall();
  const [stats, setStats] = useState<DashboardStats>({
    totalCalls: 0,
    activeCalls: 0,
    availableAgents: 0,
    avgWaitTime: 0,
    callsToday: 0,
    callsPerHour: [],
    callsPerAgent: [],
    callStatuses: [],
  });

  useEffect(() => {
    // Calculate dashboard stats from call history and agents
    // In a real app, this would come from an API
    
    // Count available agents
    const availableAgents = agents.filter(agent => agent.status === 'available').length;
    
    // Generate mock calls per hour data
    const mockCallsPerHour: CallsPerHour[] = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      count: Math.floor(Math.random() * 20) + 1, // Random call count between 1-20
    }));
    
    // Generate mock calls per agent data
    const mockCallsPerAgent: CallsPerAgent[] = agents.map(agent => ({
      agentId: agent.id,
      agentName: agent.name,
      count: Math.floor(Math.random() * 50) + 10, // Random call count between 10-60
    }));
    
    // Generate mock call status counts
    const mockCallStatuses: CallStatusCount[] = [
      { status: 'completed', count: Math.floor(Math.random() * 100) + 50 },
      { status: 'failed', count: Math.floor(Math.random() * 20) + 5 },
      { status: 'no-answer', count: Math.floor(Math.random() * 15) + 2 },
      { status: 'busy', count: Math.floor(Math.random() * 10) + 1 },
    ];
    
    setStats({
      totalCalls: callHistory.length,
      activeCalls: agents.filter(agent => agent.status === 'busy').length,
      availableAgents,
      avgWaitTime: Math.floor(Math.random() * 120) + 10, // Random wait time between 10-130 seconds
      callsToday: Math.floor(Math.random() * 100) + 20, // Random calls today between 20-120
      callsPerHour: mockCallsPerHour,
      callsPerAgent: mockCallsPerAgent,
      callStatuses: mockCallStatuses,
    });
  }, [callHistory, agents]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-500">Welcome to your Call Center Admin Dashboard</p>
      </div>
      
      <div className="dashboard-grid">
        <StatCard
          title="Total Calls"
          value={stats.totalCalls}
          icon={<PhoneCall className="h-6 w-6 text-primary-700" />}
          trend={{ value: 12, direction: 'up' }}
        />
        <StatCard
          title="Active Calls"
          value={stats.activeCalls}
          icon={<Phone className="h-6 w-6 text-success-700" />}
        />
        <StatCard
          title="Available Agents"
          value={`${stats.availableAgents}/${agents.length}`}
          icon={<Users className="h-6 w-6 text-brand-700" />}
        />
        <StatCard
          title="Avg. Wait Time"
          value={`${stats.avgWaitTime}s`}
          description="Time before agent connects"
          icon={<Clock className="h-6 w-6 text-warning-700" />}
          trend={{ value: 5, direction: 'down' }}
        />
      </div>
      
      <div className="dashboard-grid-large">
        <CallsChart data={stats.callsPerHour} />
        <AgentPerformance data={stats.callsPerAgent} />
      </div>
      
      <div className="callcenter-card">
        <div className="flex items-center space-x-3 mb-4">
          <BarChart3 className="h-5 w-5 text-primary-700" />
          <h3 className="text-lg font-medium text-gray-900">Call Distribution by Status</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.callStatuses.map((statusData) => (
            <div key={statusData.status} className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 capitalize">{statusData.status}</p>
              <p className="text-2xl font-bold mt-1">{statusData.count}</p>
              <div className="h-2 bg-gray-200 rounded-full mt-2">
                <div 
                  className={`h-2 rounded-full ${
                    statusData.status === 'completed' ? 'bg-success-500' :
                    statusData.status === 'failed' ? 'bg-error-500' :
                    statusData.status === 'busy' ? 'bg-warning-500' :
                    'bg-brand-500'
                  }`}
                  style={{ width: `${(statusData.count / 100) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
