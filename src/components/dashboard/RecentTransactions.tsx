"use client";

import Link from "next/link";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { formatCurrency, formatShortDate, getCategoryMeta } from "@/lib/utils";

interface Transaction {
  id: string;
  amount: number;
  type: string;
  category: string;
  description: string;
  date: string;
  isHormiga: boolean;
}

export default function RecentTransactions({ transactions }: { transactions: Transaction[] }) {
  return (
    <div className="card" style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#f1f5f9" }}>Recent Transactions</h3>
          <p style={{ fontSize: "0.75rem", color: "#64748b", marginTop: 2 }}>Latest activity</p>
        </div>
        <Link
          href="/transactions"
          style={{ fontSize: "0.75rem", color: "#10b981", textDecoration: "none", fontWeight: 600 }}
        >
          View all →
        </Link>
      </div>

      {transactions.length === 0 ? (
        <div style={{ textAlign: "center", padding: "32px 0", color: "#475569" }}>
          <p style={{ fontSize: "1.5rem", marginBottom: 8 }}>💳</p>
          <p style={{ fontSize: "0.85rem" }}>No transactions yet</p>
          <Link
            href="/transactions"
            style={{ fontSize: "0.8rem", color: "#10b981", textDecoration: "none", marginTop: 8, display: "inline-block" }}
          >
            Add your first transaction →
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {transactions.map((tx) => {
            const meta = getCategoryMeta(tx.category, tx.type as "income" | "expense");
            const isIncome = tx.type === "income";
            return (
              <div
                key={tx.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 12px",
                  borderRadius: 10,
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: `${meta.color}18`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1rem",
                    flexShrink: 0,
                  }}
                >
                  {meta.emoji}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "#e2e8f0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {tx.description}
                    </p>
                    {tx.isHormiga && (
                      <span style={{ fontSize: "0.6rem", background: "rgba(148,163,184,0.15)", color: "#94a3b8", padding: "1px 5px", borderRadius: 4, flexShrink: 0 }}>
                        🐜
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: "0.72rem", color: "#475569", marginTop: 1 }}>
                    {meta.label} · {formatShortDate(tx.date)}
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                  {isIncome ? (
                    <ArrowUpRight size={13} color="#10b981" />
                  ) : (
                    <ArrowDownRight size={13} color="#f43f5e" />
                  )}
                  <span
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      color: isIncome ? "#10b981" : "#f1f5f9",
                    }}
                  >
                    {isIncome ? "+" : "-"}{formatCurrency(tx.amount)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
