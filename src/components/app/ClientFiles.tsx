import { ExternalLink, FileText, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AccountFile } from "@/lib/types";
import { fmtDate } from "@/lib/format";
import { Pill } from "./bits";

export function FileLink({ file, sub }: { file: AccountFile; sub?: string }) {
  return (
    <a href={file.url} target="_blank" rel="noopener noreferrer"
      className="group flex items-center gap-2 rounded-md border p-2 text-[13px] transition-colors hover:border-primary">
      <FileText className="size-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0 flex-1">
        <div className="truncate font-medium group-hover:text-primary">{file.title}</div>
        <div className="text-[11px] text-muted-foreground">{sub ? `${sub} · ` : ""}{file.date ? fmtDate(file.date) : "Google Drive"}</div>
      </div>
      <Pill>{file.kind}</Pill>
      <ExternalLink className="size-3.5 shrink-0 text-muted-foreground" />
    </a>
  );
}

export function FolderButton({ url }: { url: string }) {
  return (
    <Button size="sm" variant="outline" asChild>
      <a href={url} target="_blank" rel="noopener noreferrer"><FolderOpen /> Open client folder</a>
    </Button>
  );
}
