import React, { useState } from "react";
import { Bold, Italic, Underline, Strikethrough, Pilcrow, Heading1, Heading2, Heading3, Heading4, Heading5, Heading6, List, ListOrdered, Code, CodeXml, Quote, Minus, Link2, Image, RemoveFormatting, Plus, Trash2, Grid3X3 } from "lucide-react";
import { TableGridInsert } from "./TableGridInsert.jsx";
import LinkImagePopup from "./LinkImagePopup.jsx";
export const ToolbarButtons = ({
  editor,
  clearFormatting
}) => {
  if (!editor) return null;
  const [popup, setPopup] = useState(null);
  return <>
      <div className="toolbar">
       <button onClick={() => editor.chain().focus().toggleBold().run()} className={`toolbar-btn ${editor.isActive("bold") ? "toolbar-btn-active" : ""}`} title="Bold (Ctrl+B)">
        <Bold size={18} />
      </button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`toolbar-btn ${editor.isActive("italic") ? "toolbar-btn-active" : ""}`} title="Italic (Ctrl+I)">
        <Italic size={18} />
      </button>
      <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={`toolbar-btn ${editor.isActive("underline") ? "toolbar-btn-active" : ""}`} title="Underline (Ctrl+U)">
        <Underline size={18} />
      </button>
      <button onClick={() => editor.chain().focus().toggleStrike().run()} className={`toolbar-btn ${editor.isActive("strike") ? "toolbar-btn-active" : ""}`} title="Strikethrough">
        <Strikethrough size={18} />
      </button>

      <div className="toolbar-divider" />

      {}
      <button onClick={() => editor.chain().focus().setParagraph().run()} className={`toolbar-btn ${editor.isActive("paragraph") ? "toolbar-btn-active" : ""}`} title="Paragraph">
        <Pilcrow size={18} />
      </button>
      <button onClick={() => editor.chain().focus().toggleHeading({
        level: 1
      }).run()} className={`toolbar-btn ${editor.isActive("heading", {
        level: 1
      }) ? "toolbar-btn-active" : ""}`} title="Heading 1">
        <Heading1 size={18} />
      </button>
      <button onClick={() => editor.chain().focus().toggleHeading({
        level: 2
      }).run()} className={`toolbar-btn ${editor.isActive("heading", {
        level: 2
      }) ? "toolbar-btn-active" : ""}`} title="Heading 2">
        <Heading2 size={18} />
      </button>
      <button onClick={() => editor.chain().focus().toggleHeading({
        level: 3
      }).run()} className={`toolbar-btn ${editor.isActive("heading", {
        level: 3
      }) ? "toolbar-btn-active" : ""}`} title="Heading 3">
        <Heading3 size={18} />
      </button>
      <button onClick={() => editor.chain().focus().toggleHeading({
        level: 4
      }).run()} className={`toolbar-btn ${editor.isActive("heading", {
        level: 4
      }) ? "toolbar-btn-active" : ""}`} title="Heading 4">
        <Heading4 size={18} />
      </button>
      <button onClick={() => editor.chain().focus().toggleHeading({
        level: 5
      }).run()} className={`toolbar-btn ${editor.isActive("heading", {
        level: 5
      }) ? "toolbar-btn-active" : ""}`} title="Heading 5">
        <Heading5 size={18} />
      </button>
      <button onClick={() => editor.chain().focus().toggleHeading({
        level: 6
      }).run()} className={`toolbar-btn ${editor.isActive("heading", {
        level: 6
      }) ? "toolbar-btn-active" : ""}`} title="Heading 6">
        <Heading6 size={18} />
      </button>

      <div className="toolbar-divider" />

      {}
      <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={`toolbar-btn ${editor.isActive("bulletList") ? "toolbar-btn-active" : ""}`} title="Bullet List">
        <List size={18} />
      </button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`toolbar-btn ${editor.isActive("orderedList") ? "toolbar-btn-active" : ""}`} title="Numbered List">
        <ListOrdered size={18} />
      </button>

      <div className="toolbar-divider" />

      {}
      <button onClick={() => editor.chain().focus().toggleCode().run()} className={`toolbar-btn ${editor.isActive("code") ? "toolbar-btn-active" : ""}`} title="Inline Code">
        <Code size={18} />
      </button>
      <button onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={`toolbar-btn ${editor.isActive("codeBlock") ? "toolbar-btn-active" : ""}`} title="Code Block">
        <CodeXml size={18} />
      </button>

      <div className="toolbar-divider" />

      {}
      <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`toolbar-btn ${editor.isActive("blockquote") ? "toolbar-btn-active" : ""}`} title="Quote">
        <Quote size={18} />
      </button>
      <button onClick={() => editor.chain().focus().setHorizontalRule().run()} className="toolbar-btn" title="Horizontal Rule">
        <Minus size={18} />
      </button>

      <div className="toolbar-divider" />
      {}
        <button onClick={() => setPopup("link")} className={`toolbar-btn ${editor.isActive("link") ? "toolbar-btn-active" : ""}`} title="Insert Link">
          <Link2 size={18} />
        </button>

        <button onClick={() => setPopup("image")} className="toolbar-btn" title="Insert Image">
          <Image size={18} />
        </button>

        <div className="toolbar-divider" />

      {}
      <div className="table-dropdown-wrapper">
        <button onMouseEnter={e => e.currentTarget.parentElement.classList.add("open")} onClick={e => {
          e.stopPropagation();
          const isOpening = !e.currentTarget.parentElement.classList.contains("open");
          document.querySelectorAll(".table-dropdown-wrapper").forEach(el => el.classList.remove("open"));
          if (isOpening) e.currentTarget.parentElement.classList.add("open");
        }} className="toolbar-btn" title="Insert Table">
          <Grid3X3 size={18} />
        </button>

        <div className="table-dropdown-menu" onMouseEnter={e => e.currentTarget.parentElement.classList.add("open")} onMouseLeave={e => {
          if (!e.currentTarget.parentElement.contains(e.relatedTarget)) {
            e.currentTarget.parentElement.classList.remove("open");
          }
        }}>
          <TableGridInsert editor={editor} onInsert={() => document.querySelectorAll(".table-dropdown-wrapper").forEach(el => el.classList.remove("open"))} />

          <div className="table-dropdown-divider" />

          <button onClick={() => editor.chain().focus().addRowAfter().run()} className="table-action-btn">
            <Plus size={16} /> Add Row
          </button>
          <button onClick={() => editor.chain().focus().addColumnAfter().run()} className="table-action-btn">
            <Plus size={16} /> Add Column
          </button>
          <button onClick={() => editor.chain().focus().deleteTable().run()} className="table-action-btn" style={{
            color: "#dc2626"
          }}>
            <Trash2 size={16} /> Delete Table
          </button>
        </div>
      </div>

      <div className="toolbar-divider" />

      {}
      <button onClick={clearFormatting} className="toolbar-btn" title="Clear Formatting">
        <RemoveFormatting size={18} />
      </button>
      </div>

      {}
      {popup && <LinkImagePopup editor={editor} type={popup} onClose={() => setPopup(null)} />}
    </>;
};