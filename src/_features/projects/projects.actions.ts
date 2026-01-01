"use server"

import { getCurrentUser } from "@/_features/auth/auth.data"
import { ProjectInsertInput, projectInsertSchema } from "@/db/schemas/projects-schema"
import { validateWithPretty } from "@/lib/helpers"
import { updateTag } from "next/cache"
import { projectsDAL } from "./projects.dal"


export const createProjectAction = async (userInput: ProjectInsertInput) => {
  try {
    // 1. check if user is logged in
    const user = await getCurrentUser()
    if (!user) {
      throw new Error("Unauthorized")
    }

    // 2. validate input data
    const validatedProjectData = validateWithPretty(projectInsertSchema, userInput)
    // 3. call createNote from projectsDAL
    await projectsDAL.createProject({ userId: user.id, data: validatedProjectData })
    // 4. invalidate cache
    updateTag("user-projects")
    updateTag("organization-projects")
    return {
      success: true,
      message: "Project created successfully!",
    }
  } catch (error) {
    console.log('🚨🚨 Failed to create project 🚨🚨', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to create project.',
    };
  }
}


export async function updateProjectAction({
  projectId,
  userInput,
}: {
  projectId: string;
  userInput: unknown
}) {
  try {
    // 1. Verify authentication
    const user = await getCurrentUser()
    if (!user) {
      throw new Error("Unauthorized")
    }

    // 2. Verify ownership
    // const existingProject = await projectsDAL.getUserProjectById({ id: projectId, userId: user.id })
    // if (!existingProject) {
    //   return {
    //     success: false,
    //     error: 'Project not found',
    //   };
    // }

    // if (existingProject.userId !== user.id) {
    //   return {
    //     success: false,
    //     error: 'You do not have permission to update this project',
    //   };
    // }

    // 3. Validate input
    // const validatedProjectData = validateWithPretty(projectUpdateSchema, userInput)

    // 4. Update project
    // await projectsDAL.updateProject({ id: noteId, userId: user.id, data: validatedNoteData })

    // 5. invalidate cache
    updateTag("user-projects")
    updateTag(`project-${projectId}`)

    return {
      success: true,
      message: 'Project updated successfully!',
    };
  } catch (error) {
    console.error('Failed to update project:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update project',
    };
  }
}
