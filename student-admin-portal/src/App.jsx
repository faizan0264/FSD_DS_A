import React from "react";
import { PortalProvider, usePortal } from "./context/PortalContext";
import { Navbar } from "./components/Navbar";
import { Login } from "./components/Login";
import { AdminPortal } from "./components/AdminPortal";
import { StudentPortal } from "./components/StudentPortal";
import { Toast } from "./components/Toast";
import { Database, ShieldCheck, GraduationCap } from "lucide-react";
import "./App.css";

const MainApp = () => {
  const { currentUser } = usePortal();

  return (
    <div className="app-container">
      <Navbar />

      <main className="main-content">
        {!currentUser ? (
          <Login />
        ) : currentUser.role === "admin" ? (
          <AdminPortal />
        ) : (
          <StudentPortal />
        )}
      </main>

      <footer className="portal-footer">
        <div className="footer-container">
          <div className="footer-left">
            <span className="footer-brand">EduPortal Frontend Architecture</span>
            <span className="footer-badge">
              <Database size={13} /> Pure Client JSON &bull; Zero Backend
            </span>
          </div>
          <div className="footer-right">
            <span>Admin & Student Role-Based Authentication with LocalStorage Persistence</span>
          </div>
        </div>
      </footer>

      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <PortalProvider>
      <MainApp />
    </PortalProvider>
  );
}
