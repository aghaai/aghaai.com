// app/blogs/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import useSWRInfinite from "swr/infinite";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, ArrowRight } from "lucide-react";
import SkeletonSingleBlog from "./SkeletonSingleBlog";
import SkeletonFeaturedPost from "./SkeletonFeaturedPost";
import LayoutWrapper from "@/components/Wrapper/LayoutWrapper";
import { formatPublishedDate, urlFor } from "@/lib/utils";
import Image from "next/image";
import type { BlogPost } from "@/types/blog";
import { motion } from "framer-motion";

const PAGE_SIZE = 6;



const getKey = (
  pageIndex: number,
  previousPageData: BlogPost[] | null
): string | null => {
  if (previousPageData && !previousPageData.length) return null;
  return `/api/?page=${pageIndex}`;
};

const fetcher = async (url: string): Promise<BlogPost[]> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch blogs");
  return res.json();
};

function displayReadTime(mins?: number): string {
  if (!mins) return "";
  if (mins === 1) return "1 min read";
  return `${mins} min read`;
}

export default function Blogs() {
  const { data, setSize, isValidating } = useSWRInfinite<BlogPost[]>(
    getKey,
    fetcher
  );

  const blogs: BlogPost[] = useMemo(() => data?.flat() || [], [data]);
  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.length < PAGE_SIZE);

  const { ref, inView } = useInView();

  // IMPORTANT: avoid calling setState in render
  useEffect(() => {
    if (inView && !isReachingEnd && !isValidating) {
      setSize((prev) => prev + 1);
    }
  }, [inView, isReachingEnd, isValidating, setSize]);

  // --- CATEGORY FILTER LOGIC ---
  const categories: string[] = useMemo(() => {
    return ["All", ...Array.from(new Set(blogs.map((post) => post.category).filter(Boolean)))];
  }, [blogs]);

  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const filteredBlogs =
    selectedCategory === "All"
      ? blogs
      : blogs.filter((b) => b.category === selectedCategory);

  const featuredPost =
    filteredBlogs.find((b) => b.featured) || filteredBlogs[0];

  const heroSubtitle =
    "Expert insights, strategies, and success stories to guide your journey.";
  const fallbackAuthor = "Admin";

  const isInitialLoading = !data;

  return (
    <LayoutWrapper className="flex flex-col items-center w-full font-sans">
      <div className="relative z-10 w-full max-w-[1440px]">
        {/* Hero Section */}
        <section className="py-16 px-4 sm:px-8 md:px-16 lg:px-20">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1
              className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 tracking-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              CSS Preparation Blog
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl text-gray-600 font-normal"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
            >
              {heroSubtitle}
            </motion.p>
          </div>
        </section>

        {/* Featured Post (skeleton during initial load) */}
        {isInitialLoading ? (
          <SkeletonFeaturedPost />
        ) : (
          featuredPost && (
            <section className="px-4 sm:px-8 md:px-16 lg:px-20 mb-16">
              <div className="mx-auto">
                <motion.div
                  className="bg-white border border-gray-100 shadow-lg rounded-2xl overflow-hidden transition-all"
                  whileHover={{
                    scale: 1.01,
                    boxShadow: "0px 8px 36px rgba(24, 42, 68, 0.11)",
                    borderColor: "#e5e7eb",
                  }}
                  transition={{ type: "spring", stiffness: 140, damping: 16 }}
                >
                  <div className="md:flex">
                    <div className="md:w-1/2">
                      <Link
                        href={`/blogs/${typeof featuredPost.slug === "string"
                            ? featuredPost.slug
                            : featuredPost.slug.current
                          }`}
                      >
                        <Image
                          width={800}
                          height={450}
                          src={
                            urlFor(featuredPost.mainImage)
                              ?.width(800)
                              .height(450)
                              .url() || ""
                          }
                          alt={featuredPost.title}
                          className="w-full h-64 md:h-full object-cover cursor-pointer transition-transform duration-500 hover:scale-105"
                          priority
                        />
                      </Link>
                    </div>
                    <div className="md:w-1/2 p-4 md:p-8 flex flex-col justify-between">
                      <div>
                        <Badge className="mb-3 bg-gray-900 text-white font-semibold">
                          Featured
                        </Badge>
                        <Badge
                          variant="outline"
                          className="mb-3 ml-2 border-gray-200 text-gray-800"
                        >
                          {featuredPost.category}
                        </Badge>
                        <Link
                          href={`/blogs/${typeof featuredPost.slug === "string"
                              ? featuredPost.slug
                              : featuredPost.slug.current
                            }`}
                        >
                          <h2 className="hover:underline text-gray-900 text-2xl md:text-3xl mb-3 font-bold">
                            {featuredPost.title}
                          </h2>
                        </Link>
                        <p className="text-gray-600 mb-8">
                          {featuredPost.excerpt}
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center gap-5 text-sm text-gray-400 mb-6">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>{featuredPost.author || fallbackAuthor}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {formatPublishedDate(featuredPost.publishedAt)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>
                              {displayReadTime(
                                featuredPost.estimatedReadingTime
                              )}
                            </span>
                          </div>
                        </div>
                        <Link
                          href={`/blogs/${typeof featuredPost.slug === "string"
                              ? featuredPost.slug
                              : featuredPost.slug.current
                            }`}
                        >
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.97 }}
                          >
                            <Button className="bg-[#1C6758] text-white shadow-none px-6 py-2 rounded-full text-base font-medium">
                              Read Full Article
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </motion.div>
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </section>
          )
        )}

        {/* Categories Filter */}
        <section className="px-4 sm:px-8 md:px-16 lg:px-20 mb-10">
          <div className=" mx-auto">
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <motion.div whileHover={{ scale: 1.08 }} key={category} className="inline-block">
                  <Button
                    type="button"
                    variant={
                      selectedCategory === category ? "default" : "outline"
                    }
                    className={`relative px-6 py-2 rounded-full font-medium transition-all duration-300 group text-gray-900 shadow-none
                      ${selectedCategory === category
                        ? "bg-gray-900 text-white"
                        : "bg-white text-gray-900 border border-gray-200"
                      }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="px-4  pb-20">
          <div className=" mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
              {(isInitialLoading ||
                (filteredBlogs.length === 0 && isValidating)) && (
                  <>
                    {Array(PAGE_SIZE)
                      .fill(0)
                      .map((_, i) => (
                        <SkeletonSingleBlog key={i} />
                      ))}
                  </>
                )}

              {!isInitialLoading &&
                filteredBlogs
                  .filter(
                    (post) => !featuredPost || post._id !== featuredPost._id
                  )
                  .map((post, idx) => (
                    <motion.div
                      key={post._id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.06, duration: 0.5 }}
                      whileHover={{
                        scale: 1.03,
                        boxShadow: "0px 8px 24px rgba(24, 42, 68, 0.08)",
                        borderColor: "#e5e7eb",
                      }}
                      className="bg-white border border-gray-100 shadow rounded-2xl overflow-hidden transition-all"
                    >
                      <div className="aspect-video overflow-hidden">
                        <Link
                          href={`/blogs/${typeof post.slug === "string"
                              ? post.slug
                              : post.slug.current
                            }`}
                        >
                          <Image
                            width={800}
                            height={450}
                            src={
                              urlFor(post.mainImage)
                                ?.width(800)
                                .height(450)
                                .url() || ""
                            }
                            alt={post.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                          />
                        </Link>
                      </div>
                      <CardContent className="p-5">
                        <Badge
                          variant="outline"
                          className="mb-2 border-gray-200 text-gray-800"
                        >
                          {post.category}
                        </Badge>
                        <Link
                          href={`/blogs/${typeof post.slug === "string"
                              ? post.slug
                              : post.slug.current
                            }`}
                        >
                          <h3 className="hover:underline text-base mb-2 font-bold line-clamp-2 text-gray-900">
                            {post.title}
                          </h3>
                        </Link>
                        <p className="text-gray-500 text-sm mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
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
                        <motion.div
                          whileHover={{ scale: 1.06 }}
                          whileTap={{ scale: 0.96 }}
                          className="inline-block"
                        >
                          <Link
                            href={`/blogs/${typeof post.slug === "string"
                                ? post.slug
                                : post.slug.current
                              }`}
                            className="inline-flex items-center text-gray-900 hover:text-gray-700 font-medium text-sm transition-all"
                          >
                            Read More
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </Link>
                        </motion.div>
                      </CardContent>
                    </motion.div>
                  ))}
            </div>

            {!isReachingEnd && (
              <div
                ref={ref}
                className="h-10 mt-6 flex justify-center items-center"
              >
                {isValidating && (
                  <span className="text-sm text-gray-400">
                    Loading more blogs...
                  </span>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </LayoutWrapper>
  );
}