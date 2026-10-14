import { createFileRoute } from "@tanstack/react-router";
import { Mail, Inbox, Calendar, HardDrive, BadgeDollarSign, LineChart, SearchCheck, MapPin, Github, ArrowRight } from "lucide-react";
import { DemoBanner, PageHeader, Panel } from "@/components/app/bits";
import { ConnectionCard } from "@/components/app/ConnectionCard";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/_authenticated/connections")({
  head: pageHead("Connections", "Planned integrations: Gmail, Google Workspace, Google marketing tools and GitHub."),
  component: Connections,
});

function Connections() {
  return (
    <>
      <PageHeader eyebrow="Workspace" title="Connections" subtitle="No integrations are active. All are planned for a later, secured phase." />
      <DemoBanner>Connections stay disabled until authentication and access controls are in place.</DemoBanner>
      <Panel title="Email migration plan" className="mb-3">
        <div className="flex flex-col gap-2 text-[13px] md:flex-row md:items-center">
          <span className="rounded-md border px-2.5 py-1.5">Personal Gmail <span className="text-muted-foreground">(temporary source)</span></span>
          <ArrowRight className="hidden size-4 text-muted-foreground md:block" />
          <span className="rounded-md border border-primary/40 bg-accent px-2.5 py-1.5 text-accent-foreground">Apex Gmail <span className="opacity-70">(primary business email)</span></span>
        </div>
        <p className="mt-2 text-[12px] text-muted-foreground">Future customer engagement should move from personal Gmail to Apex Gmail, while retaining links to historical correspondence on each account timeline.</p>
      </Panel>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <ConnectionCard name="Apex Gmail" desc="Target primary business email" status="Planned" icon={<Mail className="size-4" />} />
        <ConnectionCard name="Personal Gmail" desc="Temporary migration source (read history only)" status="Planned" icon={<Inbox className="size-4" />} note="Historical threads will be linked, not moved." />
        <ConnectionCard name="Google Calendar" desc="Meetings & follow-up reminders" icon={<Calendar className="size-4" />} />
        <ConnectionCard name="Google Drive" desc="Proposals & deliverables" icon={<HardDrive className="size-4" />} />
        <ConnectionCard name="Google Ads" desc="Campaign performance" icon={<BadgeDollarSign className="size-4" />} />
        <ConnectionCard name="Google Analytics 4" desc="Traffic & conversions" icon={<LineChart className="size-4" />} />
        <ConnectionCard name="Google Search Console" desc="Search performance" icon={<SearchCheck className="size-4" />} />
        <ConnectionCard name="Google Business Profile" desc="Local listings & reviews" icon={<MapPin className="size-4" />} />
        <ConnectionCard name="GitHub" desc="Code repositories (read-only reference)" icon={<Github className="size-4" />} note="No credentials are stored in this app." />
      </div>
    </>
  );
}
