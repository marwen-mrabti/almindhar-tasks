import ProjectForm from '@/_features/projects/components/project-form';
import type { Metadata } from 'next';
import { Suspense } from "react";

export const metadata: Metadata = {
  title: 'New Project',
}
export default async function NewProjectPage({ params }: { params: Promise<{ organizationId: string }> }) {
  const { organizationId } = await params;

  return (<div className="py-4 flex flex-col items-center justify-center">
    <Suspense fallback={<div>Loading...</div>}>
      <ProjectForm mode="create" organizationId={organizationId} />
    </Suspense>
  </div>)
}
