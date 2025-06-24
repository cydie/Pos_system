import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import jwt from "jsonwebtoken"

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { pin, role } = await request.json()

    if (!pin || !role) {
      return NextResponse.json({ error: "PIN and role are required" }, { status: 400 })
    }

    const user = await prisma.user.findFirst({
      where: {
        pin: pin,
        role: role,
      },
      include: {
        branch: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "Invalid PIN or role" }, { status: 401 })
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET || "your-secret-key", {
      expiresIn: "24h",
    })

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        branchId: user.branchId,
        branch: user.branch,
      },
      token,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
