

import SignInFormSkeleton from '@/_features/auth/components/sign-in-form-sekelton';

export default function SignInPageLoadingSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center py-4">
      <SignInFormSkeleton />
    </div>
  );
}
