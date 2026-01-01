import { getCurrentUser } from "@/_features/auth/auth.data"
import { redirect } from "next/navigation"

export default async function RequireAuth({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/sign-in")
  }

  return <>{children}</>
}
