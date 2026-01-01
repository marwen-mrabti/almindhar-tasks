
import Logo from "@/app/assets/logo-colored.png";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function SignInFormSkeleton({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex flex-col gap-6 w-full max-w-md mx-auto', className)} {...props}>
      <Card>
        <CardHeader className='text-center flex flex-col items-center gap-2'>
          <div className="flex items-center justify-center w-full">
            <Separator className="w-1/5!" />
            <Image src={Logo} alt="Alminthar Tasks Logo" className={cn("mx-1 w-32 flex-1 dark:invert")} loading="eager" />
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
          <div className='flex flex-col gap-4'>
            <Skeleton className='h-10 w-full bg-muted-foreground/30' />
            <div className='relative my-2'>
              <div className='absolute inset-0 flex items-center'>
                <Skeleton className='h-px w-full bg-muted-foreground/30' />
              </div>
              <div className='relative flex justify-center text-xs uppercase'>
                <Skeleton className='h-4 w-48 mx-2 bg-muted-foreground/30' />
              </div>
              <div className='flex justify-center mt-1'>
                <Skeleton className='h-3 w-64 bg-muted-foreground/30' />
              </div>
            </div>

            {/* Username field skeleton */}
            <div className='space-y-2'>
              <Skeleton className='h-4 w-20 bg-muted-foreground/30' />
              <Skeleton className='h-10 w-full bg-muted-foreground/30' />
            </div>

            {/* Email field skeleton */}
            <div className='space-y-2'>
              <Skeleton className='h-4 w-12 bg-muted-foreground/30' />
              <Skeleton className='h-10 w-full bg-muted-foreground/30' />
            </div>

            {/* Submit button skeleton */}
            <Skeleton className='h-10 w-full bg-muted-foreground/30' />
          </div>
        </CardContent>
      </Card>

      {/* Terms of service skeleton */}
      <div className='px-6 text-center'>
        <Skeleton className='h-4 w-80 mx-auto bg-muted-foreground/30' />
      </div>
    </div>
  );
}
