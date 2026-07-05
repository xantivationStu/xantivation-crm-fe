# Responsive & Touch Gestures Adaptation (adapt.md)

This document regulates the design patterns and code structures for adapting premium desktop layouts to touch-centric mobile viewports without losing aesthetic quality or causing layout jank.

---

## 1. Touch Target Budgets (Kích thước vùng chạm)

On mobile, the mouse cursor is replaced by human fingers, which are far less precise.

*   **Minimum Target Size:** All touch-interactive components (buttons, links, badging filters, close buttons, menu items) must occupy a physical size of at least **`44px x 44px`** (or `48px x 48px` for core CTA elements).
*   **Touch Target Padding:** If the visible button design is smaller (e.g. a micro close icon `x` of `16px`), you must apply transparent inner padding (e.g., `p-3`) or use an absolute transparent hover overlay to expand the touch boundary to `44px` without distorting the visual scale.

---

## 2. Fluid Typography & Spacing (Co giãn phông chữ động)

Avoid writing excessive media query overrides (e.g., `@media (max-width: 768px) { h1 { font-size: 2rem; } }`). This creates stair-step resizing and feels unpolished.

*   **CSS clamp():** Implement fluid sizing for typography and vertical paddings using the CSS `clamp(min, preferred, max)` function.
*   **Fluid Typography Scale:**
    *   *Display H1:* `font-size: clamp(2.5rem, 5vw + 1rem, 6rem);`
    *   *Section H2:* `font-size: clamp(1.75rem, 3vw + 0.8rem, 3.5rem);`
    *   *Body description:* `font-size: clamp(0.95rem, 1vw + 0.7rem, 1.15rem);`
*   **Fluid Spacing:** Use viewport-width (vw) units combined with standard rem units for section padding:
    *   `padding-block: clamp(4rem, 8vw + 2rem, 10rem);`

---

## 3. Touch Gesture Replacements (Thay thế cử chỉ trên Mobile)

Mouse-centric desktop behaviors must be mapped to native touch controls on mobile devices:

### A. Bottom Drawer Sheets (Thay thế Dropdown/Popover)
*   Desktop dropdown lists or setting modals are difficult to tap on mobile. 
*   **Replacement:** Slide a bottom drawer sheet from the bottom of the screen overlaying a dim backdrop, mimicking native iOS/Android system overlays.
*   **Tailwind/Framer Motion blueprint:**
    ```tsx
    import { motion, AnimatePresence } from "framer-motion";
    
    export function BottomDrawer({ isOpen, onClose, children }) {
      return (
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Dim Backdrop */}
              <motion.div 
                className="fixed inset-0 bg-black/40 z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
              />
              {/* Bottom Sheet */}
              <motion.div 
                className="fixed bottom-0 left-0 right-0 bg-[var(--card-bg)] rounded-t-3xl p-6 pb-10 z-50 border-t border-[var(--color-border)]"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
              >
                {/* Touch drag indicator */}
                <div className="w-12 h-1 bg-[var(--color-border)] rounded-full mx-auto mb-4" />
                {children}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      );
    }
    ```

### B. Swipe-Carousel (Thay thế Scroll-Scrub Timelines)
*   Complex scrub-linked animations (where users must scroll vertically to progress a timeline horizontally) feel awkward and heavy on mobile browsers.
*   **Replacement:** Automatically convert scroll-scrub timelines into swipeable carousels (`overflow-x-auto snap-x snap-mandatory flex`) on screens under `768px`. This utilizes the browser's hardware-accelerated scroll physics and provides responsive tactile feedback.
