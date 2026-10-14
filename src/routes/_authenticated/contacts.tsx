import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { byId, useDB } from "@/data/repository";
import { DataTable, type Column } from "@/components/app/DataTable";
import { Avatar, PageHeader, Pill } from "@/components/app/bits";
import { pageHead } from "@/lib/seo";
import type { Contact } from "@/lib/types";

export const Route = createFileRoute("/_authenticated/contacts")({
  head: pageHead("Contacts", "People linked to accounts and referral partners."),
  component: Contacts,
});

function Contacts() {
  const db = useDB();
  const cols: Column<Contact>[] = [
    { key: "n", header: "Name", sort: (c) => c.name, cell: (c) => <span className="flex items-center gap-2"><Avatar name={c.name} /><span className="font-medium">{c.name}</span></span> },
    { key: "r", header: "Role", cell: (c) => c.role },
    { key: "a", header: "Account", cell: (c) => { const a = byId(db.accounts, c.accountId); return a ? <Link to="/accounts/$id" params={{ id: a.id }} className="text-primary" onClick={(e) => e.stopPropagation()}>{a.name}</Link> : <span className="text-muted-foreground">—</span>; } },
    { key: "p", header: "Referral partner", cell: (c) => (c.isReferralPartner ? <Pill tone="primary">Partner</Pill> : <span className="text-muted-foreground">No</span>) },
    { key: "t", header: "Tags", cell: (c) => <span className="flex flex-wrap gap-1">{c.tags.map((t) => <Pill key={t} tone="neutral">{t}</Pill>)}</span> },
    { key: "e", header: "Email / phone", cell: () => <span className="text-[12px] text-muted-foreground">Not stored in demo</span> },
  ];
  return (
    <>
      <PageHeader eyebrow="CRM" title="Contacts" subtitle="Contacts can belong to accounts and can also be referral partners."
        actions={<Button size="sm" onClick={() => toast.info("Contact form arrives with the database connection", { description: "Demo mode." })}><Plus /> New contact</Button>} />
      <DataTable rows={db.contacts} columns={cols} searchText={(c) => `${c.name} ${c.role} ${c.tags.join(" ")}`}
        filters={[{ label: "types", options: ["Partner", "Contact"], get: (c) => (c.isReferralPartner ? "Partner" : "Contact") }]} />
    </>
  );
}
