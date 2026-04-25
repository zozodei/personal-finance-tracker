import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function formatShortDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export function getDaysUntilDeadline(deadline: Date | string): number {
  const now = new Date();
  const target = new Date(deadline);
  const diff = target.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function getWeeksUntilDeadline(deadline: Date | string): number {
  return Math.ceil(getDaysUntilDeadline(deadline) / 7);
}

export function getMonthsUntilDeadline(deadline: Date | string): number {
  const now = new Date();
  const target = new Date(deadline);
  return (
    (target.getFullYear() - now.getFullYear()) * 12 +
    (target.getMonth() - now.getMonth())
  );
}

export function calculateSavingsNeeded(
  targetAmount: number,
  currentAmount: number,
  deadline?: Date | string | null
): { weekly: number; monthly: number } {
  const remaining = Math.max(0, targetAmount - currentAmount);
  if (!deadline) return { weekly: 0, monthly: 0 };
  const weeks = Math.max(1, getWeeksUntilDeadline(deadline));
  const months = Math.max(1, getMonthsUntilDeadline(deadline));
  return {
    weekly: remaining / weeks,
    monthly: remaining / months,
  };
}

export function getProgressPercentage(current: number, target: number): number {
  if (target === 0) return 0;
  return Math.min(100, Math.round((current / target) * 100));
}

export function getStartOfMonth(date = new Date()): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function getEndOfMonth(date = new Date()): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
}

export function getStartOfWeek(date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

export function getPreviousMonthRange(): { start: Date; end: Date } {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
  return { start, end };
}

export const EXPENSE_CATEGORIES = [
  { value: "food", label: "Food & Dining", emoji: "🍔", color: "#f97316" },
  { value: "transport", label: "Transport", emoji: "🚗", color: "#3b82f6" },
  { value: "housing", label: "Housing & Rent", emoji: "🏠", color: "#8b5cf6" },
  { value: "subscriptions", label: "Subscriptions", emoji: "📱", color: "#ec4899" },
  { value: "education", label: "Education", emoji: "📚", color: "#06b6d4" },
  { value: "health", label: "Health & Medical", emoji: "💊", color: "#ef4444" },
  { value: "entertainment", label: "Entertainment", emoji: "🎬", color: "#f59e0b" },
  { value: "shopping", label: "Shopping", emoji: "🛍️", color: "#10b981" },
  { value: "utilities", label: "Utilities", emoji: "💡", color: "#6366f1" },
  { value: "travel", label: "Travel", emoji: "✈️", color: "#14b8a6" },
  { value: "personal", label: "Personal Care", emoji: "💆", color: "#a78bfa" },
  { value: "hormiga", label: "Micro-expenses", emoji: "🐜", color: "#94a3b8" },
  { value: "other", label: "Other", emoji: "📦", color: "#64748b" },
] as const;

export const INCOME_CATEGORIES = [
  { value: "salary", label: "Salary", emoji: "💼", color: "#10b981" },
  { value: "freelance", label: "Freelance", emoji: "💻", color: "#06b6d4" },
  { value: "investment", label: "Investments", emoji: "📈", color: "#6366f1" },
  { value: "business", label: "Business", emoji: "🏢", color: "#f59e0b" },
  { value: "gift", label: "Gift / Bonus", emoji: "🎁", color: "#ec4899" },
  { value: "other", label: "Other", emoji: "💰", color: "#64748b" },
] as const;

export function getCategoryMeta(category: string, type: "income" | "expense" = "expense") {
  const list = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  return (list as readonly { value: string; label: string; emoji: string; color: string }[]).find(
    (c) => c.value === category
  ) ?? { value: category, label: category, emoji: "💰", color: "#64748b" };
}

export function getInitials(name?: string | null): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
