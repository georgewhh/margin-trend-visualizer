
import React, { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { TimeRange, MarginRatioDataPoint } from '@/lib/types';

interface TimeRangeSliderProps {
  data: MarginRatioDataPoint[];
  timeRange: TimeRange;
  onRangeChange: (range: TimeRange) => void;
}

const TimeRangeSlider: React.FC<TimeRangeSliderProps> = ({ 
  data, 
  timeRange, 
  onRangeChange 
}) => {
  const [sliderValues, setSliderValues] = useState<number[]>([
    timeRange.startIndex,
    timeRange.endIndex
  ]);

  // Update slider when time range changes externally
  useEffect(() => {
    setSliderValues([timeRange.startIndex, timeRange.endIndex]);
  }, [timeRange]);

  const handleSliderValueChange = (values: number[]) => {
    setSliderValues(values);
    onRangeChange({
      startIndex: values[0],
      endIndex: values[1]
    });
  };

  if (data.length === 0) return null;

  const startDate = data[sliderValues[0]]?.date || '';
  const endDate = data[sliderValues[1]]?.date || '';

  return (
    <div className="w-full mt-6 mb-2 px-2 animate-fade-in">
      <div className="flex justify-between items-center mb-1 text-xs text-gray-500">
        <span>{startDate}</span>
        <span>{endDate}</span>
      </div>
      <Slider
        defaultValue={[0, data.length - 1]}
        value={sliderValues}
        min={0}
        max={data.length - 1}
        step={1}
        onValueChange={handleSliderValueChange}
        className="my-4"
      />
      <div className="flex justify-between items-center mt-1 text-xs text-gray-400">
        <span>设置时间范围</span>
        <span>{sliderValues[1] - sliderValues[0] + 1} 个交易日</span>
      </div>
    </div>
  );
};

export default TimeRangeSlider;
