"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface CategoryData {
  category: string;
  label: string;
  emoji: string;
  color: string;
  amount: number;
  percentage: number;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div
        style={{
          background: "#131d2e",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 10,
          padding: "10px 14px",
        }}
      >
        <p style={{ color: "#f1f5f9", fontWeight: 700, fontSize: "0.85rem" }}>
          {d.emoji} {d.label}
        </p>
        <p style={{ color: "#94a3b8", fontSize: "0.8rem" }}>
          ${d.amount.toFixed(2)} · {d.percentage.toFixed(1)}%
        </p>
      </div>
    );
  }
  return null;
};

export default function CategoryChart({ data }: { data: CategoryData[] }) {
  if (data.length === 0) {
    return (
      <div className="card" style={{ padding: 24 }}>
        <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#f1f5f9", marginBottom: 16 }}>
          Spending by Category
        </h3>
        <div style={{ textAlign: "center", padding: "40px 0", color: "#475569" }}>
          <p style={{ fontSize: "2rem", marginBottom: 8 }}>📊</p>
          <p style={{ fontSize: "0.85rem" }}>No expenses this month yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: 24 }}>
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#f1f5f9" }}>Spending by Category</h3>
        <p style={{ fontSize: "0.75rem", color: "#64748b", marginTop: 2 }}>This month's breakdown</p>
      </div>

      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <ResponsiveContainer width={160} height={160}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={72}
              paddingAngle={3}
              dataKey="amount"
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
          {data.slice(0, 5).map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: item.color,
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: "0.78rem", color: "#94a3b8", flex: 1 }}>
                {item.emoji} {item.label}
              </span>
              <span style={{ fontSize: "0.78rem", color: "#f1f5f9", fontWeight: 600 }}>
                {item.percentage.toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
