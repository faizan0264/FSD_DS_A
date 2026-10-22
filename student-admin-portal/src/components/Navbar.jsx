import React, { useState } from "react";
import { usePortal } from "../context/PortalContext";
import { 
  GraduationCap, 
  ShieldCheck, 
  User, 
  LogOut, 
  FileCode2, 
  Download, 
  RotateCcw,
  Sparkles
} from "lucide-react";
import { JsonViewerModal } from "./JsonViewerModal";
import "./Navbar.css";

export const Navbar = () => {
  const { currentUser, logout, exportDataAsJSON, resetToDefaultData } = usePortal();
  const [showJsonModal, setShowJsonModal] = useState(false);

  return (
    <>
      <header className="portal-navbar">
        <div className="navbar-container">
          <div className="navbar-brand">
            <div className="brand-icon-wrapper">
              <GraduationCap className="brand-icon" size={26} />
            </div>
            <div className="brand-text">
              <span className="brand-title">EduPortal</span>
              <span className="brand-subtitle">Frontend-Only JSON Architecture</span>
            </div>
            {currentUser && (
              <span className={`badge ${currentUser.role === "admin" ? "badge-primary" : "badge-info"} role-badge`}>
                {currentUser.role === "admin" ? (
                  <>
                    <ShieldCheck size={14} /> Admin Workspace
                  </>
                ) : (
                  <>
                    <User size={14} /> Student Workspace
                  </>
                )}
              </span>
            )}
          </div>

          <div className="navbar-actions">
            {/* JSON Tools */}
            <button
              onClick={() => setShowJsonModal(true)}
              className="btn btn-secondary btn-sm"
              title="View current in-memory & localStorage JSON data"
            >
              <FileCode2 size={16} />
              <span>Inspect JSON</span>
            </button>

            <button
              onClick={exportDataAsJSON}
              className="btn btn-secondary btn-sm"
              title="Download full JSON dataset"
            >
              <Download size={16} />
              <span>Export JSON</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm("Reset all students, attendance, and assignments back to default JSON?")) {
                  resetToDefaultData();
                }
              }}
              className="btn btn-secondary btn-sm"
              title="Restore initial JSON seed data"
            >
              <RotateCcw size={15} />
              <span>Reset Data</span>
            </button>

            {currentUser && (
              <div className="user-profile-section">
                <div className="user-avatar">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="user-details">
                  <span className="user-name">{currentUser.name}</span>
                  <span className="user-meta">
                    {currentUser.role === "admin" ? "Administrator" : currentUser.studentId}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="btn btn-danger btn-sm logout-btn"
                  title="Sign out"
                >
                  <LogOut size={15} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {showJsonModal && <JsonViewerModal onClose={() => setShowJsonModal(false)} />}
    </>
  );
};
