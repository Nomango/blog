import { slugifyStr } from "./slugify";
import type { CollectionEntry } from "astro:content";

const getUniqueTags = (posts: CollectionEntry<"blog">[]) => {
  const filteredPosts = posts.filter(({ data }) => !data.draft);
  const tags: string[] = filteredPosts
    .flatMap(post => post.data.tags)
    .filter(
      (value: string, index: number, self: string[]) =>
        self.indexOf(value) === index
    )
    .sort((tagA: string, tagB: string) =>
      slugifyStr(tagA).localeCompare(slugifyStr(tagB))
    );
  return tags;
};

export default getUniqueTags;
