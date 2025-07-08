import React from "react";

// Types
export type FieldType = "label" | "text" | "number" | "boolean" | "enum";
export type LabelLevel = "h1" | "h2" | "h3";

export interface Field {
  id: string;
  type: FieldType;
  label: string;
  labelLevel?: LabelLevel; // Only for label type
  enumOptions?: string[]; // Only for enum type
  required?: boolean;
}

export interface Section {
  id: string;
  title: string;
  fields: Field[];
}

export interface Template {
  id: string;
  name: string;
  sections: Section[];
}

interface TemplateBuilderProps {
  templates: Template[];
  setTemplates: React.Dispatch<React.SetStateAction<Template[]>>;
  activeTemplateIdx: number | null;
  setActiveTemplateIdx: React.Dispatch<React.SetStateAction<number | null>>;
  onSidebarAddField?: (type: string) => void;
}

// Add helpText to Field type
type FieldWithHelp = Field & { helpText?: string };

const TemplateBuilder: React.FC<TemplateBuilderProps> = ({
  templates,
  setTemplates,
  activeTemplateIdx,
  setActiveTemplateIdx,
}) => {
  // Add new template
  const handleAddTemplate = () => {
    if (templates.length >= 5) return;
    const newTemplate: Template = {
      id: Date.now().toString(),
      name: `Template ${templates.length + 1}`,
      sections: [],
    };
    setTemplates([...templates, newTemplate]);
    setActiveTemplateIdx(templates.length);
  };

  // Add new section
  const handleAddSection = () => {
    if (activeTemplateIdx === null) return;
    const updatedTemplates = [...templates];
    const newSection: Section = {
      id: Date.now().toString(),
      title: `Section ${
        updatedTemplates[activeTemplateIdx].sections.length + 1
      }`,
      fields: [],
    };
    updatedTemplates[activeTemplateIdx].sections.push(newSection);
    setTemplates(updatedTemplates);
  };

  // Add new field to section
  const handleAddField = (sectionIdx: number, type: FieldType) => {
    if (activeTemplateIdx === null) return;
    const updatedTemplates = [...templates];
    const newField: Field = {
      id: Date.now().toString(),
      type,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      ...(type === "label" ? { labelLevel: "h2" as LabelLevel } : {}),
      ...(type === "enum" ? { enumOptions: ["Option 1", "Option 2"] } : {}),
    };
    updatedTemplates[activeTemplateIdx].sections[sectionIdx].fields.push(
      newField
    );
    setTemplates(updatedTemplates);
  };

  // Delete field from section
  const handleDeleteField = (sectionIdx: number, fieldId: string) => {
    if (activeTemplateIdx === null) return;
    const updatedTemplates = [...templates];
    updatedTemplates[activeTemplateIdx].sections[sectionIdx].fields =
      updatedTemplates[activeTemplateIdx].sections[sectionIdx].fields.filter(
        (f) => f.id !== fieldId
      );
    setTemplates(updatedTemplates);
  };

  // Delete section
  const handleDeleteSection = (sectionIdx: number) => {
    if (activeTemplateIdx === null) return;
    const updatedTemplates = [...templates];
    updatedTemplates[activeTemplateIdx].sections = updatedTemplates[
      activeTemplateIdx
    ].sections.filter((_, idx) => idx !== sectionIdx);
    setTemplates(updatedTemplates);
  };

  // Drag-and-drop handlers for fields
  const handleDragStart = (sectionIdx: number, fieldIdx: number) => {
    setDragState({ sectionIdx, fieldIdx });
  };

  const handleDragOver = (e: React.DragEvent<HTMLLIElement>) => {
    e.preventDefault();
  };

  const handleDrop = (sectionIdx: number, targetIdx: number) => {
    if (!dragState || activeTemplateIdx === null) return;
    if (dragState.sectionIdx !== sectionIdx) return; // Only within section
    const updatedTemplates = [...templates];
    const fields =
      updatedTemplates[activeTemplateIdx].sections[sectionIdx].fields;
    const [moved] = fields.splice(dragState.fieldIdx, 1);
    fields.splice(targetIdx, 0, moved);
    setTemplates(updatedTemplates);
    setDragState(null);
  };

  const [dragState, setDragState] = React.useState<{
    sectionIdx: number;
    fieldIdx: number;
  } | null>(null);

  // Edit template name
  const handleTemplateNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (activeTemplateIdx === null) return;
    const updatedTemplates = [...templates];
    updatedTemplates[activeTemplateIdx].name = e.target.value;
    setTemplates(updatedTemplates);
  };

  // Edit section title
  const handleSectionTitleChange = (sectionIdx: number, value: string) => {
    if (activeTemplateIdx === null) return;
    const updatedTemplates = [...templates];
    updatedTemplates[activeTemplateIdx].sections[sectionIdx].title = value;
    setTemplates(updatedTemplates);
  };

  // Add required toggle state
  const handleToggleRequired = (sectionIdx: number, fieldIdx: number) => {
    if (activeTemplateIdx === null) return;
    const updatedTemplates = [...templates];
    const field =
      updatedTemplates[activeTemplateIdx].sections[sectionIdx].fields[fieldIdx];
    field.required = !field.required;
    setTemplates(updatedTemplates);
  };

  // Add helpText to Field type
  const handleFieldLabelChange = (
    sectionIdx: number,
    fieldIdx: number,
    value: string
  ) => {
    if (activeTemplateIdx === null) return;
    const updatedTemplates = [...templates];
    updatedTemplates[activeTemplateIdx].sections[sectionIdx].fields[
      fieldIdx
    ].label = value;
    setTemplates(updatedTemplates);
  };

  const handleFieldHelpChange = (
    sectionIdx: number,
    fieldIdx: number,
    value: string
  ) => {
    if (activeTemplateIdx === null) return;
    const updatedTemplates = [...templates];
    (
      updatedTemplates[activeTemplateIdx].sections[sectionIdx].fields[
        fieldIdx
      ] as FieldWithHelp
    ).helpText = value;
    setTemplates(updatedTemplates);
  };

  const handleFieldTypeChange = (
    sectionIdx: number,
    fieldIdx: number,
    value: FieldType
  ) => {
    if (activeTemplateIdx === null) return;
    const updatedTemplates = [...templates];
    updatedTemplates[activeTemplateIdx].sections[sectionIdx].fields[
      fieldIdx
    ].type = value;
    setTemplates(updatedTemplates);
  };

  return (
    <div>
      <h1>Template Builder</h1>
      <div style={{ marginBottom: 16 }}>
        <button onClick={handleAddTemplate} disabled={templates.length >= 5}>
          + Add Template
        </button>
        {templates.length === 0 && (
          <span style={{ marginLeft: 8 }}>No templates yet.</span>
        )}
        {templates.map((tpl, idx) => (
          <button
            key={tpl.id}
            style={{
              fontWeight: activeTemplateIdx === idx ? "bold" : "normal",
              marginLeft: 8,
            }}
            onClick={() => setActiveTemplateIdx(idx)}
          >
            {tpl.name}
          </button>
        ))}
      </div>
      {activeTemplateIdx !== null && templates[activeTemplateIdx] && (
        <div>
          <input
            type="text"
            value={templates[activeTemplateIdx].name}
            onChange={handleTemplateNameChange}
            style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}
          />
          <button onClick={handleAddSection} style={{ marginLeft: 8 }}>
            + Add Section
          </button>
          {templates[activeTemplateIdx].sections.length === 0 && (
            <div
              style={{
                textAlign: "center",
                color: "#6b7280",
                margin: "40px 0",
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 8 }}>📄</div>
              <div style={{ fontSize: 18, fontWeight: 500 }}>
                No sections yet
              </div>
              <div style={{ fontSize: 15 }}>
                Click <b>+ Add Section</b> to get started!
              </div>
            </div>
          )}
          {templates[activeTemplateIdx].sections.map((section, sIdx) => (
            <div key={section.id} className="section-box">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 18,
                }}
              >
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) =>
                    handleSectionTitleChange(sIdx, e.target.value)
                  }
                  style={{
                    fontWeight: "bold",
                    fontSize: 16,
                    marginBottom: 0,
                    flex: 1,
                    border: "none",
                    background: "transparent",
                  }}
                />
                <button
                  className="danger icon-only"
                  style={{ marginLeft: 8 }}
                  onClick={() => handleDeleteSection(sIdx)}
                  title="Delete section"
                >
                  🗑️
                </button>
              </div>
              {section.fields.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    color: "#6b7280",
                    margin: "24px 0",
                  }}
                >
                  <div style={{ fontSize: 32, marginBottom: 6 }}>➕</div>
                  <div style={{ fontSize: 16 }}>
                    No fields yet. Click <b>＋ Add field</b>.
                  </div>
                </div>
              )}
              <ul>
                {section.fields.map((field, fIdx) => (
                  <li
                    key={field.id}
                    draggable
                    onDragStart={() => handleDragStart(sIdx, fIdx)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(sIdx, fIdx)}
                    style={{
                      background:
                        dragState &&
                        dragState.sectionIdx === sIdx &&
                        dragState.fieldIdx === fIdx
                          ? "#ececec"
                          : undefined,
                      marginBottom: 12,
                      borderRadius: 10,
                      boxShadow: "0 1px 4px rgba(34,34,59,0.04)",
                      padding: "18px 16px",
                      border: "1.5px solid #ececec",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "stretch",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: 10,
                      }}
                    >
                      <span className="drag-handle" title="Drag to reorder">
                        ⋮⋮
                      </span>
                      <span style={{ marginRight: 12, fontSize: 20 }}>
                        {field.type === "label"
                          ? "🔤"
                          : field.type === "text"
                          ? "✏️"
                          : field.type === "number"
                          ? "🔢"
                          : field.type === "boolean"
                          ? "✅"
                          : field.type === "enum"
                          ? "🔽"
                          : "❓"}
                      </span>
                      <input
                        type="text"
                        value={field.label}
                        onChange={(e) =>
                          handleFieldLabelChange(sIdx, fIdx, e.target.value)
                        }
                        placeholder="Add field label"
                        style={{
                          flex: 1,
                          marginRight: 8,
                          fontWeight: 500,
                          fontSize: 15,
                          border: "1.5px solid #ececec",
                          borderRadius: 6,
                          background: "#fafafb",
                          padding: "6px 10px",
                        }}
                      />
                      {field.type !== "label" && (
                        <select
                          value={field.type}
                          onChange={(e) =>
                            handleFieldTypeChange(
                              sIdx,
                              fIdx,
                              e.target.value as FieldType
                            )
                          }
                          style={{
                            marginRight: 8,
                            border: "1.5px solid #ececec",
                            borderRadius: 6,
                            background: "#fafafb",
                            padding: "6px 10px",
                            fontSize: 15,
                          }}
                        >
                          <option value="text">Short Answer</option>
                          <option value="number">Number</option>
                          <option value="boolean">Yes/No</option>
                          <option value="enum">Dropdown</option>
                        </select>
                      )}
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          marginRight: 12,
                        }}
                      >
                        <span style={{ fontSize: 13, color: "#6b7280" }}>
                          Make as required
                        </span>
                        <label className="toggle">
                          <input
                            type="checkbox"
                            checked={!!field.required}
                            onChange={() => handleToggleRequired(sIdx, fIdx)}
                          />
                          <span className="toggle-slider"></span>
                        </label>
                      </span>
                      <button
                        className="danger icon-only"
                        onClick={() => handleDeleteField(sIdx, field.id)}
                        title="Delete field"
                      >
                        🗑️
                      </button>
                    </div>
                    {field.type !== "label" && (
                      <input
                        type="text"
                        value={(field as FieldWithHelp).helpText || ""}
                        onChange={(e) =>
                          handleFieldHelpChange(sIdx, fIdx, e.target.value)
                        }
                        placeholder="Add help text"
                        style={{
                          marginBottom: 8,
                          fontSize: 14,
                          border: "1.5px solid #ececec",
                          borderRadius: 6,
                          background: "#fafafb",
                          padding: "6px 10px",
                        }}
                      />
                    )}
                  </li>
                ))}
              </ul>
              <button
                className="sidebar-field"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  border: "1.5px dashed #ececec",
                  background: "#fafafb",
                  color: "#6b7280",
                  fontWeight: 500,
                  fontSize: 16,
                  marginTop: 18,
                }}
                onClick={() => handleAddField(sIdx, "text")}
              >
                ＋ Add field
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TemplateBuilder;
