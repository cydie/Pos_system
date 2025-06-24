import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { name, address, phone, taxRate } = await request.json()
    const branchId = Number.parseInt(params.id)

    const branch = await prisma.branch.update({
      where: { id: branchId },
      data: {
        name,
        address,
        phone,
        taxRate,
      },
    })

    return NextResponse.json(branch)
  } catch (error) {
    console.error("Update branch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const branchId = Number.parseInt(params.id)

    await prisma.branch.delete({
      where: { id: branchId },
    })

    return NextResponse.json({ message: "Branch deleted" })
  } catch (error) {
    console.error("Delete branch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
