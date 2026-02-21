import { MarketData, PricePoint, Alert } from './types';

// Calculate Z-Score
export function calculateZScore(value: number, mean: number, stdDev: number): number {
  if (stdDev === 0) return 0;
  return (value - mean) / stdDev;
}

// Calculate EMA
export function calculateEMA(prices: number[], period: number): number {
  if (prices.length < period) return prices[prices.length - 1] || 0;
  
  const multiplier = 2 / (period + 1);
  let ema = prices.slice(0, period).reduce((a, b) => a + b, 0) / period;
  
  for (let i = period; i < prices.length; i++) {
    ema = (prices[i] - ema) * multiplier + ema;
  }
  
  return ema;
}

// Calculate standard deviation
export function calculateStdDev(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  return Math.sqrt(variance);
}

// Calculate mismatch score
export function calculateMismatchScore(demand: number, supply: number): number {
  return demand - supply;
}

// Determine alert level
export function getAlertLevel(mismatch: number, warnThreshold: number, criticalThreshold: number): 'normal' | 'warn' | 'critical' {
  const absMismatch = Math.abs(mismatch);
  if (absMismatch >= criticalThreshold) return 'critical';
  if (absMismatch >= warnThreshold) return 'warn';
  return 'normal';
}

// Generate sample market data
export function generateSampleData(marketName: string): MarketData {
  const now = new Date();
  const history: PricePoint[] = [];
  let price = 100 + Math.random() * 50;
  
  // Generate 90 days of history
  for (let i = 90; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    price = price * (1 + (Math.random() - 0.5) * 0.05);
    const demand = 50 + Math.random() * 30 + Math.sin(i / 10) * 10;
    const supply = 50 + Math.random() * 30 + Math.cos(i / 10) * 10;
    const mismatch = demand - supply;
    
    history.push({
      date: date.toISOString().split('T')[0],
      price: Number(price.toFixed(2)),
      demand: Number(demand.toFixed(2)),
      supply: Number(supply.toFixed(2)),
      mismatch: Number(mismatch.toFixed(2))
    });
  }
  
  const prices = history.map(h => h.price);
  const mismatches = history.map(h => h.mismatch);
  const mean = prices.reduce((a, b) => a + b, 0) / prices.length;
  const stdDev = calculateStdDev(prices);
  const currentMismatch = mismatches[mismatches.length - 1];
  
  return {
    name: marketName,
    symbol: marketName.slice(0, 3).toUpperCase(),
    price: prices[prices.length - 1],
    change24h: Number(((prices[prices.length - 1] - prices[prices.length - 2]) / prices[prices.length - 2] * 100).toFixed(2)),
    demandIndex: history[history.length - 1].demand,
    supplyIndex: history[history.length - 1].supply,
    mismatchScore: currentMismatch,
    zScore: calculateZScore(prices[prices.length - 1], mean, stdDev),
    ema20: calculateEMA(prices, 20),
    ema50: calculateEMA(prices, 50),
    history,
    alertLevel: getAlertLevel(currentMismatch, 1.5, 2.0),
    lastUpdate: now.toISOString()
  };
}

// Check for alerts
export function checkAlerts(market: MarketData, warnThreshold: number, criticalThreshold: number): Alert | null {
  const level = getAlertLevel(market.mismatchScore, warnThreshold, criticalThreshold);
  
  if (level === 'normal') return null;
  
  const isDemandHigh = market.mismatchScore > 0;
  
  return {
    id: `${market.symbol}-${Date.now()}`,
    market: market.name,
    level,
    message: isDemandHigh 
      ? `${market.name}: Nachfrage übersteigt Angebot um ${Math.abs(market.mismatchScore).toFixed(2)}`
      : `${market.name}: Angebot übersteigt Nachfrage um ${Math.abs(market.mismatchScore).toFixed(2)}`,
    timestamp: new Date().toISOString(),
    read: false
  };
}
