import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { byId, useDB } from "@/data/repository";
import { DataTable, type Column } from "@/components/app/DataTable";
import { DemoBanner, PageHeader, Pill } from "@/components/app/bits";
import { useQuickCreate } from "@/components/app/QuickCreate";
import { money } from "@/lib/format";
import { pageHead } from "@/lib/seo";
import type { Campaign } from "@/lib/types";

export const Route = createFileRoute("/_authenticated/ads")({
  head: pageHead("Ads", "Google and Meta ad campaign planning."),
  component: Ads,
});

function Ads() {
  const db = useDB();
  const create = useQuickCreate();
  const rows = db.campaigns.filter((c) => c.channel === "Google Ads" || c.channel === "Meta Ads");
  const cols: Column<Campaign>[] = [
    { key: "n", header: "Campaign", sort: (c) => c.name, cell: (c) => <div><div className="font-medium">{c.name}</div><div className="text-[11px] text-muted-foreground">{byId(db.accounts, c.accountId)?.name ?? "Apex (internal)"}</div></div> },
    { key: "p", header: "Platform", cell: (c) => <Pill tone="info">{c.channel}</Pill> },
    { key: "o", header: "Objective", cell: (c) => c.objective ?? "—" },
    { key: "b", header: "Budget", sort: (c) => c.budget ?? 0, cell: (c) => <span className="num">{c.budget ? money(c.budget) : "—"}</span> },
    { key: "t", header: "Target", cell: (c) => <span className="text-[12px]">{c.audience}</span> },
    { key: "l", header: "Landing page", cell: (c) => <span className="text-[12px] text-muted-foreground">{c.landingPage ?? "TBD"}</span> },
    { key: "k", header: "Keywords / audiences", cell: (c) => <span className="flex flex-wrap gap-1">{(c.keywords ?? ["—"]).map((k) => <Pill key={k} tone="neutral">{k}</Pill>)}</span> },
    { key: "s", header: "Status", cell: (c) => <Pill>{c.status}</Pill> },
  ];
  return (
    <>
      <PageHeader eyebrow="Growth" title="Ads" subtitle="Planning workspace for paid campaigns."
        actions={<Button size="sm" onClick={() => create("campaign")}><Plus /> Plan ad campaign</Button>} />
      <DemoBanner tone="info">Planning UI only — no ad accounts connected and no spend data.</DemoBanner>
      <DataTable rows={rows} columns={cols} searchText={(c) => `${c.name} ${c.audience}`} filters={[{ label: "platforms", options: ["Google Ads", "Meta Ads"], get: (c) => c.channel }]} />
    </>
  );
}
