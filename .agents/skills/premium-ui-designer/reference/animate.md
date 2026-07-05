# Motion Effects & Smooth Scrolling (Motion & Transitions)

This document guides the Agent on how to implement smooth animations, optimize FPS, ensure mobile compatibility, and integrate advanced ScrollTrigger blueprints.

---

## 1. Motion Principles & FPS Optimization
- **The 100/300/500/800ms Timing Rule & Eases**:
  * **100ms - 150ms**: Instantaneous feedback (button clicks, active states, checkbox toggles).
  * **150ms - 250ms**: Hover transitions (must feel highly responsive).
  * **300ms - 500ms**: Layout adjustments (accordions, drawer slides, modal transitions). Entrance duration for reveals should be `400ms - 600ms`.
  * **Exit animations** must be 25% faster than entrance animations.
  * **Eases**: Use custom deceleration curves like `[0.25, 0.1, 0.25, 1]` or `"easeOut"`. Never use `"linear"` for UI.
- **Stagger Delay**: The maximum stagger delay is `0.12s` between items. Avoid making users wait too long. *Exception:* Cinematic intro sequences (Hero title/split text entrance, screen-wipe reveals) are allowed to extend staggers up to `0.3s` to establish dramatic pacing.
- **Complexity limits**: Do not animate more than **3 properties** simultaneously on a single element. Do not animate `width` or `height` directly as it triggers expensive layout shifts (use `scaleX`/`scaleY` or `max-height` + `overflow: hidden` instead).
- **Tooling Choice**:
  * **Entrance reveals** (scroll-triggered): Use `framer-motion` (via `whileInView` with `viewport: { once: true }`). Never replay entrance animations when the user scrolls back up. Do NOT use GSAP for simple entrance reveals.
  * **Interactive animations**: Use CSS transitions or `framer-motion`.
  * **Decorative loops & Marquees**: Must be **CSS-only** (`@keyframes`). Do not run JS loops for decorative elements.
  * **Complex timelines / Scroll-scrubbed paths**: GSAP is only reserved for complex scroll animations or horizontal scroll tracks.
- **Mobile Safety (Responsive Motion)**:
  * Disable all mouse parallax, cursor tracking, or liquid distortion hover effects on mobile devices.
  * Scroll parallax speeds must not exceed `0.4` to avoid motion sickness.
  * Ensure all animations respect the `@media (prefers-reduced-motion: reduce)` media query. The fallback must be a simple crossfade (opacity transition only) or instant transition.
- **LCP Performance & Above-Fold Safety**:
  * **Strictly prohibit** executing any entrance animations (such as text splits, fades, or line reveals) on above-fold elements (Hero section title, navbar) before the page becomes interactive to preserve the LCP < 2.5s budget.
  * Hero entrance animations must run after hydration/interactive state without blocking the initial layout paint.
- **Scroll Restoration & Reset**:
  * For interfaces utilizing smooth scroll wrappers (Lenis, GSAP ScrollTrigger) or scroll-driven entrance animations, ensure browser scroll restoration is set to manual (`history.scrollRestoration = 'manual'`) or force-scroll the page to the top on load (`window.scrollTo(0, 0)`).
  * This prevents users from being stuck mid-section on refresh, which disrupts animations and causes layout shifts.

---

## 2. Code Blueprints

Instead of copy-pasting raw text, import these optimized, physical component blueprints directly from the project skill library:

- **[SmoothScrollProvider.jsx](../blueprints/SmoothScrollProvider.jsx):** Global Lenis scroll manager supporting App Router and dynamic paths.
- **[ClippingMaskReveal.jsx](../blueprints/ClippingMaskReveal.jsx):** Window sliding page mask using CSS clip-path inset.
- **[StackingPanels.jsx](../blueprints/StackingPanels.jsx):** GSAP-pinned stacking panels sequence.
- **[HorizontalScroll.jsx](../blueprints/HorizontalScroll.jsx):** Breakpoint-aware horizontal slideshow slide-over.

---

### E. Next.js App Router Page Transitions (Premium Curtain Sweep)
To achieve seamless page-to-page transitions in a Next.js App Router setup, use Next.js **`template.tsx`** (which mounts and executes entrance animations on every route transition) combined with Framer Motion curtain elements.

**Transition Curtain Component (`src/components/TransitionCurtain.tsx`):**
```tsx
'use client';

import React from "react";
import { motion } from "framer-motion";

export default function TransitionCurtain() {
  return (
    <motion.div
      className="fixed inset-0 z-[999999] pointer-events-none bg-[var(--primary,#093C5D)]"
      initial={{ scaleY: 1 }}
      animate={{ scaleY: 0 }}
      exit={{ scaleY: 1 }}
      transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
      style={{ originY: 0 }} /* Sweeps upward to reveal new page */
    />
  );
}
```

**Next.js Transition Template (`src/app/template.tsx`):**
```tsx
'use client';

import React from "react";
import { motion } from "framer-motion";
import TransitionCurtain from "../components/TransitionCurtain";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TransitionCurtain />
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1], delay: 0.15 }}
      >
        {children}
      </motion.div>
    </>
  );
}
```

---

## 3. Multi-Option Animation Orchestration Rules

When a page configuration allows selecting multiple animations simultaneously (or selecting "All"), the Agent **must** distribute effects across separate layers and comply with the conflict resolution matrix below to avoid overloading the GPU or scattering visual focus:

### A. Layer Segregation
Only allow at most **one active animation** per layer in the viewport:
1. **Entrance Layer:** `SplitTextReveal`, `LineReveal`, or `ClippingMaskReveal`.
2. **Interactive Hover Layer:** `ScrambleText`, `MagneticButton`, or `LiquidDisplacementHover`.
3. **Background/Ambient Layer:** `GridSpotlight`, `OrganicBlobNoise`, or `DynamicScrollPath`.

### B. Conflict Resolution Matrix

| Animation Pair | Conflict Status | Orchestration / Solution |
|---|---|---|
| `SplitTextReveal` + `LineReveal` | **Conflict** (Transform collision) | Apply `SplitTextReveal` exclusively to headings, and `LineReveal` to description paragraphs (Prose/Body). Never run both on the same text element. |
| `OrganicBlobNoise` + `DynamicScrollPath` | **Overlap** (Visual noise) | If the background has an active flowing energy path (`DynamicScrollPath`), the background blobs (`OrganicBlobNoise`) must drop opacity below **`2%`** or hide entirely. |
| `StackingPanels` + `HorizontalScroll` | **Conflict** (ScrollTrigger pin collision) | Pinning both scroll sequences in the same viewport area is prohibited. Choose only 1 specialized scrolling method. |
| `LiquidDisplacementHover` + `TextReveal` | **Complementary** (Valid) | Allow text to reveal on scroll first, then apply water ripple displacement on hover. |

### C. Timing & Easing Harmony
When combining multiple animations in a single UI:
- **Unified Easing:** All GSAP timelines for components in the same section must share a common easing curve (recommended: `power3.out` or `expo.out`).
- **Synchronized Stagger:** The stagger delays of elements appearing together must be proportional (e.g., if heading characters stagger at `0.04s`, the card list below must stagger at `0.08s`).
- **Automatic Mobile Bypass:** All mouse-interactive animations (magnetic effects, custom cursor blend, displacement hover) must automatically disable on mobile viewports to sustain 60 FPS performance.
