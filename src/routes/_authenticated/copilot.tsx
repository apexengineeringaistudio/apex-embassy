import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Bot, Send, ExternalLink, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { repo, useDB } from "@/data/repository";
import { Pill } from "@/components/app/bits";
import { askCopilot, SUGGESTIONS, type CopilotAction, type CopilotReply } from "@/services/copilot";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/_authenticated/copilot")({
  validateSearch: (s: Record<string, unknown>): { q?: string } => (typeof s["q"] === "string" ? { q: s["q"] } : {}),
  head: pageHead("Apex Copilot", "Internal AI copilot for follow-ups, pitches and drafts."),
  component: Copilot,
});

type Msg = { role: "user"; text: string } | { role: "assistant"; reply: CopilotReply };

function Copilot() {
  const { q } = Route.useSearch();
  const db = useDB();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState<CopilotAction | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const sentQ = useRef<string | undefined>(undefined);

  const send = async (text: string) => {
    if (!text.trim() || busy) return;
    setMsgs((m) => [...m, { role: "user", text }]);
    setInput("");
    setBusy(true);
    const reply = await askCopilot(text, repo.snapshot());
    setMsgs((m) => [...m, { role: "assistant", reply }]);
    setBusy(false);
  };

  useEffect(() => { if (q && sentQ.current !== q) { sentQ.current = q; send(q); } }, [q]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, busy]);

  const act = (a: CopilotAction, body?: string) => {
    if (a.external) return setConfirm(a);
    if (a.label.startsWith("Copy") && body) navigator.clipboard?.writeText(body);
    toast.success(a.label, { description: "Done in demo data (internal action)." });
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-6.5rem)] max-w-4xl flex-col">
      <div className="mb-3 flex items-center gap-2.5">
        <span className="flex size-9 items-center justify-center rounded-md bg-sidebar text-sidebar-primary"><Bot className="size-5" /></span>
        <div className="flex-1"><h1 className="text-lg font-semibold">Apex Copilot</h1><div className="text-[12px] text-muted-foreground">Ask about accounts, pipeline and next actions. {db.accounts.length} accounts in context.</div></div>
        <Pill tone="warning">Demo mode — AI not connected</Pill>
      </div>

      <div className="panel flex-1 overflow-y-auto p-4">
        {msgs.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <Bot className="mb-2 size-8 text-primary" />
            <div className="font-semibold">What do you need today?</div>
            <div className="mb-4 text-[12px] text-muted-foreground">External actions always require your confirmation. Nothing is ever sent in demo mode.</div>
            <div className="flex max-w-xl flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((s) => <button key={s} onClick={() => send(s)} className="rounded-full border bg-background px-3 py-1.5 text-[12px] hover:border-primary">{s}</button>)}
            </div>
          </div>
        )}
        <div className="space-y-4">
          {msgs.map((m, i) => m.role === "user" ? (
            <div key={i} className="flex justify-end gap-2"><div className="max-w-[80%] rounded-lg bg-sidebar px-3 py-2 text-[13px] text-sidebar-foreground">{m.text}</div><User className="mt-1.5 size-4 text-muted-foreground" /></div>
          ) : (
            <div key={i} className="flex gap-2">
              <Bot className="mt-0.5 size-4 shrink-0 text-primary" />
              <div className="min-w-0 flex-1 space-y-2">
                <p className="text-[13px]">{m.reply.text}</p>
                {m.reply.cards.map((c, j) => (
                  <div key={j} className="rounded-md border bg-background">
                    <div className="border-b px-3 py-2 text-[12px] font-semibold">{c.title}</div>
                    <div className="p-3">
                      {c.items && (c.items.length ? <ul className="divide-y">{c.items.map((it, k) => (
                        <li key={k} className="flex items-center justify-between gap-2 py-1.5 text-[13px]"><div className="min-w-0"><div className="truncate">{it.primary}</div>{it.secondary && <div className="truncate text-[11px] text-muted-foreground">{it.secondary}</div>}</div>{it.tag && <Pill tone={it.tag === "Overdue" ? "danger" : undefined}>{it.tag}</Pill>}</li>
                      ))}</ul> : <div className="text-[12px] text-muted-foreground">No matches.</div>)}
                      {c.body && <pre className="whitespace-pre-wrap font-sans text-[13px] leading-relaxed">{c.body}</pre>}
                    </div>
                    {c.actions && <div className="flex flex-wrap gap-2 border-t px-3 py-2">{c.actions.map((a) => (
                      <Button key={a.label} size="sm" variant={a.external ? "outline" : "secondary"} onClick={() => act(a, c.body)}>{a.external && <ExternalLink />} {a.label}</Button>
                    ))}</div>}
                  </div>
                ))}
              </div>
            </div>
          ))}
          {busy && <div className="flex items-center gap-2 text-[12px] text-muted-foreground"><Bot className="size-4 animate-pulse text-primary" /> Thinking…</div>}
          <div ref={endRef} />
        </div>
      </div>

      <form className="panel mt-3 flex items-end gap-2 p-2" onSubmit={(e) => { e.preventDefault(); send(input); }}>
        <Textarea value={input} onChange={(e) => setInput(e.target.value)} rows={2} placeholder="Ask Apex…" className="min-h-0 resize-none border-0 shadow-none focus-visible:ring-0"
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }} />
        <Button type="submit" size="icon" disabled={busy || !input.trim()} aria-label="Send"><Send /></Button>
      </form>

      <AlertDialog open={!!confirm} onOpenChange={(o) => !o && setConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm external action</AlertDialogTitle>
            <AlertDialogDescription>{confirm?.label}. {confirm?.detail} In demo mode nothing will actually be sent.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => toast.info("Not sent — demo mode", { description: "Connect Apex Gmail / WhatsApp later to enable." })}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
