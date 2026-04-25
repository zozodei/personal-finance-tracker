"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: number;
  icon: React.ReactNode;
  accentColor?: string;
  glowColor?: string;
}

export default function StatsCard({
  title,
  value,
  subtitle,
  trend,
  icon,
  accentColor = "#10b981",
  glowColor = "rgba(16,185,129,0.15)",
}: StatsCardProps) {
  const TrendIcon = trend && trend > 0 ? TrendingUp : trend && trend < 0 ? TrendingDown : Minus;
  const trendColor = trend && trend > 0 ? "#10b981" : trend && trend < 0 ? "#f43f5e" : "#94a3b8";

  return (
    <div
      className="card"
      style={{
        padding: "24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: glowColor,
          filter: "blur(40px)",
          transform: "translate(30%, -30%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            {title}
          </p>
          <p style={{ fontSize: "1.75rem", fontWeight: 800, color: "#f1f5f9", marginTop: 6, letterSpacing: "-0.03em" }}>
            {value}
          </p>
          {subtitle && (
            <p style={{ fontSize: "0.75rem", color: "#64748b", marginTop: 4 }}>
              {subtitle}
            </p>
          )}
          {trend !== undefined && (
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 8 }}>
              <TrendIcon size={13} color={trendColor} />
              <span style={{ fontSize: "0.75rem", color: trendColor, fontWeight: 600 }}>
                {trend > 0 ? "+" : ""}{trend.toFixed(1)}% vs last month
              </span>
            </div>
          )}
        </div>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: `${accentColor}18`,
            border: `1px solid ${accentColor}30`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: accentColor,
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
