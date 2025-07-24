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
      className="group flex flex-col overflow-hidden rounded-lg shadow-lg hover:shadow-lg transition-all duration-300 hover:scale-105 mb-5"
    >
      <Link href={`/blogs/${blog.slug}`} className="flex flex-col h-full">
        {/* Image */}
        <div className="relative h-56 w-full overflow-hidden">
          <Image
            src={urlFor(blog.mainImage)?.width(800).height(450).url() || ""}
            alt={blog.title}
            fill
            priority
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {blog.category && (
            <div className="absolute top-3 left-3 z-10">
              <Badge variant="default" className="text-xs px-2 py-1 rounded-xl bg-black text-white">
                {blog.category}
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col justify-between p-5 flex-1">
          <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <CalendarIcon size={14} />
              <span>{formatPublishedDate(blog.publishedAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{blog.estimatedReadingTime} min read</span>
            </div>
          </div>

          <h3 className="text-lg font-semibold leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {blog.title}
          </h3>

          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {blog.excerpt}
          </p>

          <span className="text-sm font-medium text-primary hover:underline mt-auto">
            Read more →
          </span>
        </div>
      </Link>
    </div>
  );
};

export default SingleBlog;
