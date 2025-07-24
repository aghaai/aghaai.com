// components/blog/related.tsx
import { fetchRelatedBlogs } from "@/lib/sanityQueries";
import { SanityDocument } from "next-sanity";
import SingleBlog from "../SingleBlog";
import LayoutWrapper from "@/components/Wrapper/LayoutWrapper";

interface RelatedProps {
  slug: string;
  categoryId: string;
  tags: string[];
}

export default async function Related({
  slug,
  categoryId,
  tags,
}: RelatedProps) {
  if (!categoryId) return null;

  const relatedBlogs: SanityDocument[] = await fetchRelatedBlogs(
    slug,
    categoryId,
    tags
  );

  if (!relatedBlogs.length) {
    return (
      <div className="mt-12 text-center text-sm text-gray-500">
        No related posts found. Check out more from our blog!
      </div>
    );
  }

  return (
    <aside
      aria-label="Related articles"
      className="py-10 lg:py-14 border-t border-gray-100"
    >
      <LayoutWrapper>
        <h2 className="mb-8 text-2xl xl:text-4xl font-semibold text-gray-900 text-center">Related Articles</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {relatedBlogs.map((post) => (
            <SingleBlog
              key={post._id}
              _id={post._id}
              slug={post.slug.current}
              mainImage={post.mainImage}
              title={post.title}
              category={post.category.title}
              excerpt={post.excerpt}
              estimatedReadingTime={post.estimatedReadingTime}
              isFeatured={post.featured}
              publishedAt={post.publishedAt}
              titleClassName="text-lg font-semibold"
            />
          ))}
        </div>
      </LayoutWrapper>
    </aside>
  );
}
