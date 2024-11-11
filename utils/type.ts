export type RawAsset = {
  id: number;
  assetName: string;
  amount: number;
  buyPrice: number;
  buyAt: Date | null;
  isYen: boolean;
  type: string;
};

export type Asset = {
  name: string;
  value: number;
};

export interface DailyData {
  "1. open": string;
  "2. high": string;
  "3. low": string;
  "4. close": string;
  "5. volume": string;
}

export type RawStockData = {
  "Meta Data": {
    "1. Information": string;
    "2. Symbol": string;
    "3. Last Refreshed": string;
    "4. Output Size": string;
    "5. Time Zone": string;
  };
  "Time Series (Daily)": {
    [date: string]: {
      "1. open": string;
      "2. high": string;
      "3. low": string;
      "4. close": string;
      "5. volume": string;
    };
  };
};

export type RefinedData = {
  time: string;
  value: number;
};

export type DropDownType = {
  name: string;
  code: string;
};
