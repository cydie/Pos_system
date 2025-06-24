"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Eye, Printer, RefreshCw } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface Receipt {
  id: number
  total: number
  tax: number
  discount: number
  paymentMethod: string
  createdAt: string
  items: Array<{
    product: { name: string }
    quantity: number
    price: number
    discount: number
  }>
}

export function ReceiptHistory() {
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null)
  const [dateFilter, setDateFilter] = useState("")

  useEffect(() => {
    fetchReceipts()
  }, [])

  const fetchReceipts = async () => {
    try {
      const params = new URLSearchParams()
      if (dateFilter) params.append("date", dateFilter)

      const response = await fetch(`/api/pos/receipts?${params}`)
      const data = await response.json()
      setReceipts(data)
    } catch (error) {
      console.error("Error fetching receipts:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefund = async (receiptId: number) => {
    if (!confirm("Are you sure you want to process a refund for this transaction?")) return

    try {
      const response = await fetch(`/api/pos/receipts/${receiptId}/refund`, {
        method: "POST",
      })

      if (response.ok) {
        toast({
          title: "Refund Processed",
          description: "Refund has been processed successfully",
        })
        fetchReceipts()
      } else {
        const error = await response.json()
        toast({
          title: "Refund Failed",
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

  const printReceipt = (receipt: Receipt) => {
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Receipt #${receipt.id}</title>
            <style>
              body { font-family: monospace; font-size: 12px; }
              .header { text-align: center; margin-bottom: 20px; }
              .item { display: flex; justify-content: space-between; }
              .total { border-top: 1px solid #000; margin-top: 10px; padding-top: 10px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h2>Store Receipt</h2>
              <p>Receipt #${receipt.id}</p>
              <p>${new Date(receipt.createdAt).toLocaleString()}</p>
            </div>
            <div class="items">
              ${receipt.items
                .map(
                  (item) => `
                <div class="item">
                  <span>${item.product.name} x${item.quantity}</span>
                  <span>$${(item.price * item.quantity * (1 - item.discount / 100)).toFixed(2)}</span>
                </div>
              `,
                )
                .join("")}
            </div>
            <div class="total">
              <div class="item">
                <span>Subtotal:</span>
                <span>$${(receipt.total - receipt.tax + receipt.discount).toFixed(2)}</span>
              </div>
              <div class="item">
                <span>Tax:</span>
                <span>$${receipt.tax.toFixed(2)}</span>
              </div>
              <div class="item">
                <span>Discount:</span>
                <span>-$${receipt.discount.toFixed(2)}</span>
              </div>
              <div class="item" style="font-weight: bold;">
                <span>Total:</span>
                <span>$${receipt.total.toFixed(2)}</span>
              </div>
              <div class="item">
                <span>Payment:</span>
                <span>${receipt.paymentMethod.toUpperCase()}</span>
              </div>
            </div>
            <div class="header" style="margin-top: 20px;">
              <p>Thank you for your business!</p>
            </div>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  if (loading) return <div>Loading receipt history...</div>

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Receipt History</CardTitle>
            <CardDescription>View and manage past transactions</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="w-40" />
            <Button onClick={fetchReceipts} variant="outline">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Receipt #</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {receipts.map((receipt) => (
              <TableRow key={receipt.id}>
                <TableCell className="font-medium">#{receipt.id}</TableCell>
                <TableCell>{new Date(receipt.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>${receipt.total.toFixed(2)}</TableCell>
                <TableCell className="capitalize">{receipt.paymentMethod}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedReceipt(receipt)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Receipt #{selectedReceipt?.id}</DialogTitle>
                          <DialogDescription>Transaction details</DialogDescription>
                        </DialogHeader>
                        {selectedReceipt && (
                          <div className="space-y-4">
                            <div className="text-sm">
                              <p>
                                <strong>Date:</strong> {new Date(selectedReceipt.createdAt).toLocaleString()}
                              </p>
                              <p>
                                <strong>Payment:</strong> {selectedReceipt.paymentMethod.toUpperCase()}
                              </p>
                            </div>
                            <div className="space-y-2">
                              <h4 className="font-semibold">Items:</h4>
                              {selectedReceipt.items.map((item, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                  <span>
                                    {item.product.name} x{item.quantity}
                                  </span>
                                  <span>${(item.price * item.quantity * (1 - item.discount / 100)).toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                            <div className="border-t pt-2 space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span>Subtotal:</span>
                                <span>
                                  ${(selectedReceipt.total - selectedReceipt.tax + selectedReceipt.discount).toFixed(2)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Tax:</span>
                                <span>${selectedReceipt.tax.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Discount:</span>
                                <span>-${selectedReceipt.discount.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between font-bold">
                                <span>Total:</span>
                                <span>${selectedReceipt.total.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button variant="outline" size="sm" onClick={() => printReceipt(receipt)}>
                      <Printer className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleRefund(receipt.id)}>
                      <RefreshCw className="h-4 w-4" />
                    </Button>
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
