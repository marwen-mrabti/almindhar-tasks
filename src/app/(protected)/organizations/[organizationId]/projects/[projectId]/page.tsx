import { getCurrentUser } from '@/_features/auth/auth.data';
import { projectsDAL } from '@/_features/projects/projects.dal';
import TasksList from '@/_features/tasks/components/tasks-list';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/utils';
import { ArrowLeft, Calendar } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Project Details',
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ projectId: string, organizationId: string }>
}) {
  const { projectId, organizationId } = await params;
  const user = await getCurrentUser()

  if (!user) {
    throw redirect("/sign-in")
  }

  const project = await projectsDAL.getUserProjectById({
    id: projectId,
    userId: user.id
  });

  if (!project) {
    notFound()
  }

  const isOwner = project.createdBy === user.id;

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" render={<Link href={`/organizations/${organizationId}`} />} nativeButton={false}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Projects
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-3xl">{project.name}</CardTitle>
                {isOwner && (
                  <Badge variant="secondary">Owner</Badge>
                )}
              </div>
              <CardDescription className="text-base">
                {project.description || "No description provided"}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Created {formatDate(project.createdAt)}</span>
            </div>
            {project.updatedAt && project.updatedAt.getTime() !== project.createdAt.getTime() && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Updated {formatDate(project.updatedAt)}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Tasks</h2>
            <p className="text-muted-foreground">
              Manage and track tasks for this project
            </p>
          </div>
          <Button variant="outline" render={<Link href={`/organizations/${organizationId}/projects/${projectId}/tasks/new`} />} nativeButton={false}>
            Create Task
          </Button>
        </div>

        <Suspense
          fallback={
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          }
        >
          <TasksList organizationId={organizationId} projectId={projectId} />
        </Suspense>
      </div>
    </div>
  );
}
