import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader, Panel, Pill } from "@/components/app/bits";
import { LEAD_STAGES, SERVICE_CATALOG } from "@/lib/constants";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/_authenticated/settings")({
  head: pageHead("Settings", "Users, business profile, catalog, stages and notifications."),
  component: Settings,
});

const save = () => toast.success("Settings saved", { description: "Demo mode — not persisted." });

function Settings() {
  return (
    <>
      <PageHeader eyebrow="Workspace" title="Settings" />
      <div className="mb-4 flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-[13px] text-destructive">
        <ShieldAlert className="mt-0.5 size-4 shrink-0" />
        <div><b>Security:</b> do not import real client data until authentication and row-level access controls are configured. This build runs on demo data only.</div>
      </div>
      <Tabs defaultValue="users">
        <TabsList className="flex-wrap"><TabsTrigger value="users">Users & roles</TabsTrigger><TabsTrigger value="business">Business profile</TabsTrigger><TabsTrigger value="catalog">Service catalog</TabsTrigger><TabsTrigger value="stages">Stages</TabsTrigger><TabsTrigger value="notify">Notifications</TabsTrigger><TabsTrigger value="int">Integrations</TabsTrigger></TabsList>
        <TabsContent value="users"><Panel title="Users & roles">
          {[{ n: "Amar Pawar", r: "Owner" }, { n: "Team Apex", r: "Member (placeholder)" }].map((u) => <div key={u.n} className="flex justify-between border-b py-2 text-[13px] last:border-0"><span>{u.n}</span><Pill tone="neutral">{u.r}</Pill></div>)}
          <Button size="sm" variant="outline" className="mt-3" onClick={() => toast.info("Invites require authentication setup")}>Invite user</Button>
        </Panel></TabsContent>
        <TabsContent value="business"><Panel title="Business profile">
          <div className="grid max-w-xl gap-3 sm:grid-cols-2">
            <div className="space-y-1"><Label className="text-xs">Business name</Label><Input defaultValue="Apex Engineering" /></div>
            <div className="space-y-1"><Label className="text-xs">Currency</Label><Input defaultValue="INR (₹)" /></div>
            <div className="space-y-1"><Label className="text-xs">City</Label><Input defaultValue="Pune" /></div>
            <div className="space-y-1"><Label className="text-xs">Primary email</Label><Input placeholder="Apex Gmail (planned)" /></div>
          </div>
          <Button size="sm" className="mt-3" onClick={save}>Save</Button>
        </Panel></TabsContent>
        <TabsContent value="catalog"><Panel title="Service catalog"><div className="flex flex-wrap gap-1.5">{SERVICE_CATALOG.map((s) => <Pill key={s.name} tone="neutral">{s.name}</Pill>)}</div><Link to="/services" className="mt-3 inline-block text-[13px] text-primary">Open service coverage →</Link></Panel></TabsContent>
        <TabsContent value="stages"><Panel title="Lead stages"><ol className="space-y-1 text-[13px]">{LEAD_STAGES.map((s, i) => <li key={s} className="flex items-center gap-2"><span className="num w-5 text-muted-foreground">{i + 1}</span><Pill>{s}</Pill></li>)}</ol></Panel></TabsContent>
        <TabsContent value="notify"><Panel title="Notification preferences">
          {["Daily priorities digest", "Overdue follow-up alerts", "New referral introduced", "Weekly pipeline summary"].map((n, i) => (
            <div key={n} className="flex items-center justify-between border-b py-2 text-[13px] last:border-0"><span>{n}</span><Switch defaultChecked={i < 2} onCheckedChange={save} /></div>
          ))}
        </Panel></TabsContent>
        <TabsContent value="int"><Panel title="Integrations"><p className="text-[13px] text-muted-foreground">Manage planned integrations on the Connections page.</p><Link to="/connections" className="mt-2 inline-block text-[13px] text-primary">Open connections →</Link></Panel></TabsContent>
      </Tabs>
    </>
  );
}
