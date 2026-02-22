"use client"

import { useMarkets, useAlerts, useSettings, useAlertChecker } from "@/lib/hooks"
import { MarketCard } from "@/components/market-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Activity,
  AlertTriangle,
  AlertCircle,
  RefreshCw,
  Settings,
  Sun,
  Moon,
  TrendingUp
} from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function Dashboard() {
  const { markets, loading, lastUpdate, refreshMarkets } = useMarkets()
  const { alerts, addAlert, unreadCount } = useAlerts()
  const { settings } = useSettings()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Auto-check for alerts
  useAlertChecker(markets, settings, addAlert)

  const criticalCount = markets.filter(m => m.alertLevel === 'critical').length
  const warnCount = markets.filter(m => m.alertLevel === 'warn').length
  const normalCount = markets.filter(m => m.alertLevel === 'normal').length

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary shrink-0" />
              <h1 className="text-sm font-semibold tracking-tight truncate">RawMat Early Warning</h1>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {theme === 'dark' ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
              </Button>

              <Link href="/settings">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Settings className="h-3.5 w-3.5" />
                </Button>
              </Link>

              <Button
                onClick={refreshMarkets}
                disabled={loading}
                size="sm"
                className="gap-1 h-8 px-2 text-xs"
              >
                <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Status Cards - Kompakt */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <Card className="glass border-0 p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Markets</p>
                <p className="text-2xl font-bold">{markets.length}</p>
              </div>
              <Activity className="h-5 w-5 text-muted-foreground" />
            </div>
          </Card>

          <Card className="glass border-0 p-3 bg-emerald-500/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-emerald-600">Normal</p>
                <p className="text-2xl font-bold text-emerald-600">{normalCount}</p>
              </div>
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
            </div>
          </Card>

          <Card className="glass border-0 p-3 bg-amber-500/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-amber-600">Warn</p>
                <p className="text-2xl font-bold text-amber-600">{warnCount}</p>
              </div>
              <div className="h-2 w-2 rounded-full bg-amber-500" />
            </div>
          </Card>

          <Card className="glass border-0 p-3 bg-red-500/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-red-600">Critical</p>
                <p className="text-2xl font-bold text-red-600">{criticalCount}</p>
              </div>
              <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            </div>
          </Card>
        </div>

        {/* Last Update */}
        {lastUpdate && (
          <div className="text-xs text-muted-foreground mb-4">
            Letztes Update: {lastUpdate.toLocaleTimeString('de-DE')}
          </div>
        )}

        {/* Market Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {markets.map((market) => (
            <Link key={market.symbol} href={`/market/${market.name.toLowerCase()}`}>
              <MarketCard market={market} />
            </Link>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center">
        <p className="text-xs text-muted-foreground animate-fade-in">
          by <span className="font-medium text-foreground/70">Belkis Aslani</span>
        </p>
      </footer>
    </div>
  );
}

// Helper
function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ')
}
