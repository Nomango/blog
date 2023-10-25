import rss from "@astrojs/rss";
import slugify from "@utils/slugify";
import { SITE } from "@config";
import getPosts, { getSortedPosts } from "@utils/getPosts";

export async function GET() {
  const sortedPosts = getSortedPosts(await getPosts());
  return rss({
    title: SITE.title,
    description: SITE.desc,
    site: SITE.website,
    items: sortedPosts.map(post => ({
      link: `posts/${slugify(post)}`,
      title: post.data.title,
      description: post.data.description,
      pubDate: new Date(post.data.date),
    })),
  });
}
