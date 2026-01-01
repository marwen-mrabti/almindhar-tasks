import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";

export default async function OrganizationsList() {
  const userOrganizations = await auth.api.listOrganizations({
    headers: await headers(),
  });

  return (
    <div>
      <h1>Organization List</h1>
      {
        userOrganizations.length === 0 ? (
          <div>
            <p>You are not a member of any organizations.</p>
            <p>Create one</p>
          </div>
        ) : (
          <ul>
            {userOrganizations.map((organization) => (
              <li key={organization.id}>{organization.name}</li>
            ))}
          </ul>
        )
      }
    </div>
  );
}
