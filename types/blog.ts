// types/blog.ts
export interface SlugType {
  current: string;
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: SlugType | string; // usually SlugType
  mainImage: object; // Use a stricter type if you want
  excerpt: string;
  category: string;
  publishedAt: string;
  estimatedReadingTime: number;
  featured?: boolean;
  author?: string;
}
