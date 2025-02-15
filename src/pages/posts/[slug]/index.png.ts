import type { APIRoute } from "astro";
import { generateOgImageForPost } from "@utils/generateOgImages";
import slugify from "@utils/slugify";
import getPosts, { type Post } from "@utils/getPosts";

export const prerender = false;

// export async function getStaticPaths() {
//   const posts = await getPosts().then(p => p.filter(({ data }) => !data.ogImage));

//   return posts.map(post => ({
//     params: { slug: slugify(post) },
//     props: { post },
//   }));
// }

export const GET: APIRoute = async ({ params: { slug } }) => {
  const posts = await getPosts().then(p => p.filter((p) => slugify(p) == slug && !p.data.ogImage));
  if (posts.length == 0) {
    return new Response(null, {
      status: 404,
      statusText: 'Not found'
    });
  }
  return new Response(await generateOgImageForPost(posts[0]), {
    headers: { "Content-Type": "image/png" },
  });
}
