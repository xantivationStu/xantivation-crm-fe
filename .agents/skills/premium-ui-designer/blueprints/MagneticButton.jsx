import React, { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export function MagneticButton({ children, className = "", range = 80, strength = 0.35 }) {
  const buttonRef = useRef(null);

  useGSAP(() => {
    // Disable on touch devices to prevent performance lag
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    if (isTouchDevice || !buttonRef.current) return;

    const el = buttonRef.current;
    const xTo = gsap.quickTo(el, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
    const yTo = gsap.quickTo(el, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = el.getBoundingClientRect();
      const x = left + width / 2;
      const y = top + height / 2;
      
      const distanceX = clientX - x;
      const distanceY = clientY - y;
      const distance = Math.hypot(distanceX, distanceY);

      if (distance < range) {
        xTo(distanceX * strength);
        yTo(distanceY * strength);
      } else {
        xTo(0);
        yTo(0);
      }
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    window.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, { scope: buttonRef });

  return (
    <div ref={buttonRef} className={`inline-block will-change-transform ${className}`}>
      {children}
    </div>
  );
}
