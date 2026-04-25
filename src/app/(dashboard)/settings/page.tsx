"use client";

import { useEffect, useState } from "react";
import { Save, User, DollarSign } from "lucide-react";
import Header from "@/components/layout/Header";
import { formatCurrency } from "@/lib/utils";

const AVATAR_COLORS = ["#10b981", "#6366f1", "#f59e0b", "#ec4899", "#06b6d4", "#f97316", "#8b5cf6"];

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [avatarColor, setAvatarColor] = useState("#10b981");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/user").then((r) => r.json()).then((d) => {
      const u = d.user;
      setUser(u);
      setName(u.name ?? "");
      setMonthlyIncome(u.monthlyIncome?.toString() ?? "");
      setCurrency(u.currency ?? "USD");
      setAvatarColor(u.avatarColor ?? "#10b981");
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await fetch("/api/user", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, currency, monthlyIncome: monthlyIncome ? parseFloat(monthlyIncome) : null, avatarColor }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (!user) return null;

  return (
    <>
      <Header title="Settings" subtitle="Manage your profile and preferences" />

      <div style={{ padding: "24px 32px", maxWidth: 640 }}>
        <div className="card" style={{ padding: 28, marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <User size={18} color="#10b981" />
            <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#f1f5f9" }}>Profile</h2>
          </div>

          {/* Avatar */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: 10 }}>Avatar Color</label>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: `linear-gradient(135deg, ${avatarColor}, ${avatarColor}bb)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.2rem",
                  fontWeight: 800,
                  color: "white",
                  boxShadow: `0 4px 12px ${avatarColor}40`,
                }}
              >
                {name.charAt(0)?.toUpperCase() ?? "?"}
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {AVATAR_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setAvatarColor(c)}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: c,
                      border: `3px solid ${avatarColor === c ? "white" : "transparent"}`,
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: 6 }}>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                style={{ padding: "11px 12px" }}
              />
            </div>

            <div>
              <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: 6 }}>Email</label>
              <input
                type="email"
                value={user.email}
                disabled
                className="input-field"
                style={{ padding: "11px 12px", opacity: 0.5, cursor: "not-allowed" }}
              />
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: 28, marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <DollarSign size={18} color="#6366f1" />
            <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#f1f5f9" }}>Financial Settings</h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: 6 }}>
                Monthly Income
              </label>
              <input
                type="number"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(e.target.value)}
                placeholder="Your monthly take-home pay"
                step="0.01"
                min="0"
                className="input-field"
                style={{ padding: "11px 12px" }}
              />
              <p style={{ fontSize: "0.72rem", color: "#475569", marginTop: 4 }}>
                Used to calculate savings rate and financial health score
              </p>
            </div>

            <div>
              <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: 6 }}>Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="input-field"
                style={{ padding: "11px 12px" }}
              >
                <option value="USD">USD — US Dollar</option>
                <option value="EUR">EUR — Euro</option>
                <option value="GBP">GBP — British Pound</option>
                <option value="MXN">MXN — Mexican Peso</option>
                <option value="CAD">CAD — Canadian Dollar</option>
                <option value="ARS">ARS — Argentine Peso</option>
                <option value="BRL">BRL — Brazilian Real</option>
                <option value="COP">COP — Colombian Peso</option>
                <option value="CLP">CLP — Chilean Peso</option>
              </select>
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary"
          style={{ padding: "13px 28px", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: 8, opacity: saving ? 0.7 : 1 }}
        >
          <Save size={16} />
          {saved ? "✓ Saved!" : saving ? "Saving..." : "Save Changes"}
        </button>

        <div className="card" style={{ padding: 24, marginTop: 24, borderColor: "rgba(244,63,94,0.15)" }}>
          <h3 style={{ fontSize: "0.85rem", fontWeight: 700, color: "#f1f5f9", marginBottom: 8 }}>🔑 AI Assistant Setup</h3>
          <p style={{ fontSize: "0.78rem", color: "#94a3b8", lineHeight: 1.7, marginBottom: 12 }}>
            To use the AI Financial Coach, add your Anthropic API key to the <code style={{ color: "#10b981", background: "rgba(16,185,129,0.1)", padding: "1px 5px", borderRadius: 4 }}>.env</code> file:
          </p>
          <div style={{ background: "#0a0e1a", borderRadius: 8, padding: "12px 16px", fontFamily: "monospace", fontSize: "0.8rem", color: "#10b981" }}>
            ANTHROPIC_API_KEY=sk-ant-...
          </div>
          <p style={{ fontSize: "0.72rem", color: "#475569", marginTop: 8 }}>
            Get your key at console.anthropic.com
          </p>
        </div>
      </div>
    </>
  );
}
