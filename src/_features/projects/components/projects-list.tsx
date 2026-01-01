import { getCurrentUser } from "@/_features/auth/auth.data"
import { projectsDAL } from "@/_features/projects/projects.dal"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function ProjectsList() {
  const user = await getCurrentUser()
  if (!user) {
    throw redirect("/sign-in")
  }

  const projects = await projectsDAL.getUserProjects({ userId: user.id })

  return (
    <div className="flex flex-col gap-4 py-4">
      {projects.length === 0 ? (
        <p>No projects found</p>
      ) :
        <ul className="list-disc space-y-2">
          {projects.map(project => (
            <li key={project.id}>
              <Link href={`/projects/${project.id}`} className="hover:underline underline-offset-2">
                <p>{project.name}</p>
              </Link>
              <p>- {project.description}</p>
            </li>
          ))}
        </ul>}
    </div>
  )
}
