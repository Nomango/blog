import type { APIRoute } from "astro";
import { generateOgImageForPost } from "@utils/generateOgImages";
import { getPostSlugs } from "@utils/slugify";
import getPosts, { type Post } from "@utils/getPosts";

export async function getStaticPaths() {
  const posts = await getPosts().then(p =>
    p.filter(({ data }) => !data.ogImage)
  );

  return posts.reduce(
    (all, post) => {
      return [
        ...all,
        ...getPostSlugs(post).map(slug => ({
          params: { slug },
          props: { post },
        })),
      ];
    },
    [] as { params: any; props: { post: Post } }[]
  );
}

export const GET: APIRoute = async ({ props }) =>
  new Response(await generateOgImageForPost(props.post as Post), {
    headers: { "Content-Type": "image/png" },
  });
