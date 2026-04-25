"use client";

import { useState } from "react";
import { X } from "lucide-react";

const GOAL_EMOJIS = ["🎯", "🏖️", "🏠", "💻", "🚗", "📚", "💎", "🏋️", "✈️", "🎓", "💍", "🌱"];
const GOAL_COLORS = ["#10b981", "#6366f1", "#f59e0b", "#ec4899", "#06b6d4", "#f97316", "#8b5cf6", "#ef4444"];

interface GoalModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function GoalModal({ onClose, onSuccess }: GoalModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("medium");
  const [emoji, setEmoji] = useState("🎯");
  const [color, setColor] = useState("#10b981");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetAmount || parseFloat(targetAmount) <= 0) {
      setError("Please enter a valid target amount");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          targetAmount: parseFloat(targetAmount),
          currentAmount: parseFloat(currentAmount || "0"),
          deadline: deadline || undefined,
          priority,
          emoji,
          color,
        }),
      });

      if (!res.ok) throw new Error("Failed to save");
      onSuccess();
    } catch {
      setError("Failed to create goal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        padding: 16,
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: "#131d2e",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 20,
          padding: 28,
          width: "100%",
          maxWidth: 480,
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
        }}
        className="animate-slide-up"
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#f1f5f9" }}>New Savings Goal</h2>
            <p style={{ fontSize: "0.78rem", color: "#64748b", marginTop: 2 }}>Set a target and track your progress</p>
          </div>
          <button
            onClick={onClose}
            style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 8, padding: "6px", cursor: "pointer", color: "#94a3b8" }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Emoji & Color pickers */}
          <div>
            <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: 8 }}>
              Icon & Color
            </label>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {GOAL_EMOJIS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    border: `2px solid ${emoji === e ? color : "transparent"}`,
                    background: "rgba(255,255,255,0.05)",
                    fontSize: "1.1rem",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {e}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              {GOAL_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background: c,
                    border: `3px solid ${color === c ? "white" : "transparent"}`,
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                />
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: 6 }}>
              Goal Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Emergency Fund, New Laptop..."
              required
              className="input-field"
              style={{ padding: "10px 12px" }}
            />
          </div>

          <div>
            <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: 6 }}>
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Why is this goal important to you?"
              className="input-field"
              style={{ padding: "10px 12px" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: 6 }}>
                Target Amount *
              </label>
              <input
                type="number"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                placeholder="$0.00"
                step="0.01"
                min="0"
                required
                className="input-field"
                style={{ padding: "10px 12px" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: 6 }}>
                Already Saved
              </label>
              <input
                type="number"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(e.target.value)}
                placeholder="$0.00"
                step="0.01"
                min="0"
                className="input-field"
                style={{ padding: "10px 12px" }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: 6 }}>
              Target Date (optional)
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="input-field"
              style={{ padding: "10px 12px", colorScheme: "dark" }}
            />
          </div>

          <div>
            <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: 8 }}>
              Priority
            </label>
            <div style={{ display: "flex", gap: 8 }}>
              {["low", "medium", "high", "critical"].map((p) => {
                const pColors: Record<string, string> = { low: "#64748b", medium: "#f59e0b", high: "#f97316", critical: "#f43f5e" };
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    style={{
                      flex: 1,
                      padding: "6px",
                      borderRadius: 8,
                      border: `1px solid ${priority === p ? pColors[p] + "80" : "rgba(255,255,255,0.08)"}`,
                      background: priority === p ? `${pColors[p]}18` : "transparent",
                      color: priority === p ? pColors[p] : "#64748b",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      textTransform: "capitalize",
                      transition: "all 0.15s",
                    }}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <p style={{ fontSize: "0.78rem", color: "#f43f5e", padding: "8px 12px", background: "rgba(244,63,94,0.1)", borderRadius: 8 }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ padding: "12px", fontSize: "0.9rem", opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Creating..." : "Create Goal 🎯"}
          </button>
        </form>
      </div>
    </div>
  );
}
