import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { name, sku, barcode, price, cost, category, stock, lowStockWarning } = await request.json()
    const productId = Number.parseInt(params.id)

    const product = await prisma.product.update({
      where: { id: productId },
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
    console.error("Update product error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const productId = Number.parseInt(params.id)

    await prisma.product.delete({
      where: { id: productId },
    })

    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("Delete product error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
