import TasksList from "@/_features/tasks/components/tasks-list";
import { Button } from "@/components/ui/button";
import type { Metadata } from 'next';
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: 'Tasks',
}

export default async function TasksPage() {
  return (
    <div className="flex flex-col items-center justify-center py-4 ">
      <div className="flex justify-between">
        <h1 className="text-2xl text-primary underline underline-offset-2">Tasks</h1>
        <Button variant="link" render={<Link href="/tasks/new" />} nativeButton={false}>
          Add New Task
        </Button>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <TasksList />
      </Suspense>
    </div>
  )
}
