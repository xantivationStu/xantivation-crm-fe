import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function GlobalCursor({
  glowColor = "var(--cursor-glow, rgba(255, 255, 255, 0.1))",
  color = "var(--cursor-color, currentColor)",
  blendColor = "var(--cursor-blend-color, #ffffff)"
}) {
  const cursorRef = useRef(null);
  const [cursorText, setCursorText] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [isBlend, setIsBlend] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Safely check pointer type on the client to avoid SSR hydration failure
    const touchCheck = window.matchMedia("(pointer: coarse)").matches;
    setIsTouchDevice(touchCheck);
    if (touchCheck) return;

    document.body.style.cursor = "none"; // Hide default cursor

    const cursor = cursorRef.current;
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.2, ease: "power3.out" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.2, ease: "power3.out" });

    const moveCursor = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const handleMouseOver = (e) => {
      const target = e.target.closest("[data-cursor-expand], [data-cursor-text], [data-cursor-blend]");
      if (!target) {
        setIsHovered(false);
        setCursorText("");
        setIsBlend(false);
        return;
      }

      setIsHovered(true);
      if (target.hasAttribute("data-cursor-blend")) {
        setIsBlend(true);
      }
      
      const text = target.getAttribute("data-cursor-text");
      if (text) {
        setCursorText(text);
      }
    };

    const handleMouseOut = () => {
      setIsHovered(false);
      setCursorText("");
      setIsBlend(false);
    };

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);

    return () => {
      document.body.style.cursor = "auto";
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  if (!mounted || isTouchDevice) {
    return null;
  }

  return (
    <div
      ref={cursorRef}
      className={`fixed top-0 left-0 w-4 h-4 rounded-full pointer-events-none z-[999999] -translate-x-1/2 -translate-y-1/2 mix-blend-normal transition-all duration-300 ${
        isHovered ? "w-16 h-16 backdrop-blur-sm border border-white/20" : ""
      } ${isBlend ? "mix-blend-difference" : ""}`}
      style={{ 
        willChange: "transform",
        backgroundColor: isBlend ? blendColor : (isHovered ? glowColor : color)
      }}
    >
      {cursorText && (
        <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold tracking-widest text-white uppercase">
          {cursorText}
        </span>
      )}
    </div>
  );
}
