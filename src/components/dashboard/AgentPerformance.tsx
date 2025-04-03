
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CallsPerAgent } from '@/types/types';

interface AgentPerformanceProps {
  data: CallsPerAgent[];
}

const AgentPerformance = ({ data }: AgentPerformanceProps) => {
  return (
    <div className="callcenter-card">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Agent Performance</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis 
              dataKey="agentName" 
              stroke="#9ca3af"
              fontSize={12}
            />
            <YAxis 
              stroke="#9ca3af"
              fontSize={12}
            />
            <Tooltip 
              formatter={(value) => [`${value} calls`, 'Handled']}
            />
            <Bar 
              dataKey="count" 
              fill="#0e8f72" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AgentPerformance;
