# Section Transitions & Boundary Accents (Section Transitions & Boundary Accents)

This document regulates visual design principles, coding techniques, and boundary transition standards (visual bridges) between adjacent sections, designed to break layout rigidity and create fluid, organic storytelling layouts (Cozy Ghibli-tech/Neo-Brutalism).

---

## 1. Boundary Design Philosophy

In Awwwards-level interface design, the boundaries between adjacent sections are never plain horizontal straight lines or abrupt color breaks. We utilize two core visual bridging methods:
1.  **Transition Bridge Zones:** Utilizing smooth color gradients or deep curtain slide-overs (clipping masks/curtain depth reveals).
2.  **Organic Hand-Drawn Overlaps:** Placing hand-sketched illustration accents that physically overlap the boundary divider of two sections to inject depth and hand-crafted authenticity.

---

## 2. Implementing Overlapping Accents

To implement section-overlapping doodles (such as sprouts, branches, paw prints, stars, or cursive handwriting signatures) without rendering errors:

### A. Negative Margins Positioning & z-index Layering
-   **Positioning:** Insert the transition element as an independent node placed between the two adjacent sections.
-   **Negative Margins:** Apply relative negative vertical margins (e.g., `margin-top: -2rem`, `margin-bottom: -2rem`) to pull the vector graphic over both the preceding and following section backgrounds.
-   **Z-index Layering:** Assign a higher z-index (e.g., `z-index: 10`) so the stroke overlaps section border lines.
-   **No Hidden Overflow:** Never declare `overflow: hidden` or `overflow: clip` on the wrapper containers of adjacent sections, as this will clip the decorative vector drawings.

