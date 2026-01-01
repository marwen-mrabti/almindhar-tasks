"use client"

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, } from "next/navigation";

export const NavLinks = () => {
  const pathname = usePathname()


  return (
    <nav className="flex items-center space-x-4">
      <Link href="/" className={cn("text-foreground hover:text-primary", {
        "text-primary": pathname === "/"
      })}>Home</Link>
    </nav>
  );
};
