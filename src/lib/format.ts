import { TODAY } from "./constants";

const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
export const money = (n?: number) => (n == null ? "—" : inr.format(n));
export const moneyShort = (n: number) =>
  n >= 100000 ? `₹${(n / 100000).toFixed(n >= 1000000 ? 0 : 1)}L` : n >= 1000 ? `₹${Math.round(n / 1000)}k` : `₹${n}`;

export const fmtDate = (iso: string) => {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
};

export const daysFromToday = (iso: string) =>
  Math.round((new Date(iso + "T00:00:00").getTime() - new Date(TODAY + "T00:00:00").getTime()) / 86400000);

export const relDay = (iso: string) => {
  const d = daysFromToday(iso);
  if (d === 0) return "Today";
  if (d === 1) return "Tomorrow";
  if (d === -1) return "Yesterday";
  return d < 0 ? `${-d}d overdue` : `in ${d}d`;
};

export const initials = (name: string) =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map((s) => s[0]).join("").toUpperCase();
