/// <reference types="mdast-util-directive" />

import { h } from "hastscript";
import type { Root } from "mdast";
import { visit } from "unist-util-visit";

export default function remarkDirectiveHTML() {
  return (tree: Root) => {
    visit(tree, function (node) {
      if (node.type === "containerDirective" || node.type === "leafDirective" || node.type === "textDirective") {
        const data = node.data || (node.data = {});
        const hast = h(node.name, node.attributes || {});

        data.hName = hast.tagName;
        data.hProperties = hast.properties;
      }
    });
  };
}
