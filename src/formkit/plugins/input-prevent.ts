import type { FormKitNode } from "@formkit/core";
import { nextTick } from "vue";

function handleKeydown(e: KeyboardEvent) {
  if (
    e.key == "Enter" &&
    e.altKey == false &&
    e.ctrlKey == false &&
    e.metaKey == false
  ) {
    e.stopImmediatePropagation();
    e.preventDefault();
    e.stopPropagation();
  }
}

// const domEventMap = new Map()

const inputPreventFn = (node: FormKitNode) => {
  const id = node.props.id ?? "";
  if (node.type == "group") {
    nextTick(() => {
      if (
        node.children.length == 1 &&
        node.props.type == "form" &&
        node.children[0].props.type == "text"
      ) {
        const rootForm = document.getElementById(id);
        rootForm?.addEventListener("keydown", handleKeydown);
        node.props.hasKeydownEvent = true;
        node.on("destroying", () => {
          rootForm?.removeEventListener("keydown", handleKeydown);
        });
      }
    });
  }
};

export default inputPreventFn;
