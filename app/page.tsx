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
  Bell,
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
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">RawMat Early Warning</h1>
                <p className="text-xs text-muted-foreground">Rohstoff-Frühwarnsystem</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>

              <Link href="/alerts">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </Link>

              <Link href="/settings">
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </Link>

              <Button 
                onClick={refreshMarkets} 
                disabled={loading}
                size="sm"
                className="gap-2"
              >
                <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="glass border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Markets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{markets.length}</div>
              <p className="text-xs text-muted-foreground">Aktiv überwacht</p>
            </CardContent>
          </Card>

          <Card className="glass border-0 bg-emerald-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-emerald-600">Normal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600">{normalCount}</div>
              <div className="flex items-center gap-1 text-xs text-emerald-600">
                <Activity className="h-3 w-3" />
                Stabil
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-0 bg-amber-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-amber-600">Warning</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">{warnCount}</div>
              <div className="flex items-center gap-1 text-xs text-amber-600">
                <AlertTriangle className="h-3 w-3" />
                Beobachten
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-0 bg-red-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-600">Critical</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{criticalCount}</div>
              <div className="flex items-center gap-1 text-xs text-red-600">
                <AlertCircle className="h-3 w-3" />
                Handlung nötig
              </div>
            </CardContent>
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
    </div>
  );
}

// Helper
function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ')
}
