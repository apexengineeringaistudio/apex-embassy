import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Plus, Bot, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { byId, useDB } from "@/data/repository";
import { seedAccounts } from "@/data/seed";
import { Avatar, Panel, Pill, EmptyState } from "@/components/app/bits";
import { ActivityList } from "@/components/app/ActivityList";
import { CoverageCell, CoverageLegend } from "@/components/app/CoverageCell";
import { useQuickCreate } from "@/components/app/QuickCreate";
import { FileLink, FolderButton } from "@/components/app/ClientFiles";
import { SERVICE_COLUMNS } from "@/lib/constants";
import { fmtDate, money } from "@/lib/format";
import { nextBestServices } from "@/lib/insights";

export const Route = createFileRoute("/accounts/$id")({
  head: ({ params }) => {
    const name = seedAccounts.find((a) => a.id === params.id)?.name ?? "Account";
    return { meta: [
      { title: `${name} · Client 360 · Apex Growth OS` }, { name: "description", content: `Client 360 view for ${name}.` },
      { property: "og:title", content: `${name} · Client 360` }, { property: "og:description", content: `Client 360 view for ${name}.` },
      { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" },
    ] };
  },
  component: Client360,
  notFoundComponent: () => <EmptyState title="Account not found" action={<Link to="/accounts" className="text-primary">Back to accounts</Link>} />,
});

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return <div className="flex justify-between gap-3 border-t py-1.5 text-[13px] first:border-0"><span className="text-muted-foreground">{k}</span><span className="text-right">{v}</span></div>;
}

