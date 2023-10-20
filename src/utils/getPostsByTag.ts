import { slugifyStr } from "./slugify";
import type { CollectionEntry } from "astro:content";

const getPostsByTag = (posts: CollectionEntry<"blog">[], tag: string) =>
  posts.filter(post =>
    post.data.tags.map(tag => slugifyStr(tag)).includes(slugifyStr(tag))
  );

export default getPostsByTag;
