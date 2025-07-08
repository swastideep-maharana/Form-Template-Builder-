import React, { useState, useEffect } from "react";
import TemplateBuilder, { Template } from "./components/TemplateBuilder";
import FormRenderer from "./components/FormRenderer";
import PreviewPane from "./components/PreviewPane";
import Toast from "./components/Toast";
import logo from "./logo.svg";
import "./App.css";

const STORAGE_KEY = "formTemplates";

const App: React.FC = () => {
  const [view, setView] = useState<"builder" | "form">("builder");
  const [templates, setTemplates] = useState<Template[]>([]);
  const [activeTemplateIdx, setActiveTemplateIdx] = useState<number | null>(
    null
  );
  const [showPreview, setShowPreview] = useState(false);
  const [showShareMsg, setShowShareMsg] = useState(false);
  const [showSavedMsg, setShowSavedMsg] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type?: "success" | "error" | "info";
  } | null>(null);

  // Load templates from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setTemplates(JSON.parse(stored));
    }
  }, []);

  // Save templates to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
  }, [templates]);

  // Demo data
  const demoTemplates: Template[] = [
    {
      id: "demo1",
      name: "Employee Onboarding",
      sections: [
        {
          id: "s1",
          title: "Personal Info",
          fields: [
            {
              id: "f1",
              type: "label",
              label: "Welcome to the Company!",
              labelLevel: "h1",
            },
            { id: "f2", type: "text", label: "Full Name" },
            { id: "f3", type: "number", label: "Employee ID" },
            { id: "f4", type: "boolean", label: "Has Laptop?" },
          ],
        },
        {
          id: "s2",
          title: "Preferences",
          fields: [
            {
              id: "f5",
              type: "enum",
              label: "T-Shirt Size",
              enumOptions: ["S", "M", "L", "XL"],
            },
          ],
        },
      ],
    },
    {
      id: "demo2",
      name: "Daily Standup",
      sections: [
        {
          id: "s3",
          title: "Update",
          fields: [
            {
              id: "f6",
              type: "label",
              label: "What did you do yesterday?",
              labelLevel: "h2",
            },
            { id: "f7", type: "text", label: "Yesterday" },
            {
              id: "f8",
              type: "label",
              label: "What will you do today?",
              labelLevel: "h2",
            },
            { id: "f9", type: "text", label: "Today" },
            { id: "f10", type: "boolean", label: "Any Blockers?" },
          ],
        },
      ],
    },
  ];

  const handleLoadDemo = () => {
    setTemplates(demoTemplates);
    setActiveTemplateIdx(0);
  };

  // Handler to add a field from sidebar
  const handleSidebarAddField = (type: string) => {
    if (activeTemplateIdx === null) return;
    const updatedTemplates = [...templates];
    const template = updatedTemplates[activeTemplateIdx];
    if (!template.sections.length) return;
    const sectionIdx = template.sections.length - 1; // Add to last section
    const newField = {
      id: Date.now().toString(),
      type: type as import("./components/TemplateBuilder").FieldType,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      ...(type === "label"
        ? {
            labelLevel:
              "h2" as import("./components/TemplateBuilder").LabelLevel,
          }
        : {}),
      ...(type === "enum" ? { enumOptions: ["Option 1", "Option 2"] } : {}),
    };
    template.sections[sectionIdx].fields.push(newField);
    setTemplates(updatedTemplates);
  };

  // Handler for Save Draft
  const handleSaveDraft = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
    setToast({ message: "Draft saved!", type: "success" });
  };

  // Handler for Share
  const handleShare = () => {
    setToast({ message: "Feature coming soon!", type: "info" });
  };

  return (
    <div className="app-container">
      <header className="main-header">
        <div className="header-left">
          <button onClick={() => setView("builder")}>Template Builder</button>
          <button onClick={() => setView("form")}>Form Renderer</button>
          {templates.length === 0 && (
            <button style={{ marginLeft: 16 }} onClick={handleLoadDemo}>
              Load Demo Data
            </button>
          )}
        </div>
        <div className="header-right">
          <button className="header-action" onClick={handleSaveDraft}>
            Save draft
          </button>
          <button
            className="header-action"
            onClick={() => setShowPreview(true)}
          >
            Preview
          </button>
          <button className="header-action primary" onClick={handleShare}>
            Share
          </button>
        </div>
      </header>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="main-layout">
        <div className="canvas-area">
          {view === "builder" ? (
            <>
              <TemplateBuilder
                templates={templates}
                setTemplates={setTemplates}
                activeTemplateIdx={activeTemplateIdx}
                setActiveTemplateIdx={setActiveTemplateIdx}
                onSidebarAddField={handleSidebarAddField}
              />
              <PreviewPane
                template={
                  activeTemplateIdx !== null
                    ? templates[activeTemplateIdx]
                    : undefined
                }
              />
            </>
          ) : (
            <FormRenderer />
          )}
        </div>
        <aside className="sidebar">
          <div className="sidebar-tabs">
            <button className="sidebar-tab active">Field</button>
            <button className="sidebar-tab">Workflow</button>
            <button className="sidebar-tab">Permissions</button>
          </div>
          <div className="sidebar-search">
            <input type="text" placeholder="Search element" />
          </div>
          <div className="sidebar-fields">
            <div className="sidebar-group">
              <div className="sidebar-group-title">Text Elements</div>
              <button
                className="sidebar-field"
                onClick={() => handleSidebarAddField("text")}
              >
                ✏️ Short Answer
              </button>
              <button
                className="sidebar-field"
                onClick={() => handleSidebarAddField("label")}
              >
                🔤 Paragraph
              </button>
            </div>
            <div className="sidebar-group">
              <div className="sidebar-group-title">Multiple Choice</div>
              <button
                className="sidebar-field"
                onClick={() => handleSidebarAddField("enum")}
              >
                🔽 Dropdown
              </button>
              <button
                className="sidebar-field"
                onClick={() => handleSidebarAddField("enum")}
              >
                🔘 Radio
              </button>
              <button
                className="sidebar-field"
                onClick={() => handleSidebarAddField("boolean")}
              >
                ✅ Yes / No
              </button>
              <button
                className="sidebar-field"
                onClick={() => handleSidebarAddField("enum")}
              >
                🔽 Dropdown
              </button>
            </div>
            <div className="sidebar-group">
              <div className="sidebar-group-title">Media Element</div>
              <button className="sidebar-field" disabled>
                📤 Upload
              </button>
              <button className="sidebar-field" disabled>
                🖼️ Image
              </button>
            </div>
          </div>
        </aside>
      </div>
      {showPreview && (
        <div className="modal-overlay" onClick={() => setShowPreview(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <PreviewPane
              template={
                activeTemplateIdx !== null
                  ? templates[activeTemplateIdx]
                  : undefined
              }
            />
            <button
              className="primary"
              onClick={() => setShowPreview(false)}
              style={{ marginTop: 16 }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