function Client360() {
  const { id } = Route.useParams();
  const db = useDB();
  const create = useQuickCreate();
  const a = byId(db.accounts, id);
  if (!a) throw notFound();
  const acts = db.activities.filter((x) => x.accountId === a.id).sort((x, y) => y.due.localeCompare(x.due));
  const leads = db.leads.filter((l) => l.accountId === a.id);
  const projects = db.projects.filter((p) => p.accountId === a.id);
  const contacts = db.contacts.filter((c) => c.accountId === a.id || c.id === a.sourcePartnerId);
  const partner = byId(db.contacts, a.sourcePartnerId);
  const nbs = nextBestServices(a);
  const won = leads.filter((l) => l.stage === "Won").reduce((s, l) => s + l.value, 0);
  const open = leads.filter((l) => !["Won", "Lost"].includes(l.stage)).reduce((s, l) => s + l.value, 0);

  return (
    <>
      <Link to="/accounts" className="mb-3 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"><ArrowLeft className="size-3.5" /> Accounts</Link>
      <div className="panel mb-4 flex flex-col gap-3 p-4 lg:flex-row lg:items-center">
        <Avatar name={a.name} className="size-12 text-base" />
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-semibold">{a.name}</h1>
            <Pill>{a.relationship}</Pill><Pill>{a.stage}</Pill><Pill>{a.priority}</Pill>
          </div>
          <div className="mt-1 text-[13px] text-muted-foreground">{a.kind} · {a.industry} · {a.city} · Owner {a.owner} · Source {partner ? `${partner.name} (referral)` : a.source}</div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => create("activity")}><Plus /> Activity</Button>
          <Button size="sm" variant="outline" onClick={() => create("lead")}><Plus /> Opportunity</Button>
          <Button size="sm" asChild><Link to="/copilot" search={{ q: `What should I pitch ${a.name.split(" ")[0]} next?` }}><Bot /> Ask Apex</Link></Button>
        </div>
      </div>

      <div className="grid gap-3 xl:grid-cols-3">
        <div className="space-y-3 xl:col-span-2">
          <Panel title="Service coverage" action={<span className="text-[11px] text-muted-foreground">Unverified items marked Needs Review</span>}>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              {SERVICE_COLUMNS.map((c) => (
                <div key={c.key} className="rounded-md border p-2">
                  <div className="mb-1.5 text-[11px] text-muted-foreground">{c.label}</div>
                  <CoverageCell status={a.coverage[c.key]} full />
                </div>
              ))}
            </div>
            <div className="mt-3"><CoverageLegend /></div>
          </Panel>
          <Tabs defaultValue="timeline">
            <TabsList><TabsTrigger value="timeline">Timeline</TabsTrigger><TabsTrigger value="opps">Opportunities ({leads.length})</TabsTrigger><TabsTrigger value="projects">Projects ({projects.length})</TabsTrigger><TabsTrigger value="notes">Notes</TabsTrigger></TabsList>
            <TabsContent value="timeline"><Panel><ActivityList items={acts} emptyTitle="No activity yet" /></Panel></TabsContent>
            <TabsContent value="opps"><Panel>{leads.length ? (
              <ul className="divide-y">{leads.map((l) => (
                <li key={l.id} className="flex items-center justify-between gap-2 py-2 text-[13px]"><div><div className="font-medium">{l.title}</div><div className="text-[11px] text-muted-foreground">Next: {l.nextAction} · {fmtDate(l.due)}</div></div><div className="flex items-center gap-2"><span className="num">{money(l.value)}</span><Pill>{l.stage}</Pill></div></li>
              ))}</ul>) : <EmptyState title="No opportunities" />}</Panel></TabsContent>
            <TabsContent value="projects"><Panel>{projects.length ? (
              <div className="grid gap-2 sm:grid-cols-2">{projects.map((p) => (
                <div key={p.id} className="rounded-md border p-3"><div className="flex justify-between"><span className="font-medium">{p.name}</span><Pill>{p.status}</Pill></div>
                  <ul className="mt-2 list-inside list-disc text-[12px] text-muted-foreground">{p.deliverables.map((d) => <li key={d}>{d}</li>)}</ul></div>
              ))}</div>) : <EmptyState title="No projects yet" />}</Panel></TabsContent>
            <TabsContent value="notes"><Panel><p className="text-[13px] leading-relaxed">{a.notes || "No notes."}</p></Panel></TabsContent>
          </Tabs>
        </div>
        <div className="space-y-3">
          <Panel title={<span className="flex items-center gap-1.5"><Lightbulb className="size-4 text-warning" /> Next-best services</span>}>
            <p className="mb-2 text-[11px] text-muted-foreground">Hypotheses only — validate with the client before pitching.</p>
            {nbs.length ? <ul className="space-y-2">{nbs.map((n) => (
              <li key={n.key} className="rounded-md border p-2"><div className="flex items-center justify-between"><span className="text-[13px] font-medium">{n.label}</span><Pill>{n.status === "Opportunity" ? "Needs Review" : n.status}</Pill></div><div className="mt-0.5 text-[11px] text-muted-foreground">{n.reason}</div></li>
            ))}</ul> : <EmptyState title="No open hypotheses" />}
          </Panel>
          {(a.folderUrl || a.files?.length) && (
            <Panel title="Files & Documents" action={a.folderUrl ? <FolderButton url={a.folderUrl} /> : undefined}>
              {a.files?.length ? <div className="space-y-2">{a.files.map((f) => <FileLink key={f.url} file={f} />)}</div> : <EmptyState title="No files listed" />}
            </Panel>
          )}
          <Panel title="Commercial summary">
            <Row k="Estimated value" v={<span className="num">{money(a.estValue)}</span>} />
            <Row k="Won to date" v={<span className="num">{money(won)}</span>} />
            <Row k="Open pipeline" v={<span className="num">{money(open)}</span>} />
            <Row k="Recurring potential" v={<span className="num">{money(a.recurringPotential)}/mo</span>} />
            <Row k="Delivered" v={a.servicesDelivered.join(", ") || "—"} />
            <Row k="Under evaluation" v={a.servicesEvaluating.join(", ") || "—"} />
            <Row k="Last contact" v={fmtDate(a.lastContact)} />
            <Row k="Next action" v={a.nextAction} />
          </Panel>
          <Panel title="Contacts">
            {contacts.length ? <ul className="space-y-2">{contacts.map((c) => (
              <li key={c.id} className="flex items-center gap-2"><Avatar name={c.name} /><div className="flex-1 text-[13px]"><div className="font-medium">{c.name}</div><div className="text-[11px] text-muted-foreground">{c.role}</div></div>{c.isReferralPartner && <Pill tone="primary">Referrer</Pill>}</li>
            ))}</ul> : <EmptyState title="No contacts linked" />}
          </Panel>
        </div>
      </div>
    </>
  );
}
