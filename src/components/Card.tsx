import slugify from "@utils/slugify";
import Datetime from "./Datetime";
import type { Post } from "@utils/getPosts";
import { slugifyStr } from "@utils/slugify";

export interface Props {
  post: Post;
  secHeading?: boolean;
}

export default function Card({ post, secHeading = true }: Props) {
  const { title, date: pubDatetime, description, tags } = post.data;

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
      <ul className="tags-container">
        {tags.map(tag => (
          <PostTag key={tag} name={tag} />
        ))}
      </ul>
      {/* <p className="my-1 opacity-80">{description}</p> */}
    </li>
  );
}

function PostTag({ name }: { name: string }) {
  const tag = slugifyStr(name);
  return (
    <li className="my-1 inline-block underline-offset-4">
      <a
        href={`/tags/${tag}`}
        className="group relative pr-2 text-sm hover:underline hover:decoration-dashed hover:-top-0.5 hover:text-skin-accent focus-visible:p-1"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="-mr-5 h-6 w-6 scale-75 text-skin-base opacity-80 group-hover:fill-skin-accent"
        >
          <path d="M16.018 3.815 15.232 8h-4.966l.716-3.815-1.964-.37L8.232 8H4v2h3.857l-.751 4H3v2h3.731l-.714 3.805 1.965.369L8.766 16h4.966l-.714 3.805 1.965.369.783-4.174H20v-2h-3.859l.751-4H21V8h-3.733l.716-3.815-1.965-.37zM14.106 14H9.141l.751-4h4.966l-.752 4z"></path>
        </svg>
        &nbsp;&nbsp;<span>{name}</span>
      </a>
    </li>
  );
}
