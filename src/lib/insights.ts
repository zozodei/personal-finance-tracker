import { Transaction } from "@/generated/prisma/client";
import { getCategoryMeta, getStartOfMonth, getEndOfMonth, getPreviousMonthRange } from "./utils";

export interface FinancialInsight {
  type: "success" | "warning" | "danger" | "info";
  title: string;
  description: string;
  value?: string;
  category?: string;
}

export interface MonthlyStats {
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  savingsRate: number;
  topCategory: { name: string; amount: number; emoji: string } | null;
  hormigas: number;
  recurringExpenses: number;
  transactionCount: number;
}

export interface HealthScore {
  score: number;
  grade: "A" | "B" | "C" | "D" | "F";
  label: string;
  color: string;
}

export function computeMonthlyStats(
  transactions: Transaction[],
  start = getStartOfMonth(),
  end = getEndOfMonth()
): MonthlyStats {
  const monthly = transactions.filter((t) => {
    const d = new Date(t.date);
    return d >= start && d <= end;
  });

  const totalIncome = monthly
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = monthly
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const netSavings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;

  const hormigas = monthly
    .filter((t) => t.type === "expense" && t.isHormiga)
    .reduce((sum, t) => sum + t.amount, 0);

  const recurringExpenses = monthly
    .filter((t) => t.type === "expense" && t.isRecurring)
    .reduce((sum, t) => sum + t.amount, 0);

  const categoryMap: Record<string, number> = {};
  monthly
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      categoryMap[t.category] = (categoryMap[t.category] ?? 0) + t.amount;
    });

  const topCategoryEntry = Object.entries(categoryMap).sort(
    ([, a], [, b]) => b - a
  )[0];

  const topCategory = topCategoryEntry
    ? {
        name: getCategoryMeta(topCategoryEntry[0]).label,
        emoji: getCategoryMeta(topCategoryEntry[0]).emoji,
        amount: topCategoryEntry[1],
      }
    : null;

  return {
    totalIncome,
    totalExpenses,
    netSavings,
    savingsRate,
    topCategory,
    hormigas,
    recurringExpenses,
    transactionCount: monthly.length,
  };
}

export function computeHealthScore(stats: MonthlyStats): HealthScore {
  let score = 100;

  if (stats.savingsRate < 0) score -= 40;
  else if (stats.savingsRate < 10) score -= 25;
  else if (stats.savingsRate < 20) score -= 10;
  else if (stats.savingsRate >= 30) score += 5;

  if (stats.totalIncome > 0) {
    const hormigatRate = (stats.hormigas / stats.totalIncome) * 100;
    if (hormigatRate > 15) score -= 15;
    else if (hormigatRate > 8) score -= 8;
  }

  if (stats.totalExpenses > stats.totalIncome * 1.2) score -= 15;

  score = Math.max(0, Math.min(100, score));

  let grade: HealthScore["grade"];
  let label: string;
  let color: string;

  if (score >= 85) { grade = "A"; label = "Excellent"; color = "#10b981"; }
  else if (score >= 70) { grade = "B"; label = "Good"; color = "#06b6d4"; }
  else if (score >= 55) { grade = "C"; label = "Fair"; color = "#f59e0b"; }
  else if (score >= 40) { grade = "D"; label = "Poor"; color = "#f97316"; }
  else { grade = "F"; label = "Critical"; color = "#ef4444"; }

  return { score, grade, label, color };
}

