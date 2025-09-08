// app/api/route.ts

import { NextResponse } from "next/server";
import { client } from "../../sanity/client";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") || 0);
  const limit = 6;
  const start = page * limit;
  const end = start + limit;

  const query = `
    *[_type == "blogPost" && publishedAt <= now()] | order(publishedAt desc)[${start}...${end}]{
      _id,
      title,
      slug,
      mainImage,
      "category": category->title,
      excerpt,
      publishedAt,
      "estimatedReadingTime": select(
        round(length(pt::text(body)) / 5 / 180) < 1 => 1,
        round(length(pt::text(body)) / 5 / 180)
      ),
      featured
    }
  `;

  const data = await client.fetch(query);
  return NextResponse.json(data);
}
