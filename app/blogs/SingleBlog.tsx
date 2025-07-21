// app/blogs/SingleBlog.tsx

import { Badge } from "@/components/ui/badge";
import { formatPublishedDate, urlFor } from "@/lib/utils";
import { CalendarIcon, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type singleBlogProps = {
  slug: string;
  _id: number | string;
  mainImage: object;
  title: string;
  category: string;
  excerpt: string;
  estimatedReadingTime: number;
  isFeatured: boolean;
  publishedAt: string;
  titleClassName?: string;
};

const SingleBlog = (blog: singleBlogProps) => {
  return (
    <div
      key={blog._id}
      className="group overflow-hidden rounded-lg border shadow-sm transition-all hover:shadow-md"
    >
      <Link href={`/blogs/${blog.slug}`} className="block h-full">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={urlFor(blog.mainImage)?.width(800).height(450).url() || ""}
            alt={blog.title}
            fill
            priority
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {blog.category && (
            <div className="absolute bottom-2 left-2 z-50">
              <Badge variant="default" className="py-1">
                {blog.category}
              </Badge>
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
            <div className="flex items-center gap-1">
              <CalendarIcon size={12} />
              <span>{formatPublishedDate(blog.publishedAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={12} />
              <span>{blog.estimatedReadingTime} min read</span>
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2 h-14">
            {blog.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 h-[40px]">
            {blog.excerpt}
          </p>
          <div className="mt-3 flex items-center  text-sm text-primary font-medium">
            Read more
          </div>
        </div>
      </Link>
    </div>
  );
};

export default SingleBlog;
