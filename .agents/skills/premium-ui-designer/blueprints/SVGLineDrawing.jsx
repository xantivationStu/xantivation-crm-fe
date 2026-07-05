            import React, { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function SVGLineDrawing({ className = "" }) {
  const svgRef = useRef(null);
  const pathRef = useRef(null);

  useGSAP(() => {
    if (!pathRef.current) return;
    const path = pathRef.current;
    
    // Measure the actual length of the SVG path
    const pathLength = path.getTotalLength();
    
    // Establish initial hidden state
    gsap.set(path, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
    });

    gsap.to(path, {
      strokeDashoffset: 0,
      ease: "none",
      scrollTrigger: {
        trigger: svgRef.current,
        start: "top 95%",
        end: "bottom 60%",
        scrub: true,
      },
    });
  }, { scope: svgRef });

  return (
    <svg 
      ref={svgRef}
      className={`w-full overflow-visible ${className}`} 
      viewBox="0 0 100 2" 
      preserveAspectRatio="none"
      height="2"
    >
      <path 
        ref={pathRef}
        d="M 0,1 L 100,1" 
        stroke="currentColor" 
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  );
}
