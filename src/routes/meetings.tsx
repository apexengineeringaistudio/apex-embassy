import { createFileRoute } from "@tanstack/react-router";
import { ActivitiesPage } from "@/components/app/ActivitiesPage";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/meetings")({
  head: pageHead("Meetings", "Client and prospect meetings."),
  component: () => <ActivitiesPage title="Meetings" subtitle="Calendar sync is planned — see Connections." filter={(a) => a.type === "meeting"} />,
});
