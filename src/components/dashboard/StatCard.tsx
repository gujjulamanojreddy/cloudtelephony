import React from 'react';
import { cn } from '../../utils/cn';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: {
    value: string | number;
    type: 'increase' | 'decrease';
  };
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, change, className }) => {
  return (
    <div className={cn(
      'p-6 rounded-lg shadow-md border border-gray-200',
      'bg-gradient-to-br from-white to-gray-50',
      'transition-all duration-300 ease-in-out hover:shadow-lg transform hover:-translate-y-1',
      'overflow-hidden relative',
      className
    )}>
      <div className="flex items-center relative z-10">
        <div className={cn(
          'p-3 rounded-full bg-blue-100 text-blue-600',
          'shadow-sm transform transition-transform hover:scale-110',
          'bg-gradient-to-br from-blue-50 to-blue-100'
        )}>
          {icon}
        </div>
        <div className="ml-5">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">{value}</h3>
        </div>
      </div>
      
      {change && (
        <div className="mt-2 flex items-center">
          <span 
            className={cn(
              'text-xs font-medium py-1 px-2 rounded-full',
              change.type === 'increase' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800',
              'flex items-center'
            )}
          >
            {change.type === 'increase' ? '↑' : '↓'} {change.value}
            {typeof change.value === 'number' ? '%' : ''}
          </span>
          <span className="text-xs text-gray-500 ml-1">from last period</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;