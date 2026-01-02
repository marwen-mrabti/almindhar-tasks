import { getCurrentUser } from '@/_features/auth/auth.data';
import { tasksDAL } from '@/_features/tasks/tasks.dal';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Circle, ListTodo, SquarePen } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { DeleteTaskButton } from './delete-task-btn';
import { ToggleTaskButton } from './toggle-task-btn';

export default async function TasksList({
  projectId,
  organizationId,
}: {
  projectId: string;
  organizationId: string;
}) {
  const user = await getCurrentUser();
  if (!user) {
    throw redirect('/sign-in');
  }

  const tasks = await tasksDAL.getUserTasksByProjectId({
    projectId,
    userId: user.id
  });

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed rounded-lg">
        <div className="rounded-full bg-muted p-6 mb-4">
          <ListTodo className="w-12 h-12 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No tasks yet</h3>
        <p className="text-muted-foreground text-center max-w-md text-sm">
          Create your first task to start tracking work for this project.
        </p>
      </div>
    );
  }

  const completedTasks = tasks.filter((task) => task.isDone);
  const pendingTasks = tasks.filter((task) => !task.isDone);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 text-sm">
        <Badge variant="secondary" className="gap-1">
          <CheckCircle2 className="w-3 h-3" />
          {completedTasks.length} completed
        </Badge>
        <Badge variant="outline" className="gap-1">
          <Circle className="w-3 h-3" />
          {pendingTasks.length} pending
        </Badge>
      </div>

      <div className="space-y-2">
        {tasks.map((task) => (
          <Card
            key={task.id}
            className={`transition-all ${task.isDone ? 'bg-muted/50' : 'hover:shadow-md'
              }`}
          >
            <CardContent className="flex items-center gap-4 p-4">
              <ToggleTaskButton
                taskId={task.id}
                completed={task.isDone}
              />
              <div className="flex-1 min-w-0">
                <Link href={`/organizations/${organizationId}/projects/${projectId}/tasks/${task.id}`} className='hover:underline'>
                  <h3
                    className={`font-medium ${task.isDone
                      ? 'line-through '
                      : 'text-foreground'
                      }`}
                  >
                    {task.title}
                  </h3>
                </Link>
                {task.description && (
                  <p
                    className={`text-sm mt-1 ${task.isDone
                      ? 'text-muted-foreground/70'
                      : 'text-muted-foreground'
                      }`}
                  >
                    {task.description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-4">
                <Link href={`/organizations/${organizationId}/projects/${projectId}/tasks/${task.id}/edit`}>
                  <SquarePen className="w-4 h-4" />
                </Link>
                <DeleteTaskButton
                  taskId={task.id}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
