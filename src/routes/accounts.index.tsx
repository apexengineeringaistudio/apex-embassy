import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { byId, useDB } from "@/data/repository";
import { DataTable, type Column } from "@/components/app/DataTable";
import { PageHeader, Pill } from "@/components/app/bits";
import { useQuickCreate } from "@/components/app/QuickCreate";
import { fmtDate, money } from "@/lib/format";
import { pageHead } from "@/lib/seo";
import type { Account } from "@/lib/types";

export const Route = createFileRoute("/accounts/")({
  head: pageHead("Accounts", "All client, prospect and partner accounts."),
  component: Accounts,
});

function Accounts() {
  const db = useDB();
  const nav = useNavigate();
  const create = useQuickCreate();
  const cols: Column<Account>[] = [
    { key: "name", header: "Account", sort: (a) => a.name, cell: (a) => <div><div className="font-medium">{a.name}</div><div className="text-[11px] text-muted-foreground">{a.industry} · {a.city}</div></div> },
    { key: "rel", header: "Relationship", sort: (a) => a.relationship, cell: (a) => <Pill>{a.relationship}</Pill> },
    { key: "stage", header: "Stage", sort: (a) => a.stage, cell: (a) => <Pill>{a.stage}</Pill> },
    { key: "pri", header: "Priority", sort: (a) => a.priority, cell: (a) => <Pill>{a.priority}</Pill> },
    { key: "src", header: "Source", cell: (a) => <span className="text-muted-foreground">{byId(db.contacts, a.sourcePartnerId)?.name ?? a.source}</span> },
    { key: "svc", header: "Delivered", cell: (a) => <span className="text-[12px]">{a.servicesDelivered.join(", ") || "—"}</span> },
    { key: "val", header: "Est. value", sort: (a) => a.estValue, cell: (a) => <span className="num">{money(a.estValue)}</span>, className: "text-right" },
    { key: "last", header: "Last contact", sort: (a) => a.lastContact, cell: (a) => <span className="num text-[12px]">{fmtDate(a.lastContact)}</span> },
    { key: "next", header: "Next action", cell: (a) => <span className="text-[12px]">{a.nextAction}</span> },
    { key: "owner", header: "Owner", cell: (a) => a.owner },
  ];
  return (
    <>
      <PageHeader eyebrow="CRM" title="Accounts" subtitle="Companies and individuals across the client lifecycle."
        actions={<Button size="sm" onClick={() => create("account")}><Plus /> New account</Button>} />
      <DataTable rows={db.accounts} columns={cols} searchText={(a) => `${a.name} ${a.industry} ${a.city} ${a.notes}`}
        onRowClick={(a) => nav({ to: "/accounts/$id", params: { id: a.id } })}
        filters={[
          { label: "relationships", options: ["Client", "Prospect", "Past Client", "Partner"], get: (a) => a.relationship },
          { label: "priorities", options: ["High", "Medium", "Low"], get: (a) => a.priority },
        ]} />
    </>
  );
}
