"use client"

import { createProjectAction, updateProjectAction } from '@/_features/projects/projects.actions';
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
import { projectInsertSchema } from '@/db/schemas/projects-schema';
import { cn } from "@/lib/utils";
import { useForm } from '@tanstack/react-form';
import { FileText, Loader2, Plus, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type BaseProjectFormProps = React.ComponentProps<'div'> & {
  organizationId: string;
};

type CreateModeProps = BaseProjectFormProps & {
  mode: 'create';
  initialData?: never;
};

type UpdateModeProps = BaseProjectFormProps & {
  mode: 'update';
  initialData: {
    id: string;
    name: string;
    description: string;
  };
};

type ProjectFormProps = CreateModeProps | UpdateModeProps;


export default function ProjectForm({
  className,
  mode = 'create',
  organizationId,
  initialData,
  ...props
}: ProjectFormProps) {
  const router = useRouter();
  const isUpdateMode = mode === 'update';

  const form = useForm({
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
    },
    validators: {
      onSubmit: projectInsertSchema.omit({ organizationId: true }),
    },
    onSubmit: async ({ value }) => {
      try {
        const result = isUpdateMode && initialData?.id
          ? await updateProjectAction({
            projectId: initialData.id,
            userInput: value,
          })
          : await createProjectAction({
            name: value.name,
            description: value.description,
            organizationId
          });

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
          router.push(`/organizations/${organizationId}`);
        } else {
          toast.error(
            result.error || `Failed to ${isUpdateMode ? 'update' : 'create'} `,
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
            {isUpdateMode ? 'Edit Project' : 'Create New Project'}
          </CardTitle>
          <CardDescription>
            {isUpdateMode
              ? 'Update your project details'
              : 'Add a new project to your collection'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id='-form'
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              <form.Field
                name='name'
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Project Name</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder='Enter  title'
                        autoComplete='off'
                        type='text'
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                      <FieldDescription>
                        Choose a descriptive name for your project.
                      </FieldDescription>
                    </Field>
                  );
                }}
              />
              <form.Field
                name='description'
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                      <Textarea
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder='Write your  content here...'
                        rows={8}
                        className='resize-none'
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                      <FieldDescription>
                        Enter the description of your project.
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
                          ? 'Update Project'
                          : 'Create Project'}
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
