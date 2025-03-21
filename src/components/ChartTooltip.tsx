
import React from 'react';
import { TooltipData } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ChartTooltipProps {
  tooltipData: TooltipData;
}

const ChartTooltip: React.FC<ChartTooltipProps> = ({ tooltipData }) => {
  const { active, date, value, formattedValue, position } = tooltipData;

  if (!active || !position) {
    return null;
  }

  return (
    <div 
      className={cn(
        "absolute pointer-events-none z-10 animate-fade-in",
        "bg-chart-tooltip backdrop-blur-sm border border-chart-tooltipBorder",
        "rounded-lg shadow-lg p-4 min-w-[160px]"
      )}
      style={{
        left: position.x + 10,
        top: position.y - 60,
        transform: 'translateX(-50%)'
      }}
    >
      <div className="text-xs font-medium text-gray-500 mb-1">{date}</div>
      <div className="flex justify-between items-center">
        <div className="text-xs font-semibold">融资融券余额占流通市值比</div>
        <div className="text-sm font-bold text-black ml-2">{formattedValue}</div>
      </div>
    </div>
  );
};

export default ChartTooltip;
