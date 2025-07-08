import React from "react";
import { Template } from "./TemplateBuilder";

interface PreviewPaneProps {
  template?: Template;
}

const PreviewPane: React.FC<PreviewPaneProps> = ({ template }) => {
  if (!template)
    return (
      <div>
        <h2>Preview</h2>
        <p>No template selected.</p>
      </div>
    );
  return (
    <div>
      <h2>Preview: {template.name}</h2>
      {template.sections.map((section) => (
        <div key={section.id} style={{ marginBottom: 16 }}>
          <h3>{section.title}</h3>
          <ul>
            {section.fields.map((field) => (
              <li key={field.id}>
                {field.type === "label" ? (
                  <span>
                    [{field.labelLevel?.toUpperCase()}] {field.label}
                  </span>
                ) : (
                  <span>
                    [{field.type.toUpperCase()}] {field.label}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default PreviewPane;
