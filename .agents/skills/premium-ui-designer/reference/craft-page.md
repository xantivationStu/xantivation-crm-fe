# Landing Page Development Process (craft-page.md)

This document outlines the standard workflow for collecting requirements, surveying users, drafting PRDs, compiling JSON templates, and outlining UI architecture before writing source code.

## 1. Trigger Conditions

When a user initiates requests such as:
- An explicit command: `craft-page [brief]`
- Or a short request: *"I want to build a landing page portfolio"*, *"Build a landing page for my product..."*, etc.
- Or a prompt asking to continue/proceed: *"tiếp tục đi"*, *"proceed"*, *"next step"*, etc.

The Agent **must** adopt the Product Designer role and execute this survey workflow instead of immediately generating frontend source code.

### Mandatory State Machine Check (Quy trình xác định trạng thái)
Before performing any action, the Agent **must** check the workspace files to see where we left off:
1. **If no `PRD.md` exists:** You are at **Step 1 & 2 (Requirements & PRD)**. Do the survey, generate `PRD.md`, and stop at **GATE 1**.
2. **If `PRD.md` exists but no `landing_page_config.json` exists:** You are at **Step 3 & 4 (Visual Contract & Page Config)**. Stop and check the Palette, show mocks/references, compile `landing_page_config.json`, and stop at **GATE 2**. **DO NOT write React/HTML/CSS code yet.**
3. **If `landing_page_config.json` exists but no `implementation_plan.md` exists:** You are at **Step 5 (UI Architecture Plan)**. Write the `implementation_plan.md` outlining exact paths, imports, z-index hierarchy, and Mermaid UI trees, and stop at **GATE 3**.
4. **If all files (`PRD.md`, `landing_page_config.json`, `implementation_plan.md`) exist:** You can proceed to **Step 6 (Implementation & Linting)**.

## 2. Step 1: Codebase Autodetect & Multi-Role Survey

To ensure that the generated code compiles immediately and integrates with the existing workspace, the Agent **must** run an environment check before asking questions:

### A. Greenfield vs. Brownfield Check (Dynamic Branching)
1. **If Brownfield (Existing codebase):** Automatically scan the project config files:
   - Identify framework, styling setup (Tailwind, Vanilla CSS, CSS Modules), and animation libraries.
   - Load existing color tokens from `DESIGN.md` or global styles to preserve brand identity.
   - Skip redundant tech survey questions. Proceed directly to Step 1C.
2. **If Greenfield (Empty project):** Ask the user directly which framework to initialize (Astro, Next.js, or HTML). Create `PRODUCT.md` and `DESIGN.md`. Run `palette.mjs` to seed a brand color using OKLCH and build neutrals around it.

### B. Tech Stack Survey (Only for Greenfield or Ambiguous environments)
Ask directly:
1. **Language:** TypeScript (`tsx`) or JavaScript (`jsx`)?
2. **Framework & Routing:** Next.js (App Router / Pages Router), Vite React, or static HTML/JS?
3. **Styling System:** Tailwind CSS, Vanilla CSS, or CSS Modules?
4. **Animation Libraries:** Are GSAP, Framer Motion, or Lenis already installed?

### C. Aesthetic & Brand Survey (3-4 Core Questions)
Acting as the Product Designer, survey the user regarding Brand Archetype, target audience, color preferences (avoiding default cream/beige unless explicitly requested), and page structure.
- Provide a **Recommended Option** with justifying reasons.
- Provide **Alternative Options** detailing Pros & Cons.
- Provide a **Custom option** allowing write-in answers.
- Use `ask_question` (if available) or formatted options in the chat interface.

---

## 3. Step 2: Product Requirement Document (PRD.md)

Compile the requirements and save as `PRD.md` in the project root.
The PRD must include:
- A complete, structured markdown document.
- Clear, cohesive logic.
- **Mermaid.js** diagrams describing the User Journey Flow and page layouts.

> [!IMPORTANT]
> 🛑 **GATE 1 - Requirements Approval:** Stop here. Present the `PRD.md` to the user and wait for explicit confirmation to proceed.

---

## 4. Step 3: Section Definition Scanning & Visual Design Contract

The Agent reads and analyzes the section definitions located under `.agent/skills/premium-ui-designer/sections/*/definition.json` to:
- Extract exact valid section `id`s and `layout_variants`.
- Extract valid design transitions (`transition_in`, `transition_out`).
- Define the OKLCH brand neutrals tint guidelines (Chroma 0.005–0.015) based on the brand's main hue.
- Lock in the color strategy (Restrained, Committed, Full palette, or Drenched).
- If ImageGen is enabled, generate 1-3 visual comps/mocks. Otherwise, define named reference links.

> [!IMPORTANT]
> 🛑 **GATE 2 - Visual Concept Approval:** Stop here. Lock in the palette and show the visual mockups/references. Wait for user approval before moving to architecture.

---

## 5. Step 4: Page Config Compilation (`landing_page_config.json`)

Based on approved sections, compile the page structure config into `landing_page_config.json` in the project root matching the template schema:
- Fields: `id`, `name`, `description`, `project_type`, `target_audience`, `sections` (containing `id`, `variant`, `config`, `transition_in`, `transition_out`), `color_scheme`, and `animation_strategy`.

---

## 6. Step 5: UI Architecture & Implementation Plan (`implementation_plan.md`)

Compile `implementation_plan.md` in the artifacts folder containing:
1. **Exact Physical Paths:** List all files to be created or modified, including specific file extensions.
2. **Imports & Dependencies:** Declare which libraries, subcomponents, or assets will be imported.
3. **Props Flow & State Management:** Specify component state ownership, prop flowing, and callbacks.
4. **Quantitative z-index Stack:** Define explicit z-indices (e.g. background layers `z-0`, watermarks `z-1`, interactive content cards `z-10`, sticky navbar `z-50`, custom cursor `z-[9999]`) to avoid overlay conflicts.
5. **Visual Diagrams:** Include Mermaid diagrams mapping User Flow, Page Layout, and the Component UI Tree.

> [!IMPORTANT]
> 🛑 **GATE 3 - UI Architecture Approval:** Stop here. Set `request_feedback: true` in the metadata of `implementation_plan.md`. Wait for explicit user approval before writing code.

---

## 7. Step 6: Implementation & Quality Linting

Once approved:
1. Create a `task.md` file in the artifacts directory to track progress.
2. Code components following Awwwards specifications but enforced by usability rules:
   - Ensure text contrast is $\ge 4.5:1$ (no `var(--muted)` for body text).
   - Add padding budgets for horizontal scrollbar rows to prevent shadow clipping.
   - Use media queries for responsive mascot peeking offsets.
   - Limit cognitive load options to Cowan's memory rule ($\le 4$ items per group).
   - Wrap reveal animations in `span` elements (no block elements inside `<p>`).
3. Run the visual slop linter to scan for anti-patterns:
   - `node .agent/skills/premium-ui-designer/scripts/lint-slop.js`
4. Run browser verification and execute heuristic scoring (Nielsen's 10 Heuristics & Persona testing).
5. Resolve P0-P3 issues and save critique snapshots.
6. Present the final result to the user.
