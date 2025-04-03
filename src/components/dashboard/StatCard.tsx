
import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
  };
}

const StatCard = ({ title, value, description, icon, trend }: StatCardProps) => {
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
          {trend && (
            <div className="mt-2 flex items-center">
              {trend.direction === 'up' ? (
                <span className="text-success-600 flex items-center text-sm">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                  {trend.value}%
                </span>
              ) : trend.direction === 'down' ? (
                <span className="text-error-600 flex items-center text-sm">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  {trend.value}%
                </span>
              ) : (
                <span className="text-gray-500 flex items-center text-sm">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
                  </svg>
                  {trend.value}%
                </span>
              )}
              <span className="text-gray-500 text-sm ml-1">vs last period</span>
            </div>
          )}
        </div>
        <div className="p-3 bg-primary-50 rounded-lg">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
