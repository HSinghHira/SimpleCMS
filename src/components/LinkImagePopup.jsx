import React, { useState, useEffect, useRef } from "react";
import { X, Link2, Image as ImageIcon } from "lucide-react";
const LinkImagePopup = ({
  editor,
  type = "link",
  onClose
}) => {
  const [url, setUrl] = useState("");
  const [displayText, setDisplayText] = useState("");
  const [altOrTitle, setAltOrTitle] = useState("");
  const [openNewTab, setOpenNewTab] = useState(true);
  const inputRef = useRef(null);
  const textInputRef = useRef(null);
  const hasSelection = editor.state.selection.empty === false;
  useEffect(() => {
    setTimeout(() => {
      if (type === "link" && !hasSelection && !editor.isActive("link")) {
        textInputRef.current?.current?.focus();
      } else {
        inputRef.current?.focus();
      }
    }, 100);
    if (type === "link" && editor.isActive("link")) {
      const {
        href,
        target
      } = editor.getAttributes("link");
      setUrl(href || "");
      setOpenNewTab(target === "_blank");
      const selectedText = editor.state.doc.textBetween(editor.state.selection.from, editor.state.selection.to);
      setDisplayText(selectedText);
    } else if (type === "image" && editor.isActive("image")) {
      const {
        src,
        alt
      } = editor.getAttributes("image");
      setUrl(src || "");
      setAltOrTitle(alt || "");
    }
  }, [editor, type, hasSelection]);
  const handleSubmit = e => {
    e.preventDefault();
    const cleanedUrl = url.trim();
    if (!cleanedUrl) return;
    if (type === "link") {
      const text = hasSelection || editor.isActive("link") ? null : displayText.trim() || cleanedUrl;
      editor.chain().focus().insertContentAt(editor.state.selection.from, {
        type: "text",
        text: text,
        marks: [{
          type: "link",
          attrs: {
            href: cleanedUrl,
            target: openNewTab ? "_blank" : null,
            rel: openNewTab ? "noopener noreferrer" : null
          }
        }]
      }).setLink({
        href: cleanedUrl
      }).run();
      if (hasSelection || editor.isActive("link")) {
        editor.chain().focus().extendMarkRange("link").setLink({
          href: cleanedUrl,
          target: openNewTab ? "_blank" : null,
          rel: openNewTab ? "noopener noreferrer" : null
        }).run();
      }
    } else {
      editor.chain().focus().setImage({
        src: cleanedUrl,
        alt: altOrTitle.trim(),
        title: altOrTitle.trim()
      }).run();
    }
    onClose();
  };
  const handleRemove = () => {
    if (type === "link") {
      editor.chain().focus().unsetLink().run();
    } else {
      editor.chain().focus().deleteSelection().run();
    }
    onClose();
  };
  return <div className="link-image-popup-overlay" onClick={onClose}>
      <div className="link-image-popup" onClick={e => e.stopPropagation()}>
        <div className="popup-header">
          <div className="popup-title">
            {type === "link" ? <Link2 size={18} /> : <ImageIcon size={18} />}
            <span>{type === "link" ? "Link" : "Image"}</span>
          </div>
          <button onClick={onClose} className="popup-close" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {}
          {type === "link" && !hasSelection && !editor.isActive("link") && <div className="popup-field">
              <label>Text to display</label>
              <input ref={textInputRef} type="text" value={displayText} onChange={e => setDisplayText(e.target.value)} placeholder="Enter link text..." required />
            </div>}

          <div className="popup-field">
            <label>{type === "link" ? "URL" : "Image URL"}</label>
            <input ref={inputRef} type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder={type === "link" ? "https://example.com" : "https://example.com/img.jpg"} required />
          </div>

          {}
          {type === "image" ? <div className="popup-field">
              <label>Alt text (accessibility)</label>
              <input type="text" value={altOrTitle} onChange={e => setAltOrTitle(e.target.value)} placeholder="Describe the image" />
            </div> : <div className="popup-field checkbox">
              <label>
                <input type="checkbox" checked={openNewTab} onChange={e => setOpenNewTab(e.target.checked)} />
                Open in new tab
              </label>
            </div>}

          <div className="popup-actions">
            {editor.isActive(type === "link" ? "link" : "image") && <button type="button" onClick={handleRemove} className="btn btn-danger">
                Remove
              </button>}
            <div style={{
            flex: 1
          }} />
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editor.isActive(type === "link" ? "link" : "image") ? "Update" : "Insert"}
            </button>
          </div>
        </form>
      </div>
    </div>;
};
export default LinkImagePopup;