import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { name, pin, role, branchId } = await request.json()
    const userId = Number.parseInt(params.id)

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        pin,
        role,
        branchId,
      },
      include: {
        branch: true,
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error("Update user error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = Number.parseInt(params.id)

    await prisma.user.delete({
      where: { id: userId },
    })

    return NextResponse.json({ message: "User deleted successfully" })
  } catch (error) {
    console.error("Delete user error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