### B. Double-Stroke Sketching Principle
Replicate hand-drawn ink-and-pencil sketching:
-   **Master Ink Stroke:** The main defined stroke, using `stroke="var(--foreground)"` and `strokeWidth="2.2px"`.
-   **Pencil Draft Stroke:** A duplicate of the main path, but thinner (`strokeWidth="1.2px"`) and lighter (`stroke="var(--border)"` or `opacity="0.75"`).
-   **Offset Translation:** Shift the draft stroke slightly offset from the master stroke by about 1px (e.g., using SVG's `transform="translate(1px, -0.5px)"` or tweaking control points). This calculated imperfection creates natural sketch depth.

---

## 3. Standard Hand-Drawn Accents

### A. Vine Branch & Sprout Accents
-   **Ghibli Double Sprout:** A tiny, balanced sprout growing directly out of boundary dividers or action buttons (CTAs) to add playfulness and symbolize fresh starts.
-   **Overlapping Vine Branch:** Smoothly curving branch lines that cross the boundary border, populated with symmetrical leaf nodes to soften hard layout edges.

### B. Continuous Cursive Wordmark
-   **Single Continuous Path:** When displaying brand text or decorative cursive words, avoid disconnected letters. Draw them using a single continuous vector path representing fluid cursive handwriting.
-   **Tail Swash:** Cursive signatures should flow through letters and end in a sweeping, expressive tail swash. You can grow a tiny leaf node directly out of this tail.
-   **Limit Dashes:** Do not use dashed lines (`strokeDasharray`) or fragmented decorations that clutter the signature aesthetic.

### C. Cute Cat Pawprints
-   **Metacarpal Pad:** Design a large, rounded bean-like central pad. The bottom shape should feature a triple-lobe silhouette, mimicking a cat's soft paw pad.
-   **Toe Pads:** Four smaller circular/oval toe pads arranged in a neat arc above the central pad, separated by fine spacing (~1px).
-   **Color Application:** Apply low opacity fills (`fill-opacity="0.12"`) to embed paw prints into the paper background.

### D. Bionic Leaf Wave
-   **Description:** A visual bridge merging electronic IoT heartbeat signals with bionic organic leaves.
-   **Implementation:** Render a continuous heartbeat wave. At peak wave crests and the final tail swash, sprout tiny Ghibli leaves to represent tech harmonizing with nature.

---

## 4. Contrast Adaptation & High-Performance Motion

### A. Theme Adaptation (CSS Variables Contrast Rules)
-   **No Hardcoded Static Colors:** Never hardcode static HEX values (e.g., `#000` or `#fff`) on transition strokes.
-   **Use CSS Theme Variables:** Bind styles to custom CSS variables (`var(--foreground)`, `var(--primary)`, `var(--border)`, `var(--card)`) so that when the theme toggles between Light/Dark modes, boundaries reverse contrast automatically, keeping details visible.

### B. Entrance Animation & Performance
-   **Subtle Viewport Triggers:** Avoid loops for border accents. Animate them only once when scrolled into view (use Framer Motion's `whileInView` with `viewport={{ once: true }}`).
-   **Standard Spec Metrics:**
    *   **Effect:** Fade-in combined with minor scale (`0.95 -> 1.0`) and subtle rotation (`rotate: -2deg -> 2deg`).
    *   **Duration:** `500ms` with ease `cubic-bezier(0.25, 0.1, 0.25, 1)`.
    *   **CSS-only micro-animations:** Use CSS `@keyframes` for leaf swaying/swaying to keep the JS thread idle.


### C. Responsive Spacing & Overlaps
-   **Desktop Layout:** Apply relative negative margins (around `-1.75rem` to `-2.25rem`) to overlap border lines, building visual depth.
-   **Mobile Layout (<= 768px):** Strictly forbid large negative margin values. On narrow mobile viewports, section paddings shrink. Negative margins will squeeze adjacent text or buttons under drawings, making them unclickable. Convert negative margins to positive margins (around `1.25rem` to `1.5rem`) via CSS media queries, turning dividers into natural whitespace separators to give elements room to breathe.

---

## 5. Page Transitions & Loader Screens (Universal Principles)

To build seamless page transitions and avoid layout flashing/glitching, apply these universal architectural concepts regardless of the tech stack (Next.js, Astro, Svelte, Vue, or Vanilla HTML/JS):

### A. Architectural Concepts
1. **Curtain Shell Persistence (Persistent Layouts):** The transition element (SVG curtain, canvas, or colored overlay) must reside in a shell or parent container that persists across navigations. This prevents the transition component from being destroyed and re-mounted during page loads, ensuring exit animations complete smoothly.
2. **Navigation Interception:** If the framework uses routing or instant page replacements, navigation triggers (clicks) must be intercepted to block default navigation. The flow must follow a strict sequential order:
   - **Phase 1 (Reveal In):** Obscure the viewport with the transition curtain.
   - **Phase 2 (Content Swap):** Programmatically switch the page content *only* after the curtain completely covers the screen.
   - **Phase 3 (Reveal Out):** Uncover the viewport to reveal the new page.
3. **Immediate Load-State Rendering (Avoiding Initial Flashes):** When a user first lands on the website or refreshes the page, prevent a dark/white flash of the unrendered background. Render the transition curtain in its **fully covered state** immediately (via SSR, inline styling, or synchronous HTML/CSS rendering) on first paint, then perform a Reveal Out.
4. **Coordinated Entrance Animations:** Delay any internal page animations (such as text fade-ups or bento grid expansions) until the transition curtain has fully retracted, preventing animations from playing invisibly underneath.

### B. Implementation Case Study: Next.js (React)
- **Persistent Shell:** Put the `TransitionProvider` in `layout.tsx` (persistent) instead of `template.tsx` (remounts on every navigation).
- **Interception:** Wrap links in a custom `<TransitionLink>` component that intercepts click events, sets transition state to `entering`, triggers the route change (`router.push`) after a delay (~550ms), and then triggers the transition state to `exiting`.
- **Immediate Load State:** Initialize status to `loading`. Set the SVG morphing path's `initial` prop to the fully covered path (`paths[1]`) immediately so it renders the transition color on the first frame.
- **Coordination:** Access the transition status via context and condition component animations on `status === 'idle'`.

### C. Common Issues & Solutions
1. **Layout / Content Flashing:** Content swaps before the curtain covers the screen.
   * *Solution:* Guarantee the Reveal In phase is completed before initiating the route change.
2. **SVG Path Missing Initial values:** Morphs rendering empty on mount.
   * *Solution:* Explicitly define the `initial` attribute or default `d` path for morphing elements.
3. **Mobile Peeker Mascot Clipping:** Mascots overflow or display upside-down on mobile viewports.
   * *Solution:* Shift peekers from side edges to top/bottom of cards using media queries. Rotate mascots 180 degrees (`rotate(180deg)`) if peeking from bottom edges and reposition speech bubbles accordingly.
