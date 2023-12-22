import slugify from "@utils/slugify";
import Datetime from "./Datetime";
import type { Post } from "@utils/getPosts";

export interface Props {
  post: Post;
  secHeading?: boolean;
}

export default function Card({ post, secHeading = true }: Props) {
  const { title, date: pubDatetime, description } = post.data;

  const headerProps = {
    style: { viewTransitionName: `post-${slugify(post)}` },
    className: "text-lg font-medium decoration-dashed hover:underline",
  };

  return (
    <li className="my-6">
      <a
        href={`/posts/${slugify(post)}`}
        className="inline-block text-lg font-medium text-skin-accent decoration-dashed underline-offset-4 focus-visible:no-underline focus-visible:underline-offset-0"
      >
        {secHeading ? <h2 {...headerProps}>{title}</h2> : <h3 {...headerProps}>{title}</h3>}
      </a>
      <Datetime datetime={pubDatetime} />
      <p className="my-1 opacity-80">{description}</p>
    </li>
  );
}
