import { SignInForm } from "@/_features/auth/components/sign-in-form";
import type { Metadata } from 'next';
import { Suspense } from "react";

export const metadata: Metadata = {
  title: 'Sign In',
}

export default function SignInPage() {
  return (
    <div className="flex flex-col items-center justify-center py-4 ">
      <Suspense>
        <SignInForm />
      </Suspense>
    </div>
  );
}
