import "server-only"

import { cacheLife, cacheTag } from "next/cache"

export const tasksDAL = {
  /**
   * Fetch all tasks for a specific user
   */
  getUserTasks: async ({ userId }: { userId: string }) => {
    "use cache"
    cacheLife("hours")
    cacheTag("user-tasks")

    try {
      if (!userId) {
        throw new Error("Unauthorized")
      }


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


    } catch (error) {
      console.error(`Error fetching task ${id}:`, error)
      throw new Error(`Failed to fetch task ${id}`)
    }
  },

  /**
   * Create a new task for a user
   */
  createTask: async ({ userId, data }: { userId: string, data: unknown }) => {
    try {
      if (!userId) throw new Error("User ID is required")



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
    data: unknown
  }
  ) => {
    try {
      if (!userId || !id) throw new Error("User ID or Task ID is required")


      return {}
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
  }): Promise<boolean> => {
    try {
      if (!userId || !id) throw new Error("User ID or Task ID is required")


      return true
    } catch (error) {
      console.error(`Error deleting task ${id}:`, error)
      throw new Error(`Failed to delete task ${id}`)
    }
  },
}
