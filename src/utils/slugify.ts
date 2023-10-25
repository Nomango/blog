import { slug as slugger } from "github-slugger";
import type { Post } from "./getPosts";

export const slugifyStr = (str: string) => slugger(str);

export const slugifyAll = (arr: string[]) => arr.map(str => slugifyStr(str));

export const getPostSlugs = (post: Post) => {
  return [
    post.slug.slice(post.slug.lastIndexOf("/") + 1),
    slugger(post.data.title),
    ...(post.data.alias || []),
  ];
};

const slugify = (post: Post) => getPostSlugs(post)[0];

export default slugify;
