# Interaction Design & Custom Cursors (interaction.md)

This document outlines standard attributes and code blueprints for setting up interactive custom cursors, magnetic buttons, and ensuring responsive compatibility with touch screens.

---

## 1. Cursor Contract (data-attributes)

To enable the custom cursor (`GlobalCursor.jsx`) to respond dynamically without writing new JS listeners, declare custom styles on HTML5 elements using these `data-attributes`:

*   `data-cursor-expand`: Gently enlarges the cursor on hover (applied by default to buttons, links, and form triggers).
*   `data-cursor-blend`: Sets the cursor mix-blend-mode to `mix-blend-difference` to invert colors when hovering over dark image containers or geometric solids.
*   `data-cursor-text="VIEW"`: Enlarges the cursor and displays central metadata (e.g., VIEW, PLAY, CLOSE, DRAG) when hovering over portfolio show-cards or video panels.

---

## 2. Code Blueprints

#### A. MagneticButton (Tactile Magnetic Attraction)
- **Blueprint:** [MagneticButton.jsx](../blueprints/MagneticButton.jsx)
- Magnetically attracts elements on hover, automatically bypassing touch devices for optimal performance.

### B. GlobalCursor (Custom Mouse Cursor)
- **Blueprint:** [GlobalCursor.jsx](../blueprints/GlobalCursor.jsx)
- Global custom mouse indicator reacting to `data-cursor` triggers, compatible with SSR environments.

---

## 3. Premium Hover & Tactical Button Interactions (Ref: MenuOverlay)

Instead of copy-pasting raw text, import these optimized, physical component blueprints directly from the project skill library:

- **[RollingText.jsx](../blueprints/RollingText.jsx):** Splits text into characters sliding up on hover. Companion stylesheet: [RollingText.css](../blueprints/RollingText.css).
- **[SpotlightCard.jsx](../blueprints/SpotlightCard.jsx):** Container card radiating spotlight color tracking mouse client-coordinates. Companion stylesheet: [SpotlightCard.css](../blueprints/SpotlightCard.css).
- **[ShooterArrow.jsx](../blueprints/ShooterArrow.jsx):** High-fidelity micro-interaction where hovering causes an icon or arrow to slide out of bounds, fade out, instantly relocate to the opposite side, and slide back into position.
- **[ExpandableButton.jsx](../blueprints/ExpandableButton.jsx):** A circular action button that expands horizontally on hover to slide and fade in a label beside its core icon. Companion stylesheet: [ExpandableButton.css](../blueprints/ExpandableButton.css).
- **[ScaleFillButton.jsx](../blueprints/ScaleFillButton.jsx):** A tactile button interaction where an off-center circular overlay scale-expands rapidly to flood the background of the button with a secondary color. Companion stylesheet: [ScaleFillButton.css](../blueprints/ScaleFillButton.css).
- **[TactileWiggle.css](../blueprints/TactileWiggle.css):** A slight rotation, scale, and offset applied to active or inactive items to produce a responsive hand-sketched or mechanical feel.
- **[SpinContinuous.css](../blueprints/SpinContinuous.css):** A continuous rotation animation applied to active list items or decorative status pins, serving as an interactive visual anchor.
- **[IconPop.css](../blueprints/IconPop.css):** An interactive trigger state where hovering causes a hidden indicator icon to scale up and rotate from a preset angled offset.
- **[CascadeTransition.js](../blueprints/CascadeTransition.js):** An entrance layout choreography where overlay containers slide, rotate, and scale into view sequentially using spring physics.

---

## 4. Keyboard Accessibility & Portals Escape Guidelines

To ensure interactive features are accessible (WCAG AA) and robust across complex layout stacking contexts:

### A. Keyboard Navigation & focus-visible States
- **Tabindex & Focus Trap**: 
  - Ensure all custom interactive elements (e.g., custom tabs, cards, expandables) are focusable by adding `tabIndex={0}`.
  - Implement keyboard event listeners (like `onKeyDown` catching `Enter` or `Space` key codes) to trigger mouse-like click handlers.
- **Focus Rings**:
  - Always design high-visibility focus states using the `:focus-visible` pseudo-class (e.g., `outline: 2px solid var(--primary); outline-offset: 4px`).
  - Do not use `:focus` without `:focus-visible` to prevent mouse clicks from leaving ugly default browser outlines.
- **Escape Key Dismissal**:
  - All modals, dropdown overlays, and sliding drawer panels must listen to global keyboard events and automatically dismiss when the user presses the `Escape` key (`e.key === 'Escape'`).

### B. Escape Stacking Contexts (Portals)
- **Popover Clipping Prevention**:
  - Dropdowns, tooltips, or popover modals rendered inside container sections styled with `overflow: hidden` or `overflow: auto` will be clipped at the boundary.
  - **Solution**: Use React Portals (via `ReactDOM.createPortal`) or native HTML `<dialog>` element / Popover API.
  - Mount overlays to `document.body` or an isolated portal root to escape the parent container's stacking context, positioning them with `position: fixed` or dynamic absolute coordinate calculations relative to the trigger button.
- **Z-Index Harmony**:
  - Pinned elements must have explicit z-indices computed against the semantic z-index scale (dropdown $\rightarrow$ sticky $\rightarrow$ modal $\rightarrow$ tooltip) rather than hardcoding random high values.
