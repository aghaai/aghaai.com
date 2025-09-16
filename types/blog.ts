// types/blog.ts
export interface SlugType {
  current: string;
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: SlugType | string;
  mainImage: object;
  excerpt: string;
  category: string;
  publishedAt: string;
  estimatedReadingTime: number;
  featured?: boolean;
  author?: string;
}
