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

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [user, transactions, goals, budgets] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, currency: true, monthlyIncome: true, avatarColor: true, onboarded: true },
    }),
    prisma.transaction.findMany({
      where: { userId: session.user.id },
      orderBy: { date: "desc" },
    }),
    prisma.savingsGoal.findMany({
      where: { userId: session.user.id, isCompleted: false },
      orderBy: [{ priority: "desc" }],
      take: 5,
    }),
    prisma.budget.findMany({
      where: { userId: session.user.id },
    }),
  ]);

  const monthlyStats = computeMonthlyStats(transactions);
  const healthScore = computeHealthScore(monthlyStats);
  const insights = generateInsights(transactions, budgets);
  const chartData = getLast6MonthsData(transactions);
  const categoryBreakdown = getCategoryBreakdown(transactions);
  const recentTransactions = transactions.slice(0, 8);

  return NextResponse.json({
    user,
    monthlyStats,
    healthScore,
    insights,
    chartData,
    categoryBreakdown,
    recentTransactions,
    goals,
    totalTransactions: transactions.length,
  });
}
