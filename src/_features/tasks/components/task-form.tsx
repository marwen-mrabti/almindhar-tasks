"use client"

import { createTaskAction, updateTaskAction } from '@/_features/tasks/tasks.actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { noteInsertSchema } from '@/db/schemas/task-schema';
import { cn } from "@/lib/utils";
import { useForm } from '@tanstack/react-form';
import { FileText, Loader2, Plus, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type BaseTaskFormProps = React.ComponentProps<'div'>

type CreateModeProps = BaseTaskFormProps & {
  mode: 'create';
  initialData?: never;
};

type UpdateModeProps = BaseTaskFormProps & {
  mode: 'update';
  initialData: {
    id: string;
    title: string;
    content: string;
  };
};

type TaskFormProps = CreateModeProps | UpdateModeProps;


export default function TaskForm({
  className,
  mode = 'create',
  initialData,
  ...props
}: TaskFormProps) {
  const router = useRouter();
  const isUpdateMode = mode === 'update';

  const form = useForm({
    defaultValues: {
      title: initialData?.title || '',
      content: initialData?.content || '',
    },
    validators: {
      onSubmit: noteInsertSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const result = isUpdateMode && initialData?.id
          ? await updateTaskAction({
            taskId: initialData.id,
            userInput: value,
          })
          : await createTaskAction({ userInput: value });

        if (result.success) {
          toast.success(
            isUpdateMode ? 'Task updated successfully!' : 'Task created successfully!',
            {
              duration: 3000,
              position: 'top-right',
              style: {
                background: '#333',
                color: '#fff',
              },
            }
          );

          if (!isUpdateMode) {
            form.reset();
          }
          router.push("/tasks");
        } else {
          toast.error(
            result.error || `Failed to ${isUpdateMode ? 'update' : 'create'} task`,
            {
              duration: 3000,
              position: 'top-right',
              style: {
                background: '#333',
                color: '#f44',
              },
            }
          );
        }
      } catch (error) {
        toast.error('An unexpected error occurred');
        console.error(error);
      }
    },
  });

  return (
    <div className={cn('flex flex-col gap-6 w-full max-w-2xl mx-auto', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <FileText className='h-5 w-5' />
            {isUpdateMode ? 'Edit Task' : 'Create New Task'}
          </CardTitle>
          <CardDescription>
            {isUpdateMode
              ? 'Update your task details'
              : 'Add a new task to your collection'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id='task-form'
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              <form.Field
                name='title'
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder='Enter task title'
                        autoComplete='off'
                        type='text'
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                      <FieldDescription>
                        Choose a descriptive title for your task
                      </FieldDescription>
                    </Field>
                  );
                }}
              />

              <form.Field
                name='content'
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Content</FieldLabel>
                      <Textarea
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder='Write your task content here...'
                        rows={8}
                        className='resize-none'
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                      <FieldDescription>
                        Enter the main content of your task.
                      </FieldDescription>
                    </Field>
                  );
                }}
              />

              <form.Subscribe
                selector={(formState) => [formState.canSubmit, formState.isSubmitting]}
              >
                {([canSubmit, isSubmitting]) => (
                  <div className='flex gap-2'>
                    <Button
                      type='submit'
                      disabled={!canSubmit || isSubmitting}
                      className='flex-1 disabled:color-red-500 disabled:cursor-not-allowed'
                    >
                      {isSubmitting ? (
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      ) : isUpdateMode ? (
                        <Save className='mr-2 h-4 w-4' />
                      ) : (
                        <Plus className='mr-2 h-4 w-4' />
                      )}
                      {isSubmitting
                        ? isUpdateMode
                          ? 'Updating...'
                          : 'Creating...'
                        : isUpdateMode
                          ? 'Update Task'
                          : 'Create Task'}
                    </Button>

                    {!isUpdateMode && (
                      <Button
                        type='button'
                        variant='outline'
                        onClick={() => form.reset()}
                        disabled={isSubmitting}
                        className='disabled:color-red-500 disabled:cursor-not-allowed'
                      >
                        Reset
                      </Button>
                    )}

                    {isUpdateMode && (
                      <Button
                        type='button'
                        variant='outline'
                        onClick={() => router.back()}
                        disabled={isSubmitting}
                        className='disabled:color-red-500 disabled:cursor-not-allowed'
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                )}
              </form.Subscribe>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
