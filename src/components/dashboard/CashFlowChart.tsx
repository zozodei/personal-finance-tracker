"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface ChartData {
  month: string;
  income: number;
  expenses: number;
  savings: number;
}

interface CashFlowChartProps {
  data: ChartData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "#131d2e",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 12,
          padding: "12px 16px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        }}
      >
        <p style={{ color: "#94a3b8", fontSize: "0.75rem", marginBottom: 8, fontWeight: 600 }}>{label}</p>
        {payload.map((entry: any) => (
          <div key={entry.name} style={{ display: "flex", justifyContent: "space-between", gap: 24, marginBottom: 4 }}>
            <span style={{ color: entry.color, fontSize: "0.8rem", fontWeight: 500 }}>{entry.name}</span>
            <span style={{ color: "#f1f5f9", fontSize: "0.8rem", fontWeight: 700 }}>
              ${entry.value.toFixed(0)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function CashFlowChart({ data }: CashFlowChartProps) {
  return (
    <div className="card" style={{ padding: 24 }}>
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#f1f5f9" }}>Cash Flow</h3>
        <p style={{ fontSize: "0.75rem", color: "#64748b", marginTop: 2 }}>6-month income vs expenses</p>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -10 }}>
          <defs>
            <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}`} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="income" name="Income" stroke="#10b981" strokeWidth={2} fill="url(#incomeGrad)" dot={false} />
          <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#f43f5e" strokeWidth={2} fill="url(#expenseGrad)" dot={false} />
          <Area type="monotone" dataKey="savings" name="Savings" stroke="#6366f1" strokeWidth={2} fill="url(#savingsGrad)" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
