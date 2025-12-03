import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
const EmptyLinePlaceholder = Extension.create({
  name: "emptyLinePlaceholder",
  addProseMirrorPlugins() {
    return [new Plugin({
      key: new PluginKey("emptyLinePlaceholder"),
      props: {
        decorations: state => {
          const {
            doc,
            selection
          } = state;
          const decorations = [];
          const isEmptyParagraph = selection.$anchor.parent.type.name === "paragraph" && selection.$anchor.parent.content.size === 0;
          doc.descendants((node, pos) => {
            if (node.type.name === "paragraph" && node.content.size === 0) {
              const isCursorHere = isEmptyParagraph && selection.from >= pos && selection.from <= pos + node.nodeSize;
              if (isCursorHere || doc.childCount === 1) {
                const decoration = Decoration.node(pos, pos + node.nodeSize, {
                  class: "empty-line-placeholder",
                  "data-placeholder": "Press / to see available commands"
                });
                decorations.push(decoration);
              }
            }
          });
          return DecorationSet.create(doc, decorations);
        }
      }
    })];
  }
});
export default EmptyLinePlaceholder;