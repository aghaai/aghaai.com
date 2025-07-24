import { getBlogPostQuery } from "@/lib/sanityQueries";
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { formatPublishedDate, urlFor } from "@/lib/utils";
import dynamic from "next/dynamic";
import React from "react";
import PortableTextRenderer from "./PortableTextRenderer";
import { ArrowLeft, CalendarIcon, Clock, FileType2 } from "lucide-react";
import Link from "next/link";
import { client } from "@/app/sanity/client";
import LayoutWrapper from "@/components/Wrapper/LayoutWrapper";

const Related = dynamic(() => import("./related"));

type Params = Promise<{ slug: string }>;

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const postSlug = (await params).slug;
  const post = await client.fetch(getBlogPostQuery, { slug: postSlug });

  if (!post) return { title: "Not Found" };

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || "",
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      type: "article",
      images: post.mainImage
        ? [urlFor(post.mainImage)?.width(1200).height(630).url() || ""]
        : [],
    },
  };
}

export default async function BlogPage({ params }: { params: Params }) {
  const postSlug = (await params).slug;
  const blog = await client.fetch(getBlogPostQuery, { slug: postSlug });

  if (!blog) return notFound();

  return (
    <React.Fragment>
      <LayoutWrapper className="md:pt-6">
        <Link
          href="/blogs"
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 text-sm mb-8 transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Back to all blogs</span>
        </Link>
      </LayoutWrapper>

      <LayoutWrapper className="w-full lg:max-w-2xl xl:max-w-4xl 2xl:max-w-5xl pb-12">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold mb-5 text-center text-gray-900 leading-tight">{blog.title}</h1>

        {/* Meta */}
        <div className="flex items-center justify-center flex-wrap gap-5 text-sm text-gray-500 mb-6">
          {blog.category?.title && (
            <div className="flex items-center gap-1">
              <FileType2 size={16} />
              <span>{blog.category.title}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <CalendarIcon size={16} />
            <span>{formatPublishedDate(blog.publishedAt)}</span>
          </div>
          {blog.estimatedReadingTime && (
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>{blog.estimatedReadingTime} min read</span>
            </div>
          )}
        </div>

        {/* Main Image */}
        {blog.mainImage && (
          <div className="w-full rounded-xl overflow-hidden shadow-sm mb-8 flex items-center justify-center">
            <Image
              src={urlFor(blog.mainImage)?.width(800).height(450).url() || ""}
              alt={blog.title}
              width={800}
              height={450}
              className="rounded-xl object-cover max-h-80 w-full"
              priority
            />
          </div>
        )}

        {/* Body */}
        <div className="prose prose-gray max-w-none mx-auto mb-10 prose-headings:font-semibold prose-h2:mt-8 prose-h2:mb-2 prose-p:leading-relaxed">
          <PortableTextRenderer value={blog.body} />
        </div>

        {/* Tags Section - only show if tags exist */}
        {Array.isArray(blog.tags) && blog.tags.length > 0 && (
          <div className="pt-6 mt-8 border-t border-gray-100">
            <h3 className="text-base font-semibold mb-2 text-gray-900">Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </LayoutWrapper>

      {/* Related Posts */}
      <Related
        slug={blog.slug.current}
        categoryId={blog.category?._id}
        tags={blog.tags}
      />
    </React.Fragment>
  );
}
