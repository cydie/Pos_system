import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error("Get products error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, sku, barcode, price, cost, category, stock, lowStockWarning } = await request.json()

    if (!name || !sku || !price || !cost || !category || stock === undefined || !lowStockWarning) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const existingProduct = await prisma.product.findFirst({
      where: {
        OR: [{ sku: sku }, { barcode: barcode }],
      },
    })

    if (existingProduct) {
      return NextResponse.json({ error: "Product with this SKU or barcode already exists" }, { status: 400 })
    }

    const product = await prisma.product.create({
      data: {
        name,
        sku,
        barcode,
        price,
        cost,
        category,
        stock,
        lowStockWarning,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error("Create product error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
