import React from "react";
import { Bold, Italic, Underline, Code, Link2 } from "lucide-react";
export const BubbleButtons = ({ editor }) => {
    if (!editor) return null;
    return (
        <div className="bubble-menu">
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`toolbar-btn ${editor?.isActive("bold") ? "toolbar-btn-active" : ""
                    }`}
                title="Bold (Ctrl+B)"
            >
                <Bold size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`toolbar-btn ${editor?.isActive("italic") ? "toolbar-btn-active" : ""
                    }`}
                title="Italic (Ctrl+I)"
            >
                <Italic size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`toolbar-btn ${editor?.isActive("underline") ? "toolbar-btn-active" : ""
                    }`}
                title="Underline (Ctrl+U)"
            >
                <Underline size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleCode().run()}
                className={`toolbar-btn ${editor?.isActive("code") ? "toolbar-btn-active" : ""
                    }`}
                title="Inline Code"
            >
                <Code size={18} />
            </button>
            <button
                onClick={() => {
                    const url = prompt("Enter URL:");
                    if (url)
                        editor
                            .chain()
                            .focus()
                            .setLink({
                                href: url,
                            })
                            .run();
                }}
                className={`toolbar-btn ${editor?.isActive("link") ? "toolbar-btn-active" : ""
                    }`}
                title="Insert Link"
            >
                <Link2 size={18} />
            </button>
        </div>
    );
};
