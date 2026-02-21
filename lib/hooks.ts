"use client"

import { useEffect, useState } from 'react';
import { MarketData, Alert, Settings, DEFAULT_SETTINGS, DEFAULT_MARKETS } from '@/lib/types';
import { generateSampleData, checkAlerts } from '@/lib/scoring';

const STORAGE_KEY = 'rawmat-data';
const ALERTS_KEY = 'rawmat-alerts';
const SETTINGS_KEY = 'rawmat-settings';

export function useMarkets() {
  const [markets, setMarkets] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    // Load from localStorage or generate sample data
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setMarkets(JSON.parse(stored));
    } else {
      const initial = DEFAULT_MARKETS.map(generateSampleData);
      setMarkets(initial);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    }
    setLoading(false);
    setLastUpdate(new Date());
  }, []);

  const refreshMarkets = () => {
    setLoading(true);
    // Simulate data update
    const updated = markets.map(m => {
      const newData = generateSampleData(m.name);
      // Keep some history
      newData.history = [...m.history.slice(-60), ...newData.history.slice(-30)];
      return newData;
    });
    setMarkets(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setLastUpdate(new Date());
    setLoading(false);
    return updated;
  };

  const getMarket = (name: string) => markets.find(m => m.name.toLowerCase() === name.toLowerCase());

  return { markets, loading, lastUpdate, refreshMarkets, getMarket };
}

export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(ALERTS_KEY);
    if (stored) {
      setAlerts(JSON.parse(stored));
    }
  }, []);

  const addAlert = (alert: Alert) => {
    const updated = [alert, ...alerts].slice(0, 100); // Keep last 100
    setAlerts(updated);
    localStorage.setItem(ALERTS_KEY, JSON.stringify(updated));
  };

  const markAsRead = (id: string) => {
    const updated = alerts.map(a => a.id === id ? { ...a, read: true } : a);
    setAlerts(updated);
    localStorage.setItem(ALERTS_KEY, JSON.stringify(updated));
  };

  const clearAlerts = () => {
    setAlerts([]);
    localStorage.removeItem(ALERTS_KEY);
  };

  const unreadCount = alerts.filter(a => !a.read).length;

  return { alerts, addAlert, markAsRead, clearAlerts, unreadCount };
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      setSettings(JSON.parse(stored));
    }
  }, []);

  const updateSettings = (newSettings: Partial<Settings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
  };

  return { settings, updateSettings };
}

// Auto-check for alerts
export function useAlertChecker(markets: MarketData[], settings: Settings, addAlert: (alert: Alert) => void) {
  useEffect(() => {
    markets.forEach(market => {
      const alert = checkAlerts(market, settings.warnThreshold, settings.criticalThreshold);
      if (alert) {
        // Check if similar alert already exists (within last hour)
        const existing = localStorage.getItem('rawmat-alerts');
        const alerts: Alert[] = existing ? JSON.parse(existing) : [];
        const recentAlert = alerts.find(a => 
          a.market === alert.market && 
          a.level === alert.level &&
          new Date(a.timestamp).getTime() > Date.now() - 3600000
        );
        
        if (!recentAlert) {
          addAlert(alert);
        }
      }
    });
  }, [markets, settings]);
}
