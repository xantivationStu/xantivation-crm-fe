# Artistic Layouts & Brand Identity (Artistic & Brand-Infused Layouts)

This document regulates design standards and code blueprints for implementing artistic layouts that break traditional flat grid systems, drawing inspiration from high-end Editorial, Brutalist, and Anime Console dashboard styles.

---

## 1. Artistic Layout Principles

To achieve maximum visual depth (Awwwards-level), the Agent must look beyond uniform rectangular grid boxes by blending these four layout pillars:

### A. Inner Curved Insets (Folder-Tab & Console Borders)
- Avoid relying solely on standard rounded corners (`border-radius`). Implement containers with inner curved cutouts (concave corners resembling folder tabs or robotic control panels) to establish a distinct geometric personality.
- Use CSS `mask-image` combined with `radial-gradient` or SVG Masks to create perfect concave corners that scale fluidly without distortion.

### B. Asset Overflow & Breakouts
- Position primary illustrative or product assets as **overflowing elements** (`absolute`, extending `10% - 20%` beyond the parent card margins).
- Apply `pointer-events-none` to overflowing images so they do not block user click interactions underneath.
- **Mobile Check:** Disable horizontal breakouts on mobile viewports to prevent layout shifts or horizontal scrollbars (`overflow-x`).

### C. Watermark Thematic Typography
- Overlay oversized brand typographic elements (such as classic Kanji, micro-monospace tags, or cultural glyphs) behind content layers.
- Specification: `absolute pointer-events-none select-none z-0`, blending closely with the background color using ultra-low opacity (**`2% - 5%`**).

### D. Comic Grid Panels & Brutalist Accents
- Construct panels using panel dividers or minor skew angles (`skewX`) to create a dynamic grid.
- Integrate dot grid overlays (`radial-gradient`), diagonal stripes (`repeating-linear-gradient`), or distressed ink splatters to convey a gritty, street-style aesthetic.

---

## 2. Code Blueprints

### A. CustomTabContainer (Concave Corner Folder Tab Container)
Creates a container with an inner concave cut corner that remains distortion-free across varying viewports:
```jsx
import React from "react";

export function CustomTabContainer({
  children,
  className = "",
  cutSize = 36, // Corner cutout size (px)
  position = "top-right", // "top-right" or "top-left"
  backgroundColor = "var(--color-bg-card, rgba(255, 255, 255, 0.03))",
  borderColor = "var(--color-border, rgba(255, 255, 255, 0.1))"
}) {
  // Use CSS mask-image to mask out a circular concave corner
  const maskStyle = {
    maskImage: position === "top-right"
      ? `radial-gradient(circle at calc(100% - ${cutSize}px) ${cutSize}px, transparent ${cutSize}px, black 0)`
      : `radial-gradient(circle at ${cutSize}px ${cutSize}px, transparent ${cutSize}px, black 0)`,
    WebkitMaskImage: position === "top-right"
      ? `radial-gradient(circle at calc(100% - ${cutSize}px) ${cutSize}px, transparent ${cutSize}px, black 0)`
      : `radial-gradient(circle at ${cutSize}px ${cutSize}px, transparent ${cutSize}px, black 0)`
  };

  return (
    <div 
      className={`relative overflow-hidden rounded-[24px] border border-transparent transition-all duration-300 ${className}`}
      style={{
        ...maskStyle,
        backgroundColor: backgroundColor,
        borderColor: borderColor
      }}
    >
      {/* Internal Content Container */}
      <div className="p-6 w-full h-full">
        {children}
      </div>
    </div>
  );
}
```

---

### B. OverflowAsset (Floating Breakout Image - Mobile Safe)
Wraps a hero illustration so it bleeds over its parent container boundary, automatically scaling down on mobile viewports:
```jsx
import React from "react";

export function OverflowAsset({
  src,
  alt = "",
  className = "",
  // Bleed alignment variables (e.g., -top-12, -right-16)
  positionClasses = "-top-16 -right-12",
  mobileScale = 0.8 // Scaling factor on mobile touch screens
}) {
  return (
    <div 
      className={`absolute pointer-events-none select-none will-change-transform z-10 transition-transform duration-500 
        ${positionClasses} 
        ${className}
        md:scale-100 scale-[var(--mobile-scale)]
      `}
      style={{
        "--mobile-scale": mobileScale
      }}
    >
      <img 
        src={src} 
        alt={alt} 
        className="w-full h-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]" 
      />
    </div>
  );
}
```

---

### C. WatermarkText (Background Watermark Typography)
Creates giant background lettering functioning as background identity markers:
```jsx
import React from "react";

export function WatermarkText({
  text,
  className = "",
  color = "var(--watermark-color, currentColor)",
  opacity = 0.03, // Low opacity to protect main text readability
  fontSize = "text-[20vw]", // Large scale relative to viewport width
  vertical = false
}) {
  return (
    <div 
      className={`absolute pointer-events-none select-none z-0 font-bold uppercase tracking-widest ${fontSize} ${className}`}
      style={{
        color: color,
        opacity: opacity,
        writingMode: vertical ? "vertical-rl" : "horizontal-tb"
      }}
    >
      {text}
    </div>
  );
}
```

---

