
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth/auth-client";
import { cn } from "@/lib/utils";
import { Building2, LayoutDashboardIcon, LogOutIcon, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UserMenu() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession()

  if (isPending) {
    return (
      <>
        <Avatar className='h-9 w-9 animate-pulse'>
          <AvatarFallback>
            <User className='h-5 w-5' />
          </AvatarFallback>
        </Avatar>
      </>
    )
  }


  const user = session?.user

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          router.refresh();
        },
      },
    });
  };

  return (
    !user ?
      <Button variant="outline" render={<Link href="/sign-in" />} nativeButton={false} >
        Sign In
      </Button>
      : <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant='ghost'
              size='icon'
              className='rounded-full'
            />
          }
        >
          <Avatar className='h-9 w-9'>
            <AvatarImage
              src={session?.user.image || undefined}
              alt={session?.user.name}
            />
            <AvatarFallback>
              <User className='h-5 w-5' />
            </AvatarFallback>
          </Avatar>
          <span className='sr-only'>User menu</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-56'>
          <DropdownMenuGroup className={cn('cursor-pointer')}>
            <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              render={<Link href="/dashboard" />}
              className={cn('cursor-pointer')}
            >
              <LayoutDashboardIcon
                className='h-4 w-4'
                data-icon='inline-start'
              />
              Dashboard
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              render={<Link href="/organizations" />}
              className={cn('cursor-pointer')}
            >
              <Building2
                className='h-4 w-4'
                data-icon='inline-start'
              />
              Organizations
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup className='hover:cursor-pointer'>
            <DropdownMenuItem
              onClick={handleLogout}
              className='text-destructive focus:text-destructive cursor-pointer'
            >
              <LogOutIcon className='size-4 ' data-icon='inline-start' />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
  )

}
