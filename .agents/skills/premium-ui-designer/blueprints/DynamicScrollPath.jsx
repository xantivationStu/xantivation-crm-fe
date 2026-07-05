import React, { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function DynamicScrollPath({
  className = "",
  pathData = "M 300,0 Q 480,220 300,450 T 130,750 Q 90,850 300,1000 T 200,1200",
  viewBox = "0 0 600 1200",
  strokeColor = "var(--path-stroke, currentColor)",
  strokeWidth = 2,
  mode = "intro-scroll", // "intro-static" or "intro-scroll"
  flowPackets = true
}) {
  const svgRef = useRef(null);
  const pathRef = useRef(null);

  useGSAP(() => {
    if (!pathRef.current) return;
    const path = pathRef.current;
    const pathLength = path.getTotalLength();

    svgRef.current?.style.setProperty("--path-length", String(pathLength));

    gsap.set(path, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
    });

    if (mode === "intro-static") {
      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 2,
        ease: "power2.out",
        delay: 0.5
      });
    } else {
      const tl = gsap.timeline();
      tl.to(path, {
        strokeDashoffset: pathLength * 0.75,
        duration: 1.5,
        ease: "power1.out"
      });

      gsap.to(path, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: svgRef.current,
          start: "top 35%",
          end: "bottom center",
          scrub: 0.5,
        }
      });
    }
  }, { scope: svgRef, dependencies: [pathData, mode] });

  return (
    <div className={`absolute pointer-events-none overflow-visible ${className}`}>
      <svg
        ref={svgRef}
        className="w-full h-full overflow-visible"
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

        {flowPackets && (
          <path
            d={pathData}
            fill="none"
            stroke="url(#flow-gradient)"
            strokeWidth={strokeWidth + 0.5}
            strokeDasharray="15 150"
            strokeLinecap="round"
            className="animate-flow-packets-dash"
          />
        )}

        <defs>
          <linearGradient id="flow-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-primary, currentColor)" stopOpacity="0.8" />
            <stop offset="50%" stopColor="var(--color-secondary, currentColor)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      
      <style>{`
        .animate-flow-packets-dash {
          stroke-dashoffset: var(--path-length, 1200);
          animation: strokeSlide 15s linear infinite;
        }
        @keyframes strokeSlide {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
}
