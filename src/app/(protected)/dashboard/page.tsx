import CreateOrganizationForm from "@/_features/organizations/components/create-organization-form";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";

export default async function DashboardPage() {
  const userOrganizations = await auth.api.listOrganizations({
    headers: await headers(),
  });

  return (
    <div className="flex flex-col items-center justify-center py-4 ">
      <h1>Dashboard</h1>
      {userOrganizations.length === 0 ? <CreateOrganizationForm /> : null}
    </div>
  );
}
