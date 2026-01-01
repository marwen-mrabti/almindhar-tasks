import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center">
      <Skeleton className="w-full h-full bg-muted-foreground/30" />
    </div>
  );
}
