import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const transactionSchema = z.object({
  amount: z.number().positive(),
  type: z.enum(["income", "expense"]),
  category: z.string().min(1),
  subcategory: z.string().optional(),
  description: z.string().min(1).max(200),
  date: z.string(),
  isRecurring: z.boolean().optional().default(false),
  frequency: z.enum(["daily", "weekly", "monthly", "yearly"]).optional(),
  isHormiga: z.boolean().optional().default(false),
  notes: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const category = searchParams.get("category");
  const period = searchParams.get("period") ?? "month";
  const limit = parseInt(searchParams.get("limit") ?? "100");

  const now = new Date();
  let startDate: Date | undefined;

  if (period === "week") {
    startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  } else if (period === "month") {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  } else if (period === "year") {
    startDate = new Date(now.getFullYear(), 0, 1);
  } else if (period === "all") {
    startDate = undefined;
  }

  const transactions = await prisma.transaction.findMany({
    where: {
      userId: session.user.id,
      ...(type && { type }),
      ...(category && { category }),
      ...(startDate && { date: { gte: startDate } }),
    },
    orderBy: { date: "desc" },
    take: limit,
  });

  return NextResponse.json({ transactions });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = transactionSchema.parse(body);

    const transaction = await prisma.transaction.create({
      data: {
        ...data,
        date: new Date(data.date),
        userId: session.user.id,
      },
    });

    return NextResponse.json({ transaction }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
