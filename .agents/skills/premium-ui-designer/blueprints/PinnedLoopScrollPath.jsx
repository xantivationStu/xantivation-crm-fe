import React, { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function PinnedLoopScrollPath({
  children,
  className = "",
  pathData = "M 300,0 L 300,250 C 480,250 480,450 300,450 C 120,450 120,250 300,250 L 300,800",
  viewBox = "0 0 600 800",
  strokeColor = "var(--color-primary, currentColor)",
  strokeWidth = 3,
  pinDuration = 1000
}) {
  const containerRef = useRef(null);
  const pathRef = useRef(null);

  useGSAP(() => {
    if (!pathRef.current) return;
    const path = pathRef.current;
    const pathLength = path.getTotalLength();

    gsap.set(path, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
    });

    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: `+=${pinDuration}`,
      pin: true,
      scrub: 0.5,
      animation: gsap.to(path, {
        strokeDashoffset: 0,
        ease: "none",
      }),
    });
  }, { scope: containerRef, dependencies: [pathData, pinDuration] });

  return (
    <div ref={containerRef} className={`w-full h-screen relative flex items-center justify-center overflow-hidden ${className}`}>
      <div className="z-10 relative">
        {children}
      </div>

      <svg
        className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-0"
        viewBox={viewBox}
        preserveAspectRatio="none"
      >
        <path
          d={pathData}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          opacity="0.15"
          strokeLinecap="round"
        />
        
        <path
          ref={pathRef}
          d={pathData}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
