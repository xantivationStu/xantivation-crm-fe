# Section Modification & Refinement Loop Guide (modify-section.md)

This document outlines the standard process for modifying or adding technical specifications of component sections in the `sections/` directory.

## 1. Section Definition Structure (definition.json)

Each section has its own definition file `../sections/[section-id]/definition.json` (e.g., `../sections/hero/definition.json`), which must adhere strictly to the schema in [../_schema.json](../_schema.json):

- `id`, `name`, `category`, `order_weight`: Unique identifier, classification category, and default sorting weight.
- `content.slots`: List of data slots (e.g., title, media, buttons) with explicit data types (`text`, `rich-text`, `image`, `video`, `component`, `boolean`, `select`).
- `layout_variants`: Layout variants (e.g., split, centered, bento).
- `animations`: Specifications for entrance, scroll, hover, and decorative animations.
- `transition`: Visual connections at the top (`in`) and bottom (`out`) borders.
- `tech`: Core libraries used (`framer-motion`, `gsap`, `css-only`) and corresponding Payload CMS field mappings (`cms_fields`).

## 2. Process for Modifying Section Specs

When a user requests to expand, adapt, or update a Section:

1. **Step 1: Verify Existence** - Check `../sections/[section-id]/definition.json`. If the section does not exist, propose creating a new directory and initializing the definition file.
2. **Step 2: Update Specification** - Modify the targeted properties (e.g., add new content slots, update the `cms_fields` list for Payload CMS integration, or adjust animation durations).
3. **Step 3: Validate Schema** - Verify the modified JSON file against [../_schema.json](../_schema.json) to ensure data type correctness and that required fields are present.
4. **Step 4: Sync Metadata** - Update metadata fields (`summary`, `key_animations`, `required`) in [../index.json](../index.json).
5. **Step 5: Explain Changes** - Present the structural changes and updated CMS fields to the user.

## 3. Visual Feedback Refinement Loop (Specification Refinement Newsletter)

When generated React code does not meet expectations or fails visual quality checks, the Agent **MUST NOT** manually apply ad-hoc hotfixes to the frontend source files (.tsx, .css). Instead, follow this spec-driven refinement workflow:

1. **Root Cause Analysis (Specification Analysis):**
   - Check the section's `definition.json` file to compare the actual code against the layout variant `description` rules.
   - Determine if the styling/animation issue stems from a vague description (e.g., missing custom easing curves, lack of stagger delays, or desynchronized CSS classes).
2. **Update Specifications First:**
   - Rewrite the `description` text in the `definition.json` variant to describe micro-movements, padding ratios, font families, dark/light contrast parameters, and spring physics.
   - Adjust parameters in the `animations` metadata block if necessary.
3. **Regenerate Component:**
   - Regenerate the React component (`.tsx` and `.module.css`) to match the newly updated and detailed specification.
4. **Visual Verification:**
   - Run local verifications. If visual or interactive issues persist, repeat from Step 1.
