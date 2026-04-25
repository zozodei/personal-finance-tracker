"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Target,
  BarChart3,
  Bot,
  Settings,
  LogOut,
  Zap,
  TrendingUp,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { href: "/goals", label: "Savings Goals", icon: Target },
  { href: "/insights", label: "Insights", icon: BarChart3 },
  { href: "/assistant", label: "AI Coach", icon: Bot },
];

const bottomItems = [
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: 240,
        minHeight: "100vh",
        background: "linear-gradient(180deg, #0d1629 0%, #0a0e1a 100%)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        flexDirection: "column",
        padding: "24px 16px",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 40,
      }}
    >
      {/* Logo */}
      <div style={{ marginBottom: 32 }}>
        <Link
          href="/dashboard"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "linear-gradient(135deg, #10b981, #059669)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(16,185,129,0.35)",
            }}
          >
            <Zap size={18} color="white" />
          </div>
          <div>
            <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.02em" }}>
              FinZen
            </div>
            <div style={{ fontSize: "0.65rem", color: "#10b981", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Finance OS
            </div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#475569", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8, paddingLeft: 14 }}>
          Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-link ${isActive ? "active" : ""}`}
            >
              <Icon size={17} />
              <span>{item.label}</span>
              {item.label === "AI Coach" && (
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: "0.6rem",
                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    color: "white",
                    padding: "1px 6px",
                    borderRadius: 999,
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                  }}
                >
                  AI
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div
          style={{
            padding: "12px 14px",
            background: "rgba(16,185,129,0.06)",
            borderRadius: 10,
            border: "1px solid rgba(16,185,129,0.12)",
            marginBottom: 8,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <TrendingUp size={14} color="#10b981" />
            <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 500 }}>
              Your wealth journey
            </span>
          </div>
          <div style={{ fontSize: "0.7rem", color: "#475569", marginTop: 4 }}>
            Track. Save. Grow.
          </div>
        </div>
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-link ${isActive ? "active" : ""}`}
            >
              <Icon size={17} />
              <span>{item.label}</span>
            </Link>
          );
        })}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="sidebar-link"
          style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left", width: "100%" }}
        >
          <LogOut size={17} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
