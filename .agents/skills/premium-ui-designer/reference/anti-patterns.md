# AI Slop Prevention Rules (Anti-patterns)

This document defines a checklist of stereotypical AI design mistakes (AI Slop) that are strictly prohibited and provides instructions for running the automated scanning script to maintain source code quality.

---

## 1. 21 Strict Anti-patterns (Anti-patterns Checklist)
If the Agent is about to write one of the following design patterns, stop immediately and choose an alternative:

1.  **Forbidden Side-stripe Borders**: Do not use thick `border-left` or `border-right` as decorative color accents on cards, alerts, or list items.
2.  **Forbidden Gradient Text**: Do not overuse flashy gradient text on secondary headers or long paragraphs. *Exception:* Subtle gradient highlights on primary page headings (e.g., Hero title highlights) are allowed.
3.  **Forbidden Widespread Glassmorphism**: Avoid overusing the frosted glass effect (`backdrop-blur`) everywhere, as it causes GPU lag on mobile. Only use it for sticky headers, popovers, or cursors.
4.  **Forbidden Hero-metric Template**: Avoid the cliché layout: huge metric numbers + tiny labels underneath + a cliché SaaS-style secondary chart.
5.  **Forbidden Identical Card Grids**: Avoid splitting cards into uniform, repeating 3 or 4-column grids endlessly across the page.
6.  **Forbidden Tracked Uppercase Eyebrows**: Do not use capitalized kicker/eyebrow labels with wide tracking (e.g., `ABOUT`, `FEATURES`) above all main headers in every section.
7.  **Forbidden Sequential Number Prefixes**: Do not arbitrarily prefix section headers with numbers like `01`, `02`, `03` unless it is a logically sequenced process or timeline.
8.  **Forbidden Text Overflow**: Never allow text or headings to overflow their containers on mobile viewports due to fixed, oversized, non-responsive font sizes.
9.  **Forbidden Ghost Cards & Invisible Borders**: Do not combine a `1px` border and a wide blurry box-shadow (`blur >= 16px`) on the same card. Also, do not use border colors that are identical or extremely close to the background color, making the borders invisible (ghost borders).
10. **Forbidden Over-rounding**: Restrict card corner rounding to a maximum of `12px-16px` for standard content boxes. *Exception:* Large outer wrapping frames (`rounded-[24px]` or `rounded-[32px]`) utilizing spacious inner padding (`p-8` or `py-12+` or equivalent), folder-tab headers (`CustomTabContainer` using `rounded-[24px]`), and interactive spotlights (`.spotlight-card` with `24px` radius) are fully allowed to preserve structural proportion.
11. **Forbidden Sketchy/Doodle SVGs**: Avoid amateurish hand-drawn/doodle SVGs as placeholders when images are missing. *Exception:* Fine-line organic energy paths (`DynamicScrollPath` using `strokeDasharray`) and sketchbook ink draft overlays (`SketchyWaveDivider` using double-stroke `strokeDasharray`) are fully allowed for premium Ghibli-tech accents.
12. **Forbidden Stripe Backgrounds & Pure Colors**: Do not use diagonal stripes as background patterns. Never use pure white (`#ffffff`) or pure black (`#000000`) backgrounds, which strain the user's eyes.
13. **Forbidden Direct Migration of Negative Margins (Responsive Margins Conflict)**: Do not copy large negative margin values (e.g., `-2.5rem`, `-3rem`, `-35px`) used for section dividers (`SketchyAccent`) or overlapping elements directly from desktop to mobile layouts. On mobile, section paddings are much narrower; large negative margins destroy negative space, overlapping text, trapping buttons, or cutting off decorative drawings. You must use CSS media queries to reset these to a small positive margin or zero on mobile viewports.
14. **Forbidden Low Contrast Typography**: Never use background-oriented container variables like `var(--muted)` for text colors (body descriptions, excerpts, meta-info, read times, help labels, subtitles, button text). `var(--muted)` has a very high lightness value (e.g. `oklch(0.960 ...)`) in light mode, which renders text completely invisible on light backgrounds. Standard copy/description text must use text-specific variables like `var(--muted-foreground)` (or `var(--foreground)`) to guarantee readable contrast in both light and dark modes.
15. **Forbidden Blind Route Creation**: Never declare a new page route or folder path (e.g., `src/app/contact/page.tsx`) without immediately testing compiling the project (using `npm run build`) and verifying that there are no style syntax errors (e.g. using hyphenated CSS property names like `justify-content` inside JS style objects instead of camelCase `justifyContent`) or broken relative/absolute imports that prevent route hydration.
16. **Forbidden Side-Mascot Clipping (Mobile Peeking Mascot Rule)**: Do not position peeking mascots absolute to the left/right edges of content cards using large negative horizontal translate/offset (e.g., `translate(-48px)` or `translate(48px)`) on mobile viewports, as this pushes them past the screen boundaries where they are clipped. Instead, use CSS media queries to reposition them vertically (peeking upwards or downwards from the top or bottom edges of the card). Furthermore, **do not rotate the parent wrapper container** (e.g. `rotate(180deg)`) to flip the mascot; rotating the parent flips the local coordinate grid of any absolute-positioned child elements (like Speech Bubbles), forcing you to write complex, error-prone counter-rotations. Instead, keep the parent wrapper at `rotate(0deg)` and **rotate the mascot SVG element directly** (e.g., `transform: rotate(180deg)` on the SVG class) so child coordinates remain upright and normal (`top: -70px` and `left: -85px`).
17. **Forbidden Overflow Shadow Clipping (Horizontal Scroll Shadow Budget)**: Do not style horizontal scrollbars/swipe rows (`overflow-x: auto`) with zero vertical padding if the child elements (buttons, filter badges, cards) have `box-shadow` or hover transitions. The browser's overflow clipping bounds will slice off the shadows and borders at the top/bottom edges of the row. Always add vertical padding (e.g. `padding-top: 6px; padding-bottom: 8px;`) to the scroll container to reserve visual budget for rendering shadows, and apply `align-items: center` to ensure buttons align cleanly.
18. **Forbidden Display Letter-Spacing Cramping**: Do not set letter-spacing below `-0.04em` on display headings/H1s. *Exception:* Expressive/Rebellious brand designs (e.g., using ultra-heavy display fonts like `Syne` or `Clash Display` with sizes `>= 4rem`) are allowed to tighten tracking down to `-0.06em` to form cohesive graphical layout locks. Aim for `-0.02em` to `-0.03em` for clean Grotesk.
19. **Forbidden Visual Gating of Content**: Never gate content visibility on class-triggered scroll transitions. If transitions pause on hidden tabs or fail to trigger, the page remains blank. Render text visibly by default and enhance with motion.
20. **Forbidden Meta-criticism Copy**: Avoid self-referential or ironic copywriting that critiques its own structure. Make clear, direct claims about the product value instead.
21. **Forbidden Generic Alt Text**: Do not use vague alt text like "image" or "icon". Write descriptive alt attributes that depict the physical object, mood, and context (e.g., "Hand-cut coastal fettuccine served on a terrace at sunset").
22. **Forbidden System Emojis as Icons**: Do not use system emojis (e.g., 📊, 📁, ✅, 🖱️, 💰, 💡, 📈, 📸) or raw unicode characters as icons, buttons, or indicators in the UI. Emojis look inconsistent across platforms, look childish, and instantly degrade the Awwwards-level design quality. Use polished Lucide SVG outlines or custom vector icons instead.
23. **Forbidden Pure `100vh` on Mobile**: Avoid using `height: 100vh` or `h-screen` directly for layouts, as it causes mobile browser address bars to cover or clip content at the bottom. Use `min-h-[100dvh]` or dynamic viewports (`svh`, `dvh`) instead.
24. **Forbidden Cliché Device Mockups**: Do not use custom CSS mockups simulating MacBook/iPhone screens with red-yellow-green window dots. Use borderless clean canvases, simple shadows, or real screenshots.
25. **Forbidden Sparkle/Dingbat Abuse**: Do not overuse unicode sparkles (✦, ✶, ✧) as spacers, bullet list dots, or backgrounds. Limit them to a maximum of 6 per file and use real SVG icon files for visual styling.
26. **Forbidden Saturated Glow**: Do not use highly saturated colored shadows or gradients with high opacity as glowing background backdrops on dark pages. Use low-opacity (3-12%) and wide-blur (>=80px) OKLCH color dispersion.
27. **Forbidden Cream/Beige Default**: Avoid using warm off-white, cream, sand, or parchment backgrounds as the default theme palette. Warmth should be introduced via photography, typography, and accent highlights.
28. **Forbidden Center-aligned Long Text**: Avoid setting paragraph/description text longer than 3 lines to `text-center`. Left-align body copy to maintain legibility.
29. **Forbidden Oversized Entrance Offset**: Do not use large entrance animation translate offsets (translateY or y > 32px) which cause jarring pop-in jank. Keep offsets between 16px and 32px.
30. **Forbidden Saturated Colored Shadow**: Avoid box-shadows using saturated brand colors without adequate blur/spread. Use neutral dark/tinted shadows or very low-opacity colored ones.
31. **Forbidden Icon-tile Stack**: Do not place a small rounded icon in a square block directly stacked above a heading (the standard AI card grid stereotype). Use side-by-side or inline icon placements.

