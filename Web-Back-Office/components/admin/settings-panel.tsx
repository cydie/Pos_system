"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"

interface Settings {
  storeName: string
  storeAddress: string
  storePhone: string
  defaultTaxRate: number
  taxInclusive: boolean
  receiptHeader: string
  receiptFooter: string
  lowStockEnabled: boolean
  currencySymbol: string
}

export function SettingsPanel() {
  const [settings, setSettings] = useState<Settings>({
    storeName: "",
    storeAddress: "",
    storePhone: "",
    defaultTaxRate: 0,
    taxInclusive: false,
    receiptHeader: "",
    receiptFooter: "",
    lowStockEnabled: true,
    currencySymbol: "$",
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/admin/settings")
      const data = await response.json()
      setSettings(data)
    } catch (error) {
      console.error("Error fetching settings:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Settings saved successfully",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to save settings",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error occurred",
        variant: "destructive",
      })
    }
  }

  if (loading) return <div>Loading settings...</div>

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Store Information</CardTitle>
          <CardDescription>Basic store details for receipts and reports</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="storeName">Store Name</Label>
            <Input
              id="storeName"
              value={settings.storeName}
              onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="storeAddress">Store Address</Label>
            <Textarea
              id="storeAddress"
              value={settings.storeAddress}
              onChange={(e) => setSettings({ ...settings, storeAddress: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="storePhone">Store Phone</Label>
            <Input
              id="storePhone"
              value={settings.storePhone}
              onChange={(e) => setSettings({ ...settings, storePhone: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tax Settings</CardTitle>
          <CardDescription>Configure tax rates and calculation methods</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="defaultTaxRate">Default Tax Rate (%)</Label>
            <Input
              id="defaultTaxRate"
              type="number"
              step="0.01"
              value={settings.defaultTaxRate}
              onChange={(e) => setSettings({ ...settings, defaultTaxRate: Number.parseFloat(e.target.value) })}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="taxInclusive"
              checked={settings.taxInclusive}
              onCheckedChange={(checked) => setSettings({ ...settings, taxInclusive: checked })}
            />
            <Label htmlFor="taxInclusive">Tax Inclusive Pricing</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Receipt Settings</CardTitle>
          <CardDescription>Customize receipt header and footer text</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="receiptHeader">Receipt Header</Label>
            <Textarea
              id="receiptHeader"
              value={settings.receiptHeader}
              onChange={(e) => setSettings({ ...settings, receiptHeader: e.target.value })}
              placeholder="Thank you for shopping with us!"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="receiptFooter">Receipt Footer</Label>
            <Textarea
              id="receiptFooter"
              value={settings.receiptFooter}
              onChange={(e) => setSettings({ ...settings, receiptFooter: e.target.value })}
              placeholder="Visit us again soon!"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System Settings</CardTitle>
          <CardDescription>General system configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="currencySymbol">Currency Symbol</Label>
            <Input
              id="currencySymbol"
              value={settings.currencySymbol}
              onChange={(e) => setSettings({ ...settings, currencySymbol: e.target.value })}
              maxLength={3}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="lowStockEnabled"
              checked={settings.lowStockEnabled}
              onCheckedChange={(checked) => setSettings({ ...settings, lowStockEnabled: checked })}
            />
            <Label htmlFor="lowStockEnabled">Enable Low Stock Warnings</Label>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="w-full">
        Save Settings
      </Button>
    </div>
  )
}
