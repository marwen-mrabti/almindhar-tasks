import "server-only"

import { auth, type User } from "@/lib/auth/auth"
import { headers } from "next/headers"

export const getCurrentUser = async (): Promise<User | null> => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  return session?.user ?? null
}
