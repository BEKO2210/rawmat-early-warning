"use client"

import { useAlerts } from "@/lib/hooks"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, AlertTriangle, AlertCircle, Check, Trash2 } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function AlertsPage() {
  const { alerts, markAsRead, clearAlerts, unreadCount } = useAlerts()

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-2xl font-bold">Alerts</h1>
              {unreadCount > 0 && (
                <Badge variant="destructive">{unreadCount} new</Badge>
              )}
            </div>
            
            {alerts.length > 0 && (
              <Button variant="outline" size="sm" onClick={clearAlerts} className="gap-2">
                <Trash2 className="h-4 w-4" />
                Clear All
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {alerts.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-muted-foreground">
                <Check className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No alerts</p>
                <p className="text-sm">All markets are stable</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <Card 
                key={alert.id} 
                className={cn(
                  "transition-all",
                  !alert.read && "border-l-4 border-l-primary"
                )}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {alert.level === 'critical' ? (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                      )}
                      <div>
                        <CardTitle className="text-base">{alert.market}</CardTitle>
                        <p className="text-xs text-muted-foreground">
                          {new Date(alert.timestamp).toLocaleString('de-DE')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant={alert.level === 'critical' ? 'destructive' : 'default'}>
                        {alert.level.toUpperCase()}
                      </Badge>
                      
                      {!alert.read && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => markAsRead(alert.id)}
                        >
                          Mark read
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p>{alert.message}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
