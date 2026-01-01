import { getCurrentUser } from "@/_features/auth/auth.data"
import { SignInForm } from "@/_features/auth/components/sign-in-form"
import SignInFormSkeleton from "@/_features/auth/components/sign-in-form-sekelton"
import { Suspense } from "react"

export default async function Page() {
  const user = await getCurrentUser()

  return (<div className="flex flex-col items-center justify-center py-4 ">
    <Suspense>
      {user ? (
        <div>
          <p>Welcome back, {user.name}!</p>
          <p>Your email is {user.email}.</p>
        </div>
      ) : (
        <Suspense fallback={<SignInFormSkeleton />}>
          <SignInForm />
        </Suspense>
      )
      }
    </Suspense>
  </div >)
}
