import RequireGuest from "@/_features/auth/components/require-guest"
import { Skeleton } from "@/components/ui/skeleton"
import { Suspense } from "react"

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <Suspense fallback={<Skeleton className="" />}>
      <RequireGuest>{children}</RequireGuest>
    </Suspense>
  )
}
