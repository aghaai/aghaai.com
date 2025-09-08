// lib/sanityQueries.ts

import { client } from "@/sanity/client";

const options = { next: { revalidate: 30 } };

export const fetchBlogsByPage = async (start = 0, end = 6) => {
  const query = `*[_type == "blogPost" && publishedAt <= now()] 
    | order(publishedAt desc)[$start...$end]{
      _id,
      title,
      slug,
      mainImage,
      excerpt,
      "category": category->title,
      tags,
      body,
      publishedAt,
      "estimatedReadingTime": select(
        round(length(pt::text(body)) / 5 / 180) < 1 => 1,
        round(length(pt::text(body)) / 5 / 180)
      ),
      featured
    }`;

  return await client.fetch(query, { start, end }, options);
};

export const getBlogPostQuery = `
  *[_type == "blogPost" && slug.current == $slug && publishedAt <= now()] | order(publishedAt desc)[0]{
    title,
    slug,
    mainImage,
    excerpt,
    category->{title,_id},
    tags,
    metaTitle,
    metaDescription,
    publishedAt,
    body,
    "estimatedReadingTime": select(
      round(length(pt::text(body)) / 5 / 180) < 1 => 1,
      round(length(pt::text(body)) / 5 / 180)
    ),
    featured
  }
`;

export const fetchRelatedBlogs = async (
  slug: string,
  categoryId: string,
  tags?: string[] // optional
) => {
  if (!slug || !categoryId) return [];

  const categoryQuery = `*[_type == "blogPost" && slug.current != $slug && category._ref == $categoryId && publishedAt <= now()] 
    | order(publishedAt desc)[0...4]{
      _id,
      title,
      slug,
      mainImage,
      excerpt,
      category->{title},
      publishedAt,
      "estimatedReadingTime": select(
        round(length(pt::text(body)) / 5 / 180) < 1 => 1,
        round(length(pt::text(body)) / 5 / 180)
      ),
      featured
    }`;

  const categoryResults = await client.fetch(categoryQuery, {
    slug,
    categoryId,
  });

  if (categoryResults.length > 0) {
    return categoryResults;
  }

  // ✅ Safe fallback for null/undefined tags
  const safeTags = Array.isArray(tags) ? tags : [];

  if (safeTags.length === 0) {
    return [];
  }

  const tagQuery = `*[_type == "blogPost" && slug.current != $slug && count(tags[@ in $tags]) > 0 && publishedAt <= now()] 
    | order(publishedAt desc)[0...4]{
      _id,
      title,
      slug,
      mainImage,
      excerpt,
      category,
      "estimatedReadingTime": select(
        round(length(pt::text(body)) / 5 / 180) < 1 => 1,
        round(length(pt::text(body)) / 5 / 180)
      ),
      featured
    }`;

  const tagResults = await client.fetch(tagQuery, { slug, tags: safeTags });

  return tagResults;
};

export const fetchAllCategories = async () => {
  const query = `*[_type == "category"] | order(title asc){
    _id,
    title
  }`;

  return await client.fetch(query, {}, options);
};
