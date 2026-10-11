import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { initials } from "@/lib/format";

type Tone = "success" | "warning" | "info" | "danger" | "neutral" | "primary";
const toneCls: Record<Tone, string> = {
  success: "bg-success/12 text-success border-success/25",
  warning: "bg-warning/15 text-foreground border-warning/40",
  info: "bg-info/10 text-info border-info/25",
  danger: "bg-destructive/10 text-destructive border-destructive/25",
  neutral: "bg-muted text-muted-foreground border-border",
  primary: "bg-primary/10 text-primary border-primary/25",
};

const statusTone: Record<string, Tone> = {
  Active: "success", Delivered: "info", "Needs Review": "warning", Opportunity: "primary", "Not Relevant": "neutral", Unknown: "neutral",
  Client: "success", Prospect: "info", "Past Client": "neutral", Partner: "primary",
  High: "danger", Medium: "warning", Low: "neutral",
  Won: "success", Lost: "danger", Nurture: "neutral", Proposal: "primary", Negotiation: "warning", New: "info", Qualified: "info", Contacted: "info", Discovery: "primary",
  Draft: "neutral", Planned: "info", Paused: "warning", Completed: "success", Running: "success", Reviewing: "warning", Closed: "neutral",
  "In Progress": "info", "On Hold": "warning", Proposed: "primary",
  Prospecting: "neutral", Dormant: "neutral",
  "Not configured": "neutral", "Planned ": "info",
};

export function Pill({ children, tone, className }: { children: ReactNode; tone?: Tone; className?: string }) {
  const t = tone ?? statusTone[String(children)] ?? "neutral";
  return (
    <span className={cn("inline-flex items-center whitespace-nowrap rounded border px-1.5 py-px text-[11px] font-medium leading-4", toneCls[t], className)}>
      {children}
    </span>
  );
}

export function PageHeader({ title, subtitle, actions, eyebrow }: { title: string; subtitle?: string; actions?: ReactNode; eyebrow?: string }) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <div className="eyebrow mb-1">{eyebrow}</div>}
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({ title, action, children, className, bodyClass }: { title?: ReactNode; action?: ReactNode; children: ReactNode; className?: string; bodyClass?: string }) {
  return (
    <section className={cn("panel flex flex-col", className)}>
      {title && (
        <header className="flex items-center justify-between border-b px-3.5 py-2.5">
          <h2 className="text-[13px] font-semibold">{title}</h2>
          {action}
        </header>
      )}
      <div className={cn("p-3.5", bodyClass)}>{children}</div>
    </section>
  );
}

export function Kpi({ label, value, hint, icon }: { label: string; value: ReactNode; hint?: ReactNode; icon?: ReactNode }) {
  return (
    <div className="panel px-3 py-2.5">
      <div className="flex items-center justify-between">
        <span className="eyebrow">{label}</span>
        <span className="text-muted-foreground">{icon}</span>
      </div>
      <div className="num mt-1 text-xl font-semibold">{value}</div>
      {hint && <div className="mt-0.5 text-[11px] text-muted-foreground">{hint}</div>}
    </div>
  );
}

export function EmptyState({ title, hint, action }: { title: string; hint?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-md border border-dashed px-4 py-10 text-center">
      <div className="text-sm font-medium">{title}</div>
      {hint && <div className="mt-1 max-w-sm text-xs text-muted-foreground">{hint}</div>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}

export function Avatar({ name, className }: { name: string; className?: string }) {
  return (
    <span className={cn("inline-flex size-7 shrink-0 items-center justify-center rounded bg-secondary text-[11px] font-semibold text-secondary-foreground", className)}>
      {initials(name)}
    </span>
  );
}

export function DemoBanner({ children, tone = "warning" }: { children: ReactNode; tone?: Tone }) {
  return <div className={cn("mb-4 rounded-md border px-3 py-2 text-xs", toneCls[tone])}>{children}</div>;
}
