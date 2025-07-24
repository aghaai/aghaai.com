import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonSingleBlog() {
  return (
    <Card className="rounded-2xl shadow-sm overflow-hidden">
      <Skeleton className="w-full h-44 sm:h-48 md:h-52 lg:h-56 bg-gray-200" />
      <CardContent className="p-5 space-y-3">
        <Skeleton className="h-5 w-20 rounded-md bg-gray-200" /> {/* Category */}
        <Skeleton className="h-6 w-3/4 rounded bg-gray-200" /> {/* Title */}
        <Skeleton className="h-4 w-full rounded bg-gray-200" /> {/* Excerpt 1 */}
        <Skeleton className="h-4 w-2/3 rounded bg-gray-200" /> {/* Excerpt 2 */}
        <div className="flex gap-2 mt-2">
          <Skeleton className="h-4 w-12 rounded bg-gray-200" /> {/* Date */}
          <Skeleton className="h-4 w-16 rounded bg-gray-200" /> {/* Read time */}
        </div>
        <Skeleton className="h-4 w-24 rounded bg-gray-200 mt-2" /> {/* Read More Button */}
      </CardContent>
    </Card>
  );
}
