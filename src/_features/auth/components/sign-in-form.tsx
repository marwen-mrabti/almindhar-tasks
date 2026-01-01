"use client"

import { magicLinkLoginSchema } from '@/_features/auth/auth-utils';
import { useMagicLink } from '@/_features/auth/hooks/useMagicLink';
import Logo from "@/app/assets/logo-colored.png";
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
  FieldLabel
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { authClient } from '@/lib/auth/auth-client';
import { cn } from "@/lib/utils";
import { useForm } from '@tanstack/react-form';
import { Loader2, Mail } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useQueryState } from 'nuqs';
import { useState } from 'react';
import { toast } from 'sonner';

export function SignInForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const router = useRouter();
  const [nameQuery, setNameQuery] = useQueryState('name');
  const [emailQuery, setEmailQuery] = useQueryState('email');

  const { sendMagicLink, pending, cooldown, formatCooldown } = useMagicLink();
  const [socialSignInPending, setSocialSignInPending] = useState(false);

  const form = useForm({
    defaultValues: {
      email: emailQuery || '',
      name: nameQuery || '',
    },
    validators: {
      onSubmit: magicLinkLoginSchema,
    },
    onSubmit: async ({ value }) => {
      const result = await sendMagicLink({
        email: value.email,
        name: value.name,
      });

      if (result.success) {
        const params = new URLSearchParams({
          name: value.name,
          email: value.email,
        });
        router.push(`/check-email?${params.toString()}`);
      }
    },
  });

  const handleSocialSignIn = async (provider: 'google') => {
    setSocialSignInPending(true);

    await authClient.signIn.social({
      provider,
      callbackURL: '/dashboard',
      errorCallbackURL: '/error?type=social',
      newUserCallbackURL: '/dashboard',
      fetchOptions: {
        onError: (ctx) => {
          toast.error(ctx.error.message);
          router.push('/error?type=social');
        },
      },
    });

    setSocialSignInPending(false);
  };

  return (
    <div className={cn('flex flex-col gap-6 w-full max-w-md mx-auto', className)} {...props}>
      <Card>
        <CardHeader className='text-center flex flex-col items-center gap-2'>
          <div className="flex items-center justify-center w-full">
            <Separator className="w-1/5!" />
            <Image src={Logo} alt="Alminthar Tasks Logo" className={cn("mx-1 w-32 flex-1 dark:invert")} />
            <Separator className="w-1/5!" />
          </div>
          <CardTitle className='text-xl'>Welcome back</CardTitle>
          <CardDescription className="flex items-center w-full">
            <Separator className="w-1/5!" />
            <span className='flex-1 mx-1'>
              Login with your Google or MagicLink
            </span>
            <Separator className="w-1/5!" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id='login-form'
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              <Field>
                <Button
                  onClick={() => handleSocialSignIn('google')}
                  variant='outline'
                  type='button'
                  className='w-full'
                >
                  {socialSignInPending ? (
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 48 48">
                      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                      <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
                      <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
                      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
                    </svg>
                  )}
                  Login with Google
                </Button>
              </Field>

              <div className='text-center'>
                <div className='w-full text-center flex items-center justify-center'>
                  <Separator className="mr-1 w-1/5!" />
                  <span className="flex-1 mx-1">
                    Or continue with MagicLink
                  </span>
                  <Separator className="mx-1 w-1/5!" />
                </div>
                <small className='text-center text-muted-foreground mx-1 text-xs'>
                  [we will send you an email with a link to login]
                </small>
              </div>

              <form.Field
                name='name'
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Username</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => {
                          field.handleChange(e.target.value);
                          setNameQuery(e.target.value);
                        }}
                        aria-invalid={isInvalid}
                        placeholder='joe'
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

              <form.Field
                name='email'
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => {
                          field.handleChange(e.target.value);
                          setEmailQuery(e.target.value);
                        }}
                        aria-invalid={isInvalid}
                        placeholder='m@example.com'
                        autoComplete='on'
                        type='email'
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />

              <Field>
                <Button type='submit' disabled={pending || cooldown > 0} className='w-full'>
                  {pending ? (
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  ) : (
                    <Mail className='mr-2 h-4 w-4' />
                  )}
                  {pending
                    ? 'Sending...'
                    : cooldown > 0
                      ? `Wait ${formatCooldown(cooldown)}`
                      : 'Send Magic Link'}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      <FieldDescription className='px-6 text-center'>
        By clicking continue, you agree to our <a href='#'>Terms of Service</a>{' '}
        and <a href='#'>Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
