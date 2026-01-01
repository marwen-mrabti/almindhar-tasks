import { getCurrentUser } from "@/_features/auth/auth.data"
import { SignInForm } from "@/_features/auth/components/sign-in-form"
import SignInFormSkeleton from "@/_features/auth/components/sign-in-form-skeleton"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Suspense } from "react"

export default async function Page() {
  const user = await getCurrentUser()

  return (
    <div className="flex flex-col items-center justify-center py-4 ">
      {user ? (
        <Suspense fallback={<div>Loading...</div>}>
          <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-xl font-bold">Welcome back, {user.name}!</p>
            <Button variant="default" render={<Link href="/dashboard" />} nativeButton={false}>
              Check Your Tasks and Projects
            </Button>
          </div>
        </Suspense>
      ) : (
        <Suspense fallback={<SignInFormSkeleton />}>
          <SignInForm />
        </Suspense>
      )
      }
    </div >)
}
