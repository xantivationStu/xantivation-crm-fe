import React, { useRef } from "react";
import "./SpotlightCard.css";

export function SpotlightCard({ 
  children, 
  className = "", 
  spotlightRadius = 150, 
  spotlightColor = "rgba(9, 60, 93, 0.08)", 
  style = {} 
}) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Set cursor positions as local CSS custom variables
    cardRef.current.style.setProperty("--mouse-x", `${x}px`);
    cardRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`spotlight-card ${className}`}
      style={{
        ...style,
        "--spotlight-radius": `${spotlightRadius}px`,
        "--spotlight-color": spotlightColor,
      }}
    >
      <div className="card-spotlight" />
      <div className="card-content">{children}</div>
    </div>
  );
}
