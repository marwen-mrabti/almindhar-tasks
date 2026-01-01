import { getCurrentUser } from "@/app/_features/auth/auth.data";
import NoteForm from "@/app/_features/notes/components/note-form";
import { notesDAL } from "@/app/_features/notes/notes.dal";
import type { Metadata } from 'next';
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: 'New Note',
}
export default async function EditNotePage({
  params,
}: {
  params: Promise<{ noteId: string }>
}) {
  const { noteId } = await params;

  const user = await getCurrentUser()
  if (!user) {
    throw redirect("/sign-in")
  }

  const note = await notesDAL.getUserNoteById({ id: noteId, userId: user.id });
  if (!note) {
    notFound()
  }

  return (<div className="py-8 flex flex-col items-center justify-center">
    <Suspense fallback={<div>Loading...</div>}>
      <NoteForm
        mode="update"
        initialData={{
          id: note.id,
          title: note.title,
          content: note.content,
        }}
      />
    </Suspense>
  </div>)
}
