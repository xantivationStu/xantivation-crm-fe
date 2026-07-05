import React from "react";
import "./ScaleFillButton.css";

export function ScaleFillButton({ children, onClick, className = "" }) {
  return (
    <button onClick={onClick} className={`btn-scale-fill ${className}`}>
      {children}
    </button>
  );
}
