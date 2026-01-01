import { getCurrentUser } from '@/_features/auth/auth.data';
import { tasksDAL } from '@/_features/tasks/tasks.dal';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';


export const metadata: Metadata = {
  title: 'Note Details',
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

  const task = await tasksDAL.getUserTaskById({ id: noteId, userId: user.id });
  if (!task) {
    notFound()
  }

  return (<div>
    <h1 className="text-2xl font-bold">Note: {noteId}</h1>
    <h3 className="text-lg text-primary">
      {task.title}
    </h3>
    <p className="text-base text-secondary-foreground">
      {task.content}
    </p>
    <p className="text-sm text-gray-500">
      Created at: {formatDate(task.createdAt)}
    </p>
    <Button variant="link"
      render={<Link href={`/tasks/${task.id}/edit`} className="text-primary" />}
      nativeButton={false}
    >
      Edit Task
    </Button>

  </div>)
}
