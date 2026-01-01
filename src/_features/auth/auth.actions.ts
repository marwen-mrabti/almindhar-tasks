"use server"

import { type MagicLinkCredentials, magicLinkLoginSchema } from "@/_features/auth/auth-utils";
import { auth } from '@/lib/auth/auth';
import { validateWithPretty } from '@/lib/helpers';
import { headers } from 'next/headers';

export const signInWithMagicLink = async ({ email, name }: MagicLinkCredentials) => {
  try {
    const data = validateWithPretty(magicLinkLoginSchema, { email, name })

    const callbackParams = new URLSearchParams({
      name,
      email,
      type: 'magic-link'
    });

    const response = await auth.api.signInMagicLink({
      body: {
        email: data.email,
        name: data.name,
        callbackURL: '/dashboard',
        newUserCallbackURL: '/dashboard',
        errorCallbackURL: `/error?${callbackParams.toString()}`,
      },
      headers: await headers(),
    });

    return {
      success: true,
      data: response,
    };
  } catch (error: unknown) {
    console.log('🚨🚨 Failed to send magic link email 🚨🚨', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to send magic link email.',
    };
  }
}
