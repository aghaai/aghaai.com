"use client";

import useSWRInfinite from "swr/infinite";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, ArrowRight } from "lucide-react";
import SkeletonSingleBlog from "./SkeletonSingleBlog";
import LayoutWrapper from "@/components/Wrapper/LayoutWrapper";
import { formatPublishedDate, urlFor } from "@/lib/utils";
import Image from "next/image";
import { BlogPost } from "@/types/blog";

const PAGE_SIZE = 6;

const getKey = (pageIndex: number, previousPageData: BlogPost[] | null) => {
  if (previousPageData && !previousPageData.length) return null;
  return `/api/?page=${pageIndex}`;
};
const fetcher = async (url: string): Promise<BlogPost[]> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch blogs");
  return res.json();
};

export default function Blogs() {
  const { data, setSize, isValidating } = useSWRInfinite<BlogPost[]>(
    getKey,
    fetcher
  );
  const blogs: BlogPost[] = data?.flat() || [];
  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.length < PAGE_SIZE);

  const { ref, inView } = useInView();

  if (inView && !isReachingEnd && !isValidating) setSize((prev) => prev + 1);

  const categories: string[] = [
    "All",
    ...Array.from(new Set(blogs.map((post) => post.category).filter(Boolean))),
  ];

  const featuredPost = blogs.find((b) => b.featured) || blogs[0];

  const heroSubtitle =
    "Expert insights, preparation strategies, and success stories to guide your CSS journey.";

  const fallbackAuthor = "Admin";

  function displayReadTime(mins?: number) {
    if (!mins) return "";
    if (mins === 1) return "1 min read";
    return `${mins} min read`;
  }

  return (
    <LayoutWrapper className="bg-[#fafafa] flex flex-col items-center w-full font-poppins">
      <div className="bg-[#fafafa] w-full max-w-[1440px]">
        {/* Hero Section */}
        <section className="py-16 px-4 sm:px-8 md:px-16 lg:px-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-medium mb-6 text-[#111827]">
              CSS Preparation Blog
            </h1>
            <p className="text-xl font-normal text-[#6b7280]">
              {heroSubtitle}
            </p>
          </div>
        </section>

        {/* Featured Post */}
        {featuredPost && (
          <section className="px-4 sm:px-8 md:px-16 lg:px-20 mb-12">
            <div className="max-w-6xl mx-auto">
              <Card className="bg-white border border-[#e5e7eb] shadow-[0px_5px_10px_0px_rgba(0,0,0,0.10)] rounded-xl overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/2">
                    <Link href={`/blogs/${typeof featuredPost.slug === "string" ? featuredPost.slug : featuredPost.slug.current}`}>
                      <Image
                        width={800}
                        height={450}
                        src={urlFor(featuredPost.mainImage)?.width(800).height(450).url() || ""}
                        alt={featuredPost.title}
                        className="w-full h-64 md:h-full object-cover cursor-pointer"
                        priority
                      />
                    </Link>
                  </div>
                  <div className="md:w-1/2 p-8">
                    <Badge className="mb-4 bg-[#1c6758] text-white">Featured</Badge>
                    <Badge variant="outline" className="mb-4 ml-2 border-[#e5e7eb] text-[#1c6758]">{featuredPost.category}</Badge>
                    <Link href={`/blogs/${typeof featuredPost.slug === "string" ? featuredPost.slug : featuredPost.slug.current}`}>
                      <h2 className="hover:underline text-[#111827] text-3xl mb-4 font-medium">
                        {featuredPost.title}
                      </h2>
                    </Link>
                    <p className="text-[#6b7280] mb-6">{featuredPost.excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-[#6b7280] mb-6">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{featuredPost.author || fallbackAuthor}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatPublishedDate(featuredPost.publishedAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{displayReadTime(featuredPost.estimatedReadingTime)}</span>
                      </div>
                    </div>
                    <Link href={`/blogs/${typeof featuredPost.slug === "string" ? featuredPost.slug : featuredPost.slug.current}`}>
                      <Button className="bg-[#1c6758] text-white hover:bg-[#155642]">
                        Read Full Article
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </div>
          </section>
        )}

        {/* Categories Filter */}
        <section className="px-4 sm:px-8 md:px-16 lg:px-20 mb-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category, index) => (
                <Button
                  key={category}
                  variant={index === 0 ? "default" : "outline"}
                  className={`px-6 py-2 rounded-full font-medium ${index === 0 ? "bg-[#1c6758] text-white" : "bg-white text-[#1c6758] border border-[#e5e7eb]"}`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="px-4 sm:px-8 md:px-16 lg:px-20 pb-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.length === 0 && isValidating && (
                <>
                  {Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <SkeletonSingleBlog key={i} />
                    ))}
                </>
              )}
              {blogs
                .filter((post) => !featuredPost || post._id !== featuredPost._id)
                .map((post) => (
                  <Card
                    key={post._id}
                    className="bg-white border border-[#e5e7eb] shadow-[0px_5px_10px_0px_rgba(0,0,0,0.10)] rounded-xl overflow-hidden hover:shadow-[0px_3px_10px_0px_rgba(28,103,88,0.5)] transition-shadow"
                  >
                    <div className="aspect-video overflow-hidden">
                      <Link href={`/blogs/${typeof post.slug === "string" ? post.slug : post.slug.current}`}>
                        <Image
                          width={800}
                          height={450}
                          src={urlFor(post.mainImage)?.width(800).height(450).url() || ""}
                          alt={post.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                        />
                      </Link>
                    </div>
                    <CardContent className="p-6">
                      <Badge variant="outline" className="mb-3 border-[#e5e7eb] text-[#1c6758]">
                        {post.category}
                      </Badge>
                      <Link href={`/blogs/${typeof post.slug === "string" ? post.slug : post.slug.current}`}>
                        <h3 className="hover:underline text-lg mb-3 font-medium line-clamp-2 text-[#111827]">
                          {post.title}
                        </h3>
                      </Link>
                      <p className="text-[#6b7280] text-sm mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-[#6b7280] mb-4">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{post.author || fallbackAuthor}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatPublishedDate(post.publishedAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{displayReadTime(post.estimatedReadingTime)}</span>
                        </div>
                      </div>
                      <Link
                        href={`/blogs/${typeof post.slug === "string" ? post.slug : post.slug.current}`}
                        className="inline-flex items-center text-[#1c6758] hover:text-[#155642] font-medium text-sm"
                      >
                        Read More
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    </CardContent>
                  </Card>
                ))}
            </div>
            {!isReachingEnd && (
              <div ref={ref} className="h-10 mt-6 flex justify-center items-center">
                {isValidating && (
                  <span className="text-sm text-gray-500">Loading more blogs...</span>
                )}
              </div>
            )}
          </div>
        </section>


      </div>
    </LayoutWrapper>
  );
}
