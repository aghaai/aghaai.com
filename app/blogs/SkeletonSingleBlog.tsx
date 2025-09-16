// app/blogs/SkeletonSingleBlog.tsx

import { CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonSingleBlog() {
  return (
    <div className="bg-white border border-gray-100 shadow rounded-2xl overflow-hidden transition-all">
      <div className="aspect-video overflow-hidden">
        <Skeleton className="h-full w-full" />
      </div>
      <CardContent className="p-5">
        <Skeleton className="h-6 w-20 rounded-full mb-2" />
        <Skeleton className="h-6 w-3/4 rounded mb-2" />
        <div className="space-y-2 mb-4">
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-11/12 rounded" />
          <Skeleton className="h-4 w-9/12 rounded" />
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
          <Skeleton className="h-4 w-20 rounded" />
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-4 w-16 rounded" />
        </div>
        <Skeleton className="h-5 w-24 rounded" />
      </CardContent>
    </div>
  );
}