import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { byId, repo, useDB } from "@/data/repository";
import { PageHeader } from "@/components/app/bits";
import { useQuickCreate } from "@/components/app/QuickCreate";
import { LEAD_STAGES } from "@/lib/constants";
import { moneyShort, relDay } from "@/lib/format";
import { pageHead } from "@/lib/seo";
import type { LeadStage } from "@/lib/types";

export const Route = createFileRoute("/pipeline")({
  head: pageHead("Pipeline", "Kanban board of opportunities by stage."),
  component: Pipeline,
});

function Pipeline() {
  const db = useDB();
  const create = useQuickCreate();
  return (
    <>
      <PageHeader eyebrow="CRM" title="Pipeline" subtitle="Move opportunities between stages. Changes are saved to demo data."
        actions={<Button size="sm" onClick={() => create("lead")}><Plus /> New lead</Button>} />
      <div className="flex gap-2.5 overflow-x-auto pb-3">
        {LEAD_STAGES.map((s) => {
          const items = db.leads.filter((l) => l.stage === s);
          return (
            <div key={s} className="w-60 shrink-0 rounded-lg border bg-muted/50">
              <div className="flex items-center justify-between border-b px-2.5 py-2">
                <span className="text-[12px] font-semibold">{s} <span className="text-muted-foreground">{items.length}</span></span>
                <span className="num text-[11px] text-muted-foreground">{moneyShort(items.reduce((t, l) => t + l.value, 0))}</span>
              </div>
              <div className="space-y-2 p-2">
                {items.length === 0 && <div className="rounded border border-dashed py-4 text-center text-[11px] text-muted-foreground">Empty</div>}
                {items.map((l) => (
                  <div key={l.id} className="panel p-2.5 text-[12px]">
                    <div className="font-medium leading-snug">{l.title}</div>
                    <Link to="/accounts/$id" params={{ id: l.accountId }} className="text-[11px] text-muted-foreground hover:text-primary">{byId(db.accounts, l.accountId)?.name}</Link>
                    {["a4", "a6", "a10", "a14"].includes(l.accountId) && <p className="mt-1 text-[11px] leading-snug text-muted-foreground">{l.nextAction}</p>}
                    <div className="mt-1.5 flex justify-between"><span className="num font-semibold">{moneyShort(l.value)}</span><span className="text-[11px] text-muted-foreground">{relDay(l.due)}</span></div>
                    <select aria-label="Move stage" value={l.stage} className="mt-2 h-7 w-full rounded border bg-card px-1 text-[11px]"
                      onChange={(e) => { repo.moveLead(l.id, e.target.value as LeadStage); toast.success(`Moved to ${e.target.value}`); }}>
                      {LEAD_STAGES.map((o) => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
