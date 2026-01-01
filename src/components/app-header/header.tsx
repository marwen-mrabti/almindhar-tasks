import Logo from "@/app/assets/logo-colored.png";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import ModeToggle from "./mode-toggle";
import { NavLinks } from "./nav-links";
import UserMenu from "./user-menu";
export default function Header() {

  return (
    <header className="sticky top-0 container mx-auto  flex items-center justify-between px-4 py-4 shadow-sm backdrop-blur-lg bg-secondary">
      <Link href="/" className="flex items-center">
        <Image src={Logo} alt="Alminthar Tasks Logo" className={cn("w-32 dark:invert")} loading="eager" />
      </Link>
      <Suspense fallback={null}>
        <NavLinks />
      </Suspense>
      <div className="flex items-center gap-4">
        <Suspense fallback={null}>
          <UserMenu />
        </Suspense>
        <ModeToggle />
      </div>
    </header>
  );
}
