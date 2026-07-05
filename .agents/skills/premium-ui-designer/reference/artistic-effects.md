# High-End Artistic Effects (Artistic Effects & Premium Elements)

This document regulates aesthetic standards and code blueprints for four top-tier interactive artistic effects, designed to elevate a website's creative expression beyond basic, cliché layout structures.

---

## 1. Aesthetic Principles & Constraints

To prevent motion over-indexing from degrading visual luxury and turning the UI into "AI Slop", the Agent **must** strictly adhere to the quantitative guidelines below:

### A. Opacity Budget
- **Ambient Blobs & Spotlights:** Opacity must fall within **`2% - 8%`** (only a subtle tone shift should be perceived on scroll; solid colors are strictly prohibited).
- **Fine Vector Lines & Paper Noise:** Opacity is capped at **`10% - 15%`**. Any higher will fracture typographic layouts and compromise text readability.

### B. Animation Duration Floor
- All infinitely looping background animations (such as blob morphing, compass rotation, coordinate drift) must progress extremely slowly to match a biological breathing rhythm.
- **Minimum duration for a single cycle:** **`20 seconds - 45 seconds`**. Fast or jerky movements in background decorative elements are strictly banned.

### C. Line Weight Ceiling
- Micro-elements (`KineticOrnaments`) and SVG lines must maintain a stroke width (`stroke-width`) of **`0.5px` to `1px`**.
- Use `currentColor` strokes paired with low opacity to allow vector lines to blend seamlessly and elegantly into the background.

### D. Hover Restoration Rule
- Interactive liquid distortion effects (`LiquidDisplacementHover`) on images or text must use GSAP to return the filter's `scale` value back to **exactly `0`** when the hover interaction ends.
- Never leave text or media permanently distorted after mouse-leave, which degrades readability and breaks user interaction patterns.

---

## 2. Code Blueprints

### A. OrganicBlobNoise (Organic Morphing Blob with Paper Texture Noise)
Generates an organic background blob morphing slowly and randomly, combined with an SVG noise filter (`<feTurbulence>`) to replicate physical paper texture or bleeding ink. **Adheres to the CSS-only decorative loop rule (no JS thread animation).**
```jsx
import React from "react";

export function OrganicBlobNoise({
  className = "",
  color = "var(--blob-color, rgba(59, 130, 246, 0.15))",
  noiseFrequency = 0.035,
  noiseOpacity = 0.12
}) {
  return (
    <div className={`relative overflow-hidden pointer-events-none ${className}`}>
      <svg className="w-full h-full" viewBox="0 0 400 400">
        <defs>
          {/* Noise filter creating tactile material surface texture */}
          <filter id="paper-noise-filter">
            <feTurbulence 
               type="fractalNoise" 
               baseFrequency={noiseFrequency} 
               numOctaves="3" 
               result="noise" 
            />
            <feColorMatrix 
              type="matrix" 
              values={`1 0 0 0 0
                       0 1 0 0 0
                       0 0 1 0 0
                       0 0 0 ${noiseOpacity} 0`} 
              result="coloredNoise"
            />
            <feBlend mode="multiply" in="SourceGraphic" in2="coloredNoise" />
          </filter>
        </defs>

        {/* Morphing shape with paper texture overlay */}
        <g filter="url(#paper-noise-filter)">
          <path
            className="animate-blob-spin"
            d="M200,80 C280,70 340,130 330,210 C320,290 270,330 200,320 C130,310 70,260 80,180 C90,100 120,90 200,80 Z"
            fill={color}
            style={{ transformOrigin: "center" }}
          />
        </g>
      </svg>
      <style>{`
        .animate-blob-spin {
          animation: blobSpin 30s linear infinite;
        }
        @keyframes blobSpin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
