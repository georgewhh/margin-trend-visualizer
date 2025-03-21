
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
        "bg-[#2A2A3D]/90 backdrop-blur-md border border-white/10",
        "rounded-lg shadow-lg p-4 min-w-[160px]"
      )}
      style={{
        left: position.x + 10,
        top: position.y - 60,
        transform: 'translateX(-50%)'
      }}
    >
      <div className="text-xs font-medium text-gray-400 mb-1">{date}</div>
      <div className="flex justify-between items-center">
        <div className="text-xs font-semibold text-gray-300">融资融券余额占流通市值比</div>
        <div className="text-sm font-bold text-[#F0BE83] ml-2">{formattedValue}</div>
      </div>
    </div>
  );
};

export default ChartTooltip;
