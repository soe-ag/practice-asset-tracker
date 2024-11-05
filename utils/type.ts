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
