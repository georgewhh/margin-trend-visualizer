
export interface MarginRatioDataPoint {
  date: string;
  timestamp: number;
  value: number;
}

export interface ApiResponse {
  data: {
    list: {
      rzrq_margin_trading_bal_flow_value_rate: number;
      security_name: string;
      timestamp: number;
    }[];
  };
}

export interface ChartData {
  data: MarginRatioDataPoint[];
  isLoading: boolean;
  error: Error | null;
}

export interface TimeRange {
  startIndex: number;
  endIndex: number;
}

export interface TooltipData {
  date: string;
  value: number;
  formattedValue: string;
  active: boolean;
  payload?: any;
  position?: {
    x: number;
    y: number;
  };
}
