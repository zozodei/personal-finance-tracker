"use client";

import { useEffect, useState } from "react";
import { Plus, Target, Trophy } from "lucide-react";
import Header from "@/components/layout/Header";
import GoalCard from "@/components/goals/GoalCard";
import GoalModal from "@/components/goals/GoalModal";
import { formatCurrency } from "@/lib/utils";

interface AddFundsState {
  goalId: string;
  goalName: string;
  amount: string;
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [addFunds, setAddFunds] = useState<AddFundsState | null>(null);
  const [addingFunds, setAddingFunds] = useState(false);

  const fetchGoals = async () => {
    setLoading(true);
    const res = await fetch("/api/goals");
    const data = await res.json();
    setGoals(data.goals ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchGoals(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this savings goal?")) return;
    await fetch(`/api/goals/${id}`, { method: "DELETE" });
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const handleAddFunds = async () => {
    if (!addFunds || !addFunds.amount) return;
    setAddingFunds(true);
    const goal = goals.find((g) => g.id === addFunds.goalId);
    if (!goal) return;

    const newAmount = goal.currentAmount + parseFloat(addFunds.amount);
    await fetch(`/api/goals/${addFunds.goalId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentAmount: newAmount }),
    });

    setAddFunds(null);
    setAddingFunds(false);
    fetchGoals();
  };

  const active = goals.filter((g) => !g.isCompleted);
  const completed = goals.filter((g) => g.isCompleted);
  const totalSaved = goals.reduce((s, g) => s + g.currentAmount, 0);
  const totalTarget = goals.reduce((s, g) => s + g.targetAmount, 0);

  return (
    <>
      <Header title="Savings Goals" subtitle="Build your financial future, one goal at a time" />

      <div style={{ padding: "24px 32px" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
          <div className="card" style={{ padding: "20px 24px" }}>
            <p style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Active Goals</p>
            <p style={{ fontSize: "2rem", fontWeight: 900, color: "#10b981", marginTop: 6, letterSpacing: "-0.04em" }}>{active.length}</p>
          </div>
          <div className="card" style={{ padding: "20px 24px" }}>
            <p style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Total Saved</p>
            <p style={{ fontSize: "2rem", fontWeight: 900, color: "#6366f1", marginTop: 6, letterSpacing: "-0.04em" }}>{formatCurrency(totalSaved)}</p>
          </div>
          <div className="card" style={{ padding: "20px 24px" }}>
            <p style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Overall Progress</p>
            <p style={{ fontSize: "2rem", fontWeight: 900, color: "#f59e0b", marginTop: 6, letterSpacing: "-0.04em" }}>
              {totalTarget > 0 ? `${Math.round((totalSaved / totalTarget) * 100)}%` : "—"}
            </p>
          </div>
        </div>

        {/* Header + button */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Target size={18} color="#10b981" />
            <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#f1f5f9" }}>Active Goals ({active.length})</h2>
          </div>
          <button onClick={() => setShowModal(true)} className="btn-primary" style={{ padding: "9px 18px", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 6 }}>
            <Plus size={16} />
            New Goal
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px", color: "#475569" }}>Loading goals...</div>
        ) : active.length === 0 ? (
          <div className="card" style={{ padding: "60px 32px", textAlign: "center" }}>
            <p style={{ fontSize: "3rem", marginBottom: 16 }}>🎯</p>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#f1f5f9", marginBottom: 8 }}>No goals yet</h3>
            <p style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: 20 }}>
              Set your first savings goal and start building the life you want
            </p>
            <button onClick={() => setShowModal(true)} className="btn-primary" style={{ padding: "11px 28px" }}>
              Create your first goal
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16, marginBottom: 32 }}>
            {active.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onAddFunds={(g) => setAddFunds({ goalId: g.id, goalName: g.name, amount: "" })}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* Completed */}
        {completed.length > 0 && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <Trophy size={18} color="#f59e0b" />
              <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#f1f5f9" }}>Completed Goals 🎉</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16, opacity: 0.7 }}>
              {completed.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onAddFunds={() => {}}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {showModal && (
        <GoalModal
          onClose={() => setShowModal(false)}
          onSuccess={() => { setShowModal(false); fetchGoals(); }}
        />
      )}

      {/* Add Funds modal */}
      {addFunds && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 16 }}
          onClick={(e) => e.target === e.currentTarget && setAddFunds(null)}
        >
          <div style={{ background: "#131d2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: 28, width: "100%", maxWidth: 380 }} className="animate-slide-up">
            <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#f1f5f9", marginBottom: 6 }}>Add Funds</h2>
            <p style={{ fontSize: "0.8rem", color: "#64748b", marginBottom: 20 }}>Add savings to "{addFunds.goalName}"</p>
            <input
              type="number"
              value={addFunds.amount}
              onChange={(e) => setAddFunds({ ...addFunds, amount: e.target.value })}
              placeholder="Amount to add ($)"
              className="input-field"
              style={{ padding: "12px", fontSize: "1.1rem", fontWeight: 700, marginBottom: 16 }}
              autoFocus
            />
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setAddFunds(null)} className="btn-secondary" style={{ flex: 1, padding: "11px" }}>Cancel</button>
              <button onClick={handleAddFunds} disabled={!addFunds.amount || addingFunds} className="btn-primary" style={{ flex: 1, padding: "11px", opacity: addingFunds ? 0.7 : 1 }}>
                {addingFunds ? "Adding..." : "Add Funds"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
