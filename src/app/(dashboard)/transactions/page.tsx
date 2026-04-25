"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Filter, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import Header from "@/components/layout/Header";
import TransactionModal from "@/components/transactions/TransactionModal";
import { formatCurrency, formatDate, getCategoryMeta, EXPENSE_CATEGORIES } from "@/lib/utils";

type Period = "week" | "month" | "year" | "all";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [period, setPeriod] = useState<Period>("month");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "income" | "expense">("all");
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchTransactions = async () => {
    setLoading(true);
    const res = await fetch(`/api/transactions?period=${period}&limit=500`);
    const data = await res.json();
    setTransactions(data.transactions ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchTransactions(); }, [period]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this transaction?")) return;
    setDeleting(id);
    await fetch(`/api/transactions/${id}`, { method: "DELETE" });
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    setDeleting(null);
  };

  const filtered = transactions.filter((t) => {
    const matchesSearch =
      !search ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || t.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const totalIncome = filtered.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpenses = filtered.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);

  return (
    <>
      <Header title="Transactions" subtitle="Track every dollar in and out" />

      <div style={{ padding: "24px 32px" }}>
        {/* Summary */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 24 }}>
          {[
            { label: "Income", value: totalIncome, color: "#10b981", icon: TrendingUp },
            { label: "Expenses", value: totalExpenses, color: "#f43f5e", icon: TrendingDown },
            { label: "Balance", value: totalIncome - totalExpenses, color: totalIncome - totalExpenses >= 0 ? "#6366f1" : "#f43f5e", icon: null },
          ].map(({ label, value, color, icon: Icon }) => (
            <div key={label} className="card" style={{ padding: "20px 24px", display: "flex", alignItems: "center", gap: 16 }}>
              {Icon && (
                <div style={{ width: 40, height: 40, borderRadius: 12, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={18} color={color} />
                </div>
              )}
              <div>
                <p style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</p>
                <p style={{ fontSize: "1.3rem", fontWeight: 800, color: label === "Balance" ? color : value >= 0 ? color : "#f43f5e", letterSpacing: "-0.02em" }}>
                  {label === "Balance" && value < 0 ? "-" : ""}{formatCurrency(Math.abs(value))}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
          {/* Search */}
          <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
            <Search size={15} color="#475569" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search transactions..."
              className="input-field"
              style={{ paddingLeft: 36, paddingRight: 12, paddingTop: 9, paddingBottom: 9, fontSize: "0.85rem" }}
            />
          </div>

          {/* Period filter */}
          <div style={{ display: "flex", background: "rgba(255,255,255,0.05)", borderRadius: 10, padding: 3, gap: 2 }}>
            {(["week", "month", "year", "all"] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                style={{
                  padding: "6px 14px",
                  borderRadius: 8,
                  border: "none",
                  background: period === p ? "rgba(255,255,255,0.1)" : "transparent",
                  color: period === p ? "#f1f5f9" : "#64748b",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  textTransform: "capitalize",
                  transition: "all 0.15s",
                }}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Type filter */}
          <div style={{ display: "flex", background: "rgba(255,255,255,0.05)", borderRadius: 10, padding: 3, gap: 2 }}>
            {(["all", "income", "expense"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                style={{
                  padding: "6px 12px",
                  borderRadius: 8,
                  border: "none",
                  background: typeFilter === t ? "rgba(255,255,255,0.1)" : "transparent",
                  color: typeFilter === t ? "#f1f5f9" : "#64748b",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  textTransform: "capitalize",
                  transition: "all 0.15s",
                }}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="btn-primary"
            style={{ padding: "9px 18px", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}
          >
            <Plus size={16} />
            Add
          </button>
        </div>

        {/* Table */}
        <div className="card" style={{ overflow: "hidden" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "60px", color: "#475569" }}>Loading...</div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 32px" }}>
              <p style={{ fontSize: "2.5rem", marginBottom: 12 }}>💸</p>
              <p style={{ color: "#64748b", marginBottom: 16, fontSize: "0.9rem" }}>
                {search ? "No transactions match your search" : "No transactions yet for this period"}
              </p>
              <button onClick={() => setShowModal(true)} className="btn-primary" style={{ padding: "10px 24px" }}>
                Add your first transaction
              </button>
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  {["Description", "Category", "Date", "Amount", ""].map((h) => (
                    <th key={h} style={{ padding: "14px 20px", textAlign: "left", fontSize: "0.72rem", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((tx, i) => {
                  const meta = getCategoryMeta(tx.category, tx.type);
                  return (
                    <tr
                      key={tx.id}
                      style={{
                        borderBottom: i < filtered.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <td style={{ padding: "14px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 32, height: 32, borderRadius: 8, background: `${meta.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.95rem", flexShrink: 0 }}>
                            {meta.emoji}
                          </div>
                          <div>
                            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#e2e8f0" }}>{tx.description}</p>
                            <div style={{ display: "flex", gap: 6, marginTop: 2 }}>
                              {tx.isHormiga && <span style={{ fontSize: "0.6rem", color: "#94a3b8", background: "rgba(148,163,184,0.1)", padding: "1px 5px", borderRadius: 4 }}>🐜 Micro</span>}
                              {tx.isRecurring && <span style={{ fontSize: "0.6rem", color: "#6366f1", background: "rgba(99,102,241,0.1)", padding: "1px 5px", borderRadius: 4 }}>🔄 {tx.frequency}</span>}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        <span style={{ fontSize: "0.78rem", color: meta.color, background: `${meta.color}12`, padding: "3px 8px", borderRadius: 6, fontWeight: 600 }}>
                          {meta.label}
                        </span>
                      </td>
                      <td style={{ padding: "14px 20px", fontSize: "0.8rem", color: "#64748b" }}>
                        {formatDate(tx.date)}
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        <span style={{ fontSize: "0.9rem", fontWeight: 800, color: tx.type === "income" ? "#10b981" : "#f1f5f9" }}>
                          {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
                        </span>
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        <button
                          onClick={() => handleDelete(tx.id)}
                          disabled={deleting === tx.id}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "#475569", padding: 4, borderRadius: 6, opacity: deleting === tx.id ? 0.5 : 1 }}
                          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#f43f5e")}
                          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#475569")}
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <p style={{ textAlign: "center", fontSize: "0.75rem", color: "#334155", marginTop: 12 }}>
          {filtered.length} transaction{filtered.length !== 1 ? "s" : ""} shown
        </p>
      </div>

      {showModal && (
        <TransactionModal
          onClose={() => setShowModal(false)}
          onSuccess={() => { setShowModal(false); fetchTransactions(); }}
        />
      )}
    </>
  );
}
