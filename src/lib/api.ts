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


  } catch (error) {
    console.error("Error fetching margin ratio data:", error);
    throw error;
  }
};
