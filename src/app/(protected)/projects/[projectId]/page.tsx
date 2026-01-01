import { getCurrentUser } from '@/_features/auth/auth.data';
import { projectsDAL } from '@/_features/projects/projects.dal';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';


export const metadata: Metadata = {
  title: 'Project Details',
}
export default async function NotePage({
  params,
}: {
  params: Promise<{ noteId: string }>
}) {
  const { noteId } = await params;

  const user = await getCurrentUser()
  if (!user) {
    throw redirect("/sign-in")
  }

  const project = await projectsDAL.getUserProjectById({ id: noteId, userId: user.id });
  if (!project) {
    notFound()
  }

  return (<div>
    <h1 className="text-2xl font-bold">Note: {noteId}</h1>
    <h3 className="text-lg text-primary">
      {project.name}
    </h3>
    <p className="text-base text-secondary-foreground">
      {project.description}
    </p>
    <p className="text-sm text-gray-500">
      Created at: {formatDate(project.createdAt)}
    </p>
    <Button variant="link"
      render={<Link href={`/tasks/${project.id}/edit`} className="text-primary" />}
      nativeButton={false}
    >
      Edit Project
    </Button>
  </div>)
}
