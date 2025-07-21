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
      // publishedTime: post.publishedAt,
      images: post.mainImage
        ? [urlFor(post.mainImage)?.width(1200).height(630).url() || ""]
        : [],
    },
  };
}

export default async function BlogPage({ params }: { params: Params }) {
  const postSlug = (await params).slug;
  const blog = await client.fetch(getBlogPostQuery, { slug: postSlug });
  console.log("single blog", blog);
  if (!blog) return notFound();

  return (
    <React.Fragment>
      <LayoutWrapper className="md:pt-6">
        <Link
          href="/blogs"
          className="flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to all blogs</span>
        </Link>
      </LayoutWrapper>
      <LayoutWrapper className="lg:max-w-xl xl:max-w-4xl">
        <h1 className="text-4xl font-bold mb-6 text-center">{blog.title}</h1>
        <div className="flex items-center justify-center gap-2 lg:gap-4">
          <div className="flex items-center gap-6 text-muted-foreground mb-8">
            <div className="flex items-center gap-2">
              <FileType2 size={16} />
              <span>{blog.category.title}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon size={16} />
              <span>{formatPublishedDate(blog.publishedAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>{blog.estimatedReadingTime} min read</span>
            </div>
          </div>
        </div>
        {blog.mainImage && (
          <Image
            src={urlFor(blog.mainImage)?.width(800).height(450).url() || ""}
            alt={blog.title}
            width={800}
            height={450}
            className="rounded-lg my-6 object-contain"
            priority
          />
        )}

        <PortableTextRenderer value={blog.body} />
        <div className="mt-8 pt-6 border-t">
          <h3 className="text-lg font-semibold mb-3">Tags:</h3>
          <div className="flex flex-wrap gap-2">
            {blog.tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="px-3 py-1 bg-muted rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </LayoutWrapper>
      <Related
        slug={blog.slug.current}
        categoryId={blog.category?._id}
        tags={blog.tags}
      />
    </React.Fragment>
  );
}
