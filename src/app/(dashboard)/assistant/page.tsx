import Header from "@/components/layout/Header";
import ChatInterface from "@/components/assistant/ChatInterface";

export default function AssistantPage() {
  return (
    <>
      <Header
        title="AI Financial Coach"
        subtitle="Powered by Claude — knows your finances, ready to help"
      />
      <div style={{ padding: "24px 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 20 }}>
          <ChatInterface />

          {/* Tips sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div className="card" style={{ padding: 20 }}>
              <h3 style={{ fontSize: "0.85rem", fontWeight: 700, color: "#f1f5f9", marginBottom: 12 }}>💡 What I can help with</h3>
              {[
                { icon: "📊", text: "Analyze spending patterns" },
                { icon: "🎯", text: "Plan savings goals" },
                { icon: "💡", text: "Budget recommendations" },
                { icon: "🔮", text: "Future projections" },
                { icon: "✂️", text: "Cost-cutting ideas" },
                { icon: "📈", text: "Investment basics" },
              ].map(({ icon, text }, i) => (
                <div key={i} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: i < 5 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                  <span style={{ fontSize: "0.95rem" }}>{icon}</span>
                  <span style={{ fontSize: "0.78rem", color: "#94a3b8" }}>{text}</span>
                </div>
              ))}
            </div>

            <div className="card" style={{ padding: 20 }}>
              <h3 style={{ fontSize: "0.85rem", fontWeight: 700, color: "#f1f5f9", marginBottom: 12 }}>🔒 Privacy</h3>
              <p style={{ fontSize: "0.75rem", color: "#64748b", lineHeight: 1.6 }}>
                Your financial data is sent to the AI only when you ask a question. It is not stored by Anthropic beyond the conversation.
              </p>
            </div>

            <div
              style={{
                padding: 20,
                borderRadius: 16,
                background: "linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.08) 100%)",
                border: "1px solid rgba(99,102,241,0.2)",
              }}
            >
              <p style={{ fontSize: "0.78rem", color: "#818cf8", fontWeight: 600, marginBottom: 6 }}>⚙️ Setup required</p>
              <p style={{ fontSize: "0.72rem", color: "#64748b", lineHeight: 1.6 }}>
                Add your <code style={{ color: "#818cf8", background: "rgba(99,102,241,0.15)", padding: "1px 5px", borderRadius: 4 }}>ANTHROPIC_API_KEY</code> to the <code style={{ color: "#818cf8", background: "rgba(99,102,241,0.15)", padding: "1px 5px", borderRadius: 4 }}>.env</code> file to activate the AI coach.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
