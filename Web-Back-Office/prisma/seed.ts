import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // Create branches
  const branches = await prisma.branch.createMany({
    data: [
      {
        name: "Main Store",
        address: "123 Main Street, City, State 12345",
        phone: "+1-555-0123",
        taxRate: 0.1,
      },
      {
        name: "Downtown Branch",
        address: "456 Downtown Ave, City, State 12345",
        phone: "+1-555-0124",
        taxRate: 0.08,
      },
      {
        name: "Mall Location",
        address: "789 Shopping Mall, City, State 12345",
        phone: "+1-555-0125",
        taxRate: 0.1,
      },
    ],
    skipDuplicates: true,
  })

  // Create users
  const users = await prisma.user.createMany({
    data: [
      {
        name: "System Admin",
        pin: "123456",
        role: "admin",
        branchId: 1,
      },
      {
        name: "Store Manager",
        pin: "234567",
        role: "manager",
        branchId: 1,
      },
      {
        name: "Cashier One",
        pin: "345678",
        role: "cashier",
        branchId: 1,
      },
      {
        name: "Cashier Two",
        pin: "456789",
        role: "cashier",
        branchId: 2,
      },
    ],
    skipDuplicates: true,
  })

  // Create products
  const products = await prisma.product.createMany({
    data: [
      {
        name: "Coca Cola 330ml",
        sku: "COKE-330",
        barcode: "1234567890123",
        price: 2.5,
        cost: 1.2,
        category: "Drinks",
        stock: 100,
        lowStockWarning: 20,
      },
      {
        name: "Pepsi 330ml",
        sku: "PEPSI-330",
        barcode: "1234567890124",
        price: 2.5,
        cost: 1.2,
        category: "Drinks",
        stock: 80,
        lowStockWarning: 20,
      },
      {
        name: "Water Bottle 500ml",
        sku: "WATER-500",
        barcode: "1234567890125",
        price: 1.5,
        cost: 0.6,
        category: "Drinks",
        stock: 150,
        lowStockWarning: 30,
      },
      {
        name: "Sandwich - Ham & Cheese",
        sku: "SAND-HAM",
        barcode: "1234567890126",
        price: 6.99,
        cost: 3.5,
        category: "Food",
        stock: 25,
        lowStockWarning: 5,
      },
      {
        name: "Chocolate Bar",
        sku: "CHOC-BAR",
        barcode: "1234567890127",
        price: 3.99,
        cost: 2.0,
        category: "Food",
        stock: 60,
        lowStockWarning: 15,
      },
      {
        name: "Phone Charger USB-C",
        sku: "CHAR-USBC",
        barcode: "1234567890128",
        price: 19.99,
        cost: 8.0,
        category: "Electronics",
        stock: 40,
        lowStockWarning: 10,
      },
      {
        name: "Bluetooth Earbuds",
        sku: "BT-EARBUDS",
        barcode: "1234567890129",
        price: 49.99,
        cost: 25.0,
        category: "Electronics",
        stock: 20,
        lowStockWarning: 5,
      },
      {
        name: "T-Shirt Basic White M",
        sku: "TSHIRT-WM",
        barcode: "1234567890130",
        price: 15.99,
        cost: 7.0,
        category: "Clothing",
        stock: 30,
        lowStockWarning: 8,
      },
      {
        name: "Jeans Blue 32W",
        sku: "JEANS-B32",
        barcode: "1234567890131",
        price: 39.99,
        cost: 20.0,
        category: "Clothing",
        stock: 15,
        lowStockWarning: 5,
      },
      {
        name: "Notebook A4 Lined",
        sku: "NOTE-A4L",
        barcode: "1234567890132",
        price: 4.99,
        cost: 2.5,
        category: "Books",
        stock: 50,
        lowStockWarning: 12,
      },
    ],
    skipDuplicates: true,
  })

  // Create inventory for each branch
  const inventoryData = []
  for (let branchId = 1; branchId <= 3; branchId++) {
    for (let productId = 1; productId <= 10; productId++) {
      inventoryData.push({
        productId,
        branchId,
        quantity: Math.floor(Math.random() * 100) + 20, // Random quantity between 20-120
      })
    }
  }

  await prisma.inventory.createMany({
    data: inventoryData,
    skipDuplicates: true,
  })

  // Create customers
  await prisma.customer.createMany({
    data: [
      {
        name: "John Smith",
        email: "john.smith@email.com",
        phone: "+1-555-1001",
        loyaltyPoints: 150,
      },
      {
        name: "Sarah Johnson",
        email: "sarah.j@email.com",
        phone: "+1-555-1002",
        loyaltyPoints: 75,
      },
      {
        name: "Mike Wilson",
        email: "mike.wilson@email.com",
        phone: "+1-555-1003",
        loyaltyPoints: 200,
      },
      {
        name: "Emily Davis",
        email: "emily.davis@email.com",
        phone: "+1-555-1004",
        loyaltyPoints: 50,
      },
    ],
    skipDuplicates: true,
  })

  // Create settings
  await prisma.settings.createMany({
    data: [
      {
        key: "store_name",
        value: "My POS Store",
        description: "Store name for receipts",
      },
      {
        key: "store_address",
        value: "123 Main Street\nCity, State 12345",
        description: "Store address for receipts",
      },
      {
        key: "store_phone",
        value: "+1-555-0123",
        description: "Store phone number",
      },
      {
        key: "default_tax_rate",
        value: "0.10",
        description: "Default tax rate (10%)",
      },
      {
        key: "tax_inclusive",
        value: "false",
        description: "Whether prices include tax",
      },
      {
        key: "receipt_header",
        value: "Thank you for shopping with us!",
        description: "Receipt header message",
      },
      {
        key: "receipt_footer",
        value: "Visit us again soon!",
        description: "Receipt footer message",
      },
      {
        key: "low_stock_enabled",
        value: "true",
        description: "Enable low stock warnings",
      },
      {
        key: "currency_symbol",
        value: "$",
        description: "Currency symbol",
      },
      {
        key: "loyalty_points_rate",
        value: "0.01",
        description: "Points earned per dollar spent",
      },
    ],
    skipDuplicates: true,
  })

  console.log("✅ Database seeded successfully!")
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error("❌ Error seeding database:", e)
    await prisma.$disconnect()
    process.exit(1)
  })
