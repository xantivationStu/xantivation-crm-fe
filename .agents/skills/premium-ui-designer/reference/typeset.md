# Typography Principles & Code Blueprints

This document guides the Agent on how to set up and optimize typography systems to meet Awwwards standards and integrate artistic text reveal effects.

---

## 1. High-End Typography Principles
- **Display Heading Letter-Spacing**: For extremely large display headings using bold or uppercase Sans-serif fonts, the letter-spacing floor must be `>= -0.04em`. Never set it smaller (e.g., `-0.05em` to `-0.08em`, which squeezes letters together and creates a claustrophobic feel).
- **Line Length Limit (Measure)**: Limit the width of prose/body text blocks to `65-75ch` to ensure the reader's eyes do not get fatigued when transitioning lines.
- **Text Wrap**: Always apply `text-wrap: balance` to h1-h3 headings to balance the words across lines. Use `text-wrap: pretty` for body text to avoid orphans (isolated single words at the end of a paragraph).
- **Font Pairing**: Pair fonts based on a strong axis of contrast (e.g., a luxurious classic Serif for display + a modern geometric Sans-serif for body). Avoid pairing two sans-serif fonts with nearly identical geometric structures.
- **Light on Dark Compensation**: Light text on a dark background appears visually thinner than dark text on a light background. Increase the `line-height` by `0.05 - 0.1` and slightly increase the `letter-spacing` (about `0.01 - 0.02em`) compared to default settings to compensate for the glow dilation (irradiation effect).

---

## 2. Dynamic Font Selection & Loading Process

To avoid sticking to a single default Sans-serif font for every project, the Agent **must** analyze the project archetype and load appropriate fonts using the following workflow:

### Step 1: Choose a Font Pair Based on Brand Archetype
Choose one of the five font pairings below (or similar customized equivalents) depending on the project's identity:

1. **Luxury / Classical / Editorial (Fashion, Art, Luxury Portfolio):**
   - **Display (Serif):** `Cormorant Garamond` or `Playfair Display` (Elegant, sophisticated, refined)
   - **Body (Sans-serif):** `Plus Jakarta Sans` or `Inter` (Minimalist, highly legible)
   - **Effect:** Sophisticated, artistic, Awwwards-level aesthetics.
2. **Modern / Tech / SaaS (DevTools, Tech Landing, App):**
   - **Display (Geometric Sans-serif):** `Syne` or `Outfit` (Bold, structural) or the project's internal font `Aeonik-bold`
   - **Body (Sans-serif):** `Inter` or `Plus Jakarta Sans`
   - **Effect:** Professional, modern, digital-native minimalism.
3. **Creative / Disruptive / Web3 (Web3, Creative Agency, Game):**
   - **Display (Experimental):** `Space Grotesk` or `Clash Display` or `Dune-one`
   - **Body (Sleek/Mono):** `Space Mono` or `Outfit`
   - **Effect:** Futuristic, high personality, high-tech vibes.
4. **Rustic / Crafted / Humanist (Organic, Cozy, Lifestyle):**
   - **Display (Warm Serif):** `Fraunces` or `Lora` (Warm, hand-crafted feel)
   - **Body (Sans-serif):** `Plus Jakarta Sans` or `Inter`
   - **Effect:** Intimate, warm, human-centric.
5. **Expressive / Bold / Rebellious (Brutalist, Cyberpunk, Punk-Rock, Retro Psychedelic):**
   - **Display (Expressive/Rebellious):**
     * *Fluid / Highly organic script styles:* `Pinyon Script`, `Great Vibes` (Creates free-flowing curves like graffiti or rebellious classical calligraphy).
     * *Brutalist / 3D / Structural breakdown:* `Syne` (specifically at Extra Bold/Heavy weights), `Oi` (Ultra-heavy slab), `Rampart One` (3D outline), `Rubik Glitch` (pixelated interference), `Danfo` (extruded lines), `Creepster` or `Rubik Beastly` (playful/monster vibes).
   - **Body (Ultra-simple Sans-serif / Monospace):** `Inter` or `Space Mono` to preserve readability.
   - **Effect:** Creates extremely strong visual anchors in large headers, asserting a unique brand personality.

> [!IMPORTANT]
> **Typography Balance Rule:**
> When using highly **expressive, curvy, or brutalist** display fonts, the **Body** font (standard paragraph text) must be extremely minimalist, clean, and highly readable (like `Inter` or `Space Mono`). Never use two expressive fonts in the same page, as it creates visual chaos and renders content unreadable.

### Step 2: Google Fonts Dynamic Import
Based on the actual pair chosen in Step 1, the Agent **must construct** the import URL from Google Fonts dynamically.
Add the `@import` rule at the very beginning of the main CSS file (e.g., `src/index.css` or `src/App.css`):

*Example import for Luxury / Editorial style:*
```css
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300..700;1,300..700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
```

### Step 3: Define CSS Custom Variables in `:root`
Declare font variables in the `:root` block of the main CSS file. The Agent **must update** font names in the variables `--font-display`, `--font-body`, and `--font-mono` to match the actual fonts chosen for the current project:

