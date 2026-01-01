import { getCurrentUser } from "@/app/_features/auth/auth.data"
import { redirect } from "next/navigation"

export default async function RequireGuest({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (user) {
    redirect("/notes")
  }

  return <>{children}</>
}
