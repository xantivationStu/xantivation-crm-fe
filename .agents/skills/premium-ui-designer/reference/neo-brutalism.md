# Cozy Neo-Brutalism & Sketchbook UI Styling (Cozy Sketchbook & Neo-Brutalism Styling)

This hybrid design aesthetic fuses the raw, flat geometries of **Neo-Brutalism** (thick borders, flat offset box shadows) with the warm, poetic qualities of a **Ghibli sketchbook** (warm mossy tones, welcoming corner radiuses, watercolor paper textures). This layout defines functional containers and supplies tactile, mechanical feedback for button click interactions.

---

## 1. Design Standards & Tokens

- **Ink Borders:** Use solid, visible dark borders (`var(--foreground)`) with a thickness ranging from `1.5px` to `2.5px` depending on the block scale. Avoid blurry or faint borders.
- **Flat Offset Shadows:** Do not use blurred shadows. Instead, apply solid, colored shadows matching the brand palette (such as `var(--border)` or `var(--primary)`), offsetting them to the bottom-right.
  - *Examples:* `box-shadow: 4px 4px 0px var(--foreground)` for buttons; `box-shadow: 6px 6px 0px var(--border)` for cards.
- **Corner Radius:** Maintain a moderate corner radius (`--radius: 0.85rem` or `8px - 14px`) to soften traditional brutalism, providing an approachable and cozy aesthetic. *Exception:* Specialized layout structures like folder-tab headers (`CustomTabContainer` using `24px`) and interactive mouse spotlights (`.spotlight-card` with `24px` radius) are allowed to maintain their stylized character.

---

## 2. Interactive Motion Principles (Tactile Button Interactions)

All brutalist buttons must mimic mechanical keyboard keypress behaviors:
- **Default State:** The button sits elevated, throwing a default flat offset shadow.
- **Hover State:** The button rises slightly up and to the left (`translate(-2px, -2px)`) while the flat offset shadow deepens (increasing the `box-shadow` offset by `2px`).
- **Sweep Hover Light Effect:** For primary CTA buttons, add a white transparent gradient sweep across the button face on hover (using a `::after` pseudo-element shifting from `left: -150%` to `left: 150%` over `0.9s` at a `-25deg` skew).
- **Active/Click State:** The button compresses down and to the right toward the shadow offset (`translate(2px, 2px)`) while the offset shadow collapses (decreasing the offset by `2px`).
- **Timing:** State transitions must be extremely rapid (**`100ms - 150ms`**) using a `cubic-bezier(0.25, 0.1, 0.25, 1)` curve to feel snappy and tactile.

---

## 3. CSS Blueprint Code Sample

```css
/* Primary Brutalist Button with light sweep effect */
.brutalistBtnPrimary {
  position: relative;
  overflow: hidden;
  background-color: var(--primary);
  color: var(--primary-foreground);
  font-weight: 700;
  padding: 0.75rem 2rem;
  border: 2px solid var(--foreground);
  border-radius: var(--radius);
  cursor: pointer;
  box-shadow: 4px 4px 0px var(--foreground);
  transition: 
    transform 0.15s cubic-bezier(0.25, 0.1, 0.25, 1), 
    box-shadow 0.15s cubic-bezier(0.25, 0.1, 0.25, 1), 
    background-color 0.15s ease;
}

/* Sweep Hover Light Effect */
.brutalistBtnPrimary::after {
  content: '';
  position: absolute;
  top: 0;
  left: -150%;
  width: 40%;
  height: 100%;
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.4) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  transform: skewX(-25deg);
  pointer-events: none;
}

.brutalistBtnPrimary:hover {
  background-color: oklch(from var(--primary) calc(l - 0.05) c h);
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0px var(--foreground);
}

.brutalistBtnPrimary:hover::after {
  left: 150%;
  transition: all 0.9s cubic-bezier(0.25, 0.1, 0.25, 1);
}

.brutalistBtnPrimary:active {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px var(--foreground);
}

/* Secondary/Outlined Brutalist Button */
.brutalistBtnSecondary {
  background-color: transparent;
  color: var(--foreground);
  font-weight: 700;
  padding: 0.75rem 2rem;
  border: 2px solid var(--foreground);
  border-radius: var(--radius);
  cursor: pointer;
  box-shadow: 4px 4px 0px var(--border);
  transition: 
    transform 0.15s cubic-bezier(0.25, 0.1, 0.25, 1), 
    box-shadow 0.15s cubic-bezier(0.25, 0.1, 0.25, 1), 
    background-color 0.15s ease;
}

.brutalistBtnSecondary:hover {
  background-color: var(--muted);
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0px var(--border);
}

.brutalistBtnSecondary:active {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px var(--border);
}

/* Brutalist Card Panel */
.brutalistCard {
  background-color: var(--card);
  border: 2px solid var(--foreground);
  border-radius: var(--radius);
  box-shadow: 6px 6px 0px var(--border);
  transition: 
    transform 0.25s cubic-bezier(0.25, 0.1, 0.25, 1), 
    box-shadow 0.25s cubic-bezier(0.25, 0.1, 0.25, 1);
}

.brutalistCard:hover {
  transform: translate(-3px, -3px);
  box-shadow: 10px 10px 0px var(--border);
}

/* Brutalist Form Input Field */
.brutalistInput {
  padding: 0.75rem 1rem;
  background-color: var(--card);
  border: 2px solid var(--foreground);
  border-radius: var(--radius);
  color: var(--foreground);
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.brutalistInput:focus {
  border-color: var(--primary);
  box-shadow: 3px 3px 0px var(--primary);
}

/* Brutalist Sticker Badge */
.brutalistBadge {
  display: inline-flex;
  align-items: center;
  padding: 0.375rem 1rem;
  border-radius: 9999px;
  background-color: oklch(from var(--primary) l c h / 0.1);
  border: 1.5px solid var(--foreground);
  color: var(--primary);
  font-weight: 700;
  box-shadow: 2.5px 2.5px 0px var(--border);
}
```

