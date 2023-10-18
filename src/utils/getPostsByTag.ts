import { slugifyTag } from "./slugify";
import type { CollectionEntry } from "astro:content";

const getPostsByTag = (posts: CollectionEntry<"blog">[], tag: string) =>
  posts.filter(post =>
    post.data.tags
      .map(tag => slugifyTag(tag).toLowerCase())
      .includes(tag.toLowerCase())
  );

export default getPostsByTag;
