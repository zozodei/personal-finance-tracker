import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { computeMonthlyStats, computeHealthScore } from "@/lib/insights";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === "your-anthropic-api-key-here") {
    return NextResponse.json({
      message: "The AI assistant requires an Anthropic API key. Please add your ANTHROPIC_API_KEY to the .env file. Get yours at console.anthropic.com",
    });
  }

  try {
    const { messages } = await req.json();

    const [user, transactions, goals] = await Promise.all([
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: { name: true, currency: true, monthlyIncome: true },
      }),
      prisma.transaction.findMany({
        where: { userId: session.user.id },
        orderBy: { date: "desc" },
        take: 200,
      }),
      prisma.savingsGoal.findMany({
        where: { userId: session.user.id },
      }),
    ]);

    const stats = computeMonthlyStats(transactions);
    const health = computeHealthScore(stats);

    const systemContext = `You are FinZen AI, a warm, insightful personal finance coach. You help users understand their financial habits and make better decisions — not by judging them, but by empowering them with clarity and actionable steps.

USER FINANCIAL CONTEXT:
- Name: ${user?.name ?? "User"}
- Monthly Income: ${user?.monthlyIncome ? `$${user.monthlyIncome}` : "Not set"}
- Currency: ${user?.currency ?? "USD"}
- This Month Income: $${stats.totalIncome.toFixed(2)}
- This Month Expenses: $${stats.totalExpenses.toFixed(2)}
- Net Savings: $${stats.netSavings.toFixed(2)}
- Savings Rate: ${stats.savingsRate.toFixed(1)}%
- Financial Health Score: ${health.score}/100 (${health.grade} - ${health.label})
- Micro-expenses (Gastos Hormiga): $${stats.hormigas.toFixed(2)}
- Top Spending Category: ${stats.topCategory ? `${stats.topCategory.emoji} ${stats.topCategory.name} ($${stats.topCategory.amount.toFixed(2)})` : "N/A"}
- Active Savings Goals: ${goals.filter((g: { isCompleted: boolean }) => !g.isCompleted).length}
${goals.filter((g: { isCompleted: boolean }) => !g.isCompleted).map((g: { emoji: string; name: string; currentAmount: number; targetAmount: number; priority: string }) => `  • ${g.emoji} ${g.name}: $${g.currentAmount}/$${g.targetAmount} (${g.priority} priority)`).join("\n")}
- Recent transactions: ${transactions.slice(0, 10).map((t: { type: string; amount: number; category: string; description: string }) => `${t.type === "income" ? "+" : "-"}$${t.amount} ${t.category} - ${t.description}`).join(", ")}

GUIDELINES:
- Be warm, encouraging, and non-judgmental
- Give specific, actionable advice based on the user's actual data
- Use numbers from their financial context when relevant
- For goal questions, calculate realistic timelines based on their savings rate
- Keep responses concise (2-4 paragraphs max) unless a detailed breakdown is requested
- Use emojis sparingly but effectively
- If they ask about affording something, do the math for them`;

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: systemContext,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content,
      })),
    });

    const content = response.content[0];
    if (content.type !== "text") {
      return NextResponse.json({ message: "Unexpected response from AI" });
    }

    return NextResponse.json({ message: content.text });
  } catch (err) {
    console.error("Assistant error:", err);
    return NextResponse.json(
      { error: "Failed to get AI response" },
      { status: 500 }
    );
  }
}
