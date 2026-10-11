<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture rules
- UI reads/writes data only via `src/data/repository.ts` (`repo` + `useDB`); swap its internals for external Supabase later without touching pages.
- Copilot UI calls only `askCopilot` in `src/services/copilot.ts`; replace its body with a backend AI endpoint returning the same `CopilotReply` shape.
- External actions (email, WhatsApp, etc.) must always pass through a confirmation dialog and never execute in demo mode.
- No Lovable Cloud, API keys or stored credentials in this app until auth/RLS exists.
