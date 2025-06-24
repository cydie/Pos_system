import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        branch: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error("Get users error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, pin, role, branchId } = await request.json()

    if (!name || !pin || !role || !branchId) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        pin: pin,
        role: role,
      },
    })

    if (existingUser) {
      return NextResponse.json({ error: "User with this PIN and role already exists" }, { status: 400 })
    }

    const user = await prisma.user.create({
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
    console.error("Create user error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
