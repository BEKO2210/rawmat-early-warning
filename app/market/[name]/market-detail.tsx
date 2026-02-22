"use client"

import { useParams } from "next/navigation"
import { useMarkets } from "@/lib/hooks"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, TrendingUp, TrendingDown } from "lucide-react"
import Link from "next/link"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { useTheme } from "next-themes"
import { GPTAnalysis } from "@/components/gpt-analysis"

export default function MarketDetail() {
  const params = useParams()
  const { markets } = useMarkets()
  const { theme } = useTheme()
  
  const marketName = params.name as string
  const market = markets.find(m => m.name.toLowerCase() === marketName.toLowerCase())

  if (!market) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Market not found</h1>
          <Link href="/">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  const isPositive = market.change24h >= 0
  const chartColor = isPositive ? "#10b981" : "#ef4444"

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">{market.name}</h1>
              <p className="text-sm text-muted-foreground">{market.symbol}</p>
            </div>
            <Badge 
              variant={market.alertLevel === 'critical' ? 'destructive' : market.alertLevel === 'warn' ? 'default' : 'secondary'}
            >
              {market.alertLevel.toUpperCase()}
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Price Card */}
          <Card>
            <CardHeader>
              <CardTitle>Current Price</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">${market.price.toFixed(2)}</div>
              <div className={`flex items-center gap-2 mt-2 ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                {isPositive ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                <span className="text-lg">{Math.abs(market.change24h).toFixed(2)}%</span>
              </div>
            </CardContent>
          </Card>

          {/* Mismatch Score */}
          <Card>
            <CardHeader>
              <CardTitle>Mismatch Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-4xl font-bold ${
                Math.abs(market.mismatchScore) > 2 ? 'text-red-600' : 
                Math.abs(market.mismatchScore) > 1.5 ? 'text-amber-600' : 'text-emerald-600'
              }`}>
                {market.mismatchScore > 0 ? '+' : ''}{market.mismatchScore.toFixed(2)}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Demand vs Supply imbalance
              </p>
            </CardContent>
          </Card>

          {/* Z-Score */}
          <Card>
            <CardHeader>
              <CardTitle>Z-Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{market.zScore.toFixed(2)}</div>
              <p className="text-sm text-muted-foreground mt-2">
                Standard deviations from mean
              </p>
            </CardContent>
          </Card>
        </div>

        {/* GPT-4 Analysis */}
        <GPTAnalysis market={market} />

        {/* Price Chart */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Price History (90 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={market.history}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartColor} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#333' : '#eee'} />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString('de-DE', { month: 'short', day: 'numeric' })}
                    stroke={theme === 'dark' ? '#666' : '#999'}
                  />
                  <YAxis stroke={theme === 'dark' ? '#666' : '#999'} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: theme === 'dark' ? '#1a1a1a' : '#fff',
                      border: '1px solid ' + (theme === 'dark' ? '#333' : '#eee')
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="price" 
                    stroke={chartColor}
                    fillOpacity={1}
                    fill="url(#colorPrice)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Demand vs Supply */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Demand vs Supply Index</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={market.history}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#333' : '#eee'} />
                  <XAxis 
                    dataKey="date"
                    tickFormatter={(value) => new Date(value).toLocaleDateString('de-DE', { month: 'short' })}
                    stroke={theme === 'dark' ? '#666' : '#999'}
                  />
                  <YAxis stroke={theme === 'dark' ? '#666' : '#999'} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: theme === 'dark' ? '#1a1a1a' : '#fff',
                      border: '1px solid ' + (theme === 'dark' ? '#333' : '#eee')
                    }}
                  />
                  <Line type="monotone" dataKey="demand" stroke="#3b82f6" strokeWidth={2} name="Demand" />
                  <Line type="monotone" dataKey="supply" stroke="#ef4444" strokeWidth={2} name="Supply" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
