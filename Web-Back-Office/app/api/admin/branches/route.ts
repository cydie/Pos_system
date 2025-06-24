import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const branches = await prisma.branch.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(branches)
  } catch (error) {
    console.error("Get branches error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, address, phone, taxRate } = await request.json()

    if (!name || !address || !phone || taxRate === undefined) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const branch = await prisma.branch.create({
      data: {
        name,
        address,
        phone,
        taxRate,
      },
    })

    return NextResponse.json(branch)
  } catch (error) {
    console.error("Create branch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
