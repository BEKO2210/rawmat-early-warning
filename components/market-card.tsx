"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, AlertTriangle, AlertCircle, Activity } from "lucide-react"
import { cn } from "@/lib/utils"
import { MarketData } from "@/lib/types"
import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts"

interface MarketCardProps {
  market: MarketData;
  onClick?: () => void;
}

export function MarketCard({ market, onClick }: MarketCardProps) {
  const isPositive = market.change24h >= 0;
  
  const alertColors = {
    normal: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    warn: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    critical: "bg-red-500/10 text-red-600 border-red-500/20"
  };

  const alertIcons = {
    normal: Activity,
    warn: AlertTriangle,
    critical: AlertCircle
  };

  const AlertIcon = alertIcons[market.alertLevel];

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02]",
        "glass border-0 shadow-sm"
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg font-semibold">{market.name}</CardTitle>
            <span className="text-xs text-muted-foreground font-mono">{market.symbol}</span>
          </div>
          <Badge 
            variant="outline" 
            className={cn("flex items-center gap-1", alertColors[market.alertLevel])}
          >
            <AlertIcon className="h-3 w-3" />
            {market.alertLevel === 'normal' ? 'Normal' : market.alertLevel === 'warn' ? 'Warn' : 'Critical'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between mb-4">
          <div>
            <div className="text-3xl font-bold tracking-tight">
              ${market.price.toFixed(2)}
            </div>
            <div className={cn(
              "flex items-center gap-1 text-sm mt-1",
              isPositive ? "text-emerald-600" : "text-red-600"
            )}>
              {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              <span>{Math.abs(market.change24h).toFixed(2)}%</span>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-xs text-muted-foreground mb-1">Mismatch Score</div>
            <div className={cn(
              "text-lg font-semibold",
              Math.abs(market.mismatchScore) > 2 ? "text-red-600" : 
              Math.abs(market.mismatchScore) > 1.5 ? "text-amber-600" : "text-emerald-600"
            )}>
              {market.mismatchScore > 0 ? '+' : ''}{market.mismatchScore.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Sparkline */}
        <div className="h-16 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={market.history.slice(-30)}>
              <YAxis domain={['auto', 'auto']} hide />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke={isPositive ? "#10b981" : "#ef4444"}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Demand:</span>
            <span className="font-medium">{market.demandIndex.toFixed(1)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Supply:</span>
            <span className="font-medium">{market.supplyIndex.toFixed(1)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
