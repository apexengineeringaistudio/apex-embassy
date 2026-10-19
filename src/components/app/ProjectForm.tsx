import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { repo, useDB } from "@/data/repository";
import type { Priority, Project } from "@/lib/types";
import { isValidUrl, parseProgress } from "@/lib/projects";

const STATUSES: Project["status"][] = ["Proposed", "In Progress", "On Hold", "Delivered"];
const PRIORITIES: Priority[] = ["High", "Medium", "Low"];
const sel = "h-9 w-full rounded-md border bg-background px-2 text-sm";

export function ProjectForm({ open, onOpenChange, project, onSaved }: {
  open: boolean; onOpenChange: (v: boolean) => void; project?: Project; onSaved?: (p: Project) => void;
}) {
  const db = useDB();
  const blank = { name: "", accountId: "", status: "Proposed" as Project["status"], priority: "" as Priority | "", progress: "", nextAction: "", devUrl: "", liveUrl: "", notes: "" };
  const [f, setF] = useState(blank);
  const [err, setErr] = useState<Record<string, string>>({});
  useEffect(() => {
    if (!open) return;
    setErr({});
    setF(project ? {
      name: project.name, accountId: project.accountId ?? "", status: project.status, priority: project.priority ?? "",
      progress: project.progress == null ? "" : String(project.progress), nextAction: project.nextAction ?? "",
      devUrl: project.devUrl ?? "", liveUrl: project.liveUrl ?? "", notes: project.notes ?? "",
    } : blank);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, project]);
  const up = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((s) => ({ ...s, [k]: e.target.value }));

  const submit = () => {
    const e: { [k: string]: string } = {};
    if (!f.name.trim()) e["name"] = "Project name is required";
    if (!isValidUrl(f.devUrl)) e["devUrl"] = "Enter a full URL starting with https://";
    if (!isValidUrl(f.liveUrl)) e["liveUrl"] = "Enter a full URL starting with https://";
    if (f.progress.trim() && !Number.isFinite(Number(f.progress))) e["progress"] = "Enter a number 0–100";
    setErr(e);
    if (Object.keys(e).length) return;
    const saved = repo.saveProject({
      ...(project ?? { deliverables: [], milestones: [] }),
      id: project?.id,
      name: f.name.trim(), accountId: f.accountId, status: f.status,
      priority: f.priority || undefined, progress: parseProgress(f.progress),
      nextAction: f.nextAction.trim() || undefined, devUrl: f.devUrl.trim() || undefined,
      liveUrl: f.liveUrl.trim() || undefined, notes: f.notes.trim() || undefined,
    } as Omit<Project, "id"> & { id?: string });
    toast.success(project ? "Project updated" : "Project created");
    onOpenChange(false);
    onSaved?.(saved);
  };

  const field = (k: string, label: string, node: React.ReactNode) => (
    <div className="space-y-1">
      <Label htmlFor={`pf-${k}`} className="text-xs">{label}</Label>
      {node}
      {err[k] && <p className="text-[11px] text-destructive">{err[k]}</p>}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader><DialogTitle>{project ? "Edit project" : "New project"}</DialogTitle></DialogHeader>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">{field("name", "Project name *", <Input id="pf-name" value={f.name} onChange={up("name")} />)}</div>
          {field("accountId", "Client / account", (
            <select id="pf-accountId" className={sel} value={f.accountId} onChange={up("accountId")}>
              <option value="">— Not linked —</option>
              {[...db.accounts].sort((a, b) => a.name.localeCompare(b.name)).map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          ))}
          {field("status", "Status", (
            <select id="pf-status" className={sel} value={f.status} onChange={up("status")}>
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          ))}
          {field("priority", "Priority", (
            <select id="pf-priority" className={sel} value={f.priority} onChange={up("priority")}>
              <option value="">— Not set —</option>
              {PRIORITIES.map((s) => <option key={s}>{s}</option>)}
            </select>
          ))}
          {field("progress", "Progress % (manual, blank = not assessed)", <Input id="pf-progress" inputMode="numeric" value={f.progress} onChange={up("progress")} placeholder="e.g. 40" />)}
          <div className="sm:col-span-2">{field("nextAction", "Next action", <Input id="pf-nextAction" value={f.nextAction} onChange={up("nextAction")} />)}</div>
          {field("devUrl", "Development URL", <Input id="pf-devUrl" type="url" value={f.devUrl} onChange={up("devUrl")} placeholder="https://" />)}
          {field("liveUrl", "Live URL", <Input id="pf-liveUrl" type="url" value={f.liveUrl} onChange={up("liveUrl")} placeholder="https://" />)}
          <div className="sm:col-span-2">{field("notes", "Notes", <Textarea id="pf-notes" rows={3} value={f.notes} onChange={up("notes")} />)}</div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit}>{project ? "Save changes" : "Create project"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
