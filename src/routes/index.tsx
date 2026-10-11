import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, BadgeCheck, Target, FileText, IndianRupee, Repeat, AlarmClock, CalendarDays, Bot, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { byId, useDB } from "@/data/repository";
import { Kpi, PageHeader, Panel, Pill } from "@/components/app/bits";
import { ActivityList } from "@/components/app/ActivityList";
import { LEAD_STAGES, TODAY } from "@/lib/constants";
import { daysFromToday, fmtDate, money, moneyShort } from "@/lib/format";
import { nextBestServices } from "@/lib/insights";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: pageHead("Command Center", "Daily overview of accounts, pipeline, follow-ups and growth opportunities."),
  component: CommandCenter,
});

function AskApex() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const go = (prompt: string) => navigate({ to: "/copilot", search: { q: prompt } });
  return (
    <div className="panel mb-4 flex flex-col gap-3 border-primary/30 bg-accent/40 p-3 md:flex-row md:items-center">
      <div className="flex items-center gap-2.5">
        <span className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground"><Bot className="size-5" /></span>
        <div><div className="text-sm font-semibold">Ask Apex</div><div className="text-[11px] text-muted-foreground">Demo mode — AI not connected</div></div>
      </div>
      <form className="flex flex-1 gap-2" onSubmit={(e) => { e.preventDefault(); if (q.trim()) go(q); }}>
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Who needs a follow-up today?" className="h-9 bg-card" />
        <Button type="submit">Ask <ArrowRight /></Button>
      </form>
      <div className="flex flex-wrap gap-1.5">
        {["Who needs a follow-up today?", "Show clients who may need SEO."].map((s) => (
          <button key={s} onClick={() => go(s)} className="rounded-full border bg-card px-2.5 py-1 text-[11px] hover:border-primary">{s}</button>
        ))}
      </div>
    </div>
  );
}