### D. ComicSkewCard (Skewed Comic Panel Wrapper)
Creates slightly skewed card blocks with thin borders to establish an editorial comic strip style:
```jsx
import React from "react";

export function ComicSkewCard({
  children,
  className = "",
  skewAngle = -3, // Angle of rotation (degrees)
  borderColor = "var(--color-border, rgba(255, 255, 255, 0.15))"
}) {
  return (
    <div 
      className={`relative overflow-hidden rounded-2xl border transition-all duration-500 hover:scale-[1.02] ${className}`}
      style={{
        transform: `skewX(${skewAngle}deg)`,
        borderColor: borderColor
      }}
    >
      {/* Reverse skew on children so content elements (images/text) render upright */}
      <div 
        className="w-full h-full"
        style={{
          transform: `skewX(${-skewAngle}deg) scale(1.1)` // Minor upscale to clip outer gaps caused by skewing
        }}
      >
        {children}
      </div>
    </div>
  );
}
```

---

### E. InterlacedLayers (Layer Sandwicheing / Foreground-Subject-Background)
Establishes spatial 3D depth by sandwiching a transparent subject image between background typography and foreground text/controls.
```jsx
import React from "react";

export function InterlacedLayers({
  bgText,
  fgContent,
  subjectImageSrc,
  className = "",
  textColor = "var(--color-text-primary, currentColor)",
  bgTextColor = "var(--color-text-muted, rgba(255, 255, 255, 0.05))"
}) {
  return (
    <div className={`relative w-full h-[600px] flex flex-col items-center justify-center overflow-hidden ${className}`}>
      {/* Layer 1: Oversized background watermark title (Z-0) */}
      <h2 
        className="absolute top-10 font-black uppercase text-[16vw] select-none pointer-events-none leading-none tracking-tighter z-0"
        style={{ color: bgTextColor }}
      >
        {bgText}
      </h2>

      {/* Layer 2: Main foreground subject image (Z-10) */}
      <div className="absolute w-[320px] h-[450px] z-10 bottom-0 pointer-events-none">
        <img 
          src={subjectImageSrc} 
          alt="" 
          className="w-full h-full object-contain"
        />
      </div>

      {/* Layer 3: Foreground detail copy or buttons overlaying the subject (Z-20) */}
      <div className="z-20 w-full max-w-sm text-center px-4 pointer-events-auto" style={{ color: textColor }}>
        {fgContent}
      </div>
    </div>
  );
}
```

---

## 3. Sketchbook & Wavy Timeline Layouts (Wavy Timeline & Sketchbook Step Layouts)

For step-by-step flow processes (steps 1, 2, 3), we combine handwritten Sketchbook card layouts with wavy lines that draw dynamically on scroll.

### A. Sticker & Panel Step Card Design
- **Neo-Brutalist Content Boxes:** Step cards are styled with thin black borders and flat offset box shadows (`border: 2px solid var(--foreground)`, `box-shadow: 6px 6px 0px var(--border)`).
- **Floating Sticker Badges:** Place numerical step badges overlapping the top-left card borders (`position: absolute; top: -1.25rem; left: 1.5rem;`) to emulate pasted stickers. On hover, slightly scale the badge (`scale(1.08)`) and rotate it (`rotate(-5deg)`) to add a playful touch.

### B. Wavy Scroll Connector Path Drawing
- **Free-form Wavy Paths:** Instead of straight industrial grid lines, use organic SVG wave paths (`viewBox="0 0 1000 100"`) weaving between cards.
- **Resilient Path Draw Calculation (pathLength):** Bind Framer Motion's `pathLength` property directly to scroll progress (`scrollYProgress`) to scale it from `0` to `1`. This overrides absolute pixel-length issues (`strokeDashoffset` calculations) and runs predictably on fluid screen sizes.
- **Mobile Bypass:** On mobile screen widths, step cards fall back to vertical blocks (`flex-col`). Hide the horizontal wavy connector path completely (`display: none`).

### C. Monochrome Sketchbook SVGs
- At the top of each step card, embed a custom monochrome vector sketch (SVG format) to illustrate the action.
- Draw outline paths using dark strokes (`stroke="var(--foreground)"`, `strokeWidth="2"`) and fill them with brand accents at low opacity (`fill="var(--primary)" fill-opacity="0.15"` or `0.25`).
- *Example SVG Illustration (simulating a CMS dashboard with a growing seedling, NFC scan card, or phone mockup):*
```jsx
{/* Step 1: CMS Modeling */}
<svg viewBox="0 0 120 90" className={styles.illustration}>
  <path d="M 25 25 C 25 22, 27 20, 30 20 L 90 20 C 93 20, 95 22, 95 25 L 95 70 C 95 73, 93 75, 90 75 L 30 75 C 27 75, 25 73, 25 70 Z" fill="var(--card)" stroke="var(--foreground)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  <line x1="25" y1="32" x2="95" y2="32" stroke="var(--foreground)" strokeWidth="2" strokeLinecap="round" />
  <circle cx="32" cy="26" r="1.5" fill="var(--foreground)" />
  <circle cx="38" cy="26" r="1.5" fill="var(--foreground)" />
  <circle cx="44" cy="26" r="1.5" fill="var(--foreground)" />
  <path d="M 88 20 C 88 14, 90 12, 93 10" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" />
  <path d="M 93 10 Q 99 5, 101 9 Q 95 13, 93 10" fill="var(--primary)" fillOpacity="0.25" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
</svg>
```
