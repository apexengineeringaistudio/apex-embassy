import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDB } from "@/data/repository";
import { PageHeader, Panel, Pill } from "@/components/app/bits";
import { CampaignCard } from "@/components/app/CampaignCard";
import { PACKAGES } from "@/lib/constants";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/social")({
  head: pageHead("Social Media", "Social content calendar and packages."),
  component: Social,
});

const PLATFORMS = ["LinkedIn", "Instagram", "Facebook", "YouTube", "X", "WhatsApp Business"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const PLAN: Record<string, { t: string; p: string }> = { "1-Tue": { t: "Trikaya — leadership insight", p: "LinkedIn" }, "1-Thu": { t: "Apex — case study teaser", p: "Instagram" }, "2-Mon": { t: "Chocolate brand — teaser (draft)", p: "Instagram" }, "3-Wed": { t: "Apex — service explainer", p: "LinkedIn" } };

function Social() {
  const db = useDB();
  const social = db.campaigns.filter((c) => c.channel === "Social");
  return (
    <>
      <PageHeader eyebrow="Growth" title="Social Media" subtitle="Content calendar shell, packages and platforms."
        actions={<Button size="sm" onClick={() => toast.success("Post slot added", { description: "Demo mode — not scheduled anywhere." })}><Plus /> Add post</Button>} />
      <div className="mb-3 flex flex-wrap gap-1.5">{PLATFORMS.map((p) => <Pill key={p} tone="neutral">{p}</Pill>)}</div>
      <div className="grid gap-3 xl:grid-cols-3">
        <Panel title="Content calendar · October (shell)" className="xl:col-span-2" bodyClass="p-0">
          <div className="overflow-x-auto">
            <div className="grid min-w-[640px] grid-cols-7 border-b bg-muted/60">{DAYS.map((d) => <div key={d} className="px-2 py-1.5 text-[11px] font-semibold uppercase text-muted-foreground">{d}</div>)}</div>
            {[1, 2, 3, 4].map((w) => (
              <div key={w} className="grid min-w-[640px] grid-cols-7">
                {DAYS.map((d) => { const e = PLAN[`${w}-${d}`]; return (
                  <div key={d} className="h-20 border-b border-r p-1.5 text-[11px]">
                    {e && <div className="rounded bg-accent px-1.5 py-1"><div className="font-medium text-accent-foreground">{e.t}</div><div className="text-muted-foreground">{e.p}</div></div>}
                  </div>); })}
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Social packages" action={<Pill tone="warning">DRAFT</Pill>}>
          {PACKAGES.map((p) => <div key={p.name} className="mb-2 rounded-md border p-2.5"><div className="font-semibold">{p.name}</div><div className="text-[11px] text-muted-foreground">{p.items.join(" · ")}</div></div>)}
        </Panel>
      </div>
      <h2 className="mb-2 mt-5 text-sm font-semibold">Social campaigns</h2>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{social.map((c) => <CampaignCard key={c.id} c={c} />)}</div>
    </>
  );
}
