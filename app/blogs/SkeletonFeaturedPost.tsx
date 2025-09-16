// app/blogs/SkeletonFeaturedPost.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonFeaturedPost() {
    return (
        <section className="px-4 sm:px-8 md:px-16 lg:px-20 mb-16">
            <div className="mx-auto">
                <div className="bg-white border border-gray-100 shadow-lg rounded-2xl overflow-hidden">
                    <div className="md:flex">
                        <div className="md:w-1/2">
                            <div className="w-full h-64 md:h-full">
                                <Skeleton className="w-full h-full" />
                            </div>
                        </div>
                        <div className="md:w-1/2 p-4 md:p-8 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <Skeleton className="h-6 w-20 rounded-full" />
                                    <Skeleton className="h-6 w-24 rounded-full" />
                                </div>
                                <Skeleton className="h-8 w-3/4 rounded mb-3" />
                                <Skeleton className="h-4 w-full rounded mb-2" />
                                <Skeleton className="h-4 w-10/12 rounded mb-2" />
                                <Skeleton className="h-4 w-8/12 rounded mb-8" />
                            </div>

                            <div>
                                <div className="flex items-center gap-5 text-sm text-gray-400 mb-6">
                                    <Skeleton className="h-4 w-20 rounded" />
                                    <Skeleton className="h-4 w-24 rounded" />
                                    <Skeleton className="h-4 w-20 rounded" />
                                </div>
                                <Skeleton className="h-9 w-40 rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}