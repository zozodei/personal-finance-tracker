import Link from "next/link";
import { Zap, BarChart3, Target, Bot, Shield, TrendingUp, ArrowRight, CheckCircle } from "lucide-react";

export default function LandingPage() {
  const features = [
    { icon: BarChart3, title: "Smart Dashboard", desc: "Beautiful charts, cash flow analysis, and real-time financial health score", color: "#10b981" },
    { icon: TrendingUp, title: "Income & Expenses", desc: "Track everything including micro-expenses (gastos hormiga) and recurring costs", color: "#6366f1" },
    { icon: Target, title: "Savings Goals", desc: "Set goals with deadlines, track progress, and get weekly/monthly savings targets", color: "#f59e0b" },
    { icon: Bot, title: "AI Financial Coach", desc: "Claude-powered assistant that knows your finances and gives personalized advice", color: "#ec4899" },
    { icon: BarChart3, title: "Financial Insights", desc: "Spending patterns, budget warnings, savings rate, and personalized recommendations", color: "#06b6d4" },
    { icon: Shield, title: "Secure & Private", desc: "Your data stays on your server. JWT authentication and encrypted passwords", color: "#8b5cf6" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0a0e1a", color: "#f1f5f9" }}>
      {/* Nav */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 48px", borderBottom: "1px solid rgba(255,255,255,0.06)", position: "sticky", top: 0, background: "rgba(10,14,26,0.85)", backdropFilter: "blur(12px)", zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #10b981, #059669)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(16,185,129,0.35)" }}>
            <Zap size={18} color="white" />
          </div>
          <span style={{ fontSize: "1.1rem", fontWeight: 900, letterSpacing: "-0.02em" }}>FinZen</span>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <Link href="/login" style={{ padding: "9px 20px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.12)", color: "#94a3b8", textDecoration: "none", fontSize: "0.875rem", fontWeight: 600, transition: "all 0.15s" }}>
            Sign in
          </Link>
          <Link href="/register" className="btn-primary" style={{ padding: "9px 20px", borderRadius: 10, textDecoration: "none", fontSize: "0.875rem", fontWeight: 700, display: "inline-block" }}>
            Get started free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ textAlign: "center", padding: "100px 48px 80px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "20%", left: "15%", width: 500, height: 500, borderRadius: "50%", background: "rgba(16,185,129,0.06)", filter: "blur(80px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "30%", right: "15%", width: 400, height: 400, borderRadius: "50%", background: "rgba(99,102,241,0.07)", filter: "blur(80px)", pointerEvents: "none" }} />

        <div style={{ position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 999, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", marginBottom: 28 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }} />
            <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#10b981", letterSpacing: "0.04em" }}>Free · No credit card needed</span>
          </div>

          <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.04em", marginBottom: 20, maxWidth: 800, margin: "0 auto 20px" }}>
            Your personal{" "}
            <span style={{ background: "linear-gradient(135deg, #10b981, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Finance OS
            </span>
            <br />
            Manage money with intention
          </h1>

          <p style={{ fontSize: "1.15rem", color: "#94a3b8", maxWidth: 560, margin: "0 auto 40px", lineHeight: 1.7 }}>
            Track income and expenses, build savings goals, get AI-powered insights, and finally understand where your money is going.
          </p>

          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/register"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 32px",
                borderRadius: 12,
                background: "linear-gradient(135deg, #10b981, #059669)",
                color: "white",
                textDecoration: "none",
                fontSize: "1rem",
                fontWeight: 700,
                boxShadow: "0 8px 24px rgba(16,185,129,0.4)",
              }}
            >
              Start for free <ArrowRight size={18} />
            </Link>
            <Link
              href="/login"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 32px",
                borderRadius: 12,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#f1f5f9",
                textDecoration: "none",
                fontSize: "1rem",
                fontWeight: 600,
              }}
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "60px 48px 100px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 12 }}>
            Everything you need to{" "}
            <span style={{ color: "#10b981" }}>master your money</span>
          </h2>
          <p style={{ color: "#64748b", fontSize: "1rem" }}>Not just a tracker — a complete financial operating system</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          {features.map(({ icon: Icon, title, desc, color }, i) => (
            <div
              key={i}
              className="card"
              style={{ padding: 28, position: "relative", overflow: "hidden" }}
            >
              <div style={{ position: "absolute", top: 0, right: 0, width: 100, height: 100, borderRadius: "50%", background: `${color}08`, filter: "blur(30px)", transform: "translate(30%, -30%)" }} />
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, border: `1px solid ${color}25` }}>
                <Icon size={20} color={color} />
              </div>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#f1f5f9", marginBottom: 8 }}>{title}</h3>
              <p style={{ fontSize: "0.85rem", color: "#64748b", lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why FinZen */}
      <section style={{ padding: "60px 48px", background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          <div>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 20, lineHeight: 1.2 }}>
              Designed around how people actually think about money
            </h2>
            <p style={{ color: "#94a3b8", lineHeight: 1.7, marginBottom: 24, fontSize: "0.95rem" }}>
              Most finance apps are built like spreadsheets. FinZen is built around financial psychology — understanding habits, reducing friction, and motivating better decisions.
            </p>
            {[
              "Track gastos hormiga (micro-expenses) that drain your budget",
              "Visual progress on savings goals keeps you motivated",
              "AI coach gives personalized, context-aware advice",
              "Financial health score gamifies improvement",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 12 }}>
                <CheckCircle size={16} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontSize: "0.88rem", color: "#94a3b8", lineHeight: 1.5 }}>{item}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { label: "Health Score", value: "87", unit: "/100", color: "#10b981" },
              { label: "Savings Rate", value: "24", unit: "%", color: "#6366f1" },
              { label: "Goals Active", value: "3", unit: "", color: "#f59e0b" },
              { label: "Insights", value: "AI", unit: "powered", color: "#ec4899" },
            ].map(({ label, value, unit, color }, i) => (
              <div key={i} style={{ padding: 20, borderRadius: 16, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", textAlign: "center" }}>
                <p style={{ fontSize: "0.68rem", color: "#475569", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{label}</p>
                <p style={{ fontSize: "2.2rem", fontWeight: 900, color, letterSpacing: "-0.04em", lineHeight: 1 }}>{value}</p>
                <p style={{ fontSize: "0.75rem", color: "#475569", marginTop: 4 }}>{unit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ textAlign: "center", padding: "100px 48px" }}>
        <h2 style={{ fontSize: "2.4rem", fontWeight: 900, letterSpacing: "-0.04em", marginBottom: 16 }}>
          Ready to take control?
        </h2>
        <p style={{ color: "#64748b", marginBottom: 36, fontSize: "1rem" }}>
          Start for free. No credit card. No hidden fees.
        </p>
        <Link
          href="/register"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "16px 40px",
            borderRadius: 14,
            background: "linear-gradient(135deg, #10b981, #059669)",
            color: "white",
            textDecoration: "none",
            fontSize: "1.05rem",
            fontWeight: 800,
            boxShadow: "0 10px 30px rgba(16,185,129,0.45)",
          }}
        >
          <Zap size={20} />
          Get started with FinZen
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "24px 48px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Zap size={16} color="#10b981" />
          <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#475569" }}>FinZen</span>
        </div>
        <p style={{ fontSize: "0.78rem", color: "#334155" }}>Built with Next.js, Prisma, and Claude AI</p>
      </footer>
    </div>
  );
}
