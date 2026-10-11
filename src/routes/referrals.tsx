import { createFileRoute, Link } from "@tanstack/react-router";
import { useDB } from "@/data/repository";
import { Avatar, Kpi, PageHeader, Panel, Pill } from "@/components/app/bits";
import { money } from "@/lib/format";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/referrals")({
  head: pageHead("Referral Partners", "Partner introductions, wins and attribution."),
  component: Referrals,
});

function Referrals() {
  const db = useDB();
  const partners = db.contacts.filter((c) => c.isReferralPartner).map((p) => {
    const leads = db.leads.filter((l) => l.partnerId === p.id);
    const accounts = db.accounts.filter((a) => a.sourcePartnerId === p.id);
    return { p, leads, accounts, won: leads.filter((l) => l.stage === "Won"), pipeline: leads.filter((l) => !["Won", "Lost"].includes(l.stage)).reduce((s, l) => s + l.value, 0) };
  });
  const totalWon = partners.reduce((s, r) => s + r.won.reduce((t, l) => t + l.value, 0), 0);
  return (
    <>
      <PageHeader eyebrow="Acquisition" title="Referral Partners" subtitle="Who introduces business, and what it's worth." />
      <div className="mb-3 grid grid-cols-2 gap-2.5 md:grid-cols-4">
        <Kpi label="Partners" value={partners.length} />
        <Kpi label="Accounts introduced" value={partners.reduce((s, r) => s + r.accounts.length, 0)} />
        <Kpi label="Won value" value={money(totalWon)} />
        <Kpi label="Open pipeline" value={money(partners.reduce((s, r) => s + r.pipeline, 0))} />
      </div>
      <div className="grid gap-3 lg:grid-cols-3">
        {partners.map(({ p, leads, accounts, won, pipeline }) => (
          <Panel key={p.id} title={<span className="flex items-center gap-2"><Avatar name={p.name} />{p.name}</span>} action={<Pill tone="primary">Partner</Pill>}>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div><div className="num text-lg font-semibold">{leads.length}</div><div className="text-[11px] text-muted-foreground">Leads</div></div>
              <div><div className="num text-lg font-semibold">{won.length}</div><div className="text-[11px] text-muted-foreground">Won</div></div>
              <div><div className="num text-lg font-semibold">{money(pipeline)}</div><div className="text-[11px] text-muted-foreground">Pipeline</div></div>
            </div>
            <div className="eyebrow mb-1 mt-3">Attributed accounts</div>
            <ul className="space-y-1">{accounts.map((a) => (
              <li key={a.id} className="flex justify-between text-[13px]"><Link to="/accounts/$id" params={{ id: a.id }} className="hover:text-primary">{a.name}</Link><Pill>{a.relationship}</Pill></li>
            ))}</ul>
          </Panel>
        ))}
      </div>
      <p className="mt-3 text-[11px] text-muted-foreground">Sampada Inamdar is tracked as a contact (not a referral partner) unless marked otherwise.</p>
    </>
  );
}
