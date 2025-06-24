"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download } from "lucide-react"

interface SalesReport {
  id: number
  total: number
  tax: number
  discount: number
  paymentMethod: string
  createdAt: string
  user: { name: string }
  branch: { name: string }
  items: Array<{
    product: { name: string }
    quantity: number
    price: number
  }>
}

export function SalesReporting() {
  const [reports, setReports] = useState<SalesReport[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    branch: "",
    user: "",
  })
  const [branches, setBranches] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])

  useEffect(() => {
    fetchReports()
    fetchBranches()
    fetchUsers()
  }, [])

  const fetchReports = async () => {
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })

      const response = await fetch(`/api/admin/sales-reports?${params}`)
      const data = await response.json()
      setReports(data)
    } catch (error) {
      console.error("Error fetching reports:", error)
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

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users")
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value })
  }

  const applyFilters = () => {
    setLoading(true)
    fetchReports()
  }

  const exportToCSV = () => {
    const csvContent = [
      ["Date", "Branch", "User", "Total", "Tax", "Discount", "Payment Method"].join(","),
      ...reports.map((report) =>
        [
          new Date(report.createdAt).toLocaleDateString(),
          report.branch.name,
          report.user.name,
          report.total.toFixed(2),
          report.tax.toFixed(2),
          report.discount.toFixed(2),
          report.paymentMethod,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "sales-report.csv"
    a.click()
  }

  if (loading) return <div>Loading reports...</div>

  const totalSales = reports.reduce((sum, report) => sum + report.total, 0)
  const totalTax = reports.reduce((sum, report) => sum + report.tax, 0)
  const totalDiscount = reports.reduce((sum, report) => sum + report.discount, 0)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sales Filters</CardTitle>
          <CardDescription>Filter sales reports by date, branch, or user</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange("startDate", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange("endDate", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="branch">Branch</Label>
              <Select value={filters.branch} onValueChange={(value) => handleFilterChange("branch", value)}>
                <SelectTrigger>
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
            <div className="grid gap-2">
              <Label htmlFor="user">User</Label>
              <Select value={filters.user} onValueChange={(value) => handleFilterChange("user", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All users" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All users</SelectItem>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex space-x-2 mt-4">
            <Button onClick={applyFilters}>Apply Filters</Button>
            <Button variant="outline" onClick={exportToCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSales.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tax</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalTax.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Discount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalDiscount.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sales Reports</CardTitle>
          <CardDescription>Detailed sales transaction history</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Tax</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Payment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>{new Date(report.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{report.branch.name}</TableCell>
                  <TableCell>{report.user.name}</TableCell>
                  <TableCell>${report.total.toFixed(2)}</TableCell>
                  <TableCell>${report.tax.toFixed(2)}</TableCell>
                  <TableCell>${report.discount.toFixed(2)}</TableCell>
                  <TableCell className="capitalize">{report.paymentMethod}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
