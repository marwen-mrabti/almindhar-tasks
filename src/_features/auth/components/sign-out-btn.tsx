"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";

export default function SignOutBtn() {
  const { data } = authClient.useSession()
  const handleLogout = async () => {
    await authClient.signOut()
  };

  if (!data?.session || !data?.user) {
    return null
  }

  return <Button onClick={handleLogout}>
    logout
  </Button>
}
