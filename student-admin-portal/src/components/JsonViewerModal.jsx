import React, { useState } from "react";
import { usePortal } from "../context/PortalContext";
import { X, Copy, Check, Download } from "lucide-react";
import "./JsonViewerModal.css";

export const JsonViewerModal = ({ onClose }) => {
  const { data, exportDataAsJSON, showToast } = usePortal();
  const [activeTab, setActiveTab] = useState("all");
  const [copied, setCopied] = useState(false);

  const getSectionData = () => {
    if (activeTab === "all") return data;
    return data[activeTab] || {};
  };

  const jsonString = JSON.stringify(getSectionData(), null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    showToast("JSON copied to clipboard!", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-dialog json-modal" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-header">
          <div className="modal-title">
            <span>Client-Side JSON Database Viewer</span>
            <span className="badge badge-primary">No Backend</span>
          </div>
          <button onClick={onClose} className="btn-icon" aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="json-tabs">
          {["all", "students", "attendance", "assignments", "submissions", "users"].map((tab) => (
            <button
              key={tab}
              className={`json-tab-btn ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.toUpperCase()}
              {Array.isArray(data[tab]) && <span className="tab-count">{data[tab].length}</span>}
            </button>
          ))}
        </div>

        <div className="modal-body json-viewer-body">
          <p className="json-notice">
            All data below is maintained directly in memory and persisted in the browser's <code>localStorage</code> as pure JSON.
          </p>
          <pre className="json-code-block">
            <code>{jsonString}</code>
          </pre>
        </div>

        <div className="modal-footer">
          <button onClick={handleCopy} className="btn btn-secondary">
            {copied ? <Check size={16} color="green" /> : <Copy size={16} />}
            <span>{copied ? "Copied!" : "Copy JSON"}</span>
          </button>
          <button onClick={exportDataAsJSON} className="btn btn-secondary">
            <Download size={16} />
            <span>Download .json file</span>
          </button>
          <button onClick={onClose} className="btn btn-primary">
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
