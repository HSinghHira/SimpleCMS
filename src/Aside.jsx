import React, { useState } from "react";
import { Folder, Link, Pencil, Plus, Trash2, X } from "lucide-react";
import AddFrontmatterPopup from "./components/AddFrontmatterPopup";
import { Type, ToggleLeft, Calendar, List, Package, Hash } from "lucide-react";
const Aside = ({
  frontmatter,
  updateFrontmatterField,
  deleteFrontmatterField,
  addArrayItem,
  updateArrayItem,
  deleteArrayItem,
  addObjectArrayItem,
  updateObjectArrayItem,
}) => {
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
  const [fieldTypesMetadata, setFieldTypesMetadata] = useState({});

  const handleAddField = (key, value, type = "string") => {
    if (frontmatter.hasOwnProperty(key)) {
      alert(`Field "${key}" already exists!`);
      return;
    }
    updateFrontmatterField(key, value);
    setFieldTypesMetadata((prev) => ({ ...prev, [key]: type }));
    setIsAddPopupOpen(false);
  };
  const renderFrontmatterField = (key, value) => {
  const fieldType = fieldTypesMetadata[key];

  // 1. Boolean → Checkbox
  if (typeof value === "boolean" || fieldType === "boolean") {
    return (
      <div className="field-group">
        <div className="field-header">
          <label className="checkbox-container">
            <input
              type="checkbox"
              checked={value || false}
              onChange={(e) => updateFrontmatterField(key, e.target.checked)}
              className="checkbox"
            />
            <span className="checkbox-label">{key}</span>
          </label>
          <button
            onClick={() => {
              deleteFrontmatterField(key);
              setFieldTypesMetadata(prev => {
                const { [key]: _, ...rest } = prev;
                return rest;
              });
            }}
            className="delete-field-btn"
            title="Delete field"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    );
  }

  // 2. Object (nested) → Object editor
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    return (
      <div className="field-group">
        <div className="field-header">
          <label className="field-label">
            <span className="field-icon"><Folder size={18} /></span>
            {key}
          </label>
          <button
            onClick={() => {
              deleteFrontmatterField(key);
              setFieldTypesMetadata(prev => {
                const { [key]: _, ...rest } = prev;
                return rest;
              });
            }}
            className="delete-field-btn"
            title="Delete field"
          >
            <Trash2 size={14} />
          </button>
        </div>
        <div className="object-card">
          {Object.entries(value).map(([subKey, subValue]) => (
            <div key={subKey} className="object-field">
              <label className="object-field-label">{subKey}</label>
              <input
                type="text"
                value={subValue || ""}
                onChange={(e) =>
                  updateFrontmatterField(key, {
                    ...value,
                    [subKey]: e.target.value,
                  })
                }
                className="input input-sm"
              />
            </div>
          ))}
          <button
            className="add-subfield-btn"
            onClick={() => {
              const newKey = prompt("New subfield name:");
              if (newKey && !(newKey in value)) {
                updateFrontmatterField(key, {
                  ...value,
                  [newKey]: "",
                });
              }
            }}
          >
            <Plus size={12} /> Add field
          </button>
        </div>
      </div>
    );
  }

  // 3. Array
  if (Array.isArray(value)) {
    const isObjectArray =
      value.length > 0 && typeof value[0] === "object" && value[0] !== null;

    return (
      <div className="field-group">
        <div className="field-header">
          <label className="field-label">
            <span className="field-icon">
              {isObjectArray ? <List size={18} /> : <Package size={18} />}
            </span>
            {key}
          </label>
          <div className="field-actions">
            <button
              onClick={() =>
                isObjectArray ? addObjectArrayItem(key) : addArrayItem(key)
              }
              className="add-btn"
              title="Add item"
            >
              <Plus size={14} />
            </button>
            <button
              onClick={() => {
                deleteFrontmatterField(key);
                setFieldTypesMetadata(prev => {
                  const { [key]: _, ...rest } = prev;
                  return rest;
                });
              }}
              className="delete-field-btn"
              title="Delete entire field"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        <div className={isObjectArray ? "array-container" : "tags-container"}>
          {value.map((item, index) => (
            <div
              key={index}
              className={isObjectArray ? "object-card" : "tag-item"}
            >
              {isObjectArray ? (
                <>
                  <div className="object-card-header">
                    <span className="object-card-number">#{index + 1}</span>
                    <button
                      onClick={() => deleteArrayItem(key, index)}
                      className="delete-icon-btn"
                      title="Remove item"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  {Object.entries(item).map(([field, val]) => (
                    <div key={field} className="object-field">
                      <label className="object-field-label">{field}</label>
                      <input
                        type="text"
                        value={val || ""}
                        onChange={(e) =>
                          updateObjectArrayItem(
                            key,
                            index,
                            field,
                            e.target.value
                          )
                        }
                        placeholder={`Enter ${field}`}
                        className="input input-sm"
                      />
                    </div>
                  ))}
                </>
              ) : (
                <>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) =>
                      updateArrayItem(key, index, e.target.value)
                    }
                    className="tag-input"
                    placeholder="Tag name"
                  />
                  <button
                    onClick={() => deleteArrayItem(key, index)}
                    className="tag-remove"
                    title="Remove"
                  >
                    <X size={14} />
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 4. Date fields
  if (
    fieldType === "date" ||
    /\b(date|time|published|updated|created)\b/i.test(key) ||
    key.toLowerCase().includes("date")
  ) {
    const isoValue =
      value && typeof value === "string"
        ? value
        : new Date().toISOString().slice(0, 16);
    return (
      <div className="field-group">
        <div className="field-header">
          <label className="field-label">
            <span className="field-icon">
              <Calendar size={18} />
            </span>
            {key}
          </label>
          <button
            onClick={() => {
              deleteFrontmatterField(key);
              setFieldTypesMetadata(prev => {
                const { [key]: _, ...rest } = prev;
                return rest;
              });
            }}
            className="delete-field-btn"
            title="Delete field"
          >
            <Trash2 size={14} />
          </button>
        </div>

        <input
          type="datetime-local"
          value={isoValue.slice(0, 16)}
          onChange={(e) =>
            updateFrontmatterField(
              key,
              new Date(e.target.value).toISOString()
            )
          }
          className="input"
        />
      </div>
    );
  }

  // 5. Multiline text fields
  if (
    fieldType === "multiline" ||
    key.toLowerCase().includes("description") ||
    key.toLowerCase().includes("excerpt") ||
    key.toLowerCase().includes("bio") ||
    key.toLowerCase().includes("content") ||
    key.toLowerCase().includes("summary") ||
    (typeof value === "string" && value.length > 120)
  ) {
    return (
      <div className="field-group">
        <div className="field-header">
          <label className="field-label">
            <span className="field-icon">
              <Type size={18} />
            </span>
            {key}
          </label>
          <button
            onClick={() => {
              deleteFrontmatterField(key);
              setFieldTypesMetadata(prev => {
                const { [key]: _, ...rest } = prev;
                return rest;
              });
            }}
            className="delete-field-btn"
            title="Delete field"
          >
            <Trash2 size={14} />
          </button>
        </div>
        <textarea
          value={value || ""}
          onChange={(e) => updateFrontmatterField(key, e.target.value)}
          rows={4}
          className="textarea"
          placeholder={`Enter ${key}`}
        />
      </div>
    );
  }

  // 6. URL fields
  if (
    fieldType === "url" ||
    key.toLowerCase().includes("url") ||
    key.toLowerCase().includes("link") ||
    key.toLowerCase().includes("image") ||
    key.toLowerCase().includes("href") ||
    key.toLowerCase().includes("src")
  ) {
    return (
      <div className="field-group">
        <div className="field-header">
          <label className="field-label">
            <span className="field-icon">
              <Link size={18} />
            </span>
            {key}
          </label>
          <button
            onClick={() => {
              deleteFrontmatterField(key);
              setFieldTypesMetadata(prev => {
                const { [key]: _, ...rest } = prev;
                return rest;
              });
            }}
            className="delete-field-btn"
            title="Delete field"
          >
            <Trash2 size={14} />
          </button>
        </div>
        <input
          type="url"
          value={value || ""}
          onChange={(e) => updateFrontmatterField(key, e.target.value)}
          className="input"
          placeholder="https://example.com"
        />
      </div>
    );
  }

  // 7. Default text input
  return (
    <div className="field-group">
      <div className="field-header">
        <label className="field-label">
          <span className="field-icon">
            <Pencil size={18} />
          </span>
          {key}
        </label>
        <button
          onClick={() => {
            deleteFrontmatterField(key);
            setFieldTypesMetadata(prev => {
              const { [key]: _, ...rest } = prev;
              return rest;
            });
          }}
          className="delete-field-btn"
          title="Delete field"
        >
          <Trash2 size={14} />
        </button>
      </div>
      <input
        type="text"
        value={value || ""}
        onChange={(e) => updateFrontmatterField(key, e.target.value)}
        className="input"
        placeholder={`Enter ${key}`}
      />
    </div>
  );
};
  return (
    <aside className="sidebar">
      <div className="sidebar-card">
        <div className="sidebar-header">
          <div>
            <h2 className="sidebar-title">Frontmatter</h2>
            <p className="sidebar-subtitle">
              {Object.keys(frontmatter).length} fields
            </p>
          </div>
          <button
            onClick={() => setIsAddPopupOpen(true)}
            className="add-field-btn"
            title="Add field"
          >
            <Plus size={18} />
          </button>
        </div>

        <div className="frontmatter-fields">
          {Object.keys(frontmatter).length === 0 ? (
            <div className="empty-state">
              <p>No frontmatter fields yet.</p>
              <button
                onClick={() => setIsAddPopupOpen(true)}
                className="btn-link"
              >
                Add your first field
              </button>
            </div>
          ) : (
            Object.entries(frontmatter).map(([key, value]) => (
              <div key={key} className="frontmatter-field">
                {renderFrontmatterField(key, value)}
              </div>
            ))
          )}
        </div>
      </div>

      {}
      <AddFrontmatterPopup
        isOpen={isAddPopupOpen}
        onClose={() => setIsAddPopupOpen(false)}
        onAdd={handleAddField}
      />
    </aside>
  );
};
export default Aside;
