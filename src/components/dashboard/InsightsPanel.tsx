"use client";

import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";

interface Insight {
  type: "success" | "warning" | "danger" | "info";
  title: string;
  description: string;
  value?: string;
}

const icons = {
  success: CheckCircle,
  warning: AlertTriangle,
  danger: XCircle,
  info: Info,
};

const colors = {
  success: { bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.2)", icon: "#10b981", text: "#34d399" },
  warning: { bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)", icon: "#f59e0b", text: "#fbbf24" },
  danger: { bg: "rgba(244,63,94,0.08)", border: "rgba(244,63,94,0.2)", icon: "#f43f5e", text: "#fb7185" },
  info: { bg: "rgba(99,102,241,0.08)", border: "rgba(99,102,241,0.2)", icon: "#6366f1", text: "#818cf8" },
};

export default function InsightsPanel({ insights }: { insights: Insight[] }) {
  return (
    <div className="card" style={{ padding: 24 }}>
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#f1f5f9" }}>Smart Insights</h3>
        <p style={{ fontSize: "0.75rem", color: "#64748b", marginTop: 2 }}>AI-powered financial analysis</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {insights.map((insight, i) => {
          const Icon = icons[insight.type];
          const c = colors[insight.type];
          return (
            <div
              key={i}
              style={{
                padding: "12px 14px",
                borderRadius: 10,
                background: c.bg,
                border: `1px solid ${c.border}`,
                display: "flex",
                gap: 12,
              }}
            >
              <Icon size={16} color={c.icon} style={{ flexShrink: 0, marginTop: 1 }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "#e2e8f0" }}>
                    {insight.title}
                  </p>
                  {insight.value && (
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: c.text, marginLeft: 8, flexShrink: 0 }}>
                      {insight.value}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: 3, lineHeight: 1.5 }}>
                  {insight.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
