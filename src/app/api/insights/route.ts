import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  computeMonthlyStats,
  computeHealthScore,
  generateInsights,
  getLast6MonthsData,
  getCategoryBreakdown,
} from "@/lib/insights";
import { getPreviousMonthRange } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [transactions, budgets] = await Promise.all([
    prisma.transaction.findMany({
      where: { userId: session.user.id },
      orderBy: { date: "desc" },
    }),
    prisma.budget.findMany({ where: { userId: session.user.id } }),
  ]);

  const monthlyStats = computeMonthlyStats(transactions);
  const healthScore = computeHealthScore(monthlyStats);
  const insights = generateInsights(transactions, budgets);
  const chartData = getLast6MonthsData(transactions);
  const categoryBreakdown = getCategoryBreakdown(transactions);

  const { start: prevStart, end: prevEnd } = getPreviousMonthRange();
  const prevStats = computeMonthlyStats(transactions, prevStart, prevEnd);

  return NextResponse.json({
    monthlyStats,
    prevStats,
    healthScore,
    insights,
    chartData,
    categoryBreakdown,
  });
}
