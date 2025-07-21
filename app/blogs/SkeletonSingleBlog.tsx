// app/blogs/SkeletonSingleBlog.tsx

import React from "react";

const SkeletonSingleBlog = () => {
  return (
    <div className="group overflow-hidden rounded-lg border shadow-sm transition-all hover:shadow-md">
      <div className="relative h-48 w-full overflow-hidden bg-secondary animate-pulse"></div>
      <div className="p-4">
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
          <div className="h-6 w-16 bg-secondary animate-pulse rounded-md"></div>
          <div className="h-6 w-16 bg-secondary animate-pulse rounded-md"></div>
        </div>
        <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2 h-12 bg-secondary animate-pulse rounded-md"></h3>
        <p className="text-sm text-muted-foreground line-clamp-2 h-12 bg-secondary animate-pulse rounded-md"></p>
      </div>
    </div>
  );
};

export default SkeletonSingleBlog;
