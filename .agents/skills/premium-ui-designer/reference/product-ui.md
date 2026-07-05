# Premium SaaS & Dashboard UI Guidelines (product-ui.md)

This document defines high-end design principles and code patterns for building premium, responsive B2B and SaaS dashboard interfaces that achieve Awwwards-level polish and strictly avoid "AI Slop" traits.

---

## 1. Dynamic Layout Archetypes (Bố cục Động tham chiếu)

Dashboards must feel alive and responsive. **Do not hardcode static layout structures, grid dimensions, or rigid column allocations.** The layout must serve the data. AI should dynamically calculate columns and layout distribution to keep layouts diverse and clean.

### A. Modular Grid Canvas (Bento Box Layout)
*   **Aesthetic Principle:** A dynamic grid dividing widgets into distinct structural panels of varying visual weights, establishing an asymmetric grid flow.
*   **Constraint:** Use asymmetric column spans (e.g. `col-span-2` next to `col-span-1`) rather than splitting widgets into equal grids. Use a very low-opacity grid backdrop line system (`stroke-width="0.5"`, opacity `4%`) to ground floating panels.
*   **Tailwind/CSS blueprint:**
    ```tsx
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      <div className="md:col-span-2 bg-[var(--card-bg)] border border-[var(--color-border)] p-6 rounded-2xl">
        {/* Main interactive data widget */}
      </div>
      <div className="bg-[var(--card-bg)] border border-[var(--color-border)] p-6 rounded-2xl">
        {/* Supporting analytical metric */}
      </div>
    </div>
    ```

### B. Split-Screen Editor (Master-Detail Workspace)
*   **Aesthetic Principle:** Splits the screen into high-density listing and wide live-preview panels, facilitating quick editing and real-time visualization without layout jumping.
*   **Constraint:** Cột hiển thị danh sách chiếm 30% - 40% màn hình, cột biên tập chiếm 60% - 70%. Phân tách bằng đường viền thẳng đứng siêu mảnh. Không dùng bóng đổ đè lớp (overlay shadow), chỉ dùng phân tách phẳng.
*   **Tailwind/CSS blueprint:**
    ```tsx
    <div className="flex h-screen overflow-hidden">
      <aside className="w-1/3 border-r border-[var(--color-border)] overflow-y-auto p-6">
        {/* High-density list */}
      </aside>
      <main className="flex-1 overflow-y-auto p-8 bg-[var(--color-bg-tint)]">
        {/* Detailed editor and preview */}
      </main>
    </div>
    ```

### C. Zen Workspace (Focus Mode Layout)
*   **Aesthetic Principle:** Extreme minimalism to focus user attention on content creation (e.g., editing a single post).
*   **Constraint:** Hides sidebar navigation and secondary widgets entirely. Center the document container at exactly `65ch - 75ch` line-width. Use clean typography and keep interactive formatting tools floating on hover.

---

## 2. Table & Data Grid Standards (Quy chuẩn Bảng dữ liệu)

B2B AI Slop often relies on heavy, cluttered Excel-style borders. Clean tables are essential to premium UI:

1.  **No Vertical Borders:** Avoid vertical lines entirely. Use horizontal dividers only.
2.  **Ultra-thin Borders:** Horizontal dividers must use a thickness of exactly `0.5px` (or `border-[var(--color-border)]/30` with `10%` opacity).
3.  **Monospace Headers:** Column headers must use a monospace font (`var(--font-mono)`), tiny sizing (`text-[10px]` or `text-xs`), uppercase lettering, and wide spacing (`tracking-widest` or `tracking-wider`).
4.  **Hover State Fade:** Rows should have an extremely smooth background highlight transition on hover (`transition-colors duration-200`) using low-opacity brand tints (`bg-primary/[0.03]` or `bg-[var(--color-border)]/20`), while nearby rows slightly dim to focus visual attention.
5.  **Actions on Hover:** Do not display primary editing/deleting action buttons (like generic edit pencil and trash bin icons) constantly on every row. Hide action toolbars by default; reveal them inline only when hovering over the specific row.

---

## 3. Form & Input Design Standards (Quy chuẩn Form nhập liệu)

To avoid boring, static box inputs that scream AI generation:

*   **Bottom Border Only (Editorial/Minimal):** For high-end creative SaaS platforms, use an input format featuring only a bottom border (`border-b border-t-0 border-l-0 border-r-0 rounded-none`).
*   **Floating Labels:** Nhãn (label) tự động dịch chuyển nhỏ lại và đổi màu sang màu thương hiệu khi input được focus.
*   **Input Spotlight Follow:** When an input receives focus, apply a subtle, wide radial glow or transition the border color using OKLCH color spaces. Avoid high-opacity primary glows.
    ```tsx
    <div className="relative group">
      <input 
        type="text" 
        className="w-full bg-transparent border-b border-[var(--color-border)] focus:border-[var(--color-accent)] py-3 transition-colors duration-300 outline-none"
        placeholder=" "
      />
      <label className="absolute left-0 top-3 text-[var(--color-muted)] transition-all duration-300 pointer-events-none group-focus-within:-top-3 group-focus-within:text-xs group-focus-within:text-[var(--color-accent)]">
        Post Title
      </label>
    </div>
    ```

---

## 4. Shimmer Loading & Empty States (Quy chuẩn Trạng thái tải)

Sloppy loading states break the illusion of high performance. Premium UIs enforce:

*   **Skeletal Shimmer Breathing Rate:** Loading skeletons must pulse extremely slowly to fit a biological breathing rhythm. Set animation duration for the shimmer wave to **`2.5s - 3s`**. Fast flashing skeletons are strictly prohibited.
*   **OKLCH Low Lightness Contrast:** The gradient wave of the skeleton must use values extremely close to the base skeleton gray (e.g., base `L=0.92`, shimmer peak `L=0.95`). Keep chroma at `0` or minimal brand tint.
*   **Precision Skeleton matching:** Skeletons must match the exact height, line measure, and rounding of the elements they replace (do not use generic long gray bars for short headers).
