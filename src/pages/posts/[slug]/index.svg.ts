import type { APIRoute } from "astro";
import { generateOgSvgForPost } from "@utils/generateOgImages";
import slugify from "@utils/slugify";
import getPosts, { type Post } from "@utils/getPosts";

export const prerender = false;

export async function getStaticPaths() {
  const posts = await getPosts().then(p => p.filter(({ data }) => !data.ogImage));

  return posts.map(post => ({
    params: { slug: slugify(post) },
    props: { post },
  }));
}

export const GET: APIRoute = async ({ props }) =>
  new Response(await generateOgSvgForPost(props.post as Post), {
    headers: { "Content-Type": "image/svg+xml" },
  });
