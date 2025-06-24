"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, Plus, Minus, Trash2, Receipt } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface Product {
  id: number
  name: string
  sku: string
  price: number
  stock: number
  category: string
}

interface CartItem {
  product: Product
  quantity: number
  discount: number
}

interface SalesSystemProps {
  user: any
}

export function SalesSystem({ user }: SalesSystemProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
  const [paymentData, setPaymentData] = useState({
    method: "",
    cashReceived: "",
    cardAmount: "",
    discount: "0",
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/pos/products")
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error("Error fetching products:", error)
    }
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || product.category === selectedCategory
    return matchesSearch && matchesCategory && product.stock > 0
  })

  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.product.id === product.id)

    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCart(cart.map((item) => (item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)))
      } else {
        toast({
          title: "Insufficient Stock",
          description: "Not enough stock available",
          variant: "destructive",
        })
      }
    } else {
      setCart([...cart, { product, quantity: 1, discount: 0 }])
    }
  }

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity === 0) {
      setCart(cart.filter((item) => item.product.id !== productId))
    } else {
      const product = products.find((p) => p.id === productId)
      if (product && newQuantity <= product.stock) {
        setCart(cart.map((item) => (item.product.id === productId ? { ...item, quantity: newQuantity } : item)))
      } else {
        toast({
          title: "Insufficient Stock",
          description: "Not enough stock available",
          variant: "destructive",
        })
      }
    }
  }

  const updateDiscount = (productId: number, discount: number) => {
    setCart(cart.map((item) => (item.product.id === productId ? { ...item, discount } : item)))
  }

  const removeFromCart = (productId: number) => {
    setCart(cart.filter((item) => item.product.id !== productId))
  }

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => {
      const itemTotal = item.product.price * item.quantity
      const discountAmount = (itemTotal * item.discount) / 100
      return sum + (itemTotal - discountAmount)
    }, 0)
  }

  const calculateTax = () => {
    return calculateSubtotal() * 0.1 // 10% tax rate
  }

  const calculateTotal = () => {
    const subtotal = calculateSubtotal()
    const tax = calculateTax()
    const totalDiscount = Number.parseFloat(paymentData.discount) || 0
    return subtotal + tax - totalDiscount
  }

  const processPayment = async () => {
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to cart before checkout",
        variant: "destructive",
      })
      return
    }

    if (!paymentData.method) {
      toast({
        title: "Payment Method Required",
        description: "Please select a payment method",
        variant: "destructive",
      })
      return
    }

    try {
      const saleData = {
        items: cart.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
          discount: item.discount,
        })),
        subtotal: calculateSubtotal(),
        tax: calculateTax(),
        discount: Number.parseFloat(paymentData.discount) || 0,
        total: calculateTotal(),
        paymentMethod: paymentData.method,
        cashReceived: paymentData.method === "cash" ? Number.parseFloat(paymentData.cashReceived) : null,
        userId: user.id,
      }

      const response = await fetch("/api/pos/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(saleData),
      })

      if (response.ok) {
        const result = await response.json()
        toast({
          title: "Sale Completed",
          description: `Transaction #${result.id} processed successfully`,
        })

        // Clear cart and close dialog
        setCart([])
        setPaymentDialogOpen(false)
        setPaymentData({ method: "", cashReceived: "", cardAmount: "", discount: "0" })

        // Refresh products to update stock
        fetchProducts()
      } else {
        const error = await response.json()
        toast({
          title: "Payment Failed",
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

  const categories = [...new Set(products.map((p) => p.category))]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Product Selection */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Product Selection</CardTitle>
            <CardDescription>Search and select products to add to cart</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4 mb-4">
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
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold">{product.name}</h3>
                      <p className="text-sm text-gray-600">{product.sku}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
                        <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                      </div>
                      <Button onClick={() => addToCart(product)} className="w-full" size="sm">
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Shopping Cart */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Shopping Cart</CardTitle>
            <CardDescription>{cart.length} items in cart</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.product.id} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.product.name}</h4>
                      <p className="text-sm text-gray-600">${item.product.price.toFixed(2)} each</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => removeFromCart(item.product.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center space-x-2 mb-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Label htmlFor={`discount-${item.product.id}`} className="text-xs">
                      Discount %:
                    </Label>
                    <Input
                      id={`discount-${item.product.id}`}
                      type="number"
                      min="0"
                      max="100"
                      value={item.discount}
                      onChange={(e) => updateDiscount(item.product.id, Number.parseFloat(e.target.value) || 0)}
                      className="w-16 h-8 text-xs"
                    />
                  </div>

                  <div className="text-right mt-2">
                    <span className="font-semibold">
                      ${(item.product.price * item.quantity * (1 - item.discount / 100)).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}

              {cart.length === 0 && <div className="text-center text-gray-500 py-8">Cart is empty</div>}

              {cart.length > 0 && (
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (10%):</span>
                    <span>${calculateTax().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>${(calculateSubtotal() + calculateTax()).toFixed(2)}</span>
                  </div>

                  <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full mt-4">
                        <Receipt className="h-4 w-4 mr-2" />
                        Checkout
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Payment</DialogTitle>
                        <DialogDescription>Complete the transaction</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid gap-2">
                          <Label>Payment Method</Label>
                          <Select
                            value={paymentData.method}
                            onValueChange={(value) => setPaymentData({ ...paymentData, method: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select payment method" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cash">Cash</SelectItem>
                              <SelectItem value="card">Card</SelectItem>
                              <SelectItem value="split">Split Payment</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {paymentData.method === "cash" && (
                          <div className="grid gap-2">
                            <Label htmlFor="cashReceived">Cash Received</Label>
                            <Input
                              id="cashReceived"
                              type="number"
                              step="0.01"
                              value={paymentData.cashReceived}
                              onChange={(e) => setPaymentData({ ...paymentData, cashReceived: e.target.value })}
                              placeholder="0.00"
                            />
                            {paymentData.cashReceived && (
                              <p className="text-sm text-gray-600">
                                Change: ${(Number.parseFloat(paymentData.cashReceived) - calculateTotal()).toFixed(2)}
                              </p>
                            )}
                          </div>
                        )}

                        <div className="grid gap-2">
                          <Label htmlFor="totalDiscount">Additional Discount ($)</Label>
                          <Input
                            id="totalDiscount"
                            type="number"
                            step="0.01"
                            value={paymentData.discount}
                            onChange={(e) => setPaymentData({ ...paymentData, discount: e.target.value })}
                            placeholder="0.00"
                          />
                        </div>

                        <div className="border-t pt-4">
                          <div className="flex justify-between font-bold text-lg">
                            <span>Final Total:</span>
                            <span>${calculateTotal().toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={processPayment} className="w-full">
                          Complete Payment
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
