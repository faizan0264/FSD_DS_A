import React, { useState } from "react";
import { usePortal } from "../context/PortalContext";
import { 
  ShieldCheck, 
  GraduationCap, 
  KeyRound, 
  User, 
  ArrowRight, 
  Sparkles, 
  Database,
  CheckCircle2
} from "lucide-react";
import "./Login.css";

export const Login = () => {
  const { login, quickLogin, data } = usePortal();
  const [selectedRole, setSelectedRole] = useState("admin"); // "admin" | "student"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("STU-101");

  const handleSubmit = (e) => {
    e.preventDefault();
    login(username, password, selectedRole);
  };

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    if (role === "admin") {
      setUsername("admin");
      setPassword("admin123");
    } else {
      setUsername("alex");
      setPassword("student123");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        {/* Header badge */}
        <div className="login-header">
          <div className="login-badge-pill">
            <Database size={15} />
            <span>Pure React + Client JSON (No Backend / No DB)</span>
          </div>
          <h1 className="login-title">Student & Admin Portal</h1>
          <p className="login-subtitle">
            Sign in with distinct credentials to access role-specific workflows
          </p>
        </div>

        <div className="login-card portal-card">
          {/* Role Switcher Tabs */}
          <div className="role-switch-container">
            <button
              type="button"
              className={`role-tab ${selectedRole === "admin" ? "active admin" : ""}`}
              onClick={() => handleRoleChange("admin")}
            >
              <ShieldCheck size={18} />
              <span>Admin Login</span>
            </button>
            <button
              type="button"
              className={`role-tab ${selectedRole === "student" ? "active student" : ""}`}
              onClick={() => handleRoleChange("student")}
            >
              <GraduationCap size={18} />
              <span>Student Login</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label className="form-label" htmlFor="username">
                {selectedRole === "admin" ? "Admin Username" : "Student Username"}
              </label>
              <div className="input-with-icon">
                <User size={18} className="input-icon" />
                <input
                  id="username"
                  type="text"
                  required
                  placeholder={selectedRole === "admin" ? "e.g. admin" : "e.g. alex or priya"}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-input has-icon"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <div className="input-with-icon">
                <KeyRound size={18} className="input-icon" />
                <input
                  id="password"
                  type="password"
                  required
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input has-icon"
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block submit-btn">
              <span>Sign In as {selectedRole === "admin" ? "Admin" : "Student"}</span>
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Quick 1-Click Access for Instant Demo */}
          <div className="quick-access-section">
            <div className="quick-access-title">
              <Sparkles size={14} />
              <span>Instant 1-Click Demo Login</span>
            </div>
            <div className="quick-access-buttons">
              <button
                type="button"
                onClick={() => quickLogin("admin")}
                className="btn btn-secondary btn-sm quick-btn admin-quick"
              >
                <ShieldCheck size={15} />
                <span>Admin Demo</span>
              </button>

              <button
                type="button"
                onClick={() => quickLogin("student", "STU-BT-AIML-A01")}
                className="btn btn-secondary btn-sm quick-btn student-quick"
              >
                <GraduationCap size={15} />
                <span>B.Tech AI &amp; ML</span>
              </button>

              <button
                type="button"
                onClick={() => quickLogin("student", "STU-BT-DS-A01")}
                className="btn btn-secondary btn-sm quick-btn student-quick"
              >
                <GraduationCap size={15} />
                <span>B.Tech Data Science</span>
              </button>

              <button
                type="button"
                onClick={() => quickLogin("student", "STU-BT-CSE-A01")}
                className="btn btn-secondary btn-sm quick-btn student-quick"
              >
                <GraduationCap size={15} />
                <span>B.Tech CSE</span>
              </button>

              <button
                type="button"
                onClick={() => quickLogin("student", "STU-MCA-CS-A01")}
                className="btn btn-secondary btn-sm quick-btn student-quick"
              >
                <GraduationCap size={15} />
                <span>MCA CS</span>
              </button>

              <button
                type="button"
                onClick={() => quickLogin("student", "STU-BCA-IT-B01")}
                className="btn btn-secondary btn-sm quick-btn student-quick"
              >
                <GraduationCap size={15} />
                <span>BCA IT</span>
              </button>
            </div>
          </div>

          {/* Credentials Helper info */}
          <div className="credentials-info-box">
            <span className="cred-title">1,600 Indian Students &bull; 1st to 4th Year &bull; 4 Sections (A, B, C, D) &bull; 50 Students Each:</span>
            <div className="cred-item">
              <strong>Admin:</strong> <code>admin</code> / <code>admin123</code>
            </div>
            <div className="cred-item">
              <strong>B.Tech AI &amp; ML:</strong> <code>btech_aiml_student</code> / <code>student123</code>
            </div>
            <div className="cred-item">
              <strong>B.Tech Data Science:</strong> <code>btech_ds_student</code> / <code>student123</code>
            </div>
            <div className="cred-item">
              <strong>B.Tech CSE:</strong> <code>btech_cse_student</code> / <code>student123</code>
            </div>
          </div>
        </div>

        {/* Feature summary cards */}
        <div className="login-features-grid">
          <div className="feature-item">
            <div className="feature-icon admin">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4>Admin Capabilities</h4>
              <ul>
                <li>Add new students with auto-generated logins</li>
                <li>Mark & manage daily attendance</li>
                <li>Upload course assignments & view student work</li>
                <li>Delete students with full data cleanup</li>
              </ul>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon student">
              <GraduationCap size={20} />
            </div>
            <div>
              <h4>Student Capabilities</h4>
              <ul>
                <li>View personalized attendance metrics & logs</li>
                <li>Browse assignments published by admin</li>
                <li>Upload & submit solutions (with files & notes)</li>
                <li>Track submission status and review grades</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
