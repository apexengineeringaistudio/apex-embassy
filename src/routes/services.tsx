import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useDB } from "@/data/repository";
import { PageHeader, Panel, Pill } from "@/components/app/bits";
import { CoverageCell, CoverageLegend } from "@/components/app/CoverageCell";
import { PACKAGES, SERVICE_CATALOG, SERVICE_COLUMNS } from "@/lib/constants";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/services")({
  head: pageHead("Service Coverage", "Service catalog, packages and cross-sell coverage heatmap."),
  component: Services,
});

function Services() {
  const db = useDB();
  const gaps = SERVICE_COLUMNS.map((c) => ({ c, n: db.accounts.filter((a) => ["Opportunity", "Needs Review"].includes(a.coverage[c.key])).length }));
  return (
    <>
      <PageHeader eyebrow="Growth" title="Service Coverage" subtitle="Find legitimate gaps. Opportunities are hypotheses until reviewed with the client." />
      <Panel title="Coverage heatmap" action={<span className="text-[11px] text-muted-foreground">{db.accounts.length} accounts</span>} className="mb-3" bodyClass="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead className="bg-muted/60"><tr>
              <th className="sticky left-0 bg-muted px-3 py-2 text-left text-[11px] font-semibold uppercase text-muted-foreground">Account</th>
              {SERVICE_COLUMNS.map((c) => <th key={c.key} className="px-1.5 py-2 text-center text-[11px] font-semibold uppercase text-muted-foreground" title={c.label}>{c.short}</th>)}
            </tr></thead>
            <tbody>
              {db.accounts.map((a) => (
                <tr key={a.id} className="border-t">
                  <td className="sticky left-0 bg-card px-3 py-1.5"><Link to="/accounts/$id" params={{ id: a.id }} className="font-medium hover:text-primary">{a.name}</Link> <Pill className="ml-1">{a.relationship}</Pill></td>
                  {SERVICE_COLUMNS.map((c) => <td key={c.key} className="px-1.5 py-1.5 text-center"><CoverageCell status={a.coverage[c.key]} /></td>)}
                </tr>
              ))}
              <tr className="border-t bg-muted/40">
                <td className="sticky left-0 bg-muted px-3 py-1.5 text-[11px] font-semibold uppercase text-muted-foreground">To review</td>
                {gaps.map((g) => <td key={g.c.key} className="num py-1.5 text-center font-semibold">{g.n}</td>)}
              </tr>
            </tbody>
          </table>
        </div>
        <div className="border-t p-3"><CoverageLegend /></div>
      </Panel>

      <div className="grid gap-3 lg:grid-cols-3">
        <Panel title="Apex service catalog" className="lg:col-span-2">
          <div className="grid gap-2 sm:grid-cols-3">
            {SERVICE_CATALOG.map((s) => (
              <div key={s.name} className="rounded-md border p-2.5"><div className="text-[13px] font-medium">{s.name}</div><div className="text-[11px] text-muted-foreground">{s.desc}</div></div>
            ))}
          </div>
        </Panel>
        <Panel title="Packages" action={<Pill tone="warning">DRAFT</Pill>}>
          <div className="space-y-2">
            {PACKAGES.map((p) => (
              <div key={p.name} className="rounded-md border p-2.5">
                <div className="flex justify-between"><span className="font-semibold">{p.name}</span><span className="num text-[12px] text-muted-foreground">{p.price}</span></div>
                <div className="mt-1 text-[11px] text-muted-foreground">{p.items.join(" · ")}</div>
              </div>
            ))}
            <div className="rounded-md border-2 border-dashed border-primary/40 bg-accent/40 p-2.5">
              <div className="flex items-center justify-between"><span className="font-semibold">Build Your Own Package</span><Pill tone="warning">DRAFT · internal</Pill></div>
              <div className="num mt-0.5 text-[13px]">from ₹3,000/month</div>
              <div className="text-[11px] text-muted-foreground">Commercial concept under review — not for client communication.</div>
              <Button size="sm" variant="outline" className="mt-2" onClick={() => toast.info("Package builder is a draft concept", { description: "Pricing to be finalised." })}>Preview builder</Button>
            </div>
          </div>
        </Panel>
      </div>
    </>
  );
}