export function generateInsights(
  transactions: Transaction[],
  monthlyBudgets: { category: string; amount: number }[]
): FinancialInsight[] {
  const now = new Date();
  const stats = computeMonthlyStats(transactions);
  const { start: prevStart, end: prevEnd } = getPreviousMonthRange();
  const prevStats = computeMonthlyStats(transactions, prevStart, prevEnd);

  const insights: FinancialInsight[] = [];

  if (stats.savingsRate >= 20) {
    insights.push({
      type: "success",
      title: "Great savings rate!",
      description: `You're saving ${stats.savingsRate.toFixed(1)}% of your income this month. That's above the recommended 20%.`,
      value: `${stats.savingsRate.toFixed(0)}%`,
    });
  } else if (stats.savingsRate < 0) {
    insights.push({
      type: "danger",
      title: "Spending exceeds income",
      description: `You're spending more than you earn this month. Review your expenses immediately.`,
      value: `${stats.savingsRate.toFixed(0)}%`,
    });
  } else if (stats.savingsRate < 10) {
    insights.push({
      type: "warning",
      title: "Low savings rate",
      description: `You're only saving ${stats.savingsRate.toFixed(1)}% of your income. Aim for at least 20%.`,
      value: `${stats.savingsRate.toFixed(0)}%`,
    });
  }

  if (stats.hormigas > 50) {
    insights.push({
      type: "warning",
      title: "Micro-expense alert (Gastos Hormiga)",
      description: `Small impulse purchases are adding up to significant amounts this month.`,
      value: `$${stats.hormigas.toFixed(2)}`,
      category: "hormiga",
    });
  }

  if (prevStats.totalExpenses > 0) {
    const change =
      ((stats.totalExpenses - prevStats.totalExpenses) /
        prevStats.totalExpenses) *
      100;
    if (change > 20) {
      insights.push({
        type: "warning",
        title: "Expenses up vs last month",
        description: `Your expenses increased by ${change.toFixed(0)}% compared to last month.`,
        value: `+${change.toFixed(0)}%`,
      });
    } else if (change < -10) {
      insights.push({
        type: "success",
        title: "Expenses down vs last month",
        description: `Great job! You reduced expenses by ${Math.abs(change).toFixed(0)}% vs last month.`,
        value: `${change.toFixed(0)}%`,
      });
    }
  }

  const categoryMap: Record<string, number> = {};
  transactions
    .filter((t) => {
      const d = new Date(t.date);
      return t.type === "expense" && d >= getStartOfMonth() && d <= getEndOfMonth();
    })
    .forEach((t) => {
      categoryMap[t.category] = (categoryMap[t.category] ?? 0) + t.amount;
    });

  monthlyBudgets.forEach((budget) => {
    const spent = categoryMap[budget.category] ?? 0;
    const pct = (spent / budget.amount) * 100;
    if (pct >= 90) {
      const meta = getCategoryMeta(budget.category);
      insights.push({
        type: pct >= 100 ? "danger" : "warning",
        title: `${meta.label} budget ${pct >= 100 ? "exceeded" : "almost full"}`,
        description: `You've used ${pct.toFixed(0)}% of your ${meta.label} budget this month.`,
        value: `${pct.toFixed(0)}%`,
        category: budget.category,
      });
    }
  });

  if (stats.topCategory && stats.totalExpenses > 0) {
    const topPct = (stats.topCategory.amount / stats.totalExpenses) * 100;
    if (topPct > 40) {
      insights.push({
        type: "info",
        title: `${stats.topCategory.emoji} ${stats.topCategory.name} dominates spending`,
        description: `${stats.topCategory.name} represents ${topPct.toFixed(0)}% of your total expenses. Consider if this is intentional.`,
        value: `${topPct.toFixed(0)}%`,
        category: stats.topCategory.name.toLowerCase(),
      });
    }
  }

  if (insights.length === 0) {
    insights.push({
      type: "info",
      title: "Keep building your financial picture",
      description: "Add more transactions to get personalized insights and recommendations.",
    });
  }

  return insights.slice(0, 6);
}

export function getLast6MonthsData(transactions: Transaction[]): {
  month: string;
  income: number;
  expenses: number;
  savings: number;
}[] {
  const result = [];
  const now = new Date();

  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);

    const stats = computeMonthlyStats(transactions, start, end);
    result.push({
      month: date.toLocaleDateString("en-US", { month: "short" }),
      income: stats.totalIncome,
      expenses: stats.totalExpenses,
      savings: Math.max(0, stats.netSavings),
    });
  }

  return result;
}

export function getCategoryBreakdown(transactions: Transaction[]): {
  category: string;
  label: string;
  emoji: string;
  color: string;
  amount: number;
  percentage: number;
}[] {
  const start = getStartOfMonth();
  const end = getEndOfMonth();

  const expenses = transactions.filter((t) => {
    const d = new Date(t.date);
    return t.type === "expense" && d >= start && d <= end;
  });

  const total = expenses.reduce((sum, t) => sum + t.amount, 0);
  const categoryMap: Record<string, number> = {};

  expenses.forEach((t) => {
    categoryMap[t.category] = (categoryMap[t.category] ?? 0) + t.amount;
  });

  return Object.entries(categoryMap)
    .map(([category, amount]) => {
      const meta = getCategoryMeta(category);
      return {
        category,
        label: meta.label,
        emoji: meta.emoji,
        color: meta.color,
        amount,
        percentage: total > 0 ? (amount / total) * 100 : 0,
      };
    })
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 8);
}
