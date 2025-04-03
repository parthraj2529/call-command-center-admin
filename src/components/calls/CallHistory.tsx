
import { Call } from '@/types/types';
import { formatDistanceToNow } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CallHistoryProps {
  calls: Call[];
}

const CallHistory = ({ calls }: CallHistoryProps) => {
  const formatTime = (dateStr: string) => {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
  };

  const formatDuration = (seconds: number) => {
    if (seconds === 0) return '0s';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const getStatusClasses = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success-100 text-success-800';
      case 'in-progress':
        return 'bg-brand-100 text-brand-800';
      case 'failed':
        return 'bg-error-100 text-error-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDirectionIcon = (direction: string) => {
    if (direction === 'inbound') {
      return (
        <span className="inline-flex items-center text-brand-600">
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
          In
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center text-success-600">
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
          Out
        </span>
      );
    }
  };

  return (
    <div className="callcenter-card">
      <h2 className="text-xl font-semibold mb-4">Call History</h2>
      
      <div className="relative overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Direction</TableHead>
              <TableHead>From/To</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {calls.length > 0 ? (
              calls.map((call) => (
                <TableRow key={call.id}>
                  <TableCell>{getDirectionIcon(call.direction)}</TableCell>
                  <TableCell>
                    <div className="font-medium">{call.direction === 'inbound' ? call.from : call.to}</div>
                  </TableCell>
                  <TableCell>{formatDuration(call.duration)}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusClasses(call.status)}`}>
                      {call.status}
                    </span>
                  </TableCell>
                  <TableCell>{formatTime(call.createdAt)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                  No call history available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CallHistory;
