import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/app/AppShell";
import { repo } from "@/data/repository";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/auth", search: { redirect: location.href } });
    return { user: data.user };
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { user } = Route.useRouteContext();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  useEffect(() => {
    let alive = true;
    supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle()
      .then(({ data }) => { if (!alive) return; setIsAdmin(!!data); if (data) void repo.load(); });
    return () => { alive = false; };
  }, [user.id]);

  if (isAdmin === false) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="panel max-w-sm p-5 text-center">
          <h1 className="text-base font-semibold">No owner access</h1>
          <p className="mt-1 text-sm text-muted-foreground">Signed in as {user.email}, but this account is not the Apex owner/admin.</p>
          <Button className="mt-4" variant="outline" onClick={() => supabase.auth.signOut()}>Sign out</Button>
        </div>
      </div>
    );
  }
  return <AppShell userEmail={user.email ?? ""}><Outlet /></AppShell>;
}
