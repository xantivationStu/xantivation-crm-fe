# Layout, Spacing & SVG Grid (Layout & Spacing)

This document regulates visual layout standards, spacing rhythm, and the implementation of Awwwards-standard dynamic grid lines.

---

## 1. Layout Principles & Spacing Grid
- **Vertical Spacing Rhythm**: All vertical spacing (`margin-bottom`, `padding-y`, `gap-y`) must be multiples of the Base Line Height (e.g., if body font is 16px, line-height is 1.5, the line height is 24px, so spacing must be `12px`, `24px`, `48px`, `72px`, etc.). This creates optimal geometric balance.
- **Asymmetric Grid (Bento Grid)**: Designed for diverse 2D information presentation. Avoid symmetric 3-column card grids. Mix cards of different widths (e.g., one card spanning 2 columns, another spanning 1 column) to give the user's eyes natural points to pause.
- **Grid vs Flexbox**:
  * **CSS Grid** must only be used for 2D spatial layouts (such as Bento grids or complex geometric grids).
  * **Flexbox** is used for 1D flow structures (such as navbar links, tag lists, button groups). Do not use Grid for 1D flows.
- **Cowan's Working Memory Rule (Layout Constraints)**:
  * Limit distinct choices, cards, or actions visible at any single decision point to $\le 4$ items (pricing tiers $\le 3$, action buttons $\le 1$ primary + 2 secondary, dashboard widgets $\le 4$ key metrics).
  * Group related fields in forms into clusters of $\le 4$ fields separated by a clear visual break or step.
- **Horizontal Scroll Shadow Budget**:
  * For horizontal scroll containers (`overflow-x: auto`), always add explicit vertical padding (e.g., `padding-top: 6px; padding-bottom: 8px;`) to the container.
  * This reserves visual budget for rendering child elements' `box-shadow` or hover scales, preventing the browser from slicing off shadows at the scroll bounds.
- **Mobile SVG Timeline Height Fix**:
  * For absolute-positioned vertical SVG connecting lines or timelines on mobile, never define their length using only `top` and `bottom` rules without setting a height.
  * Mobile browsers compute SVG heights based on the viewBox ratio, which can stretch the SVG past the footer. Define explicit CSS heights in rems (`height: 38rem`) or use `calc` to override default aspect-ratio scaling.
- **Semantic Z-index Scale**: Avoid arbitrary z-indices like `999` or `99999`. The mandatory z-index scale is:
  ```css
  --z-dropdown: 10;
  --z-sticky: 20;
  --z-modal-backdrop: 30;
  --z-modal: 40;
  --z-toast: 50;
  --z-tooltip: 60;
  ```
- **Artistic Negative Space Fillers**:
  * **Grid Spotlight Effect**: Use extremely subtle radial gradient glows tracking the cursor, illuminating grid lines below to turn a static background into a physically interactive surface.
  * **Fine Lines & SVG Paths**: Position ultra-thin lines (`0.5px` to `1px` with low opacity) as section borders, or use winding SVG paths running vertically that draw dynamically on scroll to guide the reading flow through negative margin spaces.
  * **Side Margins Branding**: In the blank margins of the screen (`fixed left-6` or `right-6`), place short uppercase text blocks (project name, coordinates, version number) rotated vertically (`writing-mode: vertical-rl` or `rotate-90`) using a tiny Mono font (`10px`), paired with slowly rotating icon glyphs (`✦`, `✶`) as visual anchors.

---

## 2. Code Blueprints

Instead of copy-pasting raw text, import these optimized, physical component blueprints directly from the project skill library:

- **[SVGLineDrawing.jsx](../blueprints/SVGLineDrawing.jsx):** Scroll-drawn horizontal lines with resize safety.
- **[GridSpotlight.jsx](../blueprints/GridSpotlight.jsx):** Mouse-tracking spotlight gradient overlaying CSS grids.
- **[DynamicScrollPath.jsx](../blueprints/DynamicScrollPath.jsx):** Curved vertical connector paths drawing on scroll with flowing energy.
- **[PinnedLoopScrollPath.jsx](../blueprints/PinnedLoopScrollPath.jsx):** Scroll-drawn SVG loops wrapping around sticky cards.

