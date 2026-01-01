import { getCurrentUser } from "@/_features/auth/auth.data"
import { redirect } from "next/navigation"

export default async function RequireGuest({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (user) {
    redirect("/dashboard")
  }

  return <>{children}</>
}
