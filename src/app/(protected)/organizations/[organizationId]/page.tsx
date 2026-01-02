import ProjectsList from "@/_features/projects/components/projects-list";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";


export default async function OrganizationPage({
  params,
}: { params: Promise<{ organizationId: string }> }) {
  const { organizationId } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/");
  }

  // Verify access
  const userOrganizations = await auth.api.listOrganizations({
    headers: await headers(),
  });

  const currentOrg = userOrganizations.find((org) => org.id === organizationId);

  if (!currentOrg) {
    redirect("/organizations");
  }

  return (
    <div className="py-4 flex flex-col items-center justify-start">
      <div className="flex items-center justify-between mb-8 w-full lg:w-2/3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground mt-1">
            Manage your projects and tasks
          </p>
        </div>
        <Suspense fallback={<Skeleton className="h-10 w-40" />}>
          <Button variant="outline" render={<Link href={`/organizations/${organizationId}/projects/new`} />} nativeButton={false}>
            Create Project
          </Button>
        </Suspense>
      </div>

      <Suspense
        fallback={
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-lg" />
            ))}
          </div>
        }
      >
        <ProjectsList organizationId={organizationId} />
      </Suspense>
    </div>
  );
}
