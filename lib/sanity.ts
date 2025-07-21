// lib/sanity.ts
import { createClient } from '@sanity/client'

export const sanity = createClient({
  projectId: 'bwbbv78d', // your projectId
  dataset: 'production',
  apiVersion: '2023-07-21', // use today's date or the latest one
  useCdn: true,
})
