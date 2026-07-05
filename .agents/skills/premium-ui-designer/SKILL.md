---
name: premium-ui-designer
description: Build, structure, customize, or modify a landing page with premium, Awwwards-level layouts and animations.
---

# Premium UI Designer (Awwwards-Level Specification)

This is the main skill for building and modifying landing pages and web apps using available sections combined with CMS schemas and drag-and-drop configurations. It ensures the highest consistency in UI/UX, user journey flow, smooth scroll performance, and premium interactions.

## 1. Dynamic Branching Cases (Phân nhánh trường hợp)

The Agent **must** dynamically route the flow based on the project context:
- **Case A: Greenfield (Dự án mới tinh):** Ask user to choose the framework (Astro, Next.js, or HTML). Generate `PRODUCT.md` and `DESIGN.md`. Run `palette.mjs` to seed a brand color using OKLCH and build neutrals around it.
- **Case B: Brownfield (Dự án có sẵn):** Autodetect stack via config files. Kế thừa color tokens và theme trong project root. Read `reference/user-refinements.md` to load user preference history.
- **Case C: Brand Register (Landing Page/Portfolio):** Visual showmanship focused. Bold OKLCH colors (Committed/Drenched). Ensure high-quality stock photo URLs or vector SVGs (no gray divs). Keep LCP < 2.5s and mobile-responsive scroll triggers.
- **Case D: Product Register (SaaS/Dashboard):** Usability focused. Restrained color strategy (neutrals with selective action colors). Limit cognitive load to Cowan's memory rule ($\le 4$ options per group). Use Portals to escape container overflow clipping.
- **Case E: ImageGen Enabled:** Run 4 stop-point gate loops (Step A questions, Step B palette lock, Step C/D comps approval, and Step F asset slicing via agent).
- **Case F: Text-Only Brief:** Proceed directly from the brief, using verified stock photos and robust CSS/SVG scenery.

## 2. Mandatory Quality Gates (Cổng kiểm duyệt chất lượng)

The Agent **MUST NOT** proceed to write source code without user confirmation at these checkpoints:
1. **Gate 1: Requirements Approval:** Stop after creating the PRD and Mermaid User Journey.
2. **Gate 2: Visual Concept Approval:** Stop after generating/locking in the OKLCH Palette and Visual Mocks (or named references).
3. **Gate 3: UI Architecture Approval:** Stop after creating the `implementation_plan.md` outlining the component tree and z-index hierarchy.

> [!IMPORTANT]
> **State Machine & Gate Progression Rule (Quy tắc chuyển bước Gate nghiêm ngặt):**
> Khi người dùng yêu cầu "tiếp tục", "tiến hành", hoặc duyệt một bước, Agent **phải** kiểm tra các tệp tin trong thư mục gốc để xác định chính xác Gate hiện tại và **không bao giờ được phép nhảy cóc** sang bước tiếp theo:
> *   **Trạng thái 1 (Chưa có `PRD.md` hoặc `PRD.md` đang trống):** Thực hiện Step 1 & 2 -> Dừng tại **Gate 1**.
> *   **Trạng thái 2 (Đã có `PRD.md` nhưng chưa có `landing_page_config.json`):** Thực hiện Step 3 & 4 (quét định nghĩa section, chốt Palette màu OKLCH, visual mocks và tạo `landing_page_config.json`) -> Dừng tại **Gate 2** để duyệt ý tưởng thiết kế. **Tuyệt đối không được viết code nguồn ở bước này.**
> *   **Trạng thái 3 (Đã có `landing_page_config.json` nhưng chưa có `implementation_plan.md`):** Thực hiện Step 5 (lập kế hoạch kiến trúc UI, z-index, Mermaid component tree) -> Dừng tại **Gate 3**.
> *   **Trạng thái 4 (Đã duyệt qua cả 3 Gates):** Chỉ khi có đủ cả `PRD.md`, `landing_page_config.json`, và `implementation_plan.md` đã được người dùng phê duyệt rõ ràng, Agent mới bắt đầu viết code nguồn (Step 6).

## 3. Initial Setup & On-Demand Context Loading Rules

