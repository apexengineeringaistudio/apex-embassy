import { ExternalLink } from "lucide-react";
import { isValidUrl } from "@/lib/projects";

export function SafeLink({ url, label }: { url?: string | undefined; label?: string }) {
  if (!url) return <span className="text-muted-foreground">—</span>;
  if (!isValidUrl(url)) return <span className="text-destructive">Invalid URL</span>;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex max-w-full items-center gap-1 text-primary hover:underline">
      <span className="truncate">{label ?? url.replace(/^https?:\/\//, "")}</span><ExternalLink className="size-3 shrink-0" />
    </a>
  );
}

export function ProgressCell({ value }: { value?: number | undefined }) {
  if (value == null) return <span className="text-[12px] text-muted-foreground">Not assessed</span>;
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded bg-muted"><div className="h-full bg-primary" style={{ width: `${value}%` }} /></div>
      <span className="text-[12px] tabular-nums">{value}%</span>
    </div>
  );
}

export const fmtUpdated = (iso?: string) => (iso ? new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—");
