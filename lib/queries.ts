// lib/queries.ts
export const allPostsQuery = `*[_type == "blogPost"] | order(publishedAt desc){
  _id,
  title,
  excerpt,
  "author": author->name,
  publishedAt,
  "slug": slug.current,
  "image": mainImage.asset->url,
  category->{
    title
  }
}`

export const featuredPostQuery = `*[_type == "blogPost" && featured == true][0]{
  _id,
  title,
  excerpt,
  "author": author->name,
  publishedAt,
  "slug": slug.current,
  "image": mainImage.asset->url,
  category->{
    title
  }
}`
