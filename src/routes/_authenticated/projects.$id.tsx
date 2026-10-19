import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { PageHeader, Panel, Pill, EmptyState } from "@/components/app/bits";
import { ProjectForm } from "@/components/app/ProjectForm";
import { ProgressCell, SafeLink, fmtUpdated } from "@/components/app/ProjectBits";
import { byId, repo, useDB } from "@/data/repository";
import { milestoneSummary } from "@/lib/projects";
import { pageHead } from "@/lib/seo";
import type { Project } from "@/lib/types";

export const Route = createFileRoute("/_authenticated/projects/$id")({
  head: pageHead("Project", "Project delivery detail."),
  component: ProjectDetail,
});

function ProjectDetail() {
  const { id } = Route.useParams();
  const db = useDB();
  const p = byId(db.projects, id);
  const [edit, setEdit] = useState(false);
  const [ms, setMs] = useState("");
  if (!p) return <EmptyState title="Project not found" action={<Button asChild size="sm" variant="outline"><Link to="/projects">Back to projects</Link></Button>} />;
  const acc = byId(db.accounts, p.accountId);
  const save = (patch: Partial<Project>) => repo.saveProject({ ...p, ...patch });
  const milestones = p.milestones ?? [];

  return (
    <div className="space-y-4">
      <Link to="/projects" className="inline-flex items-center gap-1 text-[12px] text-muted-foreground hover:text-foreground"><ArrowLeft className="size-3.5" /> Projects</Link>
      <PageHeader eyebrow={acc?.name ?? "Not linked to an account"} title={p.name}
        actions={<Button size="sm" variant="outline" onClick={() => setEdit(true)}><Pencil /> Edit</Button>} />
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Overview" className="lg:col-span-1">
          <dl className="grid grid-cols-[110px_1fr] gap-y-2 text-[13px]">
            <dt className="text-muted-foreground">Status</dt><dd><Pill>{p.status}</Pill></dd>
            <dt className="text-muted-foreground">Priority</dt><dd>{p.priority ? <Pill>{p.priority}</Pill> : "—"}</dd>
            <dt className="text-muted-foreground">Progress</dt><dd><ProgressCell value={p.progress} /><div className="text-[11px] text-muted-foreground">Manual · {milestoneSummary(milestones)}</div></dd>
            <dt className="text-muted-foreground">Client</dt><dd>{acc ? <Link to="/accounts/$id" params={{ id: acc.id }} className="text-primary hover:underline">{acc.name}</Link> : "—"}</dd>
            <dt className="text-muted-foreground">Next action</dt><dd>{p.nextAction ?? "—"}</dd>
            <dt className="text-muted-foreground">Updated</dt><dd>{fmtUpdated(p.updatedAt)}</dd>
            <dt className="text-muted-foreground">Dev URL</dt><dd className="min-w-0"><SafeLink url={p.devUrl} /></dd>
            <dt className="text-muted-foreground">Live URL</dt><dd className="min-w-0"><SafeLink url={p.liveUrl} /></dd>
          </dl>
        </Panel>
        <Panel title="Milestones & tasks" className="lg:col-span-2">
          <form className="mb-3 flex gap-2" onSubmit={(e) => {
            e.preventDefault();
            if (!ms.trim()) return;
            save({ milestones: [...milestones, { id: Math.random().toString(36).slice(2, 8), label: ms.trim(), done: false }] });
            setMs("");
          }}>
            <Input aria-label="New milestone" placeholder="Add milestone or task…" value={ms} onChange={(e) => setMs(e.target.value)} />
            <Button type="submit" size="sm"><Plus /> Add</Button>
          </form>
          {milestones.length === 0 ? <p className="text-[13px] text-muted-foreground">No milestones yet.</p> : (
            <ul className="divide-y">
              {milestones.map((m) => (
                <li key={m.id} className="flex items-center gap-2 py-2 text-[13px]">
                  <Checkbox checked={m.done} aria-label={`Mark ${m.label} done`} onCheckedChange={() => save({ milestones: milestones.map((x) => x.id === m.id ? { ...x, done: !x.done } : x) })} />
                  <span className={m.done ? "flex-1 text-muted-foreground line-through" : "flex-1"}>{m.label}</span>
                  <Button size="icon" variant="ghost" aria-label={`Remove ${m.label}`} onClick={() => save({ milestones: milestones.filter((x) => x.id !== m.id) })}><Trash2 className="size-3.5" /></Button>
                </li>
              ))}
            </ul>
          )}
          {p.deliverables.length > 0 && (
            <div className="mt-4">
              <div className="eyebrow mb-1">Recorded deliverables</div>
              <ul className="list-disc space-y-0.5 pl-5 text-[13px]">{p.deliverables.map((d) => <li key={d}>{d}</li>)}</ul>
            </div>
          )}
        </Panel>
        <Panel title="Notes" className="lg:col-span-3">
          <p className="whitespace-pre-wrap text-[13px]">{p.notes || <span className="text-muted-foreground">No notes. Use Edit to add.</span>}</p>
        </Panel>
      </div>
      <ProjectForm open={edit} onOpenChange={setEdit} project={p} />
    </div>
  );
}
