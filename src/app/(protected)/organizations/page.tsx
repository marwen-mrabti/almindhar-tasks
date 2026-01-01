import CreateOrganizationForm from "@/_features/organizations/components/create-organization-form";
import { Suspense } from "react";
import OrganizationsList from "./organizations-list";

export default async function OrganizationsPage() {

  return (
    <div className="flex flex-col items-center justify-center py-4 ">
      <h1>Organization Page</h1>
      <CreateOrganizationForm />
      <Suspense fallback={<div>Loading...</div>}>
        <OrganizationsList />
      </Suspense>
    </div>
  );
}
