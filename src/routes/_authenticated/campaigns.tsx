import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDB } from "@/data/repository";
import { DemoBanner, EmptyState, PageHeader } from "@/components/app/bits";
import { CampaignCard } from "@/components/app/CampaignCard";
import { useQuickCreate } from "@/components/app/QuickCreate";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/_authenticated/campaigns")({
  head: pageHead("Campaigns", "Draft and planned marketing campaigns across channels."),
  component: Campaigns,
});

const CH = ["All", "Google Ads", "Meta Ads", "SEO", "Social", "Launch/Publicity", "Re-engagement", "Lead Generation"];

function Campaigns() {
  const db = useDB();
  const create = useQuickCreate();
  const [ch, setCh] = useState("All");
  const list = db.campaigns.filter((c) => ch === "All" || c.channel === ch);
  return (
    <>
      <PageHeader eyebrow="Growth" title="Campaigns" subtitle="Plan campaigns for Apex and for clients."
        actions={<Button size="sm" onClick={() => create("campaign")}><Plus /> New campaign</Button>} />
      <DemoBanner tone="info">Planning only. No Google, Meta or analytics data is connected — all metrics are placeholders.</DemoBanner>
      <div className="mb-3 flex flex-wrap gap-1.5">
        {CH.map((c) => <button key={c} onClick={() => setCh(c)} className={`rounded-full border px-2.5 py-1 text-[12px] ${ch === c ? "border-primary bg-primary text-primary-foreground" : "bg-card"}`}>{c}</button>)}
      </div>
      {list.length ? <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{list.map((c) => <CampaignCard key={c.id} c={c} />)}</div>
        : <EmptyState title="No campaigns in this channel" action={<Button size="sm" onClick={() => create("campaign")}>Create draft</Button>} />}
    </>
  );
}
