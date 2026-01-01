"use client"

import { authClient } from "@/lib/auth/auth-client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, } from "next/navigation";
import { Skeleton } from "../ui/skeleton";

export const NavLinks = () => {
  const pathname = usePathname()
  const { data: session, isPending } = authClient.useSession()
  const user = session?.user

  return (
    <nav className="flex items-center gap-4">
      {isPending ? <>
        <Skeleton className="w-24 h-6 bg-muted-foreground/30" />
        <Skeleton className="w-24 h-6 bg-muted-foreground/30" />
        <Skeleton className="w-24 h-6 bg-muted-foreground/30" />
      </> : user ?
        <>
          <Link href="/dashboard" className={cn("text-foreground hover:text-primary", {
            "text-primary": pathname === "/dashboard"
          })}>
            Dashboard
          </Link>
          <Link href="/organizations" className={cn("text-foreground hover:text-primary", {
            "text-primary": pathname === "/organization"
          })}>
            Organizations
          </Link>
          <Link href="/projects" className={cn("text-foreground hover:text-primary", {
            "text-primary": pathname === "/projects"
          })}>
            Projects
          </Link>
          <Link href="/tasks" className={cn("text-foreground hover:text-primary", {
            "text-primary": pathname === "/tasks"
          })}>
            Tasks
          </Link>
        </> :
        null
      }
    </nav>
  );
};
