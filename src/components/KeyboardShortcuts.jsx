// src/components/KeyboardShortcuts.jsx
import React from "react";
import { X } from "lucide-react";

const shortcuts = [
  { key: "Cmd + S", desc: "Download file" },
  { key: "Cmd + K", desc: "Show shortcuts" },
  { key: "Cmd + Shift + C", desc: "Copy Markdown" },
  { key: "Cmd + N", desc: "New file" },
  { key: "Tab", desc: "Indent list" },
  { key: "Shift + Tab", desc: "Outdent list" },
];

const KeyboardShortcuts = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Keyboard Shortcuts</h2>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <div className="shortcuts-list">
          {shortcuts.map(s => (
            <div key={s.key} className="shortcut-item">
              <kbd>{s.key}</kbd>
              <span>{s.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcuts;