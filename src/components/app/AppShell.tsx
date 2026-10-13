import { useEffect, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Plus, Search, Command, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { NAV } from "./nav";
import { CommandPalette } from "./CommandPalette";
import { QuickCreateProvider, useQuickCreate } from "./QuickCreate";

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (to: string) => (to === "/" ? path === "/" : path.startsWith(to));
  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-14 items-center gap-2.5 border-b border-sidebar-border px-4">
        <div className="flex size-8 items-center justify-center rounded-md bg-sidebar-primary text-sm font-bold text-sidebar-primary-foreground">A</div>
        <div className="leading-tight">
          <div className="text-sm font-semibold">Apex Growth OS</div>
          <div className="text-[11px] text-sidebar-muted">Apex Engineering · Internal</div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {NAV.map((g, i) => (
          <div key={i} className="mb-3">
            {g.label && <div className="px-2 pb-1 text-[10.5px] font-semibold uppercase tracking-wider text-sidebar-muted">{g.label}</div>}
            {g.items.map((it) => (
              <Link key={it.to} to={it.to} onClick={onNavigate}
                className={cn("flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[13px] transition-colors",
                  isActive(it.to) ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground" : "text-sidebar-foreground/85 hover:bg-sidebar-accent/60")}>
                <it.icon className={cn("size-4 shrink-0", isActive(it.to) ? "text-sidebar-primary" : "text-sidebar-foreground/80")} />
                {it.label}
              </Link>
            ))}
          </div>
        ))}
      </nav>
      <div className="border-t border-sidebar-border p-3 text-[11px] text-sidebar-muted">
        <div className="flex items-center gap-1.5"><ShieldAlert className="size-3.5" /> Operational snapshot • Updated 13 Oct 2026 • Backend sync pending</div>
      </div>
    </div>
  );
}

function TopBar({ onMenu, onSearch }: { onMenu: () => void; onSearch: () => void }) {
  const create = useQuickCreate();
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b bg-card/95 px-3 backdrop-blur md:px-5">
      <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenu} aria-label="Open menu"><Menu /></Button>
      <button onClick={onSearch} className="flex h-9 flex-1 items-center gap-2 rounded-md border bg-background px-3 text-left text-[13px] text-muted-foreground hover:border-ring md:max-w-md">
        <Search className="size-4" /> <span className="flex-1 truncate">Search accounts, pages, actions…</span>
        <kbd className="hidden items-center gap-0.5 rounded border bg-card px-1.5 text-[10px] sm:flex"><Command className="size-3" />K</kbd>
      </button>
      <div className="ml-auto flex items-center gap-2">
        <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex"><Link to="/copilot">Ask Apex</Link></Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button size="sm"><Plus /> <span className="hidden sm:inline">Create</span></Button></DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => create("lead")}>New lead</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => create("account")}>New account</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => create("activity")}>Log activity</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => create("campaign")}>New campaign</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <span className="flex size-8 items-center justify-center rounded-full bg-secondary text-xs font-semibold">AP</span>
      </div>
    </header>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [mobile, setMobile] = useState(false);
  const [cmd, setCmd] = useState(false);
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setCmd((v) => !v); } };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);
  return (
    <QuickCreateProvider>
      <div className="flex min-h-screen">
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 md:block"><SidebarNav /></aside>
        <Sheet open={mobile} onOpenChange={setMobile}>
          <SheetContent side="left" className="w-64 border-0 p-0">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <SidebarNav onNavigate={() => setMobile(false)} />
          </SheetContent>
        </Sheet>
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar onMenu={() => setMobile(true)} onSearch={() => setCmd(true)} />
          <main className="flex-1 p-3 md:p-5">{children}</main>
        </div>
      </div>
      <CommandPalette open={cmd} onOpenChange={setCmd} />
    </QuickCreateProvider>
  );
}
