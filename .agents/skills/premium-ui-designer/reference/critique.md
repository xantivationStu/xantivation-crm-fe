# Design Critique & Evaluation Framework (critique.md)

This document establishes the heuristic evaluation standards and the self-critique process that the Agent must execute to review design layouts and prevent "AI Slop" before proposing code.

---

## 1. The 10 Design Heuristics (Barem chấm điểm thiết kế)

To review a page layout, rate the design on a scale of **0 to 10** across each of the following ten criteria. A premium Awwwards-level page must achieve an average score of **>= 8.5/10**, with no single criterion scoring below **7**.

1.  **Anti-AI Slop Rating:** Is the design free of side-stripe borders, ghost cards, capital kicker eyebrows on every section, system emojis, or cliché device mockups?
2.  **Typography Contrast & Legibility:** Does body text use high-contrast variables (like `var(--muted-foreground)`)? Is the line measure limited to `65-75ch`? Are display headers set to letter-spacing `>= -0.04em`?
3.  **Color Cohesion & Tinting:** Are brand colors applied in accordance with a deliberate strategy (Restrained, Committed, or Drenched)? Are background neutrals tinted correctly with brand chroma (`0.005–0.015`)?
4.  **Layout Rhythm & Bento Asymmetry:** Are sections structured with visual variety, avoiding endlessly repeating uniform card grids? Is Bento layout used effectively?
5.  **Above-Fold LCP Safety:** Are above-fold elements free from blocking entrance transitions? Does the Hero section render instantly, delay-offsetting animations until after hydration?
6.  **Responsive Integrity:** Are vertical SVG timeline elements drawn with explicit height calculations on mobile? Are responsive margins and paddings adjusted using media queries?
7.  **Motion Constraint & Once-only Viewport:** Do scroll animations use `once: true` (Framer Motion) or manual scroll triggers? Are loop animations slow (duration `>= 20s`)?
8.  **Information Density & Cognitive Load:** Does grouped navigation or option cards comply with Cowan's memory rule ($\le 4$ items per group)?
9.  **Interactive Responsiveness:** Do mouse hover/active transitions feel snappy (150ms-250ms), utilizing tactile feedback (e.g. magnetic wiggles) without visual clutter?
10. **State Resilience (Edge Cases):** Are error states isolated? Are skeletons custom-proportioned with biological breathing shimmer loops (2.5s-3s)?

---

## 2. Mandatory Self-Critique Process (Quy trình tự phản biện)

Before starting the coding phase (Gate 3 to Gate 4 transition), the Agent **must** write a design critique block in its response to the user. This critique must explicitly calculate scores for the current implementation or proposal:

### Self-Critique Format:
```markdown
### 🛑 Design Self-Critique
*   **Anti-AI Slop Rating:** [Score]/10 - [Justification / checks for rules 1-31]
*   **Typography & Legibility:** [Score]/10 - [Checking measure, contrast, H1 letter-spacing]
*   **Color & Contrast:** [Score]/10 - [Checking OKLCH tints and dark mode depth]
*   **Layout Diversity:** [Score]/10 - [Checking Bento grid and card variation]
*   **Motion & Performance:** [Score]/10 - [Checking above-fold safety, once-only viewports]

**Deductions & Improvements:**
- *Issue:* [State what is less than perfect, e.g. card padding on mobile]
*   *Fix:* [Specify how the code will resolve it]
```

By enforcing this self-criticism loop, the Agent behaves as an elite human designer, proactively identifying and correcting visual flaws before shipping code.
