# OKLCH Color System & Palettes (Color Strategy)

This document defines premium color strategy standards, perceived contrast checks using the OKLCH system, and guidelines for generating unified color palettes.

---

## 1. Premium Color Strategy Principles

-   **Contrast Check**: Body copy must maintain a perceived contrast ratio of `>= 4.5:1` against the background (WCAG AA) with a target of `7:1` (WCAG AAA). Headers and bold display typography must satisfy `>= 3:1` (AA) with a target of `4.5:1` (AAA). Avoid placing low-opacity gray text on light backgrounds (or dark gray text on dark backgrounds), which leads to eye strain. Never use `var(--muted)` for text colors.
-   **No Pure White/Black Backgrounds**: Using pure white (`#ffffff` / `#FFFFFF`) or pure black (`#000000`) as background colors for pages, cards, or popovers is strictly forbidden. Shift backgrounds by at least 20 lightness units to protect user vision and establish ambient depth (e.g., use off-white tones like `#fcfaf7` or `#fbf8f4`, and off-black tones like `#0d0d0d` or `#121212`).
-   **Border Visibility**: Container and card borders must be clearly visible, using hues slightly offset from the adjacent background color to define visual space. Do not merge borders into background colors.
-   **Hue-Tinted Neutrals**: Neutral background colors should be tinted with a minor chroma adjustment (`0.005–0.015` in OKLCH) shifting toward the main brand color to establish color cohesion and a premium feel. Avoid the lazy default of always tinting toward warm orange or cool blue across all projects.
-   **No Cream/Beige Default Rule**: Do not translate "warmth" or "editorial" into a near-white warm-tinted beige/cream background (`oklch(L 0.84-0.97, C < 0.06, H 40-100)`) by default. This is a common AI stereotype. Warmth should be carried by accents, typography, and imagery. For backgrounds, pick a saturated brand color, a true off-white at chroma 0, or a brand-specific tinted neutral.
-   **Alpha Is A Design Smell**: Avoid heavy use of transparency (rgba, hsla) for static elements, as it creates unpredictable contrast and performance overhead. Use explicit solid overlay colors instead, reserving alpha only for focus rings and hover state transitions.
-   **Color Strategy Selection**: Before writing styles, choose one of four approaches:
    *   *Restrained:* Brand-tinted neutral backgrounds + an accent color occupying under 10% of the page.
    *   *Committed:* The primary brand color covers 30% - 60% of the page surface.
    *   *Full Palette:* 3-4 distinct named color roles used deliberately (best for datasets, charts, or complex categorized features).
    *   *Drenched:* The entire section is immersed in a strong brand color palette (ideal for dark Hero or CTA banners). Accent colors work because they are rare; overusing them kills their impact.

---

## 2. Dark Mode Contrast & Depth Rules

To prevent dark mode interfaces from collapsing into a flat, illegible void:

-   **Card-to-Background Separation**: Ensure the card background (`--card`) stands out from the primary background (`--background`). Raise the OKLCH Lightness of cards by `0.05` to `0.06` above the background (e.g., if background is `L=0.12`, set cards to `L=0.175` or higher) to define container elevation.
-   **Brutalist Flat Shadow Definition**: Flat offset shadows (`box-shadow`) and borders (`--border`) in dark mode must not use pitch-black colors. Raise the border/shadow Lightness to `0.30 - 0.35` and inject brand chroma (`0.02 - 0.03`) to cast warm, visible shadows (such as cozy dark sage-green or obsidian-slate), preserving tactile brutalist depth.
-   **Paragraph Text Readability**: Auxiliary copy (`--muted-foreground`) displayed on dark cards must have its Lightness elevated to at least `0.70 - 0.75` (while primary headers sit at `0.90+`). This maintains typography hierarchy while preventing eye strain when reading body copy.
-   **Atmospheric Ambient Glows**: Decorative backgrounds (gradient glows, watercolor bleeds) on dark pages should have their opacity set between **`4%` and `9%`** with wider radial blur spreads, maintaining visual depth and branding accents when dark mode is active.

---

## 3. Brand Personality & Preset Selection (styling.md Merge)

Before proposing colors, the Agent **must** scan the existing codebase to verify if CSS tokens, theme setups, or Tailwind configurations are already present.

### A. Style & Brand Interview
Ask the user a maximum of 3-4 concise questions to clarify the visual direction of the interface:
1. **Brand Personality:**
   - *Minimal/Editorial:* Refined typography, negative space, elegance (blogs, portfolios).
   - *Tech/SaaS Corporate:* Clean, professional, trustworthy (B2B, CMS, dashboards).
   - *Web3/Creative Interactive:* Groundbreaking, high-contrast, accents, rich animations.
2. **Display Theme:** Default to Dark mode, Light mode, or dynamic toggle?
3. **Color Strategy:** Restrained (accent < 10%), Committed (primary 30%-60%), or Drenched (strong branding throughout).
4. **Border Radius:** Sharp (0px), soft (8px - 12px), or very rounded (16px - 24px)?

### B. Layout & Animation Survey
Before writing code for any section, query choices:
1. Read `../sections/[section-id]/definition.json` to get the list of `layout_variants`, `animations.interactive`, and `animations.decorative`.
2. Recommend a **Recommended Option** (explaining why it fits the brand personality), list other options with Pros and Cons, and allow write-in answers.

### C. Preset Selection
- **If it matches an existing preset:** Apply that preset.
- **If a new preset is required:** Create a new preset JSON file in `../color-presets/[preset-name].json` with:
  - Font families (`sans`, `serif`, `mono`).
  - Correlating border `radius` values.
  - HEX or OKLCH/HSL values for both `light` and `dark` themes.
