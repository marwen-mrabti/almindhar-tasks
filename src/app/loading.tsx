import { Skeleton } from "@/components/ui/skeleton";

export default function HomePageLoading() {
  return (
    <div className="flex flex-col items-center justify-center py-4 ">
      <Skeleton className="w-full h-full" />
    </div>
  );
}
