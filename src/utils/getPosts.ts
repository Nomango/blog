import { getCollection, type CollectionEntry } from "astro:content";
import { slugifyStr } from "./slugify";

export type Post = Pick<CollectionEntry<"blog">, "slug" | "data" | "render">;

export const getPosts = async (): Promise<Post[]> => await getCollection("blog", ({ data }) => !data.draft);

export const getSortedPosts = (posts: Post[]) =>
  posts.sort(
    (a, b) => Math.floor(new Date(b.data.date).getTime() / 1000) - Math.floor(new Date(a.data.date).getTime() / 1000)
  );

export const getPostsByTag = (posts: Post[], tag: string) =>
  posts.filter(post => post.data.tags.map(tag => slugifyStr(tag)).includes(slugifyStr(tag)));

export default getPosts;
