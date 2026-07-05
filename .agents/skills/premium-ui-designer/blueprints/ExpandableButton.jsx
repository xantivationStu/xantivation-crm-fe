import React from "react";
import "./ExpandableButton.css";

export function ExpandableButton({ icon, label, onClick, className = "" }) {
  return (
    <button onClick={onClick} className={`btn-expand ${className}`}>
      <div className="btn-expand__icon">{icon}</div>
      <span className="btn-expand__text">{label}</span>
    </button>
  );
}
