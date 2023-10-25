import type { Post } from "./getPosts";
import { slugifyStr } from "./slugify";

const getUniqueTags = (posts: Post[]) => {
  const tags: string[] = posts
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
