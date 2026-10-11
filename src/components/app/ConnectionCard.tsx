import type { ReactNode } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Pill } from "./bits";

export function ConnectionCard({ name, desc, status = "Not configured", icon, note }: { name: string; desc: string; status?: "Not configured" | "Planned" | "Not connected"; icon: ReactNode; note?: string }) {
  return (
    <div className="panel flex flex-col p-3">
      <div className="flex items-start gap-2.5">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">{icon}</span>
        <div className="flex-1"><div className="font-semibold">{name}</div><div className="text-[12px] text-muted-foreground">{desc}</div></div>
        <Pill tone={status === "Planned" ? "info" : "neutral"}>{status}</Pill>
      </div>
      {note && <div className="mt-2 rounded bg-muted px-2 py-1.5 text-[11px] text-muted-foreground">{note}</div>}
      <div className="mt-3 flex gap-2">
        <Button size="sm" variant="outline" onClick={() => toast.info(`${name}: connect later`, { description: "Connections require authentication and secure backend setup first." })}>Connect later</Button>
      </div>
    </div>
  );
}
