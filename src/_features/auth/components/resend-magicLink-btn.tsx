'use client'

import { useMagicLink } from '@/_features/auth/hooks/useMagicLink';
import { Button } from '@/components/ui/button';
import { Loader2, Mail } from 'lucide-react';
import { useRouter } from "next/navigation";
import { useQueryState } from 'nuqs';

export function ResendMagicLinkButton() {
  const router = useRouter();
  const [name] = useQueryState('name');
  const [email] = useQueryState('email');

  const { sendMagicLink, pending, cooldown, formatCooldown } = useMagicLink();

  const handleResendMagicLink = async () => {
    if (!email || !name) {
      return router.push('/sign-in');
    }

    const result = await sendMagicLink({ email, name });
    if (result.success && window.location.pathname !== '/check-email') {
      const params = new URLSearchParams({
        name,
        email
      });
      router.push(`/check-email?${params.toString()}`);
    }
  };

  return (
    <Button
      variant='default'
      className='bg-accent text-accent-foreground hover:bg-accent/90 w-full'
      disabled={pending || cooldown > 0
      }
      onClick={handleResendMagicLink}
    >
      {
        pending ? (
          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
        ) : (
          <Mail className='mr-2 h-4 w-4' />
        )}
      {
        pending
          ? 'Sending...'
          : cooldown > 0
            ? `Resend available in ${formatCooldown(cooldown)}`
            : 'Resend Magic Link'
      }
    </Button>
  );
}
