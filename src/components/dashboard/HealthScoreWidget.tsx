"use client";

interface HealthScore {
  score: number;
  grade: string;
  label: string;
  color: string;
}

export default function HealthScoreWidget({ healthScore }: { healthScore: HealthScore }) {
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (healthScore.score / 100) * circumference;

  return (
    <div
      className="card"
      style={{
        padding: 24,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: `${healthScore.color}08`,
          filter: "blur(40px)",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
        }}
      />

      <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>
        Financial Health
      </p>

      <div style={{ position: "relative", width: 130, height: 130 }}>
        <svg width="130" height="130" viewBox="0 0 130 130">
          <circle
            cx="65"
            cy="65"
            r="54"
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="10"
          />
          <circle
            cx="65"
            cy="65"
            r="54"
            fill="none"
            stroke={healthScore.color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 65 65)"
            style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
          />
        </svg>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "2rem",
              fontWeight: 900,
              color: healthScore.color,
              lineHeight: 1,
              letterSpacing: "-0.04em",
            }}
          >
            {healthScore.score}
          </div>
          <div style={{ fontSize: "0.65rem", color: "#64748b", fontWeight: 600, marginTop: 2 }}>/ 100</div>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "4px 14px",
            borderRadius: 999,
            background: `${healthScore.color}18`,
            border: `1px solid ${healthScore.color}35`,
          }}
        >
          <span style={{ fontSize: "1.1rem", fontWeight: 800, color: healthScore.color }}>
            {healthScore.grade}
          </span>
          <span style={{ fontSize: "0.8rem", color: healthScore.color, fontWeight: 600 }}>
            · {healthScore.label}
          </span>
        </div>
      </div>
    </div>
  );
}
