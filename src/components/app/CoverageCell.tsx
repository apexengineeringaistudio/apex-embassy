import type { CoverageStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const cls: Record<CoverageStatus, string> = {
  Active: "bg-success text-primary-foreground",
  Delivered: "bg-info/80 text-primary-foreground",
  "Needs Review": "bg-warning/70 text-foreground",
  Opportunity: "bg-primary/20 text-primary border border-primary/40",
  "Not Relevant": "bg-muted text-muted-foreground/60",
  Unknown: "bg-background text-muted-foreground border border-dashed",
};
const abbr: Record<CoverageStatus, string> = { Active: "ACT", Delivered: "DLV", "Needs Review": "REV", Opportunity: "OPP", "Not Relevant": "N/A", Unknown: "?" };

export function CoverageCell({ status, full }: { status: CoverageStatus; full?: boolean }) {
  return (
    <span title={status} className={cn("inline-flex h-6 min-w-10 items-center justify-center rounded px-1.5 text-[10px] font-semibold", cls[status])}>
      {full ? status : abbr[status]}
    </span>
  );
}

export function CoverageLegend() {
  return (
    <div className="flex flex-wrap gap-3 text-[11px] text-muted-foreground">
      {(Object.keys(cls) as CoverageStatus[]).map((s) => <span key={s} className="flex items-center gap-1.5"><CoverageCell status={s} /> {s}</span>)}
    </div>
  );
}
