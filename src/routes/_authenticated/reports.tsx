import { createFileRoute } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { toast } from "sonner";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDB } from "@/data/repository";
import { PageHeader, Panel } from "@/components/app/bits";
import { LEAD_STAGES, SERVICE_COLUMNS } from "@/lib/constants";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/_authenticated/reports")({
  head: pageHead("Reports", "Pipeline, source attribution and coverage reporting."),
  component: Reports,
});

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

function Reports() {
  const db = useDB();
  const byStage = LEAD_STAGES.map((s) => ({ s, v: db.leads.filter((l) => l.stage === s).reduce((t, l) => t + l.value, 0) / 1000 }));
  const sources = Object.entries(db.leads.reduce<Record<string, number>>((m, l) => ({ ...m, [l.source]: (m[l.source] ?? 0) + l.value }), {})).map(([name, value]) => ({ name, value }));
  const cov = SERVICE_COLUMNS.map((c) => ({ s: c.short, covered: db.accounts.filter((a) => ["Active", "Delivered"].includes(a.coverage[c.key])).length, review: db.accounts.filter((a) => ["Needs Review", "Opportunity"].includes(a.coverage[c.key])).length }));
  return (
    <>
      <PageHeader eyebrow="Insights" title="Reports" subtitle="Calculated from demo CRM data."
        actions={<Button size="sm" variant="outline" onClick={() => toast.info("Export available after database connection")}><Download /> Export</Button>} />
      <div className="grid gap-3 lg:grid-cols-2">
        <Panel title="Pipeline value by stage (₹k)">
          <div className="h-64"><ResponsiveContainer><BarChart data={byStage}><CartesianGrid strokeDasharray="3 3" stroke="var(--border)" /><XAxis dataKey="s" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="v" fill="var(--chart-1)" radius={[3, 3, 0, 0]} /></BarChart></ResponsiveContainer></div>
        </Panel>
        <Panel title="Value by source">
          <div className="h-64"><ResponsiveContainer><PieChart><Pie data={sources} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} label={(e) => e.name}>{sources.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></div>
        </Panel>
        <Panel title="Service coverage vs. needs review" className="lg:col-span-2">
          <div className="h-64"><ResponsiveContainer><BarChart data={cov}><CartesianGrid strokeDasharray="3 3" stroke="var(--border)" /><XAxis dataKey="s" fontSize={11} /><YAxis allowDecimals={false} fontSize={11} /><Tooltip /><Bar dataKey="covered" stackId="a" fill="var(--chart-2)" /><Bar dataKey="review" stackId="a" fill="var(--chart-3)" /></BarChart></ResponsiveContainer></div>
        </Panel>
      </div>
    </>
  );
}
