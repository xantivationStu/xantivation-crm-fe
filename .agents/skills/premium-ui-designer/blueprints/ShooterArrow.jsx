import React, { useState } from "react";
import { motion } from "framer-motion";

export function ShooterArrow({ children, className = "" }) {
  const [animating, setAnimating] = useState(false);

  const triggerAnimation = () => {
    if (!animating) {
      setAnimating(true);
      setTimeout(() => setAnimating(false), 500);
    }
  };

  return (
    <div
      onMouseEnter={triggerAnimation}
      className={`flex items-center gap-2 cursor-pointer ${className}`}
    >
      <span className="text-sm font-semibold">Explore Projects</span>
      <motion.div
        className="flex-shrink-0"
        animate={
          animating
            ? {
                x: [0, 16, -16, 0],
                y: [0, -16, 16, 0],
                opacity: [1, 0, 0, 1],
              }
            : { x: 0, y: 0, opacity: 1 }
        }
        transition={{
          duration: 0.5,
          times: [0, 0.4, 0.41, 1], // Exit, jump, re-enter
          ease: "easeInOut",
        }}
      >
        {children || (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="7" y1="17" x2="17" y2="7" />
            <polyline points="7 7 17 7 17 17" />
          </svg>
        )}
      </motion.div>
    </div>
  );
}
