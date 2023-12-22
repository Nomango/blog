/// <reference types="mdast-util-directive" />

import { h as _h, s as _s, type Properties } from "hastscript";
import type { Paragraph, Root } from "mdast";
import { remove } from "unist-util-remove";
import { visit } from "unist-util-visit";
import { toc, type Options } from "mdast-util-toc";

interface TocOptions extends Omit<Options, "heading"> {
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

export default function remarkDirectivToc(options: TocOptions) {
  options = {
    label: "Table of Contents",
    ...options,
  };

  const transformer = (tree: Root) => {
    const result = toc(tree, options);

    visit(tree, (node, index, parent) => {
      if (node.type !== "containerDirective" && node.type !== "leafDirective") {
        return;
      }
      if (!parent || index === undefined) {
        return;
      }
      if (node.name !== "toc") {
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

      const details = h("details", { class: "remark-toc" }, [
        h("summary", { class: "remark-toc__summary" }, [{ type: "text", value: title }]),
        h("div", { class: "remark-toc__content" }, [result.map]),
      ]);

      parent.children[index] = details;
    });
  };
  return () => transformer;
}
