/// <reference types="mdast-util-directive" />

import type { RemarkPlugin } from "@astrojs/markdown-remark";
import { h as _h, s as _s, type Properties } from "hastscript";
import type { Paragraph, Root } from "mdast";
import { remove } from "unist-util-remove";
import { visit } from "unist-util-visit";

/** Hacky function that generates an mdast HTML tree ready for conversion to HTML by rehype. */
function h(el: string, attrs: Properties = {}, children: any[] = []): Paragraph {
  const { tagName, properties } = _h(el, attrs);
  return {
    type: "paragraph",
    data: { hName: tagName, hProperties: properties },
    children,
  };
}

/** Hacky function that generates an mdast SVG tree ready for conversion to HTML by rehype. */
function s(el: string, attrs: Properties = {}, children: any[] = []): Paragraph {
  const { tagName, properties } = _s(el, attrs);
  return {
    type: "paragraph",
    data: { hName: tagName, hProperties: properties },
    children,
  };
}

export default function remarkDirectiveButton() {
  return (tree: Root) => {
    visit(tree, (node, index, parent) => {
      if (node.type !== "containerDirective" && node.type !== "leafDirective" && node.type !== "textDirective") {
        return;
      }
      if (!parent || index === undefined) {
        return;
      }
      if (node.name !== "button" && node.name !== "btn") {
        return;
      }

      const attributes = node.attributes || {};

      const btn = h(
        "a",
        {
          class: "rounded bg-skin-card p-2 !text-skin-base no-underline hover:!text-skin-base",
          target: "_blank",
          rel: "noopener",
          href: attributes.href,
        },
        node.children.reduce((children, child) => {
          if (child.type === "paragraph") {
            children.push(...child.children);
          } else {
            children.push(child);
          }
          return children;
        }, [] as any[])
      );

      parent.children[index] = btn;
    });
  };
}
