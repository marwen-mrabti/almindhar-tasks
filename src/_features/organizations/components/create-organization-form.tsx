"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Organization } from "@/lib/auth/auth"
import { authClient } from "@/lib/auth/auth-client"
import { useForm } from '@tanstack/react-form'
import { Loader2, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useEffectEvent, useState } from "react"
import { toast } from "sonner"
import { z } from "zod"

const createOrganizationSchema = z.object({
  name: z.string().min(1),
})

type CreateOrganizationForm = z.infer<typeof createOrganizationSchema>

export default function CreateOrganizationForm() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const { data: organizations } = authClient.useListOrganizations()
  const openDialog = useEffectEvent((orgs: Organization[] | null) => {
    if (orgs && orgs.length === 0) {
      setOpen(true)
    }
  });
  useEffect(() => {
    openDialog(organizations);
  }, [organizations])

  const form = useForm({
    defaultValues: {
      name: ""
    },
    validators: {
      onSubmit: createOrganizationSchema,
    },
    onSubmit: async ({ value }) => {
      await handleCreateOrganization(value)
      router.refresh()
    }
  });

  async function handleCreateOrganization(data: CreateOrganizationForm) {
    const slug = data.name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
    const res = await authClient.organization.create({
      name: data.name,
      slug,
    })

    if (res.error) {
      toast.error(res.error.message || "Failed to create organization")
    } else {
      form.reset()
      setOpen(false)
      await authClient.organization.setActive({ organizationId: res.data.id })
    }
  }

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger render={<Button variant="outline">Create Organization</Button>} />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Organization</DialogTitle>
            <DialogDescription>
              Create a new organization to collaborate with your team. You can invite members to join your organization and manage their access.
            </DialogDescription>
          </DialogHeader>
          <form id='organization-form'
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}>
            <FieldGroup>
              <form.Field
                name='name'
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        Organization Name
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => {
                          field.handleChange(e.target.value);
                        }}
                        aria-invalid={isInvalid}
                        placeholder='organization...'
                        autoComplete='on'
                        type='text'
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
              <DialogFooter>
                <DialogClose render={<Button variant="outline">Cancel</Button>} />
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
                        )
                          : (
                            <Plus className='mr-2 h-4 w-4' />
                          )}
                        {isSubmitting
                          ? 'Creating...'
                          : 'Create Note'}
                      </Button>
                    </div>
                  )}
                </form.Subscribe>
              </DialogFooter>
            </FieldGroup>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
