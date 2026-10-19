import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader, Panel, Pill, EmptyState } from "@/components/app/bits";
import { ProjectForm } from "@/components/app/ProjectForm";
import { ProgressCell, SafeLink, fmtUpdated } from "@/components/app/ProjectBits";
import { byId, useDB } from "@/data/repository";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/_authenticated/projects/")({
  head: pageHead("Projects", "Project master and delivery tracker."),
  component: ProjectsPage,
});

function ProjectsPage() {
  const db = useDB();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [open, setOpen] = useState(false);
  const rows = useMemo(() => {
    const t = q.toLowerCase();
    return db.projects.filter((p) => {
      const acc = byId(db.accounts, p.accountId)?.name ?? "";
      return (!status || p.status === status) && (!t || `${p.name} ${acc} ${p.nextAction ?? ""}`.toLowerCase().includes(t));
    });
  }, [db, q, status]);

  return (
    <div>
      <PageHeader eyebrow="Delivery" title="Projects" subtitle="Project master — status, progress and links for every delivery."
        actions={<Button size="sm" onClick={() => setOpen(true)}><Plus /> New project</Button>} />
      <div className="mb-3 flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input aria-label="Search projects" className="pl-8" placeholder="Search project, client, next action…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <select aria-label="Filter by status" className="h-9 rounded-md border bg-background px-2 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          {["Proposed", "In Progress", "On Hold", "Delivered"].map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
      <Panel bodyClass="p-0">
        {rows.length === 0 ? (
          <EmptyState title={db.projects.length ? "No projects match" : "No projects yet"} hint={db.projects.length ? "Try a different search or status." : "Create your first project to start tracking delivery."}
            action={!db.projects.length ? <Button size="sm" onClick={() => setOpen(true)}><Plus /> New project</Button> : undefined} />
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-[13px]">
                <thead className="border-b bg-muted/40 text-left text-[11px] uppercase tracking-wide text-muted-foreground">
                  <tr>{["Project", "Client", "Status", "Progress", "Priority", "Next action", "Updated", "Dev", "Live"].map((h) => <th key={h} className="px-3 py-2 font-medium">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {rows.map((p) => (
                    <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="px-3 py-2 font-medium"><Link to="/projects/$id" params={{ id: p.id }} className="hover:underline">{p.name}</Link></td>
                      <td className="px-3 py-2">{byId(db.accounts, p.accountId)?.name ?? <span className="text-muted-foreground">—</span>}</td>
                      <td className="px-3 py-2"><Pill>{p.status}</Pill></td>
                      <td className="px-3 py-2"><ProgressCell value={p.progress} /></td>
                      <td className="px-3 py-2">{p.priority ? <Pill>{p.priority}</Pill> : "—"}</td>
                      <td className="max-w-[220px] truncate px-3 py-2">{p.nextAction ?? "—"}</td>
                      <td className="whitespace-nowrap px-3 py-2">{fmtUpdated(p.updatedAt)}</td>
                      <td className="max-w-[140px] px-3 py-2"><SafeLink url={p.devUrl} label="Open" /></td>
                      <td className="max-w-[140px] px-3 py-2"><SafeLink url={p.liveUrl} label="Open" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ul className="divide-y md:hidden">
              {rows.map((p) => (
                <li key={p.id}>
                  <Link to="/projects/$id" params={{ id: p.id }} className="block space-y-1.5 p-3">
                    <div className="flex items-start justify-between gap-2"><span className="font-medium">{p.name}</span><Pill>{p.status}</Pill></div>
                    <div className="text-[12px] text-muted-foreground">{byId(db.accounts, p.accountId)?.name ?? "Not linked"} · Updated {fmtUpdated(p.updatedAt)}</div>
                    <ProgressCell value={p.progress} />
                    {p.nextAction && <div className="text-[12px]">Next: {p.nextAction}</div>}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </Panel>
      <ProjectForm open={open} onOpenChange={setOpen} />
    </div>
  );
}
