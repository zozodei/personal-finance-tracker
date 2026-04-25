"use client";

import { useEffect, useState } from "react";
import { ArrowUpCircle, ArrowDownCircle, PiggyBank, TrendingUp, Plus } from "lucide-react";
import Header from "@/components/layout/Header";
import StatsCard from "@/components/dashboard/StatsCard";
import CashFlowChart from "@/components/dashboard/CashFlowChart";
import CategoryChart from "@/components/dashboard/CategoryChart";
import HealthScoreWidget from "@/components/dashboard/HealthScoreWidget";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import InsightsPanel from "@/components/dashboard/InsightsPanel";
import TransactionModal from "@/components/transactions/TransactionModal";
import { formatCurrency } from "@/lib/utils";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchData = async () => {
    const res = await fetch("/api/dashboard");
    const json = await res.json();
    setData(json);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "2rem", marginBottom: 12 }}>⚡</div>
          <p style={{ color: "#64748b", fontSize: "0.9rem" }}>Loading your financial dashboard...</p>
        </div>
      </div>
    );
  }

  const { monthlyStats, healthScore, insights, chartData, categoryBreakdown, recentTransactions, goals } = data;
  const currentMonth = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <>
      <Header
        title={`Good ${getGreeting()}, ${data.user?.name?.split(" ")[0] ?? "there"} 👋`}
        subtitle={`Your financial overview for ${currentMonth}`}
      />

      <div style={{ padding: "24px 32px" }}>
        {/* Stats Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 24 }}>
          <StatsCard
            title="Monthly Income"
            value={formatCurrency(monthlyStats.totalIncome)}
            subtitle="This month"
            icon={<ArrowUpCircle size={22} />}
            accentColor="#10b981"
            glowColor="rgba(16,185,129,0.15)"
          />
          <StatsCard
            title="Monthly Expenses"
            value={formatCurrency(monthlyStats.totalExpenses)}
            subtitle="This month"
            icon={<ArrowDownCircle size={22} />}
            accentColor="#f43f5e"
            glowColor="rgba(244,63,94,0.12)"
          />
          <StatsCard
            title="Net Savings"
            value={formatCurrency(Math.abs(monthlyStats.netSavings))}
            subtitle={monthlyStats.netSavings >= 0 ? `${monthlyStats.savingsRate.toFixed(1)}% savings rate` : "Spending over income"}
            icon={<PiggyBank size={22} />}
            accentColor={monthlyStats.netSavings >= 0 ? "#6366f1" : "#f43f5e"}
            glowColor={monthlyStats.netSavings >= 0 ? "rgba(99,102,241,0.15)" : "rgba(244,63,94,0.12)"}
          />
          <StatsCard
            title="Active Goals"
            value={`${goals.length}`}
            subtitle="Savings goals tracking"
            icon={<TrendingUp size={22} />}
            accentColor="#f59e0b"
            glowColor="rgba(245,158,11,0.12)"
          />
        </div>

        {/* Main grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 24 }}>
          <div style={{ gridColumn: "1 / 3" }}>
            <CashFlowChart data={chartData} />
          </div>
          <HealthScoreWidget healthScore={healthScore} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
          <RecentTransactions transactions={recentTransactions} />
          <CategoryChart data={categoryBreakdown} />
        </div>

        <InsightsPanel insights={insights} />

        {/* Active Goals preview */}
        {goals.length > 0 && (
          <div className="card" style={{ padding: 24, marginTop: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#f1f5f9" }}>Active Goals</h3>
              <a href="/goals" style={{ fontSize: "0.75rem", color: "#10b981", textDecoration: "none", fontWeight: 600 }}>
                Manage all →
              </a>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
              {goals.slice(0, 4).map((goal: any) => {
                const progress = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
                return (
                  <div key={goal.id} style={{ padding: "14px 16px", borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                      <span style={{ fontSize: "1.2rem" }}>{goal.emoji}</span>
                      <div>
                        <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "#e2e8f0" }}>{goal.name}</p>
                        <p style={{ fontSize: "0.7rem", color: "#64748b" }}>{formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}</p>
                      </div>
                    </div>
                    <div className="progress-bar-track" style={{ height: 6 }}>
                      <div className="progress-bar-fill" style={{ width: `${progress}%`, height: "100%", background: `linear-gradient(90deg, ${goal.color}bb, ${goal.color})` }} />
                    </div>
                    <p style={{ fontSize: "0.7rem", color: goal.color, marginTop: 4, fontWeight: 600 }}>{progress}%</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowModal(true)}
        style={{
          position: "fixed",
          bottom: 32,
          right: 32,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #10b981, #059669)",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 8px 24px rgba(16,185,129,0.45)",
          zIndex: 50,
          transition: "transform 0.2s ease",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.08)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
        title="Add transaction"
      >
        <Plus size={24} color="white" />
      </button>

      {showModal && (
        <TransactionModal
          onClose={() => setShowModal(false)}
          onSuccess={() => { setShowModal(false); fetchData(); }}
        />
      )}
    </>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}
