// lib/utils.ts

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import imageUrlBuilder from "@sanity/image-url";
import { format, formatDistanceToNowStrict, differenceInDays } from "date-fns";
import { client } from "@/sanity/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const { projectId, dataset } = client.config();
export const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

/**
 * Formats a date based on how recent it is.
 * - If it's within the last 7 days: returns "x days ago"
 * - Otherwise: returns full date like "May 1, 2024"
 */
export const formatPublishedDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  const now = new Date();

  const daysDiff = differenceInDays(now, date);

  if (daysDiff <= 7) {
    return formatDistanceToNowStrict(date, { addSuffix: true });
  } else {
    return format(date, "MMMM d, yyyy");
  }
};
