export interface MarketData {
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  demandIndex: number;
  supplyIndex: number;
  mismatchScore: number;
  zScore: number;
  ema20: number;
  ema50: number;
  history: PricePoint[];
  alertLevel: 'normal' | 'warn' | 'critical';
  lastUpdate: string;
}

export interface PricePoint {
  date: string;
  price: number;
  demand: number;
  supply: number;
  mismatch: number;
}

export interface Alert {
  id: string;
  market: string;
  level: 'warn' | 'critical';
  message: string;
  timestamp: string;
  read: boolean;
}

export interface Settings {
  warnThreshold: number;
  criticalThreshold: number;
  refreshInterval: number;
  markets: string[];
}

export const DEFAULT_MARKETS = [
  'Copper',
  'Nickel', 
  'Cobalt',
  'Lithium',
  'Magnesium',
  'Aluminium'
];

export const DEFAULT_SETTINGS: Settings = {
  warnThreshold: 1.5,
  criticalThreshold: 2.0,
  refreshInterval: 300000, // 5 minutes
  markets: DEFAULT_MARKETS
};
