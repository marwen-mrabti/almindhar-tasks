import { getCurrentUser } from "@/_features/auth/auth.data"
import { notesDAL } from "@/_features/tasks/tasks.dal"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function NotesList() {
  const user = await getCurrentUser()

  if (!user) {
    throw redirect("/sign-in")
  }
  const tasks = await notesDAL.getUserNotes({ userId: user.id })

  return (
    <div className="flex flex-col gap-4 py-4">
      {tasks.length === 0 ? (
        <p>No tasks found</p>
      ) :
        <ul className="list-disc space-y-2">
          {tasks.map(task => (
            <li key={task.id}>
              <Link href={`/tasks/${task.id}`} className="hover:underline underline-offset-2">
                <p>{task.title}</p>
              </Link>
              <p>- {task.content}</p>
            </li>
          ))}
        </ul>}
    </div>
  )
}