For depth separation using z-index overlays or clipping masks on overlapping lines, refer to the guides in [clipping-masks.md](clipping-masks.md).

---

## 3. Layout Archetypes & Design Diversity (Variety & Flexibility)

When designing a section or page layout (e.g., Blog listing, Feature cards, Showcases, or grids), avoid hardcoding rigid, static structures. The patterns below are **guiding archetypes and starting structures** for layout density. The Agent should dynamically choose, combine, or adapt these based on:
1. The **volume of content** (e.g., number of items retrieved from the CMS or data source).
2. The **richness of the elements** (e.g., presence of images, tag lists, or descriptions).
3. The **responsive screen size** (preserving visual balance across all breakpoints).

### Conceptual Archetype A: Split Spotlight (Featured Hero)
* **Visual Structure:** A prominent horizontal/vertical split layout. For instance, a `60/40` split card where one side hosts a large media object (featured image/video), and the other holds metadata, header, short body text, and actions.
* **Aesthetic Focus:** Outlined container with a flat offset shadow, anchoring the section load and giving focal weight.
* **Adaptation Logic:** Stacks vertically on smaller screens. If there is only one item, it should automatically render in this featured style to fill the canvas.

### Conceptual Archetype B: Asymmetric Bento Grid
* **Visual Structure:** A modular grid of varying card sizes to create a modern, high-fidelity editorial flow (e.g., combining wide, tall, and small cards).
* **Aesthetic Focus:** Establishes a clear visual hierarchy, leading the user's eye from the largest/tallest element to smaller details.
* **Adaptation Logic:** Adapt layout columns based on content count:
  * If N=1: Split Spotlight.
  * If N=2: 2-column split.
  * If N=3: Bento grid with 1 large featured card and 2 smaller stacked cards.
  * If N=5: Bento grid with 1 large, 2 medium, 2 small, or dynamically wrap the odd item to span full width.

### Conceptual Archetype C: Sidebar + Content Split
* **Visual Structure:** A two-column layout (typically `2.5fr 7.5fr` or similar ratio) featuring a sticky navigation, filter, or meta panel on one side and a responsive grid of card elements on the other.
* **Aesthetic Focus:** Highly functional, organizing navigation and content discovery in a clean magazine-style format.
* **Adaptation Logic:** On mobile, the sticky sidebar must gracefully collapse into a horizontal scrolling row of filter chips or a collapsible overlay.

### Conceptual Archetype D: Alternating Row List
* **Visual Structure:** A vertical stack of horizontal entries (rows). To maximize dynamic interest, rows can alternate alignments (e.g., text-left/image-right on even rows, and image-left/text-right on odd rows).
* **Aesthetic Focus:** Typography-centric and editorial, reminiscent of premium paper print journals.
* **Adaptation Logic:** On viewports below `768px`, row structures should stack uniformly (image-top/text-bottom) to preserve structural readability.

### Data-Adaptive Layout Calculations (Rules for Diversity)
To avoid broken grids and empty spaces when database records vary, the Agent **must** apply these calculations dynamically in the component logic:
* **Empty States:** Always provide a styled empty state card (e.g., a cozy capybara peeking with a speech bubble saying *"Nothing here yet!"*).
* **Odd-Numbered Grids:** If a grid is designed for 3 columns but receives 4 items, the first 3 items should display as a 3-column row, and the 4th item must dynamically span all 3 columns (or span 2 columns with an adjacent decorative mascot block) to prevent a trailing single-column empty gap.
* **Layout Merging:** Enable combining archetypes. For example, rendering the first item as a **Split Spotlight**, and the remaining items in an **Asymmetric Bento Grid** or **Alternating Row List**.