---

## 4. Peeking Screen Edge Elements

To enhance the friendly, cozy, and playful characteristics of mobile interfaces, we can position small hand-drawn elements (such as leaf sprouts, capybara heads, or card avatars) peeking out from the screen edges. Alignment and layout rules include:

### A. Alternating Sequence Principle
-   **Left-Right Alternation:** Alternate peeking elements along the page's vertical scroll path (e.g., a vine sprout at the top left, mascot head in the middle right, mascot with speech bubble at the bottom left).
-   **Compact Sizing:** On viewports under `1200px`, scale these elements down to **`40px` - `85px`** in width to prevent blocking primary text content or breaking mobile layouts.
-   **Peek & Rest Motion:** Run peeking animations only once during page load (use Framer Motion's `viewport: { once: true }` or CSS `animation-fill-mode: forwards`). Translate the character from off-screen (`translate3d(-100%, 0, 0)` or `100%`) to sit neatly on the edge, then keep it static. Avoid continuous bouncing or looping animations which distract readers.

### B. Card and Box Border Peekers
Mascots can also peek directly from the vertical or horizontal borders of specific content blocks (such as info cards, accordions, and forms):
-   **Left Border Peeking:** Position the mascot on the left boundary (`left: 0`, `top: 50%`, `transform: translate(-30px, -50%) rotate(90deg)`), pointing inwards to the card. On hover, translate further left (e.g., `translate(-50px, -50%) rotate(90deg)`).
-   **Right Border Peeking:** Position the mascot on the right boundary (`right: 0`, `top: 50%`, `transform: translate(30px, -50%) rotate(-90deg)`), pointing inwards to the form. On hover, translate further right (e.g., `translate(50px, -50%) rotate(-90deg)`).
-   **Bottom Border Peeking (Upside down):** Position the mascot hanging upside down from the bottom boundary (`bottom: 0`, `left: 50%`, `transform: translate(-50%, 30px) rotate(180deg)`). On hover, translate further down (e.g., `translate(-50%, 48px) rotate(180deg)`).

### C. Speech Bubble Alignment
-   **Tail Pointing:** The tail pointer of the bubble must point directly to and touch the mouth/snout boundary of the speaking mascot character (e.g., if capybara snout is at X=44, Y=33, the bubble tail should point to X=44, Y=32).
-   **Body Elevation:** The oval text container of the speech bubble should sit fully elevated above the snout (e.g., raising the Y-axis to 1 - 23 rather than 6 - 32) to prevent the bubble body from overlapping the character's facial features.
-   **Text Centering:** Center the text horizontally (`text-anchor: middle`) and offset it slightly lower than the geometric center (e.g., if center Y=12, place text at Y=15) to balance character line weight.
-   **Counter-Rotation for Upright Text:** When a speech bubble is nested inside a rotated peeking mascot container, counteract the container's rotation in CSS so the text remains perfectly vertical and readable (e.g., apply `transform: rotate(-90deg)` on a bubble inside a 90deg left-peeker, `transform: rotate(90deg)` for a -90deg right-peeker, and `transform: rotate(-180deg)` for an 180deg bottom-peeker).

### D. Grip-to-Edge Techniques
-   **Paws Grip:** When drawing characters on screen edges, sketch tiny paws overlapping the border cuts to anchor them realistically (e.g., if the screen edge is at X=58, extend the paws to X=60 to simulate a grip).
-   **Facial Feature Inset:** Recess key facial expressions (eyes, mouth, cheeks) deep inside the character boundary. This ensures that even when the character is partially hidden by screen edges (via offsets like `translate3d(30%, 0, 0)`), their face remains fully visible and undistorted.

---

## 5. FAQ Active Card Accents

For sequential card displays like FAQ accordions, styling the active card with distinct color highlights and mechanical feedback isolates the open item:

### A. Active Card Highlighting
-   **Border & Shadow Override:** When a card expands, override default styles with the brand's primary color theme (`border-color: var(--primary) !important; box-shadow: 6px 6px 0px var(--primary) !important;`).
-   **Tinted Pastel Backgrounds:** Apply soft brand pastel hues to the active card's background:
  - *Light Mode:* Soft mint green (`oklch(from var(--primary) 0.985 0.025 155) !important`).
  - *Dark Mode:* Deep obsidian moss (`oklch(from var(--primary) 0.180 0.020 150) !important`).
  This visually separates the active item from adjacent unopened card titles.

### B. Hover Translation
-   **Elevated Shifting:** Hovering over closed item cards should translate them slightly up and left (`transform: translate(-3px, -3px)`) while expanding the shadow (`box-shadow: 9px 9px 0px var(--border) !important` or `var(--primary)` if already active), matching global button behaviors.
-   **Smooth Response Timings:** Synchronize all interactive properties (`transform`, `border-color`, `box-shadow`, `background-color`) using a transition speed of **`150ms - 200ms`** with a standard deceleration curve.

---

## 6. 3D Stacking Cards Deck V3

To create a premium 3D stacked card deck on scroll:
-   **No Diagonal Rotation:** Keep cards aligned horizontally. Do not skew/rotate individual panels to avoid typographic readability issues.
-   **Top-Center Scale Anchor:** When an older card is layered underneath a newer card, the older card scales down (e.g., from `1.0` to a defined `scaleEnd`). Set the `transform-origin` to `'top center'` so the top of each card remains pinned at its sticky top coordinate, stacking header tabs neatly.
-   **Measure Progress via Static Outer Wrapper:** **Never** attach `useScroll` target parameters to the element designated as `position: sticky`. When pinned, the element is static relative to the viewport, which freezes scroll progress. Instead, track progress on a static outer container (`.stackingOuter` height of `475vh` for 5 cards) with offsets `['start start', 'end end']`.
-   **Spring Smoothing (useSpring):** Pass `scrollYProgress` through a `useSpring` filter (e.g., `stiffness: 100`, `damping: 30`, `mass: 0.3`) before sending values to child cards to smooth out mouse wheel jitter.
-   **Overlapping Cascading Intervals:** Map card animations across a timeline from `0.0 -> 1.0` using step sequences (`step = 0.18`) and transition durations (`duration = 0.30`):
  - *Slide-up:* `startY = (index - 1) * step`, `endY = (index - 1) * step + duration` (with index 0 fixed at `0`).
  - *Scale-down:* `startScale = index * step`, `endScale = index * step + duration`.
-   **Initial Hidden Position:** Set the initial off-screen offset `y` (from `0` to `startY`) to `1000px` on desktop viewports. This prevents cards from peeking at the bottom of the viewport before their activation step.
-   **Sticky Alignment & Combined Displace:** Position all card layers absolutely to the **same sticky anchor** (`position: sticky`, `top: 20vh` or `24vh` inside a `.stickyHolder` block). Apply vertical displacement offsets (e.g. `y: index * 40`) to create a cascading stack. When the parent scroll container finishes scrolling, the entire deck slides away upward **together**.
-   **Dynamic 3D Stack Depth:** Calculate scale offsets based on layering depth: `1 - (totalFeatures - 1 - index) * 0.035` so underlying cards appear smaller.
-   **Last Card Scaling Exclusion:** The final card in the deck (`index === totalFeatures - 1`) must skip scale-down steps, serving as a stable visual anchor.
-   **Borders & Shadows:** Apply a solid border (`2px solid var(--foreground)`), warm card fill (`var(--card)`), and tactile shadow (`6px 6px 0px var(--border)`) across both dark and light themes.
-   **Responsive Safety (isDesktop):** On mobile viewports (<= 768px), disable all sticky pinning, absolute offsets, translation scales, and card scaling; render cards in a natural vertical stack (`position: relative`, `y: 0`, `scale: 1`).

---

## 7. Organic Hand-Drawn Accents & Transition Components

To soften section transitions and foster organic warmth:

### A. Double-Stroke Pencil Sketching
-   **Technique:** Instead of a single clean stroke, clone your master path (ink stroke: `stroke="var(--foreground)"`, `strokeWidth="2.2px"`) and draw a secondary pencil draft stroke underneath (`stroke="var(--border)"`, `strokeWidth="1.2px"`, `opacity="0.7" - 0.8"`).
-   **Alignment:** Offset the draft path slightly diagonal (e.g. `transform="translate(1px, -0.5px)"` or slightly shift control points). This calculates a manual pencil sketch imperfection.

### B. Continuous Cursive Signature
-   **Single Path Continuity:** For brand signatures, avoid detached block letters. Program a single continuous path (`single continuous SVG path`) representing cursive handwriting ink.
-   **Curved Swashes:** Construct paths flowing from the baseline, curving smoothly through letters using Cubic Bezier coordinates (`C` and `S`), and wrap with a tail flourish swash.
-   **Simplify Details:** Keep signature elements clean; avoid dashed paths (`strokeDasharray`) or underlines that clutter the signature.
-   **Natural Accents:** You can sprout a tiny leaf node directly from the cursive tail swash to reinforce the organic style.

### C. Cute Cat Pawprints
-   **Paw Pad Silhouettes:** Draw round, bean-shaped paw pad outlines. The central metacarpal pad should look plump with a triple-lobe bottom shape.
-   **Toe Spacing:** Arrange four circular toe pad shapes in a neat arc above the main pad, separated by fine borders (~1px).
-   **Theme Filling:** For brand accent prints, combine thin borders with low opacity fills (`fill-opacity="0.1" - 0.2"`). For subtle paper marks, use outlines (`fill="none"`) with low opacity.

### D. Divider SVG Blueprints
```tsx
// 1. Double Sketchy Wave Divider
export function SketchyWaveDivider() {
  return (
    <div style={{ width: '100%', overflow: 'hidden', lineHeight: 0, padding: '1.5rem 0', pointerEvents: 'none' }}>
      <svg viewBox="0 0 1200 20" width="100%" height="10" preserveAspectRatio="none">
        {/* Main Ink line */}
        <path d="M 0,10 Q 150,6 300,12 T 600,8 T 900,13 T 1200,10" fill="none" stroke="var(--border)" strokeWidth="1.5" opacity="0.75" />
        {/* Secondary pencil draft line */}
        <path d="M 0,11 Q 150,9 300,9 T 600,11 T 900,9 T 1200,11" fill="none" stroke="var(--border)" strokeWidth="1" opacity="0.5" strokeDasharray="150 10 200 15" />
      </svg>
    </div>
  );
}
```

---

## 8. Interactive Typography Letters Bounce (Watermark Bounce)

Creating responsive letter keys on giant background watermarks (like footer titles) increases user interaction delight:
-   **Splitting Characters:** Map character arrays to independent `span` nodes (`wordmarkLetter`).
-   **Spring Overshoot & Alternate Rotation:** On hover, animate letters to bounce up (`translateY(-20px)`), enlarge (`scale: 1.15`), and twist slightly in alternating directions (`rotate(4deg)` and `rotate(-4deg)`), transitioning to the brand color (`var(--primary)`) with a brutalist text shadow (`text-shadow: 4px 4px 0px var(--foreground)`).
-   **CSS Blueprint:**
```css
.giantWordmarkContainer {
  pointer-events: auto; /* Enable mouse hover events through the parent wrapper */
}

.giantWordmark {
  pointer-events: auto;
}

.wordmarkLetter {
  display: inline-block;
  color: var(--foreground);
  opacity: 0.06; /* Highly faded background state */
  transition: 
    transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), /* Spring overshoot inertia */
    color 0.3s ease,
    opacity 0.3s ease,
    text-shadow 0.3s ease;
  cursor: pointer;
}

.wordmarkLetter:hover {
  transform: translateY(-20px) scale(1.15) rotate(4deg);
  color: var(--primary);
  opacity: 0.95;
  text-shadow: 4px 4px 0px var(--foreground);
}

.wordmarkLetter:nth-child(even):hover {
  transform: translateY(-20px) scale(1.15) rotate(-4deg);
}
```
