import { finding } from './findings.mjs';
import { applyInlineIgnores } from './inline-ignores.mjs';

function stripHtmlToText(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ');
}

export const REGEX_MATCHERS = [
  {
    id: 'side-stripe-border',
    test: (line) => {
      return /border-[lr]-(?:4|8|16)/.test(line) && /border-(?:[a-z]+)-\d+/.test(line);
    }
  },
  {
    id: 'gradient-text',
    test: (line) => {
      if (/(?:h1|h2|title|hero-title|highlight|gradient-highlight)/.test(line)) return false;
      return /bg-clip-text/.test(line) && /text-transparent/.test(line);
    }
  },
  {
    id: 'glassmorphism-abuse',
    test: (line) => {
      return /backdrop-blur/.test(line) && !/(?:absolute|fixed|sticky|z-\d+|popover|dropdown|tooltip|modal|nav)/.test(line);
    }
  },
  {
    id: 'hero-metric-template',
    test: (line) => {
      return /(?:99%|10x|24\/7|100\+)/.test(line) && /text-(?:5xl|6xl|7xl|8xl)/.test(line);
    }
  },
  {
    id: 'tracked-uppercase-eyebrows',
    test: (line) => {
      return /uppercase/.test(line) && /tracking-(?:wider|widest)/.test(line);
    }
  },
  {
    id: 'sequential-number-prefixes',
    test: (line) => {
      return /["']0[1-9]["']/.test(line) && /<span|className/.test(line);
    }
  },
  {
    id: 'text-overflow',
    test: (line) => {
      return /text-ellipsis/.test(line) && !/overflow-hidden/.test(line);
    }
  },
  {
    id: 'ghost-cards',
    test: (line) => {
      return /border/.test(line) && /shadow-(?:lg|xl|2xl)/.test(line);
    }
  },
  {
    id: 'over-rounding',
    test: (line) => {
      if (/(?:CustomTabContainer|spotlight|clip-path|folder-tab|CustomClipMaskImage)/.test(line)) return false;
      // Relax over-rounding if container has spacious padding (e.g. p-8, py-12 or higher)
      if (/(?:p|py)-(?:8|10|12|16|20|24|32)\b/.test(line)) return false;
      return /rounded-(?:3xl|4xl|5xl)/.test(line) || /rounded-\[(?:2[4-9]|[3-9]\d)px\]/.test(line);
    }
  },
  {
    id: 'sketchy-doodle-svgs',
    test: (line) => {
      if (/(?:DynamicScrollPath|animate-flow|energy-packet|SketchyWaveDivider|pencil-draft|KineticOrnaments|compassRef|ringRef)/.test(line)) return false;
      return /stroke-dasharray/.test(line) && /<path/.test(line);
    }
  },
  {
    id: 'stripe-backgrounds',
    test: (line) => {
      return /bg-\[linear-gradient\(45deg/.test(line) && /repeating/.test(line);
    }
  },
  {
    id: 'unresponsive-negative-margins',
    test: (line) => {
      return /(?:\s|^|['"])-(?:mt|mb|my|m|top|bottom|left|right)-(?:8|9|[1-9]\d+)/.test(line) && !/(?:md|lg|xl|sm):-/.test(line);
    }
  },
  {
    id: 'low-contrast-typography',
    test: (line) => {
      return /(?:text-muted(?!-foreground)|text-\[var\(--muted\)\]|(?<![a-zA-Z-])color:\s*var\(--muted\)(?!-foreground))/.test(line);
    }
  },
  {
    id: 'mobile-mascot-clipping',
    test: (line) => {
      const hasMascot = /(?:mascot|peeker|capybara)/i.test(line);
      const hasNegOffset = /(?:-[xy]-|left-|right-)(?:1[2-9]|[2-9]\d|48px)/.test(line);
      const hasParentRotate = /rotate-\d+.*?:mascot|peeker|capybara-parent/.test(line);
      return hasMascot && (hasNegOffset || hasParentRotate);
    }
  },
  {
    id: 'overflow-shadow-clipping',
    test: (line) => {
      const isScroll = /overflow-x-(?:auto|scroll)/.test(line) || /overflow-x:\s*(?:auto|scroll)/.test(line);
      const hasPadding = /p[yb]-[1-9]|p[tb]-[1-9]|padding(?:-top|-bottom)?:\s*\d/.test(line);
      return isScroll && !hasPadding;
    }
  },
  {
    id: 'display-letter-spacing-cramping',
    test: (line) => {
      // If it uses expressive fonts or large display text, allow tighter letter-spacing down to -0.06em
      const isExpressiveLarge = /(?:Syne|Clash|Aeonik)/i.test(line) || /\btext-(?:6xl|7xl|8xl|9xl)\b/i.test(line);
      const tightLimit = isExpressiveLarge ? 6 : 4;
      
      const match = line.match(/(?:tracking-\[-0\.0([4-9])em\]|letter-spacing\s*:\s*-0\.0([4-9])em|letterSpacing\s*:\s*["']-0\.0([4-9])em['"])/i) ||
                    line.match(/(?:tracking-\[-0\.([1-9]\d+)em\]|letter-spacing\s*:\s*-0\.([1-9]\d+)em|letterSpacing\s*:\s*["']-0\.([1-9]\d+)em['"])/i);
      if (!match) return false;
      
      const valStr = match[1] || match[2] || match[3];
      const val = valStr.length === 1 ? parseInt(valStr) : parseInt(valStr);
      return val > tightLimit;
    }
  },
  {
    id: 'meta-criticism-copy',
    test: (line) => {
      return /(?:lorem ipsum|placeholder text|insert text|mock text|temp text)/i.test(line);
    }
  },
  {
    id: 'generic-alt-text',
    test: (line) => {
      return /alt=["'](?:image|icon|logo|placeholder)["']/i.test(line);
    }
  },
  {
    id: 'system-emoji-icons',
    test: (line) => {
      const emojiRegex = /[\u{1F300}-\u{1F6FF}]|[\u{1F900}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;
      return emojiRegex.test(line);
    }
  },
  // --- New rules 23-31 ---
  {
    id: 'raw-100vh',
    test: (line) => {
      return (/\bh-screen\b/.test(line) || /height:\s*100vh/.test(line)) && !/\b(?:min-h-|dvh|svh|lvh)\b/.test(line);
    }
  },
  {
    id: 'cliche-device-mockup',
    test: (line) => {
      return /(?:macbook|iphone|device)-mockup/i.test(line) || /(?:window-dots|red-dot|yellow-dot|green-dot|window-controls)/i.test(line);
    }
  },
  {
    id: 'sparkle-dingbat-abuse',
    test: (line) => {
      const count = (line.match(/[✦✶✧]/g) || []).length;
      return count >= 3;
    }
  },
  {
    id: 'saturated-glow',
    test: (line) => {
      return /shadow-(?:primary|accent|secondary)\b/.test(line) && /bg-opacity-|bg-[a-z]+\/(?:[2-9]\d|1[6-9])/.test(line);
    }
  },
  {
    id: 'centered-long-text',
    test: (line) => {
      // Look for text-center on a paragraph or description that has a long string
      if (!/text-center/i.test(line)) return false;
      const m = line.match(/>([^<]{120,})</);
      return !!m;
    }
  },
  {
    id: 'oversized-entrance',
    test: (line) => {
      return /(?:y|translateY)\s*:\s*(?:[5-9]\d|[1-9]\d{2,})\b/i.test(line) || /translateY\((?:[5-9]\d|[1-9]\d{2,})px\)/i.test(line);
    }
  },
  {
    id: 'colored-box-shadow',
    test: (line) => {
      return /shadow-(?:primary|secondary|accent)/.test(line) && !/shadow-(?:sm|md|lg|xl|2xl|none|inner)/.test(line);
    }
  }
];

export const REGEX_ANALYZERS = [
  // Rule 19: missing-prefers-reduced-motion
  (content, filePath) => {
    if (!/\.(css|scss|sass)$/.test(filePath)) return [];
    if (/(?:transition:|animation:|@keyframes)/.test(content) && !/prefers-reduced-motion/.test(content)) {
      return [finding('missing-prefers-reduced-motion', filePath, 'CSS transitions/animations defined without prefers-reduced-motion query', 1)];
    }
    return [];
  },
  // Rule 25: sparkle-dingbat-abuse (File-level counter)
  (content, filePath) => {
    const text = stripHtmlToText(content);
    const count = (text.match(/[✦✶✧]/g) || []).length;
    if (count > 6) {
      return [finding('sparkle-dingbat-abuse', filePath, `Found ${count} sparkles (✦, ✶, ✧) in file (max allowed: 6)`, 1)];
    }
    return [];
  },
  // Rule 27: cream-palette
  (content, filePath) => {
    // Look for common cream/beige colors
    const creamColors = /#(?:f5f0e8|faf7f2|fdfbf7|fbf9f5|fcfaf6|faf6f0)\b/i;
    const creamOklch = /oklch\(\s*0\.9[5-9]\s+0\.0[1-3]\s+(?:7|8|9)\d/i;
    if (creamColors.test(content) || creamOklch.test(content)) {
      return [finding('cream-palette', filePath, 'Warm cream/beige default background detected', 1)];
    }
    return [];
  },
  // Rule 31: icon-tile-stack
  (content, filePath) => {
    // Look for standard icon wrapper stacked above a heading in JSX
    const stackPattern = /className=["'][^"']*icon-wrapper[^"']*["'][\s\S]{1,150}<h[2-4]/i;
    if (stackPattern.test(content)) {
      return [finding('icon-tile-stack', filePath, 'Icon tile stacked directly above heading', 1)];
    }
    return [];
  }
];

export function detectText(content, filePath, options = {}) {
  const findings = [];
  const lines = content.split('\n');

  // Run matchers
  for (const matcher of REGEX_MATCHERS) {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (matcher.test(line)) {
        findings.push(finding(matcher.id, filePath, line.trim(), i + 1));
      }
    }
  }

  // Run analyzers
  for (const analyzer of REGEX_ANALYZERS) {
    findings.push(...analyzer(content, filePath));
  }

  // Deduplicate
  const deduped = [];
  for (const f of findings) {
    const isDupe = deduped.some(d =>
      d.antipattern === f.antipattern &&
      d.snippet === f.snippet &&
      Math.abs(d.line - f.line) <= 2
    );
    if (!isDupe) deduped.push(f);
  }

  // Apply inline ignores
  return options?.inlineIgnores === false ? deduped : applyInlineIgnores(deduped, content);
}
