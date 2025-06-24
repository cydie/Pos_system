"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Package, AlertTriangle } from "lucide-react"

interface InventoryItem {
  id: number
  productId: number
  branchId: number
  quantity: number
  product: {
    name: string
    sku: string
    price: number
    category: string
    lowStockWarning: number
  }
  branch: {
    name: string
  }
}

export function InventoryLookup() {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBranch, setSelectedBranch] = useState("")
  const [branches, setBranches] = useState<any[]>([])

  useEffect(() => {
    fetchInventory()
    fetchBranches()
  }, [])

  const fetchInventory = async () => {
    try {
      const response = await fetch("/api/pos/inventory")
      const data = await response.json()
      setInventory(data)
    } catch (error) {
      console.error("Error fetching inventory:", error)
    } finally {
      setLoading(false)
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

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesBranch = !selectedBranch || item.branchId.toString() === selectedBranch
    return matchesSearch && matchesBranch
  })

  if (loading) return <div>Loading inventory...</div>

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Lookup</CardTitle>
        <CardDescription>Check stock levels across all branches</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <Select value={selectedBranch} onValueChange={setSelectedBranch}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All branches" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All branches</SelectItem>
              {branches.map((branch) => (
                <SelectItem key={branch.id} value={branch.id.toString()}>
                  {branch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInventory.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.product.name}</TableCell>
                <TableCell>{item.product.sku}</TableCell>
                <TableCell>{item.branch.name}</TableCell>
                <TableCell>${item.product.price.toFixed(2)}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Package className="h-4 w-4" />
                    <span>{item.quantity}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {item.quantity <= item.product.lowStockWarning && (
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                    )}
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
                          : "In Stock"}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
