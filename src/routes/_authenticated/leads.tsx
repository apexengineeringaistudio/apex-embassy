import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { byId, useDB } from "@/data/repository";
import { DataTable, type Column } from "@/components/app/DataTable";
import { PageHeader, Pill } from "@/components/app/bits";
import { useQuickCreate } from "@/components/app/QuickCreate";
import { LEAD_STAGES } from "@/lib/constants";
import { money, relDay } from "@/lib/format";
import { pageHead } from "@/lib/seo";
import type { Lead } from "@/lib/types";

export const Route = createFileRoute("/_authenticated/leads")({
  head: pageHead("Leads", "Every open and closed sales opportunity."),
  component: Leads,
});

function Leads() {
  const db = useDB();
  const nav = useNavigate();
  const create = useQuickCreate();
  const cols: Column<Lead>[] = [
    { key: "t", header: "Opportunity", sort: (l) => l.title, cell: (l) => <div><div className="font-medium">{l.title}</div><div className="text-[11px] text-muted-foreground">{byId(db.accounts, l.accountId)?.name}</div></div> },
    { key: "s", header: "Stage", sort: (l) => LEAD_STAGES.indexOf(l.stage), cell: (l) => <Pill>{l.stage}</Pill> },
    { key: "v", header: "Value", sort: (l) => l.value, cell: (l) => <span className="num">{money(l.value)}</span> },
    { key: "src", header: "Source", cell: (l) => <span className="text-muted-foreground">{byId(db.contacts, l.partnerId)?.name ?? l.source}</span> },
    { key: "n", header: "Next action", cell: (l) => l.nextAction },
    { key: "d", header: "Due", sort: (l) => l.due, cell: (l) => <span className="num text-[12px]">{relDay(l.due)}</span> },
    { key: "o", header: "Owner", cell: (l) => l.owner },
  ];
  return (
    <>
      <PageHeader eyebrow="CRM" title="Leads" subtitle="Stages: New → Qualified → Contacted → Discovery → Proposal → Negotiation → Won / Lost / Nurture."
        actions={<Button size="sm" onClick={() => create("lead")}><Plus /> New lead</Button>} />
      <DataTable rows={db.leads} columns={cols} searchText={(l) => `${l.title} ${byId(db.accounts, l.accountId)?.name}`}
        onRowClick={(l) => nav({ to: "/accounts/$id", params: { id: l.accountId } })}
        filters={[{ label: "stages", options: LEAD_STAGES, get: (l) => l.stage }, { label: "sources", options: ["Referral", "Direct", "Existing client"], get: (l) => l.source }]} />
    </>
  );
}
