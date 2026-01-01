
import TaskForm from '@/_features/tasks/components/task-form';
import type { Metadata } from 'next';
import { Suspense } from "react";

export const metadata: Metadata = {
  title: 'New Project',
}
export default async function NewTaskPage() {

  return (<div className="py-4 flex flex-col items-center justify-center">
    <Suspense fallback={<div>Loading...</div>}>
      <TaskForm mode="create" />
    </Suspense>
  </div>)
}