function CommandCenter() {
  const db = useDB();
  const openLeads = db.leads.filter((l) => !["Won", "Lost"].includes(l.stage));
  const proposals = db.leads.filter((l) => ["Proposal", "Negotiation"].includes(l.stage));
  const pipeline = openLeads.reduce((s, l) => s + l.value, 0);
  const openActs = db.activities.filter((a) => !a.completed);
  const overdue = openActs.filter((a) => daysFromToday(a.due) < 0);
  const week = db.activities.filter((a) => { const d = daysFromToday(a.due); return d >= -3 && d <= 3; });
  const recurring = db.accounts.filter((a) => a.relationship === "Client").reduce((s, a) => s + a.recurringPotential, 0);
  const priorities = openActs.filter((a) => daysFromToday(a.due) <= 0).sort((a, b) => a.due.localeCompare(b.due));
  const funnel = LEAD_STAGES.filter((s) => s !== "Lost" && s !== "Nurture").map((s) => {
    const ls = db.leads.filter((l) => l.stage === s);
    return { s, n: ls.length, v: ls.reduce((t, l) => t + l.value, 0) };
  });
  const maxV = Math.max(...funnel.map((f) => f.v), 1);
  const opps = db.accounts.flatMap((a) => nextBestServices(a).slice(0, 2).map((n) => ({ a, n }))).slice(0, 6);
  const partners = db.contacts.filter((c) => c.isReferralPartner).map((p) => {
    const ls = db.leads.filter((l) => l.partnerId === p.id);
    return { p, intro: ls.length, won: ls.filter((l) => l.stage === "Won").length, value: ls.filter((l) => l.stage !== "Lost").reduce((s, l) => s + l.value, 0) };
  });
  const recent = db.activities.filter((a) => a.completed).sort((a, b) => b.due.localeCompare(a.due)).slice(0, 6);

  return (
    <>
      <PageHeader eyebrow={`Today · ${fmtDate(TODAY)} 2026`} title="Command Center" subtitle="Your acquisition and client lifecycle at a glance." />
      <AskApex />
      <div className="mb-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4 xl:grid-cols-8">
        <Kpi label="Accounts" value={db.accounts.length} icon={<Building2 className="size-3.5" />} />
        <Kpi label="Active clients" value={db.accounts.filter((a) => a.relationship === "Client").length} icon={<BadgeCheck className="size-3.5" />} />
        <Kpi label="Open leads" value={openLeads.length} icon={<Target className="size-3.5" />} />
        <Kpi label="Proposals" value={proposals.length} icon={<FileText className="size-3.5" />} />
        <Kpi label="Pipeline" value={moneyShort(pipeline)} icon={<IndianRupee className="size-3.5" />} hint="Open opportunities" />
        <Kpi label="Recurring" value={moneyShort(recurring)} icon={<Repeat className="size-3.5" />} hint="Potential /mo · placeholder" />
        <Kpi label="Overdue" value={<span className={overdue.length ? "text-destructive" : ""}>{overdue.length}</span>} icon={<AlarmClock className="size-3.5" />} hint="Follow-ups" />
        <Kpi label="This week" value={week.length} icon={<CalendarDays className="size-3.5" />} hint="Activities" />
      </div>

      <div className="grid gap-3 xl:grid-cols-3">
        <Panel title="Today's priorities" action={<Link to="/follow-ups" className="text-xs text-primary">All follow-ups</Link>} className="xl:col-span-1">
          <ActivityList items={priorities} compact emptyTitle="You're clear for today" />
        </Panel>
        <Panel title="Sales pipeline" action={<Link to="/pipeline" className="text-xs text-primary">Open board</Link>}>
          <div className="space-y-1.5">
            {funnel.map((f) => (
              <div key={f.s} className="flex items-center gap-2 text-[12px]">
                <span className="w-20 shrink-0 text-muted-foreground">{f.s}</span>
                <div className="h-5 flex-1 rounded bg-muted">
                  <div className="h-5 rounded bg-primary/80" style={{ width: `${Math.max((f.v / maxV) * 100, f.n ? 4 : 0)}%` }} />
                </div>
                <span className="num w-6 text-right">{f.n}</span>
                <span className="num w-14 text-right text-muted-foreground">{moneyShort(f.v)}</span>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Follow-ups due" action={<Pill tone={overdue.length ? "danger" : "neutral"}>{overdue.length} overdue</Pill>}>
          <ActivityList items={openActs.filter((a) => daysFromToday(a.due) <= 3).slice(0, 7)} compact />
        </Panel>
        <Panel title="Growth opportunities" action={<Link to="/services" className="text-xs text-primary">Coverage map</Link>}>
          <p className="mb-2 text-[11px] text-muted-foreground">Hypotheses to validate — not confirmed needs.</p>
          <ul className="divide-y">
            {opps.map(({ a, n }) => (
              <li key={a.id + n.key} className="flex items-center justify-between gap-2 py-1.5 text-[13px]">
                <Link to="/accounts/$id" params={{ id: a.id }} className="truncate hover:text-primary">{a.name}</Link>
                <span className="flex shrink-0 items-center gap-1.5"><span className="text-muted-foreground">{n.label}</span><Pill>{n.status}</Pill></span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Referral performance" action={<Link to="/referrals" className="text-xs text-primary">Partners</Link>}>
          <table className="w-full text-[13px]">
            <thead><tr className="text-left text-[11px] uppercase text-muted-foreground"><th className="pb-1 font-medium">Partner</th><th className="font-medium">Intro</th><th className="font-medium">Won</th><th className="text-right font-medium">Value</th></tr></thead>
            <tbody>{partners.map((r) => (
              <tr key={r.p.id} className="border-t"><td className="py-1.5">{r.p.name}</td><td className="num">{r.intro}</td><td className="num">{r.won}</td><td className="num text-right">{moneyShort(r.value)}</td></tr>
            ))}</tbody>
          </table>
        </Panel>
        <Panel title="Recent activity">
          <ul className="divide-y">
            {recent.map((a) => (
              <li key={a.id} className="flex justify-between gap-2 py-1.5 text-[13px]">
                <span className="truncate">{a.subject}<span className="text-muted-foreground"> · {byId(db.accounts, a.accountId)?.name ?? "Internal"}</span></span>
                <span className="num shrink-0 text-[11px] text-muted-foreground">{fmtDate(a.due)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-2 text-[11px] text-muted-foreground">Total won: {money(db.leads.filter((l) => l.stage === "Won").reduce((s, l) => s + l.value, 0))}</div>
        </Panel>
      </div>
    </>
  );
}
