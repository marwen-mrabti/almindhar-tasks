import CreateOrganizationForm from "@/_features/organizations/components/create-organization-form";
import OrganizationsList from "@/_features/organizations/components/organizations-list";
import { Suspense } from "react";

export default async function OrganizationsPage() {

  return (
    <div className="flex flex-col items-center justify-center py-4 ">
      <CreateOrganizationForm />
      <Suspense fallback={<div>Loading...</div>}>
        <OrganizationsList />
      </Suspense>
    </div>
  );
}
