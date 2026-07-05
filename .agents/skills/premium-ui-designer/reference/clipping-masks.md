# Clipping & Geometric Masking Guidelines (clipping-masks.md)

This document provides guidelines and blueprints for implementing visual effects using geometric clipping masks and color-inverting text overlays to create premium interactive page transitions and layout assets.

---

## 1. CustomClipMaskImage (Custom SVG Clip-Paths)

Using SVG `clipPath` units with normalized coordinates (`0-1` scaling bounds) allows images to be cropped into organic, curved folder-tab shapes instead of plain rectangles.

```jsx
import React, { useId } from "react";

export function CustomClipMaskImage({
  src,
  alt = "",
  className = "",
  maskType = "right", // "right" | "left" | "top" | "bottom"
  aspectRatio = "aspect-[2/3]"
}) {
  const maskId = useId();

  // Normalized SVG coordinates (0-1) to auto-stretch with container bounds
  const paths = {
    right: "M 0.08,0 L 0.67,0 Q 0.75,0 0.75,0.08 L 0.75,0.22 Q 0.75,0.3 0.83,0.3 L 0.92,0.3 Q 1,0.3 1,0.38 L 1,0.62 Q 1,0.7 0.92,0.7 L 0.83,0.7 Q 0.75,0.7 0.75,0.78 L 0.75,0.92 Q 0.75,1 0.67,1 L 0.08,1 Q 0,1 0,0.92 L 0,0.08 Q 0,0 0.08,0 Z",
    left: "M 0.92,0 L 0.33,0 Q 0.25,0 0.25,0.08 L 0.25,0.22 Q 0.25,0.3 0.17,0.3 L 0.08,0.3 Q 0,0.3 0,0.38 L 0,0.62 Q 0,0.7 0.08,0.7 L 0.17,0.7 Q 0.25,0.7 0.25,0.78 L 0.25,0.92 Q 0.25,1 0.33,1 L 0.92,1 Q 1,1 1,0.92 L 1,0.08 Q 1,0 0.92,0 Z",
    top: "M 0,0.33 Q 0,0.25 0.08,0.25 L 0.22,0.25 Q 0.3,0.25 0.3,0.17 L 0.3,0.08 Q 0.3,0 0.38,0 L 0.62,0 Q 0.7,0 0.7,0.08 L 0.7,0.17 Q 0.7,0.25 0.78,0.25 L 0.92,0.25 Q 1,0.25 1,0.33 L 1,0.92 Q 1,1 0.92,1 L 0.08,1 Q 0,1 0,0.92 L 0,0.33 Z",
    bottom: "M 0,0.67 Q 0,0.75 0.08,0.75 L 0.22,0.75 Q 0.3,0.75 0.3,0.83 L 0.3,0.92 Q 0.3,1 0.38,1 L 0.62,1 Q 0.7,1 0.7,0.92 L 0.7,0.83 Q 0.7,0.75 0.78,0.75 L 0.92,0.75 Q 1,0.75 1,0.67 L 1,0.08 Q 1,0 0.92,0 L 0.08,0 Q 0,0 0,0.08 L 0,0.67 Z"
  };

  return (
    <div className={`relative overflow-hidden w-full ${aspectRatio} ${className}`}>
      {/* Local SVG clipPath declaration */}
      <svg className="absolute w-0 h-0 pointer-events-none">
        <defs>
          <clipPath id={maskId} clipPathUnits="objectBoundingBox">
            <path d={paths[maskType]} />
          </clipPath>
        </defs>
      </svg>

      {/* Apply crop mask */}
      <div 
        style={{ clipPath: `url(#${maskId})` }} 
        className="w-full h-full bg-cover bg-center"
      >
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
        />
      </div>
    </div>
  );
}
```

---

## 2. BoundaryClippedText (High-Contrast Overlapping Inverted Text)

A visual technique to dynamically invert the color of overlay text when it crosses the boundary of an overlapping image block, establishing strong visual alignment between typography and imagery.

```jsx
import React from "react";

export function BoundaryClippedText({
  text,
  imageUrl,
  className = "",
  imageHeight = "h-[320px]",
  textStyle = "font-black text-6xl tracking-tighter uppercase"
}) {
  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      {/* Background level text (Lower layer) */}
      <div className={`w-full text-center text-zinc-900 dark:text-zinc-300 ${textStyle}`}>
        {text}
      </div>

      {/* Overlapping image element (Upper layer) */}
      <div className={`relative w-full ${imageHeight} -mt-8 overflow-hidden z-10 rounded-2xl`}>
        <img 
          src={imageUrl} 
          alt="" 
          className="w-full h-full object-cover" 
        />

        {/* Duplicated text layered exactly on top using mix-blend-difference */}
        <div className="absolute inset-0 flex items-start justify-center">
          <div 
            className={`w-full text-center text-white mix-blend-difference pointer-events-none ${textStyle}`}
            style={{ 
              transform: "translateY(-2rem)" // Counteract Tailwind's relative margin shift (-mt-8 / -2rem)
            }}
          >
            {text}
          </div>
        </div>
      </div>
    </div>
  );
}
```
