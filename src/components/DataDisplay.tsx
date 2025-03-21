
import React from 'react';
import { MarginRatioDataPoint } from '@/lib/types';
import { formatPercentage } from '@/lib/api';
import { cn } from '@/lib/utils';

interface DataDisplayProps {
  data: MarginRatioDataPoint[];
  timeRange: { startIndex: number; endIndex: number };
}

const DataDisplay: React.FC<DataDisplayProps> = ({ data, timeRange }) => {
  if (data.length === 0) return null;
  
  const { startIndex, endIndex } = timeRange;
  const visibleData = data.slice(startIndex, endIndex + 1);
  
  // Calculate latest value
  const latestValue = visibleData[visibleData.length - 1]?.value || 0;
  
  // Calculate average
  const avgValue = visibleData.reduce((sum, item) => sum + item.value, 0) / visibleData.length;
  
  // Calculate max and min
  const maxValue = Math.max(...visibleData.map(item => item.value));
  const minValue = Math.min(...visibleData.map(item => item.value));
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6 animate-fade-in">
      <StatCard 
        title="当前值" 
        value={formatPercentage(latestValue)} 
        change={(latestValue - visibleData[0].value) / visibleData[0].value}
      />
      <StatCard 
        title="平均值" 
        value={formatPercentage(avgValue)} 
      />
      <StatCard 
        title="最高值" 
        value={formatPercentage(maxValue)} 
      />
      <StatCard 
        title="最低值" 
        value={formatPercentage(minValue)} 
      />
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  change?: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
      <h3 className="text-sm text-gray-500 font-medium mb-1">{title}</h3>
      <div className="flex items-end justify-between">
        <div className="text-xl font-semibold">{value}</div>
        {change !== undefined && (
          <div className={cn(
            "text-xs font-medium",
            change > 0 ? "text-green-600" : 
            change < 0 ? "text-red-600" : "text-gray-500"
          )}>
            {change > 0 ? '+' : ''}{(change * 100).toFixed(2)}%
          </div>
        )}
      </div>
    </div>
  );
};

export default DataDisplay;