---

## 2. Automated Scanning Script (`lint-slop.js`)
Before finishing design work or refactoring styles, the Agent must run the automated visual linter tool to scan for anti-pattern issues:

```bash
node .agent/skills/premium-ui-designer/scripts/lint-slop.js
```
*The script checks for anti-pattern violations and returns a report indicating the files with issues so the Agent can resolve them immediately.*

---

## 3. Advanced UI Resilience Rules
To enhance UI stability and maintain high-fidelity interactivity, always adhere to the following systematic rules:

*   **Sticky Scroll Container Isolation**: When using `position: sticky` (e.g., stacked cards or sticky secondary navigation), ensure no parent elements (from the immediate parent up to the document root) contain `overflow: hidden`, `overflow: auto`, or `overflow: scroll`. These properties disable the browser's sticky positioning mechanism. Use `overflow: clip` or handle scroll containers at the global layout level.
*   **Scroll Restoring & Reset**: For interfaces utilizing smooth scroll wrappers (Lenis, GSAP ScrollTrigger) or scroll-driven entrance animations, ensure browser scroll restoration is set to manual (`history.scrollRestoration = 'manual'`) or force-scroll the page to the top on load (`window.scrollTo(0, 0)`). This prevents users from being stuck mid-section on refresh, which disrupts animations and causes layout shifts.
*   **Tactile Card-to-Background Separation**: When rendering content cards (Cards, Tables, Accordions, CTA Banner cards) on complex backdrop layers (such as topographic curves, grids, or animated particles), reinforce borders and shadows so cards do not blend into the background. Use subtle theme-derived border colors (e.g., `oklch(from var(--primary) calc(l - 0.1) c h / 0.45)`) combined with inset shadows (`box-shadow: inset ...`) to elevate contrast and create 3D depth in both light and dark modes. The contrast should not be harsh but must clearly distinguish the card (e.g., card light mode background luminosity `L=0.94 - 0.92` on page background `L=0.985`, paired with a `2px` border and a smooth shadow).
*   **Transparent Wrappers for Background Line/Wave Visibility**: If the page features full-height topographic waves (`MagneticWaves`), coordinate grids, or particle grids, all wrapping containers of homepage sections (`Hero.module.css`, `FeaturesGrid.module.css`, `HowItWorks.module.css`, `FAQ.module.css`, etc.) **must** use `background-color: transparent` instead of solid backgrounds. This ensures background patterns flow continuously without being chopped by solid-colored section blocks.
*   **Opaque Stacking Cards Rule**: When applying stacked card layouts (Stacking Cards), each card's background (`background-color`) **must** be 100% opaque. Do not use low opacity properties (e.g., below 1) or scroll-driven opacity fades on stacked cards. Transparency exposes the underlying cards, creating visual clutter and a sloppy layout.
*   **Next.js Hydration & HTML Nesting (No Text-clipping)**: When using text reveal components (`LineReveal` or `SplitTextReveal`), **do not** place them directly inside HTML paragraph `<p>` tags to avoid Hydration Mismatch errors in Next.js (use `<div>` instead). Furthermore, **do not set `overflow: hidden`** on individual word wrapping spans (`.line-reveal-word-wrapper`). Setting `overflow: hidden` here cuts off the descenders of letters like "y", "g", "j", "p", "q" during transition. Using opacity paired with standard translation is sufficient to create a smooth effect without clipping letters.
*   **Widespread Line Reveal Application**: Do not restrict the `LineReveal` effect only to headings and subheadings. Actively apply this effect to **all suitable long-form body text** across the page (including feature descriptions, body copy within cards, description lists, or CTA banner text). Applying it broadly to body copy creates a cohesive and premium scroll rhythm. Avoid using it on interactive elements like button labels, form inputs, or real-time data metrics.
*   **Optical Sticky Vertical Offsets**: Avoid pinning elements with a `top` value too close to the top of the screen (under `15vh`), as they can collide with the floating navigation bar or feel layout-wise claustrophobic. Always calculate safe vertical offsets using viewport units (`15vh` - `22vh`) combined with index-based padding offsets (`index * offset`).
*   **Stacking Panels for Sequential Content**: For sequential flow displays (steps 1, 2, 3), core features, or product showcases, prioritize stacked card layouts (Stacking Cards) over traditional flat lists or static grids if vertical space permits. This leverages natural scroll behavior to deliver a fluid visual narrative.
*   **Footer Bottom Spacing & Layout Dynamics**: When styling the bottom area of the footer (including secondary logos, copyright lines, and large typographic watermarks), do not use oversized margins/paddings or fixed positions that disconnect the components. Maintain a compact stack: place the large typographic watermark directly below the main link columns (`margin-top: 2rem - 3rem`, with no border divider above), followed by the copyright text at the very bottom, separated by a thin top border (`border-top`) and neat padding (`margin-top: 2rem - 2.5rem`, `padding-top: 1.5rem`). This establishes a solid, well-proportioned visual finish.
*   **Card Reveal Container Separation**: When animating lists of cards (such as Accordions, FAQ cards, Pricing grids, or Testimonial cards), do not apply word-by-word `LineReveal` or `SplitTextReveal` to the text content inside the cards. This makes the UI feel fragmented. Instead, animate **the card containers themselves** (Card Reveal) by sliding them up (`y: 30` or `40`), fading them in (`opacity: 0 -> 1`), and applying a minor scaling effect (`scale: 0.98 -> 1`) to the entire card block. Use dedicated wrapper components to keep scroll animations isolated and clean.
*   **Once-only Entrance Animations**: To prevent distracting visual clutter, layout jumping, and performance lag when scrolling, always set entrance scroll animations to run only once (`once: true` in Framer Motion, `toggleActions: 'play none none none'` in GSAP). Never replay entrance animations when the user scrolls back up. In Framer Motion, set `viewport={{ once: true }}`.
*   **Avoid macOS-Style Window Controls**: Do not draw red-yellow-green window circles (macOS style) on dashboard simulation frames or mockups. This is a common template cliché. Replace them with professional dashboard iconography: place a clean, monochrome representative icon (e.g., Lucide `FileText`, `Database`, `Cpu`) paired with an uppercase label in the top-left corner.

