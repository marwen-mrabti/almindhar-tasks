import "server-only"

import { db } from "@/db"
import { projects } from "@/db/schemas"
import { ProjectInsertInput } from "@/db/schemas/projects-schema"
import { and, eq } from "drizzle-orm"
import { cacheLife, cacheTag } from "next/cache"

export const projectsDAL = {
  /**
   * Fetch all projects for a specific user
   */
  getUserProjects: async ({ userId }: { userId: string }) => {
    "use cache"
    cacheLife("hours")
    cacheTag("user-projects")

    try {
      if (!userId) {
        throw new Error("Unauthorized")
      }
      const userProjects = await db.query.projects.findMany({
        where: eq(projects.createdBy, userId),
      })
      return userProjects
    } catch (error) {
      console.error("Error fetching projects:", error)
      throw new Error("Failed to fetch projects")
    }
  },

  /**
   * Fetch projects by user id and organization id
   */
  getUserProjectsByOrganizationId: async ({ userId, organizationId }: { userId: string, organizationId: string }) => {
    "use cache"
    cacheLife("hours")
    cacheTag("organization-projects")

    try {
      if (!userId || !organizationId) {
        throw new Error("Unauthorized")
      }
      const organizationProjects = await db.query.projects.findMany({
        where: and(eq(projects.createdBy, userId), eq(projects.organizationId, organizationId)),
      })
      return organizationProjects
    } catch (error) {
      console.error("Error fetching projects:", error)
      throw new Error("Failed to fetch projects")
    }
  },

  /**
   * Fetch a single project by id for a specific user
   */
  getUserProjectById: async ({ id, userId }: { id: string, userId: string }) => {
    "use cache"
    cacheLife("hours")
    cacheTag(`project-${id}`)

    try {
      if (!id || !userId) return null
      const userProject = await db.query.projects.findFirst({
        where: and(eq(projects.id, id), eq(projects.createdBy, userId)),
      })
      return userProject
    } catch (error) {
      console.error(`Error fetching project ${id}:`, error)
      throw new Error(`Failed to fetch project ${id}`)
    }
  },

  /**
   * Create a new project for a user
   */
  createProject: async ({ userId, data }: { userId: string, data: ProjectInsertInput }) => {
    try {
      if (!userId) throw new Error("User ID is required")

      await db.insert(projects).values({
        createdBy: userId,
        ...data,
      })

      return { success: true, message: "Project created successfully" }
    } catch (error) {
      console.error("Error creating project:", error)
      throw new Error("Failed to create project")
    }
  },

  /**
   * Update a project by id for a specific user
   */
  updateProject: async ({
    id,
    userId,
    data,
  }: {
    id: string,
    userId: string,
    data: unknown
  }
  ) => {
    try {
      if (!userId || !id) throw new Error("User ID or Project ID is required")


      return {}
    } catch (error) {
      console.error(`Error updating project ${id}:`, error)
      throw new Error(`Failed to update project ${id}`)
    }
  },

  /**
   * Delete a project by id for a specific user
   */
  deleteProject: async ({
    id,
    userId,
  }: {
    id: string,
    userId: string,
  }): Promise<boolean> => {
    try {
      if (!userId || !id) throw new Error("User ID or Project ID is required")


      return true
    } catch (error) {
      console.error(`Error deleting project ${id}:`, error)
      throw new Error(`Failed to delete project ${id}`)
    }
  },
}
