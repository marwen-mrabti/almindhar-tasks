import SignInFormSkeleton from '@/_features/auth/components/sign-in-form-skeleton';

export default function SignInPageLoadingSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center py-4">
      <SignInFormSkeleton />
    </div>
  );
}