```

---

### B. MorphingClipPath (Scroll-Triggered Geometric Morphing Mask)
Reveals media or content through a geometric mask that morphs into full fullscreen dimensions as the user scrolls, creating a smooth cinematic layout transition.

> [!WARNING]
> **GSAP MorphSVGPlugin License Restriction:**
> Morphing complex paths with varying node structures and control point counts requires GSAP's paid member-only `MorphSVGPlugin`.
> For free/core usage, **startPath and endPath must share the exact same number of control points and command structure** (e.g., both having 4 vertices and matching `L` / `C` commands) so the free core `AttrPlugin` can interpolate attributes directly.
```jsx
import React, { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function MorphingClipPath({
  children,
  className = "",
  // Normalized path coordinates (0 to 1) sharing identical node counts for free interpolation
  startPath = "M 0.5,0.1 L 0.9,0.5 L 0.5,0.9 L 0.1,0.5 Z", // Central diamond shape (4 points)
  endPath = "M 0,0 L 1,0 L 1,1 L 0,1 Z"                    // 100% full rectangle (4 points)
}) {
  const containerRef = useRef(null);
  const pathRef = useRef(null);

  useGSAP(() => {
    if (!pathRef.current) return;

    gsap.to(pathRef.current, {
      attr: { d: endPath },
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom center",
        scrub: true,
      }
    });
  }, { scope: containerRef, dependencies: [endPath] });

  return (
    <div ref={containerRef} className={`relative overflow-hidden w-full ${className}`}>
      {/* SVG ClipPath automatically scaling to container via objectBoundingBox */}
      <svg className="absolute w-0 h-0 pointer-events-none">
        <defs>
          <clipPath id="morph-clip" clipPathUnits="objectBoundingBox">
            <path ref={pathRef} d={startPath} />
          </clipPath>
        </defs>
      </svg>

      {/* Render area constrained by morphing mask */}
      <div style={{ clipPath: "url(#morph-clip)" }} className="w-full h-full">
        {children}
      </div>
    </div>
  );
}
```

---

### C. LiquidDisplacementHover (Interactive Water Wave Ripple on Hover - Grid Safe)
Utilizes SVG's `<feDisplacementMap>` to create organic ripples on images or text elements upon hover. **Uses unique IDs to prevent filter collision when multiple components are rendered in lists/grids.**
```jsx
import React, { useRef, useId } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export function LiquidDisplacementHover({
  children,
  className = "",
  id: customId
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  
  // Auto-generate a unique filter ID if none is supplied to avoid list/grid collision
  const reactId = useId();
  const filterId = customId || `displacement-${reactId.replace(/:/g, "")}`;

  useGSAP(() => {
    if (!mapRef.current) return;

    const handleMouseEnter = () => {
      // Trigger displacement burst, then decay smoothly back to 0
      gsap.fromTo(mapRef.current, 
        { attr: { scale: 60 } },
        { attr: { scale: 0 }, duration: 1.5, ease: "power2.out" }
      );
    };

    const container = containerRef.current;
    container.addEventListener("mouseenter", handleMouseEnter);
    return () => container.removeEventListener("mouseenter", handleMouseEnter);
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className={`relative cursor-pointer ${className}`}>
      {/* SVG filter managing the fluid displacement */}
      <svg className="absolute w-0 h-0 pointer-events-none">
        <defs>
          <filter id={filterId}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.03"
              numOctaves="2"
              result="noise"
            />
            <feDisplacementMap
              ref={mapRef}
              in="SourceGraphic"
              in2="noise"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <div style={{ filter: `url(#${filterId})` }}>
        {children}
      </div>
    </div>
  );
}
```

---

### D. KineticOrnaments (Interactive Micro-Geometric coordinate system)
Micro-fine structural design details (mini compasses, dials, coordinates) that counter-rotate dynamically during page scroll to express high-fidelity technical depth.
```jsx
import React, { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function KineticOrnaments({
  className = "",
  strokeColor = "var(--ornament-stroke, currentColor)",
  strokeWidth = 1,
  size = 70
}) {
  const compassRef = useRef(null);
  const ringRef = useRef(null);

  useGSAP(() => {
    // Inner crosshairs rotate clockwise on scroll
    gsap.to(compassRef.current, {
      rotate: 180,
      ease: "none",
      scrollTrigger: {
        trigger: compassRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });

    // Outer dashed ring rotates counter-clockwise
    gsap.to(ringRef.current, {
      rotate: -90,
      ease: "none",
      scrollTrigger: {
        trigger: ringRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });
  }, { scope: compassRef });

  return (
    <div className={`pointer-events-none select-none relative ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 100 100" className="w-full h-full overflow-visible">
        {/* Outer dashed dial */}
        <circle
          ref={ringRef}
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray="4 8"
          opacity="0.3"
          style={{ transformOrigin: "center" }}
        />
        
        {/* Inner rotating crosshair */}
        <g ref={compassRef} style={{ transformOrigin: "center" }}>
          {/* Fine lines */}
          <line x1="50" y1="20" x2="50" y2="80" stroke={strokeColor} strokeWidth={strokeWidth + 0.5} />
          <line x1="20" y1="50" x2="80" y2="50" stroke={strokeColor} strokeWidth={strokeWidth} opacity="0.5" />
          
          {/* Fine pointers */}
          <polygon points="50,15 47,25 53,25" fill={strokeColor} />
          <polygon points="50,85 47,75 53,75" fill={strokeColor} opacity="0.5" />
        </g>

        {/* Technical monospace labels */}
        <text x="50" y="8" textAnchor="middle" fontSize="6" fontFamily="var(--font-mono, monospace)" fill={strokeColor} opacity="0.4">N</text>
        <text x="50" y="98" textAnchor="middle" fontSize="6" fontFamily="var(--font-mono, monospace)" fill={strokeColor} opacity="0.4">S</text>
      </svg>
    </div>
  );
}
```
