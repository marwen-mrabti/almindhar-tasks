import "server-only"

import { db } from "@/db"
import { tasks } from "@/db/schemas"
import { TaskInsertInput, TaskUpdateInput } from "@/db/schemas/tasks-schema"
import { and, eq } from "drizzle-orm"
import { cacheLife, cacheTag } from "next/cache"

export const tasksDAL = {
  /**
   * Fetch all tasks for a specific user
   */
  getUserTasks: async ({ userId }: { userId: string }) => {
    "use cache"
    cacheLife("hours")
    cacheTag("tasks")

    try {
      if (!userId) {
        throw new Error("Unauthorized")
      }
      const userTasks = await db.query.tasks.findMany({
        where: eq(tasks.createdBy, userId)
      })

      return userTasks
    } catch (error) {
      console.error("Error fetching tasks:", error)
      throw new Error("Failed to fetch tasks")
    }
  },

  /**
   * Fetch all tasks for a specific project
   */
  getUserTasksByProjectId: async ({ projectId, userId }: { projectId: string, userId: string }) => {
    "use cache"
    cacheLife("hours")
    cacheTag("tasks")

    try {
      if (!projectId || !userId) {
        throw new Error("Unauthorized")
      }
      const projectTasks = await db.query.tasks.findMany({
        where: and(eq(tasks.projectId, projectId), eq(tasks.createdBy, userId))
      })

      return projectTasks
    } catch (error) {
      console.error("Error fetching tasks:", error)
      throw new Error("Failed to fetch tasks")
    }
  },


  /**
   * Fetch a single task by id for a specific user
   */
  getUserTaskById: async ({ id, userId }: { id: string, userId: string }) => {
    "use cache"
    cacheLife("hours")
    cacheTag(`task-${id}`)

    try {
      if (!id || !userId) return null
      const task = await db.query.tasks.findFirst({
        where: eq(tasks.id, id),
      })
      return task
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error)
      throw new Error(`Failed to fetch task ${id}`)
    }
  },

  /**
   * Create a new task for a user
   */
  createTask: async ({ userId, data }: { userId: string, data: TaskInsertInput }) => {
    try {
      if (!userId) throw new Error("User ID is required")

      await db.insert(tasks).values({
        createdBy: userId,
        ...data,
      })

      return { success: true, message: "Task created successfully" }
    } catch (error) {
      console.error("Error creating task:", error)
      throw new Error("Failed to create task")
    }
  },

  /**
   * Update a task by id for a specific user
   */
  updateTask: async ({
    id,
    userId,
    data,
  }: {
    id: string,
    userId: string,
    data: TaskUpdateInput
  }
  ) => {
    try {
      if (!userId || !id) throw new Error("User ID or Task ID is required")

      await db.update(tasks).set({ ...data }).where(and(eq(tasks.id, id), eq(tasks.createdBy, userId)))
      return {
        success: true,
        message: "Task updated successfully"
      }
    } catch (error) {
      console.error(`Error updating task ${id}:`, error)
      throw new Error(`Failed to update task ${id}`)
    }
  },

  /**
   * Delete a task by id for a specific user
   */
  deleteTask: async ({
    id,
    userId,
  }: {
    id: string,
    userId: string,
  }) => {
    try {
      if (!userId || !id) throw new Error("User ID or Task ID is required")

      await db.delete(tasks).where(and(eq(tasks.id, id), eq(tasks.createdBy, userId)))
      return {
        success: true,
        message: "Task deleted successfully"
      }
    } catch (error) {
      console.error(`Error deleting task ${id}:`, error)
      throw new Error(`Failed to delete task ${id}`)
    }
  },
}
