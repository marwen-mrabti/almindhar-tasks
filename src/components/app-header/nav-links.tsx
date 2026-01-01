"use client"

import { authClient } from "@/lib/auth/auth-client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, } from "next/navigation";

export const NavLinks = () => {
  const pathname = usePathname()
  const { data: session } = authClient.useSession()
  const user = session?.user

  return (
    <nav className="flex items-center gap-4">
      <Link href="/" className={cn("text-foreground hover:text-primary", {
        "text-primary": pathname === "/"
      })}>Home</Link>
      {user ?
        <>
          <Link href="/dashboard" className={cn("text-foreground hover:text-primary", {
            "text-primary": pathname === "/dashboard"
          })}>Dashboard</Link>
          <Link href="/tasks" className={cn("text-foreground hover:text-primary", {
            "text-primary": pathname === "/tasks"
          })}>Tasks</Link>
        </> :
        <>
          <Link href="/sign-in" className={cn("text-foreground hover:text-primary", {
            "text-primary": pathname === "/sign-in"
          })}>Sign In</Link>
        </>
      }
    </nav>
  );
};
