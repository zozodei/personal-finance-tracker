"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Zap, Mail, Lock, User, DollarSign, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          monthlyIncome: monthlyIncome ? parseFloat(monthlyIncome) : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Registration failed");
        return;
      }

      router.push("/login?registered=true");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0e1a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", top: "15%", right: "15%", width: 350, height: 350, borderRadius: "50%", background: "rgba(99,102,241,0.07)", filter: "blur(70px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "15%", left: "10%", width: 300, height: 300, borderRadius: "50%", background: "rgba(16,185,129,0.06)", filter: "blur(60px)", pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: 440 }} className="animate-slide-up">
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 40, justifyContent: "center" }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: "linear-gradient(135deg, #10b981, #059669)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 6px 20px rgba(16,185,129,0.4)",
            }}
          >
            <Zap size={22} color="white" />
          </div>
          <div>
            <div style={{ fontSize: "1.4rem", fontWeight: 900, color: "#f1f5f9", letterSpacing: "-0.03em" }}>FinZen</div>
            <div style={{ fontSize: "0.65rem", color: "#10b981", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Finance OS</div>
          </div>
        </div>

        <div
          style={{
            background: "#131d2e",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 20,
            padding: "36px 32px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
          }}
        >
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.02em" }}>
              Start your journey 🚀
            </h1>
            <p style={{ fontSize: "0.85rem", color: "#64748b", marginTop: 6 }}>
              Create your free FinZen account
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: 6 }}>Full Name</label>
              <div style={{ position: "relative" }}>
                <User size={15} color="#475569" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required className="input-field" style={{ paddingLeft: 38, paddingRight: 12, paddingTop: 11, paddingBottom: 11 }} />
              </div>
            </div>

            <div>
              <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: 6 }}>Email</label>
              <div style={{ position: "relative" }}>
                <Mail size={15} color="#475569" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="input-field" style={{ paddingLeft: 38, paddingRight: 12, paddingTop: 11, paddingBottom: 11 }} />
              </div>
            </div>

            <div>
              <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: 6 }}>Password</label>
              <div style={{ position: "relative" }}>
                <Lock size={15} color="#475569" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 8 characters" required className="input-field" style={{ paddingLeft: 38, paddingRight: 12, paddingTop: 11, paddingBottom: 11 }} />
              </div>
            </div>

            <div>
              <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: 6 }}>
                Monthly Income <span style={{ color: "#475569", fontWeight: 400 }}>(optional)</span>
              </label>
              <div style={{ position: "relative" }}>
                <DollarSign size={15} color="#475569" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
                <input type="number" value={monthlyIncome} onChange={(e) => setMonthlyIncome(e.target.value)} placeholder="Helps with insights" step="0.01" min="0" className="input-field" style={{ paddingLeft: 38, paddingRight: 12, paddingTop: 11, paddingBottom: 11 }} />
              </div>
              <p style={{ fontSize: "0.7rem", color: "#475569", marginTop: 4 }}>Used to calculate your savings rate and health score</p>
            </div>

            {error && (
              <div style={{ padding: "10px 12px", background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.2)", borderRadius: 10, fontSize: "0.8rem", color: "#fb7185" }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ padding: "13px", fontSize: "0.9rem", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 4, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Creating account..." : (<>Create account <ArrowRight size={16} /></>)}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: 20, fontSize: "0.82rem", color: "#64748b" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "#10b981", fontWeight: 600, textDecoration: "none" }}>
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
