
import TaskForm from '@/_features/tasks/components/task-form';
import type { Metadata } from 'next';
import { Suspense } from "react";

export const metadata: Metadata = {
  title: 'New Task',
}
export default async function NewTaskPage({ params }: { params: Promise<{ organizationId: string, projectId: string }> }) {
  const { organizationId, projectId } = await params;
  return (<div className="py-4 flex flex-col items-center justify-center">
    <Suspense fallback={<div>Loading...</div>}>
      <TaskForm mode="create" organizationId={organizationId} projectId={projectId} />
    </Suspense>
  </div>)
}
