import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

    const [todaySales, monthlySales, totalProducts, totalUsers, topProducts] = await Promise.all([
      prisma.sale.aggregate({
        where: {
          createdAt: {
            gte: today,
          },
        },
        _sum: {
          total: true,
        },
      }),
      prisma.sale.aggregate({
        where: {
          createdAt: {
            gte: startOfMonth,
          },
        },
        _sum: {
          total: true,
        },
      }),
      prisma.product.count(),
      prisma.user.count(),
      prisma.saleItem.groupBy({
        by: ["productId"],
        _sum: {
          quantity: true,
        },
        orderBy: {
          _sum: {
            quantity: "desc",
          },
        },
        take: 5,
      }),
    ])

    const topProductsWithNames = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        })
        return {
          name: product?.name || "Unknown",
          sales: item._sum.quantity || 0,
        }
      }),
    )

    return NextResponse.json({
      todaySales: todaySales._sum.total || 0,
      monthlySales: monthlySales._sum.total || 0,
      totalProducts,
      totalUsers,
      topProducts: topProductsWithNames,
    })
  } catch (error) {
    console.error("Dashboard stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
