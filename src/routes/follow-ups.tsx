import { createFileRoute } from "@tanstack/react-router";
import { ActivitiesPage } from "@/components/app/ActivitiesPage";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/follow-ups")({
  head: pageHead("Follow-ups", "Calls, emails, WhatsApp and proposal follow-ups."),
  component: () => <ActivitiesPage title="Follow-ups" subtitle="Calls, emails, WhatsApp messages and proposal chasers."
    filter={(a) => ["call", "email", "whatsapp", "proposal"].includes(a.type)} />,
});
