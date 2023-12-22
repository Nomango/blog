/// <reference types="mdast-util-directive" />

import { h as _h, s as _s, type Properties } from "hastscript";
import type { Paragraph, Root } from "mdast";
import { remove } from "unist-util-remove";
import { visit } from "unist-util-visit";

interface CollapseOptions {
  label?: string;
}

/** Hacky function that generates an mdast HTML tree ready for conversion to HTML by rehype. */
function h(el: string, attrs: Properties = {}, children: any[] = []): Paragraph {
  const { tagName, properties } = _h(el, attrs);
  return {
    type: "paragraph",
    data: { hName: tagName, hProperties: properties },
    children,
  };
}

export default function remarkDirectiveCollapse(options: CollapseOptions) {
  options = {
    label: "Open",
    ...options,
  };

  const transformer = (tree: Root) => {
    visit(tree, (node, index, parent) => {
      if (node.type !== "containerDirective" && node.type !== "leafDirective") {
        return;
      }
      if (!parent || index === undefined) {
        return;
      }
      if (node.name !== "collapse" && node.name !== "details") {
        return;
      }

      let title = options.label;
      remove(node, (child): boolean | void => {
        if (child.data && "directiveLabel" in child.data && child.data.directiveLabel) {
          if ("children" in child && Array.isArray(child.children) && "value" in child.children[0]) {
            title = child.children[0].value;
          }
          return true;
        }
      });

      const details = h("details", { class: "remark-collapse" }, [
        h("summary", { class: "remark-collapse__summary" }, [{ type: "text", value: title }]),
        h("div", { class: "remark-collapse__content" }, node.children),
      ]);

      parent.children[index] = details;
    });
  };
  return () => transformer;
}
