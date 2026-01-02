import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth/auth";
import { formatDate } from "@/lib/utils";
import { Building2, Calendar } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";

export default async function OrganizationsList() {
  const userOrganizations = await auth.api.listOrganizations({
    headers: await headers(),
  });

  if (userOrganizations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="rounded-full bg-muted p-6 mb-4">
          <Building2 className="w-12 h-12 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No organizations yet</h3>
        <p className="text-muted-foreground text-center max-w-md">
          You&apos;re not a member of any organizations. Create your first organization to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(250px,1fr))]">
      {userOrganizations.map((organization) => {
        const initials = organization.name
          .split(" ")
          .map((word) => word[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);

        return (
          <Link
            key={organization.id}
            href={`/organizations/${organization.id}`}
            className="group"
          >
            <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={organization.logo || undefined} alt={organization.name} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors truncate">
                      {organization.name}
                    </CardTitle>
                    <CardDescription className="text-sm truncate">
                      @{organization.slug}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {formatDate(organization.createdAt)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
