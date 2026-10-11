import { createFileRoute } from "@tanstack/react-router";
import { ActivitiesPage } from "@/components/app/ActivitiesPage";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/tasks")({
  head: pageHead("Tasks", "Internal tasks, notes and campaign to-dos."),
  component: () => <ActivitiesPage title="Tasks" subtitle="Internal tasks, notes and campaign work." filter={(a) => ["task", "note", "campaign"].includes(a.type)} />,
});
