import React from "react";
import { usePortal } from "../context/PortalContext";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import "./Toast.css";

export const Toast = () => {
  const { toast } = usePortal();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 size={18} className="toast-icon success" />,
    error: <AlertCircle size={18} className="toast-icon error" />,
    info: <Info size={18} className="toast-icon info" />
  };

  return (
    <div className={`portal-toast ${toast.type || "info"}`}>
      {icons[toast.type] || icons.info}
      <span className="toast-text">{toast.message}</span>
    </div>
  );
};
