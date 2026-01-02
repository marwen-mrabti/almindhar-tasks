import CreateOrganizationForm from "@/_features/organizations/components/create-organization-form";
import OrganizationsList from "@/_features/organizations/components/organizations-list";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default async function OrganizationsPage() {

  return (
    <div className="flex flex-col items-center justify-start py-4 ">
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Organizations</h1>
            <p className="text-muted-foreground mt-1">
              Manage your organizations and switch between workspaces
            </p>
          </div>
          <Suspense fallback={<Skeleton className="h-10 w-40" />}>
            <CreateOrganizationForm />
          </Suspense>
        </div>

        <Suspense
          fallback={
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-lg" />
              ))}
            </div>
          }
        >
          <OrganizationsList />
        </Suspense>
      </div>
    </div>
  );
}