Before executing any task, the Agent **must** perform the following steps:
1. Read [index.json](index.json) to understand the existing library of sections, templates, and configurations.
2. Read [flow-map.json](flow-map.json) to ensure compliance with section transition rules and ordering logic.
3. Automatically identify the technical stack (e.g., `.jsx`/`.tsx`/`.html`/`.vue`/`.astro` files, Tailwind/Vanilla CSS/CSS Modules, and animation libraries like GSAP/Framer Motion). If there is any ambiguity, ask the user the mandatory technical survey questions before planning or writing code (see details in [reference/craft-page.md](reference/craft-page.md)). **Never assume a fixed stack**; always adapt code blueprints dynamically to match the project's actual frameworks and architecture.
4. **Mandatory Proactive Option Survey Rule:** Whenever the user requests to add or modify anything new (e.g., a new page, path, section, feature, template, layout variant, styling rule, or animation transition), the Agent **MUST NOT** proceed directly to coding. Instead, the Agent must formulate a clear design options survey presenting multiple paths (suited for the project's framework) and ask the user to select or write in their response.
5. **Mandatory Project Memory Rule:** Before writing any style or markup code, the Agent **must** read [DESIGN.md](../../../DESIGN.md) in the project root to load the active color palette, CSS variables, corner-radius, hover animations, and mascot guidelines.
6. **Mandatory Design Refinement Memory Rule:** The Agent **must** read [reference/user-refinements.md](reference/user-refinements.md) to load any user preferences or style corrections from previous sessions and apply them to the current suggestions.
7. **Mandatory Dynamic Creative Archetypes & Stack Versatility Rule (Layout & Design Diversity):** The layout variants, CSS blueprints, and design options described in this skill library are conceptual guides and starting archetypes, NOT rigid constraints. The Agent **must** avoid hardcoding layouts, static grids, and framework-specific structures. It **must** dynamically calculate columns, gaps, layout adjustments, and spacing to fit the actual number of content items returned by the CMS/data payload, while keeping the overall design diverse, creative, responsive, and of Awwwards-level/premium caliber across any target stack.

> [!CAUTION]
> **No Redundant Reads Rule:**
> To prevent token waste, context dilution, and execution delays, the Agent **MUST NOT** automatically read all files in the `reference/` directory. Only open reference files when the current task falls within the scope of that specific file:
> - **Loading the brand identity, active palette, design tokens, or mascot guidelines:** Always read [DESIGN.md](../../../DESIGN.md) in the project root.
> - **Building a new page from scratch:** Only read [reference/craft-page.md](reference/craft-page.md).
> - **Designing layout systems, grids, vertical rhythm, or SVG scroll-drawn lines:** Only read [reference/layout.md](reference/layout.md).
> - **Modifying template structures (section order/list):** Only read [reference/modify-template.md](reference/modify-template.md).
> - **Modifying details of a specific Section (code, slots, fields):** Only read [reference/modify-section.md](reference/modify-section.md).
> - **Changing visual styles, colors, or global typography:** Only read [reference/styling.md](reference/styling.md) and [reference/colorize.md](reference/colorize.md).
> - **Fine-tuning animations or smooth scrolling:** Only read [reference/animate.md](reference/animate.md).
> - **Fine-tuning mouse interactions or custom cursors:** Only read [reference/interaction.md](reference/interaction.md).
> - **Fine-tuning fonts & typography:** Only read [reference/typeset.md](reference/typeset.md).
> - **Fine-tuning background effects, noise filters, or organic morphing:** Only read [reference/artistic-effects.md](reference/artistic-effects.md).
> - **Designing folders, overflow boundaries, or background watermarks:** Only read [reference/artistic-layouts.md](reference/artistic-layouts.md).
> - **Applying clipping masks or text-color inversion:** Only read [reference/clipping-masks.md](reference/clipping-masks.md).
> - **Implementing sketch styles or Neo-Brutalism:** Only read [reference/neo-brutalism.md](reference/neo-brutalism.md).
> - **Scanning and fixing AI Slop design errors:** Only read [reference/anti-patterns.md](reference/anti-patterns.md).
> - **Designing section connections & boundary accents:** Only read [reference/transitions.md](reference/transitions.md).
> - **Reviewing user refinement feedback history:** Only read [reference/user-refinements.md](reference/user-refinements.md).
> - **Designing tables, forms, or layouts for Dashboard/SaaS Product UI:** Only read [reference/product-ui.md](reference/product-ui.md).
> - **Running design evaluations, heuristic scores, or self-critique reviews:** Only read [reference/critique.md](reference/critique.md).
> - **Tuning aesthetic intensity, making the UI bolder or quieter:** Only read [reference/bolder-quieter.md](reference/bolder-quieter.md).
> - **Optimizing WebGL/Three.js performance or R3F components:** Only read [reference/webgl-3d.md](reference/webgl-3d.md).
> - **Adapting layouts for mobile responsiveness and touch gestures:** Only read [reference/adapt.md](reference/adapt.md).
> - **Applying premium media treatments, image masking, or noise overlays:** Only read [reference/media-treatment.md](reference/media-treatment.md).


---

## Commands Routing

| Command | Meaning | Reference Guide File |
|---|---|---|
| `craft-page [brief]` | Survey requirements (from roles of CEO, PO, PM, SE), create PRD, generate JSON Template configuration, and establish UI architecture plan before coding. | [reference/craft-page.md](reference/craft-page.md) |
| `init [brand/project]` | Analyze brand, execute aesthetic survey, and set up color/font presets. | [reference/styling.md](reference/styling.md) |
| `modify-template [id]` | Modify/add template structures (list of sections, order, transitions). | [reference/modify-template.md](reference/modify-template.md) |
| `modify-section [id]` | Modify detailed resources of a specific section (layout_variants, slots, animations, cms_fields). | [reference/modify-section.md](reference/modify-section.md) |

> [!IMPORTANT]
> **Automatic Routing:** When a user inputs a brief or indirect request such as *"I want to build a landing page/portfolio..."*, the Agent **must** automatically route this request to the `craft-page` command and follow the process defined in [reference/craft-page.md](reference/craft-page.md).

---

## Core Specifications

To ensure the generated interface meets premium Awwwards standards and avoids "AI Slop" visual traits, the Agent must read and apply the following single-responsibility technical guides when writing code:

1. **[Typography Specifications](reference/typeset.md):** Font configuration, typographic scale, line measure, and split-text reveal blueprints (`SplitTextReveal`, `LineReveal`, `ScrambleText`).
2. **[Layout & Grid Spacing](reference/layout.md):** Spacing rhythm based on line-height, asymmetric Bento Grids, z-index architecture, and self-drawing line blueprints (`SVGLineDrawing`).
3. **[OKLCH Color System & Palettes](reference/colorize.md):** Brand color palettes using OKLCH, contrast checks, tinted neutrals, and palette auto-generators.
4. **[Animations & Smooth Scrolling](reference/animate.md):** Timing rules (100/300/500/800ms), eases, mobile-responsive motion, and smooth scrolling (`Lenis`), slide-overs (`ClippingMaskReveal`), sticky panels (`StackingPanels`), and horizontal scrolls (`HorizontalScroll`).
5. **[Interactions & Cursors](reference/interaction.md):** Cursor contracts, magnetic buttons, and blueprints (`MagneticButton`, `GlobalCursor` mobile-safe).
6. **[Premium Artistic Effects](reference/artistic-effects.md):** Noise/grain overlays, morphing SVG masks, liquid displacement hovers, and micro-grid coordinates.
7. **[Artistic Layouts & Identity](reference/artistic-layouts.md):** Folder tabs, overflow assets, watermark text backdrops, and overlapping layers.
8. **[Clipping Masks & Shapes](reference/clipping-masks.md):** Polygon clip-paths, organic curve masks, and border text color inversion.
9. **[Sketching & Neo-Brutalism](reference/neo-brutalism.md):** Ink/pencil borders, flat offset shadows, and tactile button push-down animations.
10. **[Anti-AI Slop Rules](reference/anti-patterns.md):** 31 forbidden anti-patterns, automated detector with inline-ignore support, and code quality checkers.
11. **[Transitions & Boundary Accents](reference/transitions.md):** Overlapping negative margin z-indices, double-stroke pencil sketching, continuous cursive signature paths, and broad feline paw pad layouts.
12. **[Premium SaaS & Dashboard UI](reference/product-ui.md):** Dynamic layout archetypes, table columns, floating action menus, forms, input spotlight glows, and slow-shimmer loading skeletons.
13. **[Design Critique & Evaluation](reference/critique.md):** The 10 design heuristics scoring framework and mandatory self-critique process.
14. **[Bolder & Quieter Visual Tuning](reference/bolder-quieter.md):** Guidelines for increasing creative character (coordinates, dials, sketch dividers) or minimizing visual noise (dimming blobs, removing animations, increasing negative space).
15. **[WebGL & 3D Performance](reference/webgl-3d.md):** Memory disposal workflows, shadows and postprocessing adaptive bypass, and dynamic camera aspect-ratio adjustments.
16. **[Mobile & Touch Gestures](reference/adapt.md):** Target size minimums, fluid clamp() resizing scales, and swipe carousels or bottom drawer overlays.
17. **[Premium Media Treatment](reference/media-treatment.md):** Inset reveals, interactive tilt overlays, image grain templates, and mix-blend-mode difference text styling.


