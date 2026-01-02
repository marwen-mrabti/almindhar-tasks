import { getCurrentUser } from '@/_features/auth/auth.data';
import { tasksDAL } from '@/_features/tasks/tasks.dal';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';


export const metadata: Metadata = {
  title: 'Task Details',
}
export default async function TaskPage({
  params,
}: {
  params: Promise<{ taskId: string }>
}) {
  const { taskId } = await params;

  const user = await getCurrentUser()
  if (!user) {
    throw redirect("/sign-in")
  }

  const task = await tasksDAL.getUserTaskById({ id: taskId, userId: user.id });
  if (!task) {
    notFound()
  }

  return (<div>
    <h1 className="text-2xl font-bold">Task: {taskId}</h1>
    <h3 className="text-lg text-primary">
      {task.title}
    </h3>
    <p className="text-base text-secondary-foreground">
      {task.description}
    </p>
    <p className="text-sm text-gray-500">
      Created at: {formatDate(task.createdAt)}
    </p>
    <Button variant="link"
      render={<Link href={`/organizations/${task.organizationId}/projects/${task.projectId}/tasks/${taskId}/edit`} className="text-primary" />}
      nativeButton={false}
    >
      Edit Task
    </Button>
  </div>)
}
