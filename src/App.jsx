import React, { useState, useEffect, useCallback } from "react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import BubbleMenu from "@tiptap/extension-bubble-menu";
import { Slash } from "@harshtalks/slash-tiptap";
import SlashMenuComponent from "./components/SlashMenu.jsx";
import EmptyLinePlaceholder from "./components/EmptyLinePlaceholder.jsx";
import { ReactRenderer } from "@tiptap/react";
import tippy from "tippy.js";
import { enableKeyboardNavigation } from "@harshtalks/slash-tiptap";
import { TableKit } from "@tiptap/extension-table";
import matter from "gray-matter";
import TOML from "toml-j0.4";
import TurndownService from "turndown";
import { marked } from "marked";
import { Buffer } from "buffer";
import { set, get, del } from "idb-keyval";
import Landing from "./Landing";
import Aside from "./Aside";
import Editor from "./Editor";
import KeyboardShortcuts from "./components/KeyboardShortcuts.jsx";
import { FileText, Download, Copy, Settings, FilePlus } from "lucide-react";
import "./App.css";
import ThemeToggle from "./components/ThemeToggle.jsx";
window.Buffer = Buffer;
const DRAFT_KEY = "cms-hira-draft-v3";
const suggestions = [{
  title: "Heading 1",
  command: ({
    editor,
    range
  }) => editor.chain().focus().deleteRange(range).setHeading({
    level: 1
  }).run()
}, {
  title: "Heading 2",
  command: ({
    editor,
    range
  }) => editor.chain().focus().deleteRange(range).setHeading({
    level: 2
  }).run()
}, {
  title: "Bullet List",
  command: ({
    editor,
    range
  }) => editor.chain().focus().deleteRange(range).toggleBulletList().run()
}, {
  title: "Numbered List",
  command: ({
    editor,
    range
  }) => editor.chain().focus().deleteRange(range).toggleOrderedList().run()
}, {
  title: "Code Block",
  command: ({
    editor,
    range
  }) => editor.chain().focus().deleteRange(range).toggleCodeBlock().run()
}, {
  title: "Quote",
  command: ({
    editor,
    range
  }) => editor.chain().focus().deleteRange(range).toggleBlockquote().run()
}];
const turndownService = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced"
});
turndownService.addRule("underline", {
  filter: ["u"],
  replacement: c => c
});
turndownService.addRule("image", {
  filter: "img",
  replacement: (content, node) => {
    const alt = node.alt || "";
    const src = node.getAttribute("src") || "";
    return src ? `![${alt}](${src})` : "";
  }
});
function App() {
  const [file, setFile] = useState(null);
  const [frontmatter, setFrontmatter] = useState({});
  const [content, setContent] = useState("");
  const [delimiter, setDelimiter] = useState("---");
  const [isToml, setIsToml] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    if (frontmatter.title && typeof frontmatter.title === "string" && !frontmatter.slug) {
      const slug = frontmatter.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").replace(/-+/g, "-");
      if (slug) {
        setFrontmatter(prev => ({
          ...prev,
          slug
        }));
      }
    }
  }, [frontmatter.title]);
  const editor = useEditor({
    extensions: [EmptyLinePlaceholder, Slash.configure({
      suggestion: {
        items: () => suggestions,
        render: () => {
          let component;
          let popup;
          return {
            onStart: props => {
              component = new ReactRenderer(SlashMenuComponent, {
                props,
                editor: props.editor
              });
              if (!props.clientRect) return;
              popup = tippy("body", {
                getReferenceClientRect: props.clientRect,
                appendTo: () => document.body,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: "manual",
                placement: "bottom-start",
                animation: "shift-away",
                arrow: false
              });
            },
            onUpdate: props => {
              component.updateProps(props);
              if (!props.clientRect) return;
              popup[0]?.setProps({
                getReferenceClientRect: props.clientRect
              });
            },
            onKeyDown: props => {
              if (props.event.key === "Escape") {
                popup[0]?.hide();
                return true;
              }
              return component.ref?.onKeyDown(props);
            },
            onExit: () => {
              popup[0]?.destroy();
              component?.destroy();
            }
          };
        }
      }
    }), TableKit.configure({
      table: {
        resizable: true
      }
    }), BubbleMenu, StarterKit.configure({
      codeBlock: {
        languageClassPrefix: "language-"
      },
      heading: {
        levels: [1, 2, 3, 4, 5, 6]
      }
    }), Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: "editor-link"
      }
    }), Placeholder.configure({
      placeholder: "Start writing your content here..."
    }), Underline, Image.configure({
      HTMLAttributes: {
        class: "editor-image"
      }
    })],
    editorProps: {
      handleDOMEvents: {
        keydown: (_, v) => enableKeyboardNavigation(v)
      }
    },
    content: "",
    onUpdate: ({
      editor
    }) => {
      const html = editor.getHTML();
      const markdown = turndownService.turndown(html);
      setContent(markdown);
    }
  });
  const saveDraft = useCallback(async () => {
    if (!file && (Object.keys(frontmatter).length > 0 || content.trim())) {
      await set(DRAFT_KEY, {
        frontmatter,
        content,
        delimiter,
        isToml,
        timestamp: Date.now()
      });
    }
  }, [frontmatter, content, delimiter, isToml, file]);
  useEffect(() => {
    const timer = setTimeout(saveDraft, 1000);
    return () => clearTimeout(timer);
  }, [saveDraft]);
  useEffect(() => {
    if (!file) {
      get(DRAFT_KEY).then(draft => {
        if (draft) {
          setFrontmatter(draft.frontmatter || {});
          setContent(draft.content || "");
          setDelimiter(draft.delimiter || "---");
          setIsToml(draft.isToml || false);
          if (editor && draft.content) {
            editor.commands.setContent(marked.parse(draft.content));
          }
        }
      });
    }
  }, [editor, file]);
  const handleFileUpload = uploadedFile => {
    if (uploadedFile.size === 0 && uploadedFile.name === "new-post.md") {
      setFile(uploadedFile);
      setFrontmatter({
        title: "",
        date: new Date().toISOString().slice(0, 10),
        description: "",
        tags: [],
        draft: true
      });
      setContent("");
      setDelimiter("---");
      setIsToml(false);
      if (editor) {
        editor.commands.clearContent();
        editor.commands.focus();
      }
      del(DRAFT_KEY);
      return;
    }
    const reader = new FileReader();
    reader.onload = e => {
      const text = e.target.result;
      let parsed;
      let usedDelimiter = "---";
      try {
        if (text.trimStart().startsWith("+++")) {
          usedDelimiter = "+++";
          parsed = matter(text, {
            language: "toml",
            delimiters: "+++",
            engines: {
              toml: TOML.parse
            }
          });
          setIsToml(true);
        } else {
          parsed = matter(text);
          setIsToml(false);
        }
      } catch (err) {
        console.error(err);
        alert("Failed to parse frontmatter. Check console.");
        return;
      }
      const cleaned = {
        ...parsed.data
      };
      Object.keys(cleaned).forEach(k => {
        if (typeof cleaned[k] === "string" && /date|time|published/i.test(k)) {
          const d = new Date(cleaned[k]);
          if (!isNaN(d)) cleaned[k] = d.toISOString();
        }
      });
      setFrontmatter(cleaned);
      setDelimiter(usedDelimiter);
      setContent(parsed.content.trim());
      setFile(uploadedFile);
      if (editor) {
        editor.commands.setContent(marked.parse(parsed.content));
      }
    };
    reader.readAsText(uploadedFile);
  };
  const stringifyTOML = (obj, indent = "") => {
    const lines = [];
    for (const [key, value] of Object.entries(obj)) {
      if (value === null || value === undefined) continue;
      if (Array.isArray(value)) {
        if (value.length === 0) lines.push(`${indent}${key} = []`);else if (value.every(v => typeof v !== "object" || v === null)) {
          lines.push(`${indent}${key} = ${JSON.stringify(value)}`);
        } else {
          lines.push(`${indent}${key} = [`);
          value.forEach(item => {
            if (typeof item === "object" && item !== null) {
              lines.push(`${indent}  {`);
              lines.push(stringifyTOML(item, indent + "    "));
              lines.push(`${indent}  },`);
            }
          });
          lines.push(`${indent}]`);
        }
      } else if (typeof value === "object" && !(value instanceof Date)) {
        lines.push(`${indent}[${key}]`);
        lines.push(stringifyTOML(value, indent + "  "));
      } else if (typeof value === "string") {
        const needsTriple = value.includes("\n") || value.includes('"""');
        if (needsTriple) {
          lines.push(`${indent}${key} = """${value.replace(/"""/g, '\\"""')}"""`);
        } else {
          lines.push(`${indent}${key} = "${value.replace(/"/g, '\\"')}"`);
        }
      } else if (value instanceof Date) {
        lines.push(`${indent}${key} = "${value.toISOString()}"`);
      } else {
        lines.push(`${indent}${key} = ${value}`);
      }
    }
    return lines.join("\n");
  };
  const copyMarkdown = async () => {
    const header = isToml ? stringifyTOML(frontmatter) ? `+++\n${stringifyTOML(frontmatter)}\n+++` : "+++\n+++" : matter.stringify("", frontmatter).trim() || "---\n---";
    const full = `${header}\n\n${content.trim()}\n`;
    await navigator.clipboard.writeText(full);
    alert("Copied full Markdown to clipboard!");
  };
  const handleDownload = () => {
    const header = isToml ? stringifyTOML(frontmatter) ? `+++\n${stringifyTOML(frontmatter)}\n+++` : "+++\n+++" : matter.stringify("", frontmatter).trim() || "---\n---";
    const full = `${header}\n\n${content.trim()}\n`;
    const blob = new Blob([full], {
      type: "text/markdown"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file?.name || (frontmatter.slug ? `${frontmatter.slug}.md` : "post.md");
    a.click();
    URL.revokeObjectURL(url);
  };
  const toggleFormat = () => {
    setIsToml(!isToml);
    setDelimiter(isToml ? "---" : "+++");
  };
  useEffect(() => {
    const handler = e => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowShortcuts(true);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        handleDownload();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [frontmatter, content, isToml]);
  if (!file) {
    return <Landing onFileUpload={handleFileUpload} />;
  }
  return <div>
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <FileText size={40} className="header-logo" />
            <div className="header-info">
              <h1 className="header-title">Simple CMS</h1>
              <span className="header-filename">{file.name}</span>
            </div>
          </div>

          <div className="header-actions">
            <button onClick={copyMarkdown} className="btn btn-secondary" title="Copy Markdown (Ctrl+Shift+C)">
              <Copy size={18} /> Copy
            </button>

            <button onClick={toggleFormat} className="btn btn-secondary">
              <Settings size={16} /> {isToml ? "TOML" : "YAML"}
            </button>

            <button onClick={() => {
            if (confirm("Start new file? Current draft will be cleared.")) {
              del(DRAFT_KEY);
              setFile(null);
              setFrontmatter({});
              setContent("");
              editor?.commands.clearContent();
            }
          }} className="btn btn-secondary">
              <FilePlus size={18} /> New
            </button>

            <button onClick={handleDownload} className="btn btn-primary">
              <Download size={18} /> Download
            </button>

            <div className="theme-toggle-editor"><ThemeToggle size={22} /></div>
          </div>
        </div>
      </header>

      <div className="main-content">
        <Aside frontmatter={frontmatter} updateFrontmatterField={(k, v) => setFrontmatter(p => ({
        ...p,
        [k]: v
      }))} deleteFrontmatterField={k => setFrontmatter(p => {
        const {
          [k]: _,
          ...r
        } = p;
        return r;
      })} addArrayItem={k => setFrontmatter(p => ({
        ...p,
        [k]: [...(p[k] || []), ""]
      }))} updateArrayItem={(k, i, v) => setFrontmatter(p => ({
        ...p,
        [k]: p[k].map((x, idx) => idx === i ? v : x)
      }))} deleteArrayItem={(k, i) => setFrontmatter(p => ({
        ...p,
        [k]: p[k].filter((_, idx) => idx !== i)
      }))} addObjectArrayItem={k => {
        const template = frontmatter[k]?.[0] || {};
        const empty = Object.keys(template).reduce((a, f) => ({
          ...a,
          [f]: ""
        }), {});
        setFrontmatter(p => ({
          ...p,
          [k]: [...(p[k] || []), empty]
        }));
      }} updateObjectArrayItem={(k, i, f, v) => setFrontmatter(p => ({
        ...p,
        [k]: p[k].map((item, idx) => idx === i ? {
          ...item,
          [f]: v
        } : item)
      }))} />

        <Editor editor={editor} />
      </div>

      <KeyboardShortcuts isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />
    </div>;
}
export default App;