*   **Conflicting Accordion Height Transitions**: When creating height expand/collapse transitions for Accordion/FAQ items using JS libraries (e.g., `height: 'auto'` in Framer Motion or GSAP), **never** specify CSS transitions for `height` on the wrapper containing the answer (`.answerWrapper`). This results in a double transition conflict, causing stuttering, lag, or layout jumping. Control height dynamics 100% via JS, and sync it with opacity transitions (`opacity: 0 -> 1`) for a smooth entrance.
*   **Framer Motion `whileInView` over GSAP ScrollTrigger for Simple Entrance Animations**: Use Framer Motion's `whileInView` for scroll-triggered entrance reveals on single elements or lists of cards (FAQs, Testimonials, etc.). Do not use GSAP `ScrollTrigger` for these basic entrance animations. GSAP coordinate calculations can conflict with smooth scroll libraries (like Lenis) or layout shifts during page loading, trapping elements in hidden states. GSAP `ScrollTrigger` should be reserved for complex timelines, horizontal scrolling, or scroll-scrubbed drawing paths.
*   **Next.js Hydration & HMR Chunk Safety**:
    1.  *Never check viewport environments during initial render*: Do not use window-dependent variables (like `window.innerWidth > 768` or `isDesktop`) directly to conditionally render HTML blocks during the first render pass.
        *   *Consequence*: Triggers browser-side hydration failures, crashing the React render tree, which breaks Next.js HMR connections and causes CSS chunk loading errors (`No link element found for chunk`).
        *   *Solution*: Wrap conditional desktop/mobile blocks in a `mounted` state flag (set to `true` in a client-side `useEffect` hook).
    2.  *Do not nest block elements inside headings or paragraph tags*: Never place block elements like `div` or block-returning components (such as `LineReveal` wrappers) inside Heading (`h1`-`h6`) or Paragraph (`p`) tags.
        *   *Consequence*: The browser automatically closes headings or paragraphs early to accommodate block divs, causing the DOM structure to diverge from React's virtual tree, triggering hydration mismatch.
        *   *Solution*: Convert wrappers inside reveal components to `span` elements and apply `display: block` or `display: inline-block` where layout dictates.
    3.  *Do not run dynamic calculations during SSR*: Avoid invoking `new Date()` or `Date.now()` directly in SSR-rendered markup (like copyright years in the footer). Use a static fallback string (e.g., `2026`) or update it on client mount to prevent timezone mismatches between server and client.
    4.  *Utilize suppressHydrationWarning for theme initialization*: Declare `suppressHydrationWarning` on `<html>` or `<body>` if your ThemeProvider modifies theme classes or `data-theme` attributes on load, preventing unnecessary hydration warnings.
