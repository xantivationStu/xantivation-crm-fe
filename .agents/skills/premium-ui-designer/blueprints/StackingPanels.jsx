import React, { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function StackingPanels({ panels, className = "" }) {
  const containerRef = useRef(null);

  useGSAP(() => {
    const cards = gsap.utils.toArray(".stack-panel");
    cards.forEach((card, i) => {
      if (i === cards.length - 1) return;
      
      ScrollTrigger.create({
        trigger: card,
        start: "top top",
        pin: true,
        pinSpacing: false,
        end: () => `+=${window.innerHeight}`,
        invalidateOnRefresh: true,
      });
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className={`w-full relative ${className}`}>
      {panels.map((panel, idx) => (
        <div
          key={idx}
          className="stack-panel w-full min-h-screen flex items-center justify-center"
          style={{ backgroundColor: panel.bgColor || "transparent" }}
        >
          {panel.content}
        </div>
      ))}
    </div>
  );
}
