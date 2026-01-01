"use client"

import { ResendMagicLinkButton } from '@/_features/auth/components/resend-magicLink-btn';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AlertCircle, Home, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useQueryState } from 'nuqs';
import { Suspense } from 'react';

type ErrorDetails = {
  title: string;
  message: string;
  suggestion: string;
};

/* ---------------------------------------------
 * Error catalogs
 * -------------------------------------------- */

const SHARED_ERRORS: Record<string, ErrorDetails> = {
  RATE_LIMIT_EXCEEDED: {
    title: 'Too Many Attempts',
    message: 'You have made too many sign-in attempts.',
    suggestion:
      'Please wait a few minutes before trying again. This helps protect your account security.',
  },
  PLEASE_RESTART_THE_PROCESS: {
    title: 'Session Interrupted',
    message: 'The sign-in process was interrupted.',
    suggestion: 'Please start over and try again.',
  },
};

const SOCIAL_ERRORS: Record<string, ErrorDetails> = {
  ACCESS_DENIED: {
    title: 'Access Denied',
    message: 'You cancelled the sign-in process.',
    suggestion:
      'If you want to sign in, please try again and grant the necessary permissions.',
  },
  ACCOUNT_NOT_LINKED: {
    title: 'Account Not Linked',
    message: 'This social account is not linked to any user.',
    suggestion:
      'Please sign in with your original method first, then link your social account in settings.',
  },
  EMAIL_CONFLICT: {
    title: 'Email Already in Use',
    message: 'An account with this email already exists.',
    suggestion:
      'Please sign in with your existing account or use a different social provider.',
  },
  PROVIDER_ERROR: {
    title: 'Provider Error',
    message: 'The authentication provider encountered an error.',
    suggestion:
      'This might be a temporary issue. Please try again in a few moments.',
  },
  ...SHARED_ERRORS,
};

const MAGIC_LINK_ERRORS: Record<string, ErrorDetails> = {
  INVALID_TOKEN: {
    title: 'Invalid or Expired Link',
    message: 'This magic link is no longer valid.',
    suggestion:
      'Magic links expire after 30 minutes or can only be used once. Please request a new one.',
  },
  EXPIRED_TOKEN: {
    title: 'Link Expired',
    message: 'This magic link has expired.',
    suggestion:
      'Magic links expire after 30 minutes for security. Please request a new one.',
  },
  VERIFICATION_FAILED: {
    title: 'Verification Failed',
    message: "We couldn't verify your email address.",
    suggestion: 'Please try requesting a new magic link.',
  },
  ...SHARED_ERRORS,
};

const DEFAULT_ERROR: ErrorDetails = {
  title: 'Something Went Wrong',
  message: 'An unexpected error occurred during sign in.',
  suggestion: 'Please try again or contact support if the problem persists.',
};

/* ---------------------------------------------
 * Helpers
 * -------------------------------------------- */

function normalizeErrorCode(error?: string | null): string {
  return (error || 'UNKNOWN_ERROR').toUpperCase();
}

function resolveErrorType(
  paramsType: string | null | undefined,
  errorCode: string
): 'magic-link' | 'social' {
  if (paramsType === 'magic-link' || paramsType === 'social') return paramsType;

  if (errorCode in SOCIAL_ERRORS) return 'social';
  if (errorCode in MAGIC_LINK_ERRORS) return 'magic-link';

  // fallback heuristic
  return 'social';
}

function getErrorDetails(
  errorType: 'magic-link' | 'social',
  errorCode: string
): ErrorDetails {
  const source = errorType === 'social' ? SOCIAL_ERRORS : MAGIC_LINK_ERRORS;
  return source[errorCode] ?? DEFAULT_ERROR;
}

/* ---------------------------------------------
 * Component
 * -------------------------------------------- */

export default function ErrorPage() {
  const [error] = useQueryState('error');
  const [type] = useQueryState('type');

  const errorCode = normalizeErrorCode(error);
  const errorType = resolveErrorType(type, errorCode);
  const errorDetails = getErrorDetails(errorType, errorCode);

  return (
    <Suspense>
      <div className="flex flex-col items-center justify-center py-4 ">
        <Card className='w-full max-w-md'>
          <CardHeader className='pb-4 text-center'>
            <div className='mb-4 flex justify-center'>
              <div className='flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10'>
                <AlertCircle className='h-10 w-10 text-destructive' />
              </div>
            </div>

            <CardTitle className='mb-2 text-3xl'>{errorDetails.title}</CardTitle>

            <CardDescription className='text-base'>
              {errorDetails.message}
            </CardDescription>
          </CardHeader>

          <CardContent className='space-y-6'>
            <Alert>
              <AlertDescription>
                <p className='mb-2 font-medium'>What happened?</p>
                <p className='text-sm text-muted-foreground'>
                  {errorDetails.suggestion}
                </p>
              </AlertDescription>
            </Alert>

            <div className='space-y-3'>
              <div className='grid grid-cols-2 gap-2'>
                <Button variant='outline' render={<Link href='/' />} nativeButton={false}>
                  <Home className='mr-2 h-4 w-4' />
                  Go Home
                </Button>

                <Button variant='outline' render={<Link href='/sign-in' />} nativeButton={false}>
                  <RefreshCw className='mr-2 h-4 w-4' />
                  Try Again
                </Button>
              </div>
              {errorType === "magic-link" && <ResendMagicLinkButton />}
            </div>

            <div className='text-center'>
              <p className='text-xs text-muted-foreground'>
                Need help?{' '}
                <a href='/support' className='text-primary hover:underline'>
                  Contact support
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Suspense>

  );
}
