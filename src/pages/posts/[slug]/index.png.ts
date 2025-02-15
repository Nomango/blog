import type { APIRoute } from "astro";
import { generateOgImageForPost } from "@utils/generateOgImages";
import slugify from "@utils/slugify";
import getPosts, { type Post } from "@utils/getPosts";

export const prerender = true;

export async function getStaticPaths() {
  const posts = await getPosts().then(p => p.filter(({ data }) => !data.ogImage));

  return posts.map(post => ({
    params: { slug: slugify(post) },
    props: { post },
  }));
}

export const GET: APIRoute = async ({ props: { post } }) => {
  return new Response(await generateOgImageForPost(post as Post), {
    headers: { "Content-Type": "image/png" },
  });
}
