import { getCurrentUser } from "@/_features/auth/auth.data";
import { projectsDAL } from "@/_features/projects/projects.dal";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { Calendar, FolderOpen } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ProjectsList({
  organizationId,
}: {
  organizationId: string;
}) {
  const user = await getCurrentUser();
  if (!user) {
    throw redirect("/sign-in");
  }

  const projects = await projectsDAL.getUserProjectsByOrganizationId({
    organizationId,
    userId: user.id,
  });

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed rounded-lg">
        <div className="rounded-full bg-muted p-6 mb-4">
          <FolderOpen className="w-12 h-12 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
        <p className="text-muted-foreground text-center max-w-md">
          Create your first project to start organizing your tasks and
          collaborating with your team.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full grid gap-4 grid-cols-[repeat(auto-fill,minmax(250px,1fr))]">
      {projects.map((project) => {
        const isCreatedByCurrentUser = project.createdBy === user.id;

        return (
          <Link
            key={project.id}
            href={`/organizations/${organizationId}/projects/${project.id}`}
            className="group"
          >
            <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors truncate">
                      {project.name}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 mt-1.5">
                      {project.description || "No description"}
                    </CardDescription>
                  </div>
                  {isCreatedByCurrentUser && (
                    <Badge variant="secondary" className="shrink-0">
                      Owner
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {formatDate(project.createdAt)}
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
