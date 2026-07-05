# Premium Media & Image Treatment (media-treatment.md)

This document establishes artistic standards and CSS/JSX patterns for rendering images, video placeholders, and graphics to meet luxury Awwwards-level quality.

---

## 1. Aesthetic Media Treatment Rules (Nguyên tắc đồ họa báo chí)

Awwwards websites rarely display raw, un-styled rectangular images. Direct rendering of raw photographs is considered a "design tell" (AI slop).

1.  **Masked reveals:** Always hide images under clipping masks or container boundaries, revealing them dynamically on scroll.
2.  **Aesthetic Texture Overlays (Grain):** Apply a fine, low-opacity grain/noise texture overlay (`opacity: 0.04 - 0.08`) over media content to eliminate flat digital rendering, giving photos a tactile, printed paper feel.
3.  **No Raw Rectangles:** Give images thin borders offset from the container, or nest them inside asymmetrical frames (e.g., top-left corner sharp `rounded-tl-none`, other corners rounded `rounded-[16px]`).
4.  **Parallax Content Scrolling:** Lock the image scaling slightly larger than its parent container, using GSAP or CSS scroll variables to move the image position vertically inside the `overflow-hidden` mask as the user scrolls.

---

## 2. Code Blueprints

### A. ImageRevealOnScroll (Khung lộ ảnh nghệ thuật)
Renders a container with an sliding inset clipping mask that opens to reveal the image on scroll:
```tsx
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

export function ImageRevealOnScroll({ src, alt, className = "", aspect = "aspect-video" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className={`relative overflow-hidden ${aspect} ${className}`}>
      {/* Sliding Curtain mask */}
      <motion.div
        className="absolute inset-0 bg-[var(--primary,#093C5D)] z-10"
        initial={{ scaleX: 1 }}
        animate={isInView ? { scaleX: 0 } : { scaleX: 1 }}
        transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
        style={{ originX: 0 }}
      />
      {/* Zoomed Image */}
      <motion.img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        initial={{ scale: 1.15 }}
        animate={isInView ? { scale: 1 } : { scale: 1.15 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      />
    </div>
  );
}
```

---

### B. InteractiveZoomTilt (Hiệu ứng zoom-nghiêng khi di chuột)
Scales and slightly rotates the image inside an overflow-hidden wrapper, responding to cursor positioning:
```tsx
import React, { useState } from "react";
import { motion } from "framer-motion";

export function InteractiveZoomTilt({ src, alt, className = "" }) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Tilt calculations (max 6 degrees tilt)
    setRotateX(-y / (rect.height / 12));
    setRotateY(x / (rect.width / 12));
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--card-bg)] cursor-pointer ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1000 }}
    >
      <motion.div
        className="w-full h-full"
        animate={{ rotateX, rotateY, scale: 1.05 }}
        transition={{ type: "spring", damping: 20, stiffness: 150 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-full object-cover"
        />
      </motion.div>
    </div>
  );
}
```

---

### C. Mix Blend Modes for Text Overlay (Hiệu ứng đè lớp tương phản)
For text elements positioned absolute above images or background blocks, use `mix-blend-mode: difference` combined with light text colors (e.g. white/light gray). As the text slides across dark and light sections of the image, the colors invert dynamically:
```tsx
export function BlendOverlayText({ text }) {
  return (
    <h2 className="absolute top-1/2 left-10 -translate-y-1/2 text-white font-display text-4xl md:text-7xl font-bold mix-blend-mode-difference select-none pointer-events-none z-20">
      {text}
    </h2>
  );
}
```
*Note: Ensure the parent container does not isolate stacking contexts (`isolation: isolate`), which would disable the blend mode overlay.*
