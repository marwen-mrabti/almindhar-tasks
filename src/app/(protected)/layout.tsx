import RequireAuth from "@/_features/auth/components/require-auth"
import { Suspense } from "react"

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <Suspense fallback={null}>
      <RequireAuth>{children}</RequireAuth>
    </Suspense>
  )
}
