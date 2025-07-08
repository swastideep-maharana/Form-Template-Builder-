import React, { useState } from "react";
import { Template, Field, LabelLevel } from "./TemplateBuilder";

const FORM_DATA_KEY = "formData";
const TEMPLATES_KEY = "formTemplates";

const getTemplates = (): Template[] => {
  const stored = localStorage.getItem(TEMPLATES_KEY);
  return stored ? JSON.parse(stored) : [];
};

const FormRenderer: React.FC = () => {
  const [templates] = useState<Template[]>(getTemplates());
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [form, setForm] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  if (templates.length === 0) {
    return (
      <div>
        <h1>Form Renderer</h1>
        <p>No templates available.</p>
      </div>
    );
  }

  const handleSelectTemplate = (idx: number) => {
    setSelectedIdx(idx);
    setForm({});
    setErrors({});
    setSubmitted(false);
  };

  const handleChange = (fieldId: string, value: any) => {
    setForm((prev) => ({ ...prev, [fieldId]: value }));
  };

  const validate = (template: Template) => {
    const newErrors: Record<string, string> = {};
    template.sections.forEach((section) => {
      section.fields.forEach((field) => {
        const value = form[field.id];
        if (field.type === "text" && typeof value !== "string") {
          newErrors[field.id] = "Text required";
        }
        if (
          field.type === "number" &&
          (value === undefined || value === "" || isNaN(Number(value)))
        ) {
          newErrors[field.id] = "Number required";
        }
        if (
          field.type === "enum" &&
          (!field.enumOptions || !field.enumOptions.includes(value))
        ) {
          newErrors[field.id] = "Select a valid option";
        }
        // Boolean and label do not require validation
      });
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIdx === null) return;
    const template = templates[selectedIdx];
    if (validate(template)) {
      // Save form data to localStorage
      const allData = JSON.parse(localStorage.getItem(FORM_DATA_KEY) || "{}");
      const templateId = template.id;
      allData[templateId] = allData[templateId] || [];
      allData[templateId].push(form);
      localStorage.setItem(FORM_DATA_KEY, JSON.stringify(allData));
      setSubmitted(true);
    } else {
      setSubmitted(false);
    }
  };

  return (
    <div>
      <h1>Form Renderer</h1>
      <div style={{ marginBottom: 16 }}>
        <span>Select Template: </span>
        {templates.map((tpl, idx) => (
          <button
            key={tpl.id}
            style={{
              fontWeight: selectedIdx === idx ? "bold" : "normal",
              marginLeft: 8,
            }}
            onClick={() => handleSelectTemplate(idx)}
          >
            {tpl.name}
          </button>
        ))}
      </div>
      {selectedIdx !== null && (
        <form onSubmit={handleSubmit}>
          {templates[selectedIdx].sections.map((section) => (
            <div key={section.id} style={{ marginBottom: 16 }}>
              <h3>{section.title}</h3>
              {section.fields.map((field) => (
                <div key={field.id} style={{ marginBottom: 8 }}>
                  {field.type === "label" ? (
                    React.createElement(
                      field.labelLevel || "h2",
                      {},
                      field.label
                    )
                  ) : field.type === "text" ? (
                    <div>
                      <label>{field.label}: </label>
                      <input
                        type="text"
                        value={form[field.id] || ""}
                        onChange={(e) => handleChange(field.id, e.target.value)}
                      />
                      {errors[field.id] && (
                        <span style={{ color: "red", marginLeft: 8 }}>
                          {errors[field.id]}
                        </span>
                      )}
                    </div>
                  ) : field.type === "number" ? (
                    <div>
                      <label>{field.label}: </label>
                      <input
                        type="number"
                        value={form[field.id] || ""}
                        onChange={(e) => handleChange(field.id, e.target.value)}
                      />
                      {errors[field.id] && (
                        <span style={{ color: "red", marginLeft: 8 }}>
                          {errors[field.id]}
                        </span>
                      )}
                    </div>
                  ) : field.type === "boolean" ? (
                    <div>
                      <label>
                        <input
                          type="checkbox"
                          checked={!!form[field.id]}
                          onChange={(e) =>
                            handleChange(field.id, e.target.checked)
                          }
                        />{" "}
                        {field.label}
                      </label>
                    </div>
                  ) : field.type === "enum" ? (
                    <div>
                      <label>{field.label}: </label>
                      <select
                        value={form[field.id] || ""}
                        onChange={(e) => handleChange(field.id, e.target.value)}
                      >
                        <option value="">Select...</option>
                        {field.enumOptions?.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      {errors[field.id] && (
                        <span style={{ color: "red", marginLeft: 8 }}>
                          {errors[field.id]}
                        </span>
                      )}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          ))}
          <button type="submit">Submit</button>
          {submitted && (
            <div style={{ color: "green", marginTop: 8 }}>
              Form submitted and saved!
            </div>
          )}
        </form>
      )}
    </div>
  );
};

export default FormRenderer;
