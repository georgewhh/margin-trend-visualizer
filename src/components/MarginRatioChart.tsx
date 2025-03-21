
import React, { useState, useEffect, useRef } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, ReferenceLine 
} from 'recharts';
import { fetchMarginRatioData, formatPercentage } from '@/lib/api';
import { MarginRatioDataPoint, TooltipData, TimeRange } from '@/lib/types';
import ChartTooltip from './ChartTooltip';
import TimeRangeSlider from './TimeRangeSlider';
import DataDisplay from './DataDisplay';
import { cn } from '@/lib/utils';

const MarginRatioChart: React.FC = () => {
  const [fullData, setFullData] = useState<MarginRatioDataPoint[]>([]);
  const [filteredData, setFilteredData] = useState<MarginRatioDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>({ startIndex: 0, endIndex: 0 });
  const [tooltipData, setTooltipData] = useState<TooltipData>({
    date: '',
    value: 0,
    formattedValue: '',
    active: false
  });
  
  const chartContainerRef = useRef<HTMLDivElement>(null);

  // Fetch data
  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchMarginRatioData();
        setFullData(data);
        
        // Initially show the last 200 days or all data if less than 200
        const endIndex = data.length - 1;
        const startIndex = Math.max(0, endIndex - 199);
        setTimeRange({ startIndex, endIndex });
        
        setIsLoading(false);
      } catch (err) {
        setError(err as Error);
        setIsLoading(false);
      }
    };
    
    getData();
  }, []);

  // Update filtered data when full data or time range changes
  useEffect(() => {
    if (fullData.length > 0) {
      const { startIndex, endIndex } = timeRange;
      setFilteredData(fullData.slice(startIndex, endIndex + 1));
    }
  }, [fullData, timeRange]);

  const handleTimeRangeChange = (newRange: TimeRange) => {
    setTimeRange(newRange);
  };

  const handleTooltipChange = (data: any) => {
    if (data && data.active && data.payload && data.payload.length) {
      const payload = data.payload[0].payload;
      setTooltipData({
        active: true,
        date: payload.date,
        value: payload.value,
        formattedValue: formatPercentage(payload.value),
        payload: data.payload,
        position: {
          x: data.coordinate.x,
          y: data.coordinate.y
        }
      });
    } else {
      setTooltipData(prev => ({ ...prev, active: false }));
    }
  };

  // Calculate domain for Y axis with some padding
  const calculateYDomain = () => {
    if (filteredData.length === 0) return [0, 0.1];
    
    const values = filteredData.map(item => item.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    
    // Add 10% padding to top and bottom
    const padding = (max - min) * 0.1;
    return [
      Math.max(0, min - padding), // Don't go below zero
      max + padding
    ];
  };

  const yDomain = calculateYDomain();

  // Format dates for x-axis
  const formatXAxis = (timestamp: string) => {
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  // Calculate average for reference line
  const calculateAverage = () => {
    if (filteredData.length === 0) return 0;
    return filteredData.reduce((sum, item) => sum + item.value, 0) / filteredData.length;
  };

  const averageValue = calculateAverage();

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">两融余额占流通市值比</h2>
          <p className="text-sm text-gray-500 mt-1">
            最近 {filteredData.length} 个交易日数据
          </p>
        </div>
      </div>

      <DataDisplay data={fullData} timeRange={timeRange} />
      
      <div 
        ref={chartContainerRef} 
        className={cn(
          "chart-container relative w-full h-80 border border-gray-100 bg-white rounded-lg p-4 shadow-sm",
          isLoading && "animate-pulse-soft"
        )}
      >
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-sm text-gray-400">加载中...</div>
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-sm text-red-500">
              获取数据时出错: {error.message}
            </div>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-sm text-gray-400">没有可用数据</div>
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={filteredData}
                margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                onMouseMove={handleTooltipChange}
                onMouseLeave={() => setTooltipData(prev => ({ ...prev, active: false }))}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatXAxis} 
                  tick={{ fontSize: 10, fill: '#9ca3af' }}
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(0,0,0,0.1)' }}
                  interval={Math.floor(filteredData.length / 6)}
                />
                <YAxis 
                  domain={yDomain}
                  tickFormatter={value => formatPercentage(value)}
                  tick={{ fontSize: 10, fill: '#9ca3af' }}
                  tickLine={false}
                  axisLine={false}
                  width={50}
                  tickCount={5}
                />
                <Tooltip 
                  content={<div></div>} // Empty div as we use custom tooltip
                  cursor={{ stroke: '#9ca3af', strokeWidth: 1, strokeDasharray: '3 3' }}
                />
                <ReferenceLine 
                  y={averageValue} 
                  stroke="rgba(0,0,0,0.2)" 
                  strokeDasharray="3 3" 
                  label={{ 
                    value: `均值: ${formatPercentage(averageValue)}`, 
                    position: 'right',
                    fill: '#6b7280',
                    fontSize: 10 
                  }} 
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#F0BE83"
                  strokeWidth={1.5}
                  dot={false}
                  activeDot={{ 
                    r: 4, 
                    fill: '#F0BE83', 
                    stroke: '#fff', 
                    strokeWidth: 2 
                  }}
                  animationDuration={500}
                />
              </LineChart>
            </ResponsiveContainer>
            <ChartTooltip tooltipData={tooltipData} />
          </>
        )}
      </div>

      <TimeRangeSlider 
        data={fullData} 
        timeRange={timeRange} 
        onRangeChange={handleTimeRangeChange} 
      />

      <div className="text-xs text-gray-400 mt-2">
        <p>数据来源: 融资融券数据接口</p>
      </div>
    </div>
  );
};

export default MarginRatioChart;
