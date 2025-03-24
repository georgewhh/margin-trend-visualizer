import { ApiResponse, MarginRatioDataPoint } from "./types";

const API_URL = "http://dq.10jqka.com.cn/fuyao/rzrq_data/default/v1/fetch_data";

// Format date string to "YYYY-MM-DD"
export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

// Format percentage with 2 decimal places
export const formatPercentage = (value: number): string => {
  return `${(value * 100).toFixed(2)}%`;
};

export const fetchMarginRatioData = async (): Promise<MarginRatioDataPoint[]> => {
  try {
    // Payload as specified in the requirements
    const payload = {
      codeSelectors: `{
        "include": [
          {
            "type": "block_code",
            "values": [
              "1B"
            ]
          }
        ]
      }`,
      indexInfo: `[{"index_id":"security_name"},{"index_id":"rzrq_margin_trading_bal_flow_value_rate","attribute":{},"timestamp":0,"time_type":"SNAPSHOT"}]`,
      appId: "tangram-data-view-stocklist",
      columnMap: `{"rzrq_margin_trading_bal_flow_value_rate":{"title":"融资融券余额占流通市值比","sortBy":true,"fit":true}}`,
      page: "{size:200}",
      sort: "{}",
      fixed: "20"
    };

    // In a real production environment, we would use the actual API endpoint
    // For demo purposes, we'll create a mocked response
    const mockData = generateMockData(200);
    
    // In production, you would use:
    /*
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data: ApiResponse = await response.json();
    */

    // For the sake of this demo, we'll just return the mock data
    return mockData;
  } catch (error) {
    console.error("Error fetching margin ratio data:", error);
    throw error;
  }
};

// Generate mock data for demo purposes
function generateMockData(days: number): MarginRatioDataPoint[] {
  const data: MarginRatioDataPoint[] = [];
  const endDate = new Date();
  
  // Start from 'days' trading days ago (excluding weekends)
  let currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - days * 1.4); // Roughly account for weekends
  
  let baseValue = 0.04 + Math.random() * 0.02; // Start with a value between 4-6%
  
  while (currentDate <= endDate) {
    // Skip weekends
    if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
      // Add some volatility to the data
      const change = (Math.random() - 0.5) * 0.002; // Small random changes
      baseValue += change;
      
      // Add trend and cycles to make it look more realistic
      const trend = Math.sin(data.length / 30) * 0.005;
      const cyclical = Math.sin(data.length / 10) * 0.002;
      
      // Ensure value stays in a reasonable range (3-8%)
      baseValue = Math.max(0.03, Math.min(0.08, baseValue + trend + cyclical));
      
      data.push({
        date: formatDate(currentDate.getTime()),
        timestamp: currentDate.getTime(),
        value: baseValue
      });
    }
    
    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return data;
}
