# Page Template Modification & Dynamic Assembly Guide (modify-template.md)

This document outlines the standard process for modifying or creating page layout templates in the `templates/` directory.

## 1. Template Structure

Each template is stored as a JSON file (e.g., `../templates/payload-cms-landing-full.json`) containing the following properties:
- `id`: Unique kebab-case identifier.
- `name`: Display name.
- `description`: Purpose and ideal use case of the template.
- `sections`: Array of sections, where each element specifies the section `id`, layout `variant`, slots `config`, and visual border transitions (`transition_in`, `transition_out`).
- `color_scheme` & `animation_strategy`: Default brand colors and global motion orchestration strategy.

## 2. Flow Map Validation & Spacing Rules

When adding, removing, or reordering sections in a template, the Agent **must** validate the layout against [../flow-map.json](../flow-map.json):

1. **Strict Ordering Rules (Mandatory Ordering):**
   - The first section must always be `navbar` (`order_weight: 0`).
   - The second section must always be `hero` (`order_weight: 10`).
   - The last section must always be `footer` (`order_weight: 100`).
   - The penultimate section (before footer) must always be `cta-banner` (`order_weight: 90`).
2. **Valid Connections (Connection Validation):**
   - Ensure each section only precedes a section listed in its `valid_connections` registry.
   - For example, `hero` can only precede `logo-bar`, `features-grid`, or `how-it-works`. Placing `hero` directly before `pricing` will trigger a narrative flow warning.
3. **Mutual Exclusions (Mutual Exclusions):**
   - Check the `mutual_exclusions` rules in `flow-map.json`. E.g., `features-grid` and `how-it-works` are soft-exclusive; if a template includes both, the Agent should recommend placing `features-grid` before `how-it-works`.

## 3. Standard Modification Workflow

1. **Step 1: Receive Request** - Identify the target template JSON (or the new template ID to create).
2. **Step 2: Update JSON File** - Write/modify the configuration file under `../templates/[template-id].json`.
3. **Step 3: Sync Metadata** - Update the index registry [../index.json](../index.json) templates array.
4. **Step 4: Report Changes** - Display the section differences (Diff) to the user for verification.

## 4. Template-Free Dynamic Assembly (Dynamic Assembly)

If the user bypasses preconfigured templates to assemble a custom section order, the Agent will execute this dynamic assembly workflow:

1. **Step 1: Analyze and Propose Section List**:
   - Compare the user journey (`narrative_flow` in [../flow-map.json](../flow-map.json)) with the project brief (e.g., an early-stage startup without social proof will skip `testimonials` and `logo-bar` to focus on `how-it-works`).
   - Sort sections by their `order_weight` to ensure a natural progression of information.
2. **Step 2: Survey Section Selection**:
   - Call the `ask_question` tool to verify the proposed section list (allowing the user to add, remove, or reorder).
3. **Step 3: Validate Transitions**:
   - Validate the custom list against the `valid_connections` and `mutual_exclusions` matrices. Alert the user if flow anomalies occur (e.g., placing `hero` directly before `pricing` without establishing value).
4. **Step 4: Survey Layouts and Animations**:
   - For each approved section, interview the user to select layout variants and animations according to the guidelines in [styling.md](styling.md).
5. **Step 5: Save Custom Template**:
   - Compile the approved configurations into a new template JSON file.
   - Generate a kebab-case `id` based on the brand/project name.
   - Save it directly to `../templates/[template-id].json`.
   - Update the `templates` registry in `../index.json` to register the new template for future use.

## 5. Visual & Client Feedback Refinement Loop

During testing or when receiving direct adjustment requests from clients, the Agent will adjust the template JSON configurations according to the following guidelines:

### A. Technical & Performance Optimizations:
*   *Contrast & Transition Clash:* Change conflicting adjacent section transitions to gradient transitions (e.g., `gradient-fade-bridge`) or adjust the global `color_scheme` to avoid harsh boundaries.
*   *Performance Overhead:* If the page feels laggy due to excessive animations (too many `immersive` level components), downgrade non-essential sections to `ambient` or `minimal` variants.

### B. Business & Client Customizations:
*   *Flow Adjustments:* Add, remove, or reorder components in the template's `sections` list to match sales/conversion goals.
*   *Variant Switch:* Swap the `"variant"` of a specific section in the template (e.g., changing showcase from `"minimalist-outlined-list"` to `"stacking-cards-sticky"`).
*   *Branding Alignment:* Modify HEX/OKLCH codes in the template's `"color_scheme"` to align with the client's official brand guidelines.
