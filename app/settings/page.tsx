"use client"

import { useSettings } from "@/lib/hooks"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function SettingsPage() {
  const { settings, updateSettings } = useSettings()
  const [localSettings, setLocalSettings] = useState(settings)

  const handleSave = () => {
    updateSettings(localSettings)
  }

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
            <h1 className="text-2xl font-bold">Settings</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Alert Thresholds</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="warn">Warning Threshold (Mismatch Score)</Label>
              <Input
                id="warn"
                type="number"
                step="0.1"
                value={localSettings.warnThreshold}
                onChange={(e) => setLocalSettings({ ...localSettings, warnThreshold: parseFloat(e.target.value) })}
              />
              <p className="text-sm text-muted-foreground">
                Alert when |mismatch| exceeds this value (default: 1.5)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="critical">Critical Threshold (Mismatch Score)</Label>
              <Input
                id="critical"
                type="number"
                step="0.1"
                value={localSettings.criticalThreshold}
                onChange={(e) => setLocalSettings({ ...localSettings, criticalThreshold: parseFloat(e.target.value) })}
              />
              <p className="text-sm text-muted-foreground">
                Critical alert when |mismatch| exceeds this value (default: 2.0)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="refresh">Refresh Interval (minutes)</Label>
              <Input
                id="refresh"
                type="number"
                min="1"
                max="60"
                value={localSettings.refreshInterval / 60000}
                onChange={(e) => setLocalSettings({ ...localSettings, refreshInterval: parseInt(e.target.value) * 60000 })}
              />
            </div>

            <Button onClick={handleSave} className="w-full gap-2">
              <Save className="h-4 w-4" />
              Save Settings
            </Button>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-medium">RawMat Early Warning System</p>
              <p className="text-sm text-muted-foreground">Version 1.0.0</p>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p>A free, open-source commodity early warning dashboard.</p>
              <p className="mt-2">No paid APIs. No login required. Fully client-side.</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
