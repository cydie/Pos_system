"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, AlertTriangle } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface InventoryItem {
  id: number
  productId: number
  branchId: number
  quantity: number
  product: {
    name: string
    sku: string
    lowStockWarning: number
  }
  branch: {
    name: string
  }
}

export function InventoryManagement() {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [branches, setBranches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [adjustmentData, setAdjustmentData] = useState({
    productId: "",
    branchId: "",
    quantity: "",
    reason: "",
  })

  useEffect(() => {
    fetchInventory()
    fetchProducts()
    fetchBranches()
  }, [])

  const fetchInventory = async () => {
    try {
      const response = await fetch("/api/admin/inventory")
      const data = await response.json()
      setInventory(data)
    } catch (error) {
      console.error("Error fetching inventory:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/admin/products")
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error("Error fetching products:", error)
    }
  }

  const fetchBranches = async () => {
    try {
      const response = await fetch("/api/admin/branches")
      const data = await response.json()
      setBranches(data)
    } catch (error) {
      console.error("Error fetching branches:", error)
    }
  }

  const handleStockAdjustment = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/admin/inventory/adjust", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...adjustmentData,
          productId: Number.parseInt(adjustmentData.productId),
          branchId: Number.parseInt(adjustmentData.branchId),
          quantity: Number.parseInt(adjustmentData.quantity),
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Stock adjusted successfully",
        })
        setDialogOpen(false)
        setAdjustmentData({ productId: "", branchId: "", quantity: "", reason: "" })
        fetchInventory()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error,
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

  if (loading) return <div>Loading inventory...</div>

  const lowStockItems = inventory.filter((item) => item.quantity <= item.product.lowStockWarning)

  return (
    <div className="space-y-6">
      {lowStockItems.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-800">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Low Stock Warnings
            </CardTitle>
            <CardDescription className="text-orange-700">The following items are running low on stock</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStockItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-2 bg-white rounded">
                  <span className="font-medium">{item.product.name}</span>
                  <span className="text-sm text-gray-600">{item.branch.name}</span>
                  <span className="text-sm font-medium text-orange-600">{item.quantity} remaining</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Inventory Management</CardTitle>
              <CardDescription>Monitor and adjust stock levels across branches</CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Adjust Stock
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Stock Adjustment</DialogTitle>
                  <DialogDescription>Adjust inventory levels for products</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleStockAdjustment}>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="product">Product</Label>
                      <Select
                        value={adjustmentData.productId}
                        onValueChange={(value) => setAdjustmentData({ ...adjustmentData, productId: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select product" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem key={product.id} value={product.id.toString()}>
                              {product.name} ({product.sku})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="branch">Branch</Label>
                      <Select
                        value={adjustmentData.branchId}
                        onValueChange={(value) => setAdjustmentData({ ...adjustmentData, branchId: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select branch" />
                        </SelectTrigger>
                        <SelectContent>
                          {branches.map((branch) => (
                            <SelectItem key={branch.id} value={branch.id.toString()}>
                              {branch.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="quantity">Quantity Change</Label>
                      <Input
                        id="quantity"
                        type="number"
                        value={adjustmentData.quantity}
                        onChange={(e) => setAdjustmentData({ ...adjustmentData, quantity: e.target.value })}
                        placeholder="Enter positive or negative number"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="reason">Reason</Label>
                      <Input
                        id="reason"
                        value={adjustmentData.reason}
                        onChange={(e) => setAdjustmentData({ ...adjustmentData, reason: e.target.value })}
                        placeholder="Reason for adjustment"
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Adjust Stock</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Low Stock Warning</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.product.name}</TableCell>
                  <TableCell>{item.product.sku}</TableCell>
                  <TableCell>{item.branch.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.product.lowStockWarning}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        item.quantity <= item.product.lowStockWarning
                          ? "bg-red-100 text-red-800"
                          : item.quantity <= item.product.lowStockWarning * 2
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {item.quantity <= item.product.lowStockWarning
                        ? "Low Stock"
                        : item.quantity <= item.product.lowStockWarning * 2
                          ? "Medium Stock"
                          : "Good Stock"}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
