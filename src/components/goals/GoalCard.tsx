"use client";

import { Target, Calendar, TrendingUp, Trash2 } from "lucide-react";
import {
  formatCurrency,
  formatDate,
  getProgressPercentage,
  calculateSavingsNeeded,
  getDaysUntilDeadline,
} from "@/lib/utils";

interface Goal {
  id: string;
  name: string;
  description?: string | null;
  targetAmount: number;
  currentAmount: number;
  deadline?: string | null;
  priority: string;
  category: string;
  emoji: string;
  color: string;
  isCompleted: boolean;
}

interface GoalCardProps {
  goal: Goal;
  onAddFunds: (goal: Goal) => void;
  onDelete: (id: string) => void;
}

const priorityColors: Record<string, string> = {
  low: "#64748b",
  medium: "#f59e0b",
  high: "#f97316",
  critical: "#f43f5e",
};

export default function GoalCard({ goal, onAddFunds, onDelete }: GoalCardProps) {
  const progress = getProgressPercentage(goal.currentAmount, goal.targetAmount);
  const savingsNeeded = goal.deadline
    ? calculateSavingsNeeded(goal.targetAmount, goal.currentAmount, goal.deadline)
    : null;
  const daysLeft = goal.deadline ? getDaysUntilDeadline(goal.deadline) : null;

  return (
    <div
      className="card"
      style={{
        padding: 24,
        borderLeft: `3px solid ${goal.color}`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {goal.isCompleted && (
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            background: "rgba(16,185,129,0.15)",
            border: "1px solid rgba(16,185,129,0.3)",
            borderRadius: 999,
            padding: "2px 10px",
            fontSize: "0.7rem",
            fontWeight: 700,
            color: "#10b981",
          }}
        >
          ✓ Completed
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: `${goal.color}18`,
              border: `1px solid ${goal.color}30`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.3rem",
              flexShrink: 0,
            }}
          >
            {goal.emoji}
          </div>
          <div>
            <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#f1f5f9" }}>{goal.name}</h3>
            {goal.description && (
              <p style={{ fontSize: "0.75rem", color: "#64748b", marginTop: 2 }}>{goal.description}</p>
            )}
            <span
              style={{
                display: "inline-block",
                marginTop: 4,
                padding: "1px 8px",
                borderRadius: 999,
                fontSize: "0.65rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                background: `${priorityColors[goal.priority]}20`,
                color: priorityColors[goal.priority],
                border: `1px solid ${priorityColors[goal.priority]}35`,
              }}
            >
              {goal.priority} priority
            </span>
          </div>
        </div>

        {!goal.isCompleted && (
          <button
            onClick={() => onDelete(goal.id)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#475569",
              padding: 4,
              borderRadius: 6,
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#f43f5e")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#475569")}
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>

      {/* Progress */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: "0.78rem", color: "#94a3b8" }}>
            {formatCurrency(goal.currentAmount)} saved
          </span>
          <span style={{ fontSize: "0.78rem", fontWeight: 700, color: goal.color }}>
            {progress}%
          </span>
        </div>
        <div className="progress-bar-track" style={{ height: 8 }}>
          <div
            className="progress-bar-fill"
            style={{
              width: `${progress}%`,
              height: "100%",
              background: `linear-gradient(90deg, ${goal.color}bb, ${goal.color})`,
            }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
          <span style={{ fontSize: "0.7rem", color: "#475569" }}>Goal: {formatCurrency(goal.targetAmount)}</span>
          <span style={{ fontSize: "0.7rem", color: "#475569" }}>
            {formatCurrency(goal.targetAmount - goal.currentAmount)} remaining
          </span>
        </div>
      </div>

      {/* Meta info */}
      <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
        {goal.deadline && (
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <Calendar size={13} color="#64748b" />
            <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
              {daysLeft !== null && daysLeft > 0
                ? `${daysLeft} days left`
                : daysLeft === 0
                ? "Due today!"
                : "Overdue"}
            </span>
          </div>
        )}
        {savingsNeeded && savingsNeeded.monthly > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <TrendingUp size={13} color="#10b981" />
            <span style={{ fontSize: "0.75rem", color: "#10b981" }}>
              {formatCurrency(savingsNeeded.monthly)}/mo needed
            </span>
          </div>
        )}
      </div>

      {!goal.isCompleted && (
        <button
          onClick={() => onAddFunds(goal)}
          style={{
            width: "100%",
            padding: "9px",
            borderRadius: 10,
            border: `1px solid ${goal.color}40`,
            background: `${goal.color}12`,
            color: goal.color,
            fontSize: "0.82rem",
            fontWeight: 700,
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = `${goal.color}22`;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = `${goal.color}12`;
          }}
        >
          + Add Funds
        </button>
      )}
    </div>
  );
}
