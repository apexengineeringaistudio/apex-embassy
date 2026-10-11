import { useNavigate } from "@tanstack/react-router";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { Plus, Bot, Building2 } from "lucide-react";
import { useDB } from "@/data/repository";
import { NAV } from "./nav";
import { useQuickCreate } from "./QuickCreate";

export function CommandPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const navigate = useNavigate();
  const create = useQuickCreate();
  const db = useDB();
  const run = (fn: () => void) => { onOpenChange(false); fn(); };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search accounts, pages, or run an action…" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup heading="Quick actions">
          {(["lead", "account", "activity", "campaign"] as const).map((k) => (
            <CommandItem key={k} onSelect={() => run(() => create(k))}><Plus /> New {k}</CommandItem>
          ))}
          <CommandItem onSelect={() => run(() => navigate({ to: "/copilot" }))}><Bot /> Ask Apex Copilot</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Accounts">
          {db.accounts.map((a) => (
            <CommandItem key={a.id} value={`account ${a.name}`} onSelect={() => run(() => navigate({ to: "/accounts/$id", params: { id: a.id } }))}>
              <Building2 /> {a.name}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Go to">
          {NAV.flatMap((g) => g.items).map((i) => (
            <CommandItem key={i.to} value={`page ${i.label}`} onSelect={() => run(() => navigate({ to: i.to }))}>
              <i.icon /> {i.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
