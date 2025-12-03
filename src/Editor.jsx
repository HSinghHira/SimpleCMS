import { EditorContent } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import { ToolbarButtons } from "./components/ToolbarButtons.jsx";
import { BubbleButtons } from "./components/BubbleButtons.jsx";
const Editor = ({
  editor
}) => {
  const addImage = () => {
    const url = prompt("Enter image URL:");
    if (url) {
      editor.chain().focus().setImage({
        src: url
      }).run();
    }
  };
  const clearFormatting = () => {
    editor.chain().focus().clearNodes().unsetAllMarks().run();
  };
  const rawText = editor?.getText() || "";
  const words = rawText.trim() ? rawText.trim().split(/\s+/).length : 0;
  const chars = rawText.length;
  const readMins = Math.max(1, Math.round(words / 265));
  return <main className="editor-container">
      <div className="editor-card">
        <div className="editor-header">
          <h3 className="editor-title">Content</h3>
          <div className="editor-info">
            <span className="editor-badge">{words} Words</span>
            <span className="editor-badge">{chars} Chars</span>
            <span className="editor-badge">{readMins} min read</span>
            <span className="editor-badge">Markdown</span>
          </div>
        </div>

        <ToolbarButtons editor={editor} clearFormatting={clearFormatting} addImage={addImage} />

        {editor && <>
            <BubbleMenu editor={editor} tippyOptions={{
          duration: 100
        }}>
              <BubbleButtons editor={editor} />
            </BubbleMenu>

            <BubbleMenu editor={editor} shouldShow={({
          editor
        }) => editor.isActive("bulletList") || editor.isActive("orderedList")} tippyOptions={{
          duration: 100
        }}>
              <div className="bubble-menu">
                <button onClick={() => {
              if (editor.isActive("bulletList")) {
                editor.chain().focus().toggleOrderedList().run();
              } else {
                editor.chain().focus().toggleBulletList().run();
              }
            }} className="bubble-btn">
                  Toggle List Type
                </button>
              </div>
            </BubbleMenu>
          </>}

        <EditorContent editor={editor} className="editor" />
      </div>
    </main>;
};
export default Editor;