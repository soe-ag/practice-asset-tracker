export type RawAsset = {
  id: number;
  asssetName: string;
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
