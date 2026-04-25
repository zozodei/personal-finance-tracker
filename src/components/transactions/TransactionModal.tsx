"use client";

import { useState } from "react";
import { X, DollarSign } from "lucide-react";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/lib/utils";

interface TransactionModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function TransactionModal({ onClose, onSuccess }: TransactionModalProps) {
  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("food");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState("monthly");
  const [isHormiga, setIsHormiga] = useState(false);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const categories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(amount),
          type,
          category,
          description,
          date,
          isRecurring,
          frequency: isRecurring ? frequency : undefined,
          isHormiga: type === "expense" ? isHormiga : false,
          notes,
        }),
      });

      if (!res.ok) throw new Error("Failed to save");
      onSuccess();
    } catch {
      setError("Failed to save transaction. Please try again.");
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
            <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#f1f5f9" }}>Add Transaction</h2>
            <p style={{ fontSize: "0.78rem", color: "#64748b", marginTop: 2 }}>Track your money flow</p>
          </div>
          <button
            onClick={onClose}
            style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 8, padding: "6px", cursor: "pointer", color: "#94a3b8" }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Type Toggle */}
        <div
          style={{
            display: "flex",
            background: "rgba(255,255,255,0.05)",
            borderRadius: 12,
            padding: 4,
            marginBottom: 20,
          }}
        >
          {(["expense", "income"] as const).map((t) => (
            <button
              key={t}
              onClick={() => {
                setType(t);
                setCategory(t === "income" ? "salary" : "food");
              }}
              style={{
                flex: 1,
                padding: "8px 16px",
                borderRadius: 9,
                border: "none",
                cursor: "pointer",
                fontSize: "0.85rem",
                fontWeight: 700,
                transition: "all 0.2s",
                background: type === t
                  ? t === "income"
                    ? "linear-gradient(135deg, #10b981, #059669)"
                    : "linear-gradient(135deg, #f43f5e, #dc2626)"
                  : "transparent",
                color: type === t ? "white" : "#64748b",
                boxShadow: type === t ? "0 2px 8px rgba(0,0,0,0.3)" : "none",
              }}
            >
              {t === "expense" ? "💸 Expense" : "💰 Income"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Amount */}
          <div>
            <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: 6 }}>
              Amount *
            </label>
            <div style={{ position: "relative" }}>
              <DollarSign size={16} color="#475569" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
                className="input-field"
                style={{ paddingLeft: 36, paddingRight: 12, paddingTop: 10, paddingBottom: 10, fontSize: "1.1rem", fontWeight: 700 }}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: 6 }}>
              Description *
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What was this for?"
              required
              className="input-field"
              style={{ padding: "10px 12px" }}
            />
          </div>

          {/* Category */}
          <div>
            <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: 6 }}>
              Category
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  style={{
                    padding: "5px 10px",
                    borderRadius: 8,
                    border: `1px solid ${category === cat.value ? cat.color + "60" : "rgba(255,255,255,0.08)"}`,
                    background: category === cat.value ? `${cat.color}18` : "rgba(255,255,255,0.03)",
                    color: category === cat.value ? cat.color : "#94a3b8",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div>
            <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: 6 }}>
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input-field"
              style={{ padding: "10px 12px", colorScheme: "dark" }}
            />
          </div>

          {/* Options */}
          <div style={{ display: "flex", gap: 12 }}>
            {type === "expense" && (
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={isHormiga}
                  onChange={(e) => setIsHormiga(e.target.checked)}
                  style={{ accentColor: "#10b981", width: 15, height: 15 }}
                />
                <span style={{ fontSize: "0.78rem", color: "#94a3b8" }}>🐜 Micro-expense</span>
              </label>
            )}
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                style={{ accentColor: "#10b981", width: 15, height: 15 }}
              />
              <span style={{ fontSize: "0.78rem", color: "#94a3b8" }}>🔄 Recurring</span>
            </label>
          </div>

          {isRecurring && (
            <div>
              <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: 6 }}>
                Frequency
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="input-field"
                style={{ padding: "10px 12px" }}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          )}

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
            {loading ? "Saving..." : `Save ${type === "income" ? "Income" : "Expense"}`}
          </button>
        </form>
      </div>
    </div>
  );
}