*Example font variables for Luxury / Editorial style:*
```css
:root {
  /* Define display and body fonts based on the selected brand archetype */
  --font-display: 'Cormorant Garamond', serif;
  --font-body: 'Plus Jakarta Sans', sans-serif;
  --font-mono: 'Space Mono', monospace; /* Loaded for code, labels, or numbers */
}
```

### Step 4: Use Font Variables in CSS & Tailwind
When writing React/CSS, **avoid** hardcoding specific font families. Instead, reference the CSS variables:
- In Vanilla CSS:
  ```css
  h1, h2, h3, .display-text {
    font-family: var(--font-display);
    font-weight: 700;
  }
  body, p, .body-text {
    font-family: var(--font-body);
  }
  code, .mono-label {
    font-family: var(--font-mono);
  }
  ```
- In Tailwind CSS, map these variables in the `tailwind.config.js` extend configuration:
  ```javascript
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      }
    }
  }
  ```
  Then use the classes: `font-display`, `font-body`, `font-mono`.

---

## 3. Code Blueprints

### A. SplitTextReveal (Word-by-Word Reveal on Scroll)
Renders words sliding up from beneath the baseline synchronized with scroll progress:
```jsx
import React, { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function SplitTextReveal({ text, className = "", highlightWords = [] }) {
  const containerRef = useRef(null);

  useGSAP(() => {
    const elements = containerRef.current.querySelectorAll(".split-element");
    gsap.fromTo(
      elements,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.03,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 92%",
          end: "top 70%",
          scrub: 0.3,
        },
      }
    );
  }, { scope: containerRef });

  const words = text.split(" ");
  
  return (
    <div ref={containerRef} className={className}>
      {words.map((word, index) => {
        const cleanWord = word.replace(/[^a-zA-Z0-9]/g, "");
        const isHighlight = highlightWords.includes(cleanWord);
        return (
          <span
            key={index}
            style={{ display: "inline-block", overflow: "hidden", paddingBottom: "0.1em" }}
            className="mr-2"
          >
            <span className={`split-element inline-block ${isHighlight ? "opacity-30" : ""}`}>
              {word}
            </span>
          </span>
        );
      })}
    </div>
  );
}
```

### B. LineReveal (Automated Line-by-Line Reveal)
Reveals text row-by-row, automatically calculating words per line on resize to prevent layout shifts. **Avoids descender clipping by not using overflow: hidden (animates opacity and a subtle vertical shift instead).**
```jsx
import React, { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function LineReveal({ text, className = "" }) {
  const containerRef = useRef(null);
  const [lines, setLines] = useState([]);

  useEffect(() => {
    const calculateLines = () => {
      if (!containerRef.current) return;
      const words = containerRef.current.querySelectorAll(".line-reveal-word");
      const lineMap = new Map();

      words.forEach((word) => {
        const top = word.offsetTop;
        if (!lineMap.has(top)) lineMap.set(top, []);
        lineMap.get(top).push(word);
      });

      const sortedTops = Array.from(lineMap.keys()).sort((a, b) => a - b);
      setLines(sortedTops.map((top) => lineMap.get(top)));
    };

    const timer = setTimeout(calculateLines, 150);
    window.addEventListener("resize", calculateLines);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", calculateLines);
    };
  }, [text]);

  useGSAP(() => {
    if (lines.length === 0) return;
    lines.forEach((lineWords) => {
      gsap.fromTo(
        lineWords,
        { y: "20px", opacity: 0 },
        {
          y: "0px",
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: lineWords[0],
            start: "top 95%",
            end: "top 80%",
            scrub: 1,
          },
        }
      );
    });
  }, { dependencies: [lines], scope: containerRef });

  return (
    <div ref={containerRef} className={className}>
      {text.split(" ").map((word, idx) => (
        <span
          key={idx}
          style={{ display: "inline-block", verticalAlign: "bottom" }}
          className="mr-2"
        >
          <span className="line-reveal-word inline-block will-change-transform">
            {word}
          </span>
        </span>
      ))}
    </div>
  );
}
```

### C. ScrambleText (Interactive HUD Decryption Text - Memory Safe)
```jsx
import React, { useState, useRef, useEffect } from "react";

export function ScrambleText({ text, duration = 800, className = "" }) {
  const [displayText, setDisplayText] = useState(text);
  const isScrambling = useRef(false);
  const rafRef = useRef(null);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$_&%+*=";

  useEffect(() => {
    // Cleanup active animation frame on component unmount
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const startScramble = () => {
    if (isScrambling.current) return;
    isScrambling.current = true;
    let start = null;

    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);

      const scrambled = text
        .split("")
        .map((char, index) => {
          if (char === " ") return " ";
          if (index / text.length < progress) {
            return char;
          }
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join("");

      setDisplayText(scrambled);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayText(text);
        isScrambling.current = false;
      }
    };
    rafRef.current = requestAnimationFrame(animate);
  };

  return (
    <span
      onMouseEnter={startScramble}
      className={`cursor-pointer inline-block ${className}`}
    >
      {displayText}
    </span>
  );
}
```
