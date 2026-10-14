import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, LineChart, SearchCheck, BadgeDollarSign } from "lucide-react";
import { useDB } from "@/data/repository";
import { DemoBanner, PageHeader, Panel, Pill } from "@/components/app/bits";
import { ConnectionCard } from "@/components/app/ConnectionCard";
import { CoverageCell } from "@/components/app/CoverageCell";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/_authenticated/google-seo")({
  head: pageHead("Google & SEO", "Google Business Profile, GA4, Search Console and SEO readiness."),
  component: GoogleSeo,
});

function GoogleSeo() {
  const db = useDB();
  return (
    <>
      <PageHeader eyebrow="Growth" title="Google & SEO" subtitle="Connection readiness and SEO coverage across accounts." />
      <DemoBanner tone="info">No Google accounts are connected. Nothing on this page reflects real Google data.</DemoBanner>
      <div className="mb-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <ConnectionCard name="Google Business Profile" desc="Listings, reviews, local insights" status="Not connected" icon={<MapPin className="size-4" />} />
        <ConnectionCard name="Google Analytics 4" desc="Traffic & conversions" status="Not connected" icon={<LineChart className="size-4" />} />
        <ConnectionCard name="Search Console" desc="Queries, indexing, coverage" status="Not connected" icon={<SearchCheck className="size-4" />} />
        <ConnectionCard name="Google Ads" desc="Campaign performance" status="Not connected" icon={<BadgeDollarSign className="size-4" />} />
      </div>
      <Panel title="SEO readiness by account" bodyClass="p-0">
        <div className="overflow-x-auto"><table className="w-full text-[13px]">
          <thead className="bg-muted/60 text-[11px] uppercase text-muted-foreground"><tr>
            <th className="px-3 py-2 text-left">Account</th><th>GBP</th><th>SEO</th><th>GA4</th><th>GSC</th><th className="px-3 text-left">Status</th></tr></thead>
          <tbody>{db.accounts.map((a) => (
            <tr key={a.id} className="border-t">
              <td className="px-3 py-1.5"><Link to="/accounts/$id" params={{ id: a.id }} className="hover:text-primary">{a.name}</Link></td>
              {(["gbp", "seo", "ga4", "gsc"] as const).map((k) => <td key={k} className="py-1.5 text-center"><CoverageCell status={a.coverage[k]} /></td>)}
              <td className="px-3"><Pill tone="neutral">Awaiting data</Pill></td>
            </tr>
          ))}</tbody>
        </table></div>
      </Panel>
    </>
  );
}
