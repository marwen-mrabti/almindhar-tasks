import CreateOrganizationForm from "@/_features/organizations/components/create-organization-form";
import { auth } from "@/lib/auth/auth";
import { ArrowBigRight } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";

export default async function DashboardPage() {
  const userOrganizations = await auth.api.listOrganizations({
    headers: await headers(),
  });

  return (
    <div className="flex flex-col items-center justify-start py-4 ">
      <h1>Dashboard</h1>
      {userOrganizations.length === 0 ? <CreateOrganizationForm /> :
        <div className="flex flex-col items-center justify-center gap-4 py-4 ">
          <h2>Manage Your Organizations and Projects</h2>
          <Link href="/organizations" className="flex items-center font-bold text-2xl text-primary">
            from here
            <ArrowBigRight className="ml-2 h-6 w-6" />
          </Link>
        </div>
      }

    </div>
  );
}
