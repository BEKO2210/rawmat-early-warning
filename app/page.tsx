"use client"

import { useMarkets, useAlerts, useSettings, useAlertChecker } from "@/lib/hooks"
import { MarketCard } from "@/components/market-card"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Activity,
  AlertTriangle,
  AlertCircle,
  RefreshCw,
  Settings,
  Bell,
  Sun,
  Moon,
  Zap,
  ShieldCheck,
  Eye,
  BarChart3
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
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">Energie-Rohstoff Monitor</h1>
                <p className="text-xs text-muted-foreground">Frühwarnsystem für kritische Energie-Rohstoffe</p>
              </div>
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

              <Link href="/alerts">
                <Button variant="ghost" size="icon" className="relative h-8 w-8">
                  <Bell className="h-3.5 w-3.5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-red-500 text-[9px] font-medium text-white flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </Link>

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
                <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
                Aktualisieren
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Intro / Hero Section */}
        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border border-primary/10">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 rounded-lg mt-0.5">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-semibold mb-1">Energie-Rohstoff Frühwarnsystem</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Echtzeit-Überwachung kritischer Rohstoffe für die Energiewende — Kupfer, Nickel, Cobalt, Lithium, Magnesium und Aluminium.
                Das System analysiert Angebot- und Nachfrage-Ungleichgewichte, berechnet Z-Scores und erkennt Preisanomalien,
                um frühzeitig auf Versorgungsrisiken für Batterie-, Solar- und Windkrafttechnologien hinzuweisen.
              </p>
            </div>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {/* Aktiv überwacht */}
          <Card className="glass border-0 p-4">
            <div className="flex items-center justify-between mb-2">
              <Activity className="h-5 w-5 text-primary" />
              <span className="text-xs font-medium text-primary bg-primary/10 rounded-full px-2 py-0.5">Live</span>
            </div>
            <p className="text-2xl font-bold">{markets.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Energie-Rohstoffe überwacht</p>
          </Card>

          {/* Stabil */}
          <Card className="glass border-0 p-4 bg-emerald-500/5">
            <div className="flex items-center justify-between mb-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
            </div>
            <p className="text-2xl font-bold text-emerald-600">{normalCount}</p>
            <p className="text-xs text-emerald-600/80 mt-1">Stabil — Versorgung gesichert</p>
          </Card>

          {/* Beobachten */}
          <Card className="glass border-0 p-4 bg-amber-500/5">
            <div className="flex items-center justify-between mb-2">
              <Eye className="h-5 w-5 text-amber-600" />
              <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            </div>
            <p className="text-2xl font-bold text-amber-600">{warnCount}</p>
            <p className="text-xs text-amber-600/80 mt-1">Warnung — Markt beobachten</p>
          </Card>

          {/* Handlung nötig */}
          <Card className="glass border-0 p-4 bg-red-500/5">
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
            </div>
            <p className="text-2xl font-bold text-red-600">{criticalCount}</p>
            <p className="text-xs text-red-600/80 mt-1">Kritisch — Handlung erforderlich</p>
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
