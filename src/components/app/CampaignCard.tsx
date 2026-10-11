import { Link } from "@tanstack/react-router";
import { byId, useDB } from "@/data/repository";
import { money } from "@/lib/format";
import type { Campaign } from "@/lib/types";
import { Pill } from "./bits";

export function CampaignCard({ c }: { c: Campaign }) {
  const db = useDB();
  const acc = byId(db.accounts, c.accountId);
  return (
    <div className="panel flex flex-col p-3">
      <div className="flex items-start justify-between gap-2">
        <div><div className="text-[11px] font-medium text-primary">{c.channel}</div><div className="font-semibold leading-snug">{c.name}</div></div>
        <Pill>{c.status}</Pill>
      </div>
      <dl className="mt-2 grid grid-cols-[72px_1fr] gap-y-1 text-[12px]">
        <dt className="text-muted-foreground">Goal</dt><dd>{c.goal}</dd>
        <dt className="text-muted-foreground">Audience</dt><dd>{c.audience}</dd>
        <dt className="text-muted-foreground">Linked</dt><dd>{acc ? <Link to="/accounts/$id" params={{ id: acc.id }} className="text-primary">{acc.name}</Link> : "Apex (internal)"}</dd>
        <dt className="text-muted-foreground">Budget</dt><dd className="num">{c.budget ? money(c.budget) : "Placeholder"}</dd>
      </dl>
      <div className="mt-2 border-t pt-2">
        <div className="eyebrow mb-1">Tasks</div>
        {c.tasks.length ? c.tasks.map((t) => <div key={t.label} className="text-[12px]">{t.done ? "☑" : "☐"} {t.label}</div>) : <div className="text-[12px] text-muted-foreground">No tasks yet</div>}
      </div>
      <div className="mt-2 grid grid-cols-3 gap-1 border-t pt-2 text-center">
        {["Impr.", "Clicks", "Leads"].map((m) => <div key={m}><div className="num text-[13px] text-muted-foreground">—</div><div className="text-[10px] text-muted-foreground">{m}</div></div>)}
      </div>
      <div className="mt-1 text-center text-[10px] text-muted-foreground">Metrics placeholder · no live data</div>
    </div>
  );
}
