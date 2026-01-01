import ProjectsList from "@/_features/projects/components/projects-list";
import { Button } from "@/components/ui/button";
import type { Metadata } from 'next';
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: 'Projects',
}

export default async function TasksPage() {
  return (
    <div className="flex flex-col items-center justify-start py-4 ">
      <div className="flex flex-col justify-between">
        <h1 className="text-2xl text-primary underline underline-offset-2">
          Projects
        </h1>
        <Button variant="link" render={<Link href="/projects/new" />} nativeButton={false}>
          Add New Project
        </Button>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <ProjectsList />
      </Suspense>
    </div>
  )
}
