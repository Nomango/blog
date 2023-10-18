import { z } from "astro:content";

export const blogSchema = z
  .object({
    author: z.string().optional(),
    date: z.date(),
    title: z.string(),
    postSlug: z.string().optional(),
    featured: z.boolean().optional(),
    draft: z.boolean().optional(),
    tags: z.array(z.string()).default(["others"]),
    ogImage: z.string().optional(),
    description: z.string().optional(),
    canonicalURL: z.string().optional(),
  })
  .strict();

export type BlogFrontmatter = z.infer<typeof blogSchema>;
