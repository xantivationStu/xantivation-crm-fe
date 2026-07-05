# Visual Tuning: Bolder vs. Quieter Aesthetics (bolder-quieter.md)

This document provides visual adjustment guidelines to help the Agent tune the aesthetic intensity of a user interface, turning a bland page into a high-character premium workspace (Bolder) or toning down an over-stimulating layout into an elegant editorial document (Quieter).

---

## 1. Make it Bolder (Tăng tính nghệ thuật & cá tính)

When a design feels plain, sterile, B2B-cliché, or "flat", use these elements to inject character and premium Awwwards-level visual interest:

*   **Micro-Coordinates & Grid Systems:** Add extremely thin (`0.5px`), low-opacity (`3% - 6%`) grid line coordinates (using `<svg>` coordinate markers) in the background. Use the `KineticOrnaments` component to add fine dials or compass indicators that rotate slowly on scroll.
*   **Tactile Card Layouts (Folder Tabs & Offsets):** Instead of standard rounded cards, style them as stacked paper files with tab folder headers (`rounded-t-[20px] rounded-br-[20px]`). Apply a slight rotation (`rotate-[0.5deg]` or `hover:rotate-0`) or flat offset borders (`border-2 border-primary shadow-[4px_4px_0px_var(--color-primary)]`).
*   **Fine-line Sketch Wavelines:** Incorporate double-stroke SVG organic waves (`SketchyWaveDivider` or `DynamicScrollPath` using `strokeDasharray`) to act as page transitions or borders.
*   **Interactive Mouse Spotlights:** Implement Spotlight Cards (`.spotlight-card`) where a soft OKLCH radial background glow tracks the user's cursor dynamically on hover.
*   **Typography Accent Shifts:** Switch secondary headers or numerical metrics to an expressive typeface (like a warm serif like `Fraunces`, or monospace fonts like `Space Mono` for technical readouts).
*   **Masked Media Clipping:** Avoid plain rectangular images. Clip media using organic polygon paths or scroll-morphing masks (`MorphingClipPath` diamond-to-rectangle transition).

---

## 2. Make it Quieter (Tiết chế & Tối giản hóa)

When a design feels noisy, over-stimulating, cluttered, or degrades performance (high cognitive load or GPU lag), apply these calming guidelines:

*   **Dim Background Elements:** Drop the opacity of ambient blobs, spotlights, and grids to under **`2%`** or hide them completely. Set background colors to solid neutral colors instead of complex gradient meshes.
*   **Slow Down Motion:** Reduce the speed of scroll parallax. Increase the duration of infinite loops to `>= 45s` or switch to completely static backgrounds. 
*   **Standardize Typography:** Convert expressive headings to clean, geometric Sans-serif fonts (`Inter`, `Plus Jakarta Sans`). Reduce font weights (e.g. from `font-extrabold` to `font-medium`) and limit headings to a standard scale.
*   **Remove Distortion Filters:** Disable SVG displacement filters (`feDisplacementMap`), noise filters (`feTurbulence`), and liquid hovers. Use standard clean CSS transitions (`opacity`, `transform: translateY`) instead.
*   **Soften Colored Shadows:** Convert colored drop shadows (e.g. shadow using brand colors) to standard neutral dark gray/black shadows with very high blur spreads and low opacities (`3%`).
*   **Increase Negative Space:** Expand padding (`py-16 md:py-32`) and gaps to give copy and content room to breathe, improving legibility and layout flow.