*   **Mobile SVG & ViewBox Aspect-Ratio Stretching**:
    *   *Rule*: When using absolute positioning for long vertical SVG lines acting as connectors/timelines on mobile, never define their length using only CSS `top` and `bottom` without specifying `height`.
    *   *Reason*: Mobile browsers compute the height of `<svg>` elements based on the viewBox aspect ratio. For a vertical line (viewBox like `0 0 20 1000`), a fixed width of `20px` forces the browser to set height to `1000px`, ignoring CSS `bottom` rules and pushing the SVG past the footer.
    *   *Solution*: Assign explicit heights in CSS using rem units (`height: 38rem` or `height: 57rem`) or use CSS `calc` to override default browser aspect-ratio behavior, keeping vertical sizing predictable.
*   **Responsive Border Overlap Budget**:
    *   *Rule*: Hand-drawn border accent lines or overlapping widgets (`SketchyAccent`) overlap section boundaries. On **Desktop**, we use small negative margins (around `-1.75rem` to `-2.25rem`) to align these accents. On **Mobile** (under 768px), vertical paddings shrink to `1.5rem` - `2.5rem`. Large negative margins swallow this padding, forcing adjacent text or buttons to overlap and become unclickable.
    *   *Solution*: Convert negative margins to positive margins (around `1.25rem` to `1.5rem`) on mobile via media queries, allowing details to float safely between sections.

---

## 4. Inline Ignore System

In cases where a specific code pattern triggers a false positive or is deliberately chosen for branding/artistic reasons, you can disable individual rules locally using `slop-disable` comments.

### Syntax
*   `/* slop-disable <rule-id> */` — Disables the specified rule for the entire file.
*   `/* slop-disable-line <rule-id> */` — Disables the specified rule for the current line.
*   `/* slop-disable-next-line <rule-id> */` — Disables the specified rule for the following line.

### Example
```javascript
// slop-disable-next-line raw-100vh
const height = '100vh'; // Allowed by local exception
```

