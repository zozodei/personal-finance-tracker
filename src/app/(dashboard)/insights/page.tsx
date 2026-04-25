"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Header from "@/components/layout/Header";
import HealthScoreWidget from "@/components/dashboard/HealthScoreWidget";
import InsightsPanel from "@/components/dashboard/InsightsPanel";
import CategoryChart from "@/components/dashboard/CategoryChart";
import { formatCurrency } from "@/lib/utils";

export default function InsightsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/insights").then((r) => r.json()).then((d) => { setData(d); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "2rem", marginBottom: 12 }}>📊</div>
          <p style={{ color: "#64748b", fontSize: "0.9rem" }}>Analyzing your financial data...</p>
        </div>
      </div>
    );
  }

  const { monthlyStats, prevStats, healthScore, insights, chartData, categoryBreakdown } = data;

  const comparisons = [
    { label: "Income", current: monthlyStats.totalIncome, prev: prevStats.totalIncome, color: "#10b981" },
    { label: "Expenses", current: monthlyStats.totalExpenses, prev: prevStats.totalExpenses, color: "#f43f5e" },
    { label: "Savings", current: Math.max(0, monthlyStats.netSavings), prev: Math.max(0, prevStats.netSavings), color: "#6366f1" },
  ];

  return (
    <>
      <Header title="Financial Insights" subtitle="Deep analysis of your money habits" />

      <div style={{ padding: "24px 32px" }}>
        {/* Health score + key metrics */}
        <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 16, marginBottom: 24 }}>
          <HealthScoreWidget healthScore={healthScore} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, alignContent: "start" }}>
            {[
              { label: "Savings Rate", value: `${monthlyStats.savingsRate.toFixed(1)}%`, good: monthlyStats.savingsRate >= 20, note: monthlyStats.savingsRate >= 20 ? "Above target" : "Target: 20%+" },
              { label: "Micro-expenses", value: formatCurrency(monthlyStats.hormigas), good: monthlyStats.hormigas < 100, note: monthlyStats.hormigas < 100 ? "Under control" : "High impulse" },
              { label: "Recurring Costs", value: formatCurrency(monthlyStats.recurringExpenses), good: true, note: "Fixed obligations" },
            ].map(({ label, value, good, note }) => (
              <div key={label} className="card" style={{ padding: "20px" }}>
                <p style={{ fontSize: "0.7rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>{label}</p>
                <p style={{ fontSize: "1.6rem", fontWeight: 900, color: good ? "#10b981" : "#f59e0b", letterSpacing: "-0.03em", marginBottom: 4 }}>{value}</p>
                <p style={{ fontSize: "0.72rem", color: "#475569" }}>{note}</p>
              </div>
            ))}

            {/* Month vs month */}
            {comparisons.map(({ label, current, prev, color }) => {
              const change = prev > 0 ? ((current - prev) / prev) * 100 : 0;
              return (
                <div key={label} className="card" style={{ padding: "20px" }}>
                  <p style={{ fontSize: "0.7rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>{label} vs Last Month</p>
                  <p style={{ fontSize: "1.3rem", fontWeight: 900, color, letterSpacing: "-0.03em", marginBottom: 4 }}>{formatCurrency(current)}</p>
                  <p style={{ fontSize: "0.72rem", color: change > 0 ? (label === "Income" || label === "Savings" ? "#10b981" : "#f43f5e") : "#94a3b8" }}>
                    {change > 0 ? "▲" : change < 0 ? "▼" : "—"} {Math.abs(change).toFixed(1)}% vs prior month
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Charts row */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 24 }}>
          {/* Bar chart */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#f1f5f9" }}>6-Month Comparison</h3>
              <p style={{ fontSize: "0.75rem", color: "#64748b", marginTop: 2 }}>Income vs Expenses by month</p>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: -10 }} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}`} />
                <Tooltip
                  contentStyle={{ background: "#131d2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#f1f5f9" }}
                  formatter={(v) => [`$${Number(v ?? 0).toFixed(0)}`, ""]}
                />
                <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" name="Expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <CategoryChart data={categoryBreakdown} />
        </div>

        <InsightsPanel insights={insights} />
      </div>
    </>
  );
}
