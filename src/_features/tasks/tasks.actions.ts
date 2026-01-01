"use server"

import { getCurrentUser } from "@/_features/auth/auth.data"
import { updateTag } from "next/cache"


export const createTaskAction = async ({ userInput }: { userInput: unknown }) => {
  try {
    // 1. check if user is logged in
    const user = await getCurrentUser()
    if (!user) {
      throw new Error("Unauthorized")
    }
    // 2. validate input data
    // const validatedTaskData = validateWithPretty(taskInsertSchema, userInput)
    // 3. call createNote from tasksDAL
    // await tasksDAL.createTask({ userId: user.id, data: validatedNoteData })
    // 4. invalidate cache
    updateTag("user-tasks")
    return {
      success: true,
      message: "Task created successfully!",
    }
  } catch (error) {
    console.log('🚨🚨 Failed to create task 🚨🚨', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to create task.',
    };
  }
}


export async function updateTaskAction({
  taskId,
  userInput,
}: {
  taskId: string;
  userInput: unknown
}) {
  try {
    // 1. Verify authentication
    const user = await getCurrentUser()
    if (!user) {
      throw new Error("Unauthorized")
    }

    // 2. Verify ownership
    // const existingTask = await tasksDAL.getUserTaskById({ id: taskId, userId: user.id })
    // if (!existingTask) {
    //   return {
    //     success: false,
    //     error: 'Task not found',
    //   };
    // }

    // if (existingTask.userId !== user.id) {
    //   return {
    //     success: false,
    //     error: 'You do not have permission to update this task',
    //   };
    // }

    // 3. Validate input
    // const validatedTaskData = validateWithPretty(taskUpdateSchema, userInput)

    // 4. Update task
    // await tasksDAL.updateTask({ id: noteId, userId: user.id, data: validatedNoteData })

    // 5. invalidate cache
    updateTag("user-tasks")
    updateTag(`task-${taskId}`)

    return {
      success: true,
      message: 'Task updated successfully!',
    };
  } catch (error) {
    console.error('Failed to update task:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update task',
    };
  }
}
