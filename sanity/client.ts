import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "bwbbv78d",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});