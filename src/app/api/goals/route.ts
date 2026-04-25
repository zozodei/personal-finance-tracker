import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const goalSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  targetAmount: z.number().positive(),
  currentAmount: z.number().min(0).optional().default(0),
  deadline: z.string().optional(),
  priority: z.enum(["low", "medium", "high", "critical"]).optional().default("medium"),
  category: z.string().optional().default("general"),
  emoji: z.string().optional().default("🎯"),
  color: z.string().optional().default("#10b981"),
});

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const goals = await prisma.savingsGoal.findMany({
    where: { userId: session.user.id },
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
  });

  return NextResponse.json({ goals });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = goalSchema.parse(body);

    const goal = await prisma.savingsGoal.create({
      data: {
        ...data,
        ...(data.deadline && { deadline: new Date(data.deadline) }),
        userId: session.user.id,
      },
    });

    return NextResponse.json({ goal }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
