import { getCurrentUser } from "@/_features/auth/auth.data";
import TaskForm from "@/_features/tasks/components/task-form";
import { tasksDAL } from "@/_features/tasks/tasks.dal";
import type { Metadata } from 'next';
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: 'Edit Task',
}
export default async function EditTaskPage({
  params,
}: {
  params: Promise<{ organizationId: string, projectId: string, taskId: string }>
}) {
  const { organizationId, projectId, taskId } = await params;

  const user = await getCurrentUser()
  if (!user) {
    throw redirect("/sign-in")
  }

  const task = await tasksDAL.getUserTaskById({ id: taskId, userId: user.id });
  if (!task) {
    notFound()
  }

  return (<div className="py-8 flex flex-col items-center justify-center">
    <Suspense fallback={<div>Loading...</div>}>
      <TaskForm
        mode="update"
        organizationId={organizationId}
        projectId={projectId}
        initialData={{
          id: task.id,
          title: task.title,
          description: task.description,
        }}
      />
    </Suspense>
  </div>)
}
