import React from "react";
import "./RollingText.css";

/**
 * Splits text into individual spans for character-by-character translation.
 * Custom styling via CSS variables:
 * --roll-font-family, --roll-font-size, --roll-text-color, --roll-text-hover-color, --roll-duration
 */
export function RollingText({ text, className = "", style = {} }) {
  return (
    <span className={`rolling-text ${className}`} style={style}>
      {text.split("").map((char, index) => (
        <span
          key={index}
          className="rolling-char"
          data-text={char}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}
