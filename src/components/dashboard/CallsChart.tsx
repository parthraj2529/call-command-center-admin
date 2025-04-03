
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CallsPerHour } from '@/types/types';

interface CallsChartProps {
  data: CallsPerHour[];
}

const CallsChart = ({ data }: CallsChartProps) => {
  // Format hour as readable time
  const formatXAxis = (hour: number) => {
    return `${hour}:00`;
  };

  return (
    <div className="callcenter-card">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Calls Per Hour</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
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
              dataKey="hour" 
              tickFormatter={formatXAxis}
              stroke="#9ca3af"
              fontSize={12}
            />
            <YAxis 
              stroke="#9ca3af"
              fontSize={12}
            />
            <Tooltip 
              formatter={(value) => [`${value} calls`, 'Count']}
              labelFormatter={(label) => `${label}:00`}
            />
            <Area 
              type="monotone" 
              dataKey="count" 
              stroke="#4b4ee3" 
              fill="#c7d7fe" 
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CallsChart;
