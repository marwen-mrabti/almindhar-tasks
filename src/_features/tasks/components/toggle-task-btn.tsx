'use client';

import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { updateTaskAction } from '../tasks.actions';

export function ToggleTaskButton({
  taskId,
  completed,
}: {
  taskId: string;
  completed: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleToggle = () => {
    startTransition(async () => {
      const result = await updateTaskAction({ taskId, userInput: { isDone: !completed } });
      if (result.success) {
        toast.success(completed ? 'Task marked as pending' : 'Task completed!');
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to update task');
      }
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      disabled={isPending}
      className="shrink-0"
    >
      {completed ? (
        <CheckCircle2 className="w-5 h-5 text-green-600" />
      ) : (
        <Circle className="w-5 h-5 text-muted-foreground" />
      )}
    </Button>
  );
}
