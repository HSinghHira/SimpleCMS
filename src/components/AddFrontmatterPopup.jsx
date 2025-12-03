// components/AddFrontmatterPopup.jsx
import React, { useState, useEffect, useRef } from "react";
import { X, Type, ToggleLeft, Calendar, List, Package, Hash } from "lucide-react";

const fieldTypes = [
  { type: "string", icon: Type, label: "Text", default: "" },
  { type: "multiline", icon: Type, label: "Multiline Text", default: "" },
  { type: "boolean", icon: ToggleLeft, label: "True/False", default: false },
  { type: "date", icon: Calendar, label: "Date & Time", default: new Date().toISOString() },
  { type: "array", icon: List, label: "List of Strings (tags)", default: [] },
  { type: "url", icon: Hash, label: "URL / Link", default: "" },
];

const AddFrontmatterPopup = ({ isOpen, onClose, onAdd }) => {
  const [key, setKey] = useState("");
  const [selectedType, setSelectedType] = useState("string");
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setKey("");
      setSelectedType("string");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!key.trim()) return;

    const cleanKey = key.trim();
    const typeInfo = fieldTypes.find(t => t.type === selectedType);

    let value = typeInfo.default;

    // Special handling
    if (selectedType === "multiline") value = "";
    if (selectedType === "object-array") {
      value = [];
    }

    onAdd(cleanKey, value, selectedType);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="link-image-popup-overlay" onClick={onClose}>
      <div className="link-image-popup" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <div className="popup-title">
            <Hash size={18} />
            <span>Add Frontmatter Field</span>
          </div>
          <button onClick={onClose} className="popup-close">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="popup-field">
            <label>Field Name (key)</label>
            <input
              ref={inputRef}
              type="text"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="e.g. title, tags, author, published_date"
              required
              className="input"
            />
          </div>

          <div className="popup-field">
            <label>Field Type</label>
            <div className="field-type-grid">
              {fieldTypes.map(({ type, icon: Icon, label }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedType(type)}
                  className={`field-type-btn ${
                    selectedType === type ? "selected" : ""
                  }`}
                >
                  <Icon size={16} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="popup-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Field
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFrontmatterPopup;