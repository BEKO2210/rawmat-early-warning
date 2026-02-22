"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { MarketData } from '@/lib/types';

interface GPTAnalysisProps {
  market: MarketData;
}

export function GPTAnalysis({ market }: GPTAnalysisProps) {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [signal, setSignal] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAnalysis = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ marketData: market, type: 'analysis' }),
      });
      const data = await response.json();
      setAnalysis(data.result);
    } catch (error) {
      setAnalysis('Fehler bei der Analyse.');
    }
    setLoading(false);
  };

  const fetchSignal = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ marketData: market, type: 'signal' }),
      });
      const data = await response.json();
      setSignal(data.result);
    } catch (error) {
      setSignal('HOLD');
    }
    setLoading(false);
  };

  const getSignalIcon = () => {
    if (!signal) return <Minus className="h-4 w-4" />;
    if (signal.includes('BUY')) return <TrendingUp className="h-4 w-4 text-emerald-600" />;
    if (signal.includes('SELL')) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-amber-600" />;
  };

  return (
    <Card className="border-dashed">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-500" />
            GPT-4 Analyse
          </CardTitle>
          <Badge variant="outline" className="text-xs">Powered by OpenAI</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!analysis && !signal ? (
          <div className="flex gap-2">
            <Button 
              onClick={fetchAnalysis} 
              disabled={loading}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <Sparkles className="h-3 w-3 mr-1" />
              Marktanalyse
            </Button>
            <Button 
              onClick={fetchSignal} 
              disabled={loading}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              {getSignalIcon()}
              <span className="ml-1">Signal</span>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {analysis && (
              <div className="text-sm text-muted-foreground">
                {analysis}
              </div>
            )}
            {signal && (
              <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                {getSignalIcon()}
                <span className="font-medium">{signal}</span>
              </div>
            )}
            <Button 
              onClick={() => { setAnalysis(null); setSignal(null); }} 
              variant="ghost"
              size="sm"
              className="w-full"
            >
              Zurücksetzen
            </Button>
          </div>
        )}
        
        {loading && (
          <div className="text-center text-sm text-muted-foreground">
            GPT-4 analysiert...
          </div>
        )}
      </CardContent>
    </Card>
  );
}
