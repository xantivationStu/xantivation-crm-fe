export const ANTIPATTERNS = [
  {
    id: 'side-stripe-border',
    category: 'slop',
    name: 'Side-stripe accent border',
    description: 'Thick colored border-left or border-right as decorative accent on cards. Use subtle borders or remove.',
    severity: 'warning'
  },
  {
    id: 'gradient-text',
    category: 'slop',
    name: 'Abusive gradient text',
    description: 'Abusive use of gradient text on body paragraphs or secondary headings is forbidden.',
    severity: 'warning'
  },
  {
    id: 'glassmorphism-abuse',
    category: 'slop',
    name: 'Glassmorphism abuse',
    description: 'Use backdrop-blur only for floating/hovering elements; do not abuse on ordinary cards.',
    severity: 'warning'
  },
  {
    id: 'hero-metric-template',
    category: 'slop',
    name: 'Cliché hero-metric template',
    description: 'Avoid structured templates: a giant statistic next to a boring small label repeated.',
    severity: 'warning'
  },
  {
    id: 'identical-card-grids',
    category: 'slop',
    name: 'Identical card grids',
    description: 'Avoid hardcoding multiple static card blocks with identical class structure.',
    severity: 'warning'
  },
  {
    id: 'tracked-uppercase-eyebrows',
    category: 'slop',
    name: 'Tracked uppercase eyebrows',
    description: 'Uppercase kickers/eyebrows with excessively wide tracking above headings are forbidden.',
    severity: 'warning'
  },
  {
    id: 'sequential-number-prefixes',
    category: 'slop',
    name: 'Sequential number prefixes',
    description: 'Hardcoded sequential numbering prefixes like "01", "02", "03" for card/section decoration are forbidden.',
    severity: 'warning'
  },
  {
    id: 'text-overflow',
    category: 'quality',
    name: 'Uncontrolled text overflow',
    description: 'Text overflow or clipping is forbidden (text-ellipsis must be accompanied by overflow-hidden and whitespace-nowrap).',
    severity: 'warning'
  },
  {
    id: 'ghost-cards',
    category: 'slop',
    name: 'Ghost cards and invisible borders',
    description: 'Combining a 1px border and large diffused box-shadow on the same card is forbidden.',
    severity: 'warning'
  },
  {
    id: 'over-rounding',
    category: 'slop',
    name: 'Over-rounding',
    description: 'Do not use excessive border-radius (> 16px) for standard cards or containers.',
    severity: 'warning'
  },
  {
    id: 'sketchy-doodle-svgs',
    category: 'slop',
    name: 'Sketchy/Doodle SVGs',
    description: 'Avoid amateurish/doodle style dashed vector drawings unless explicitly requested.',
    severity: 'warning'
  },
  {
    id: 'stripe-backgrounds',
    category: 'slop',
    name: 'Stripe backgrounds',
    description: 'Diagonal stripes as background decorations are forbidden.',
    severity: 'warning'
  },
  {
    id: 'unresponsive-negative-margins',
    category: 'quality',
    name: 'Unresponsive negative margins',
    description: 'Direct migration of large negative margins/offsets without responsive prefixes is forbidden.',
    severity: 'warning'
  },
  {
    id: 'low-contrast-typography',
    category: 'quality',
    name: 'Low contrast typography',
    description: 'Never use background-oriented variables (like var(--muted)) or classes (text-muted) for text colors.',
    severity: 'warning'
  },
  {
    id: 'blind-route-creation',
    category: 'quality',
    name: 'Blind route creation',
    description: 'Check compilation and hydration when adding new page routes or folder paths.',
    severity: 'warning'
  },
  {
    id: 'mobile-mascot-clipping',
    category: 'quality',
    name: 'Mobile mascot clipping',
    description: 'Do not position peeking mascots absolute to card edges with large negative translate/offsets on mobile.',
    severity: 'warning'
  },
  {
    id: 'overflow-shadow-clipping',
    category: 'quality',
    name: 'Overflow shadow clipping',
    description: 'Horizontal scroll containers must have vertical padding to prevent shadow clipping on hover.',
    severity: 'warning'
  },
  {
    id: 'display-letter-spacing-cramping',
    category: 'quality',
    name: 'Display letter-spacing cramping',
    description: 'Do not set letter-spacing below -0.04em on display headings/H1s.',
    severity: 'warning'
  },
  {
    id: 'missing-prefers-reduced-motion',
    category: 'quality',
    name: 'Missing prefers-reduced-motion',
    description: 'CSS files containing transition or animation properties must define media query for prefers-reduced-motion.',
    severity: 'warning'
  },
  {
    id: 'meta-criticism-copy',
    category: 'slop',
    name: 'Meta-criticism or placeholder copy',
    description: 'Do not use self-referential/ironic text, lorem ipsum, or placeholder copy.',
    severity: 'warning'
  },
  {
    id: 'generic-alt-text',
    category: 'quality',
    name: 'Generic alt text',
    description: 'Avoid vague alt attributes like "image", "icon", or "logo".',
    severity: 'warning'
  },
  {
    id: 'system-emoji-icons',
    category: 'slop',
    name: 'System emojis as icons',
    description: 'Do not use system emojis as UI icons or indicators. Use SVG or Lucide icons instead.',
    severity: 'warning'
  },
  {
    id: 'raw-100vh',
    category: 'quality',
    name: 'Raw 100vh on mobile',
    description: 'height: 100vh or h-screen causes Safari/Chrome mobile address bar to clip bottom content. Use min-h-[100dvh] or 100svh instead.',
    severity: 'warning'
  },
  {
    id: 'cliche-device-mockup',
    category: 'slop',
    name: 'Cliché CSS device mockup',
    description: 'Custom CSS MacBook/iPhone wrappers with colored dots look amateurish. Use borderless canvas or real screenshots.',
    severity: 'warning'
  },
  {
    id: 'sparkle-dingbat-abuse',
    category: 'slop',
    name: 'Sparkle/dingbat overuse',
    description: 'Overuse of ✦, ✶, or similar dingbats as bullet points or spacers. Use SVG icons or Lucide outlines.',
    severity: 'warning'
  },
  {
    id: 'saturated-glow',
    category: 'slop',
    name: 'Raw saturated glow',
    description: 'Bright colored box-shadow or bg-opacity glow on dark backgrounds. Use low-opacity (3-12%), wide-blur (>=80px) OKLCH color dispersion.',
    severity: 'warning'
  },
  {
    id: 'cream-palette',
    category: 'slop',
    name: 'Cream/beige default background',
    description: 'Warm cream/beige/sand page background is the saturated AI default. Choose a deliberate palette.',
    severity: 'warning'
  },
  {
    id: 'centered-long-text',
    category: 'quality',
    name: 'Center-aligned long description',
    description: 'Body text longer than ~3 lines set to text-center reduces readability. Left-align body copy.',
    severity: 'warning'
  },
  {
    id: 'oversized-entrance',
    category: 'quality',
    name: 'Oversized entrance animation offset',
    description: 'Slide entrance with translateY > 32px or y > 40 causes visible pop-in jank. Keep entrance offsets between 16-32px.',
    severity: 'warning'
  },
  {
    id: 'colored-box-shadow',
    category: 'slop',
    name: 'Saturated colored box-shadow',
    description: 'Box-shadow using saturated brand colors without sufficient blur/spread looks garish. Use neutral shadows.',
    severity: 'warning'
  },
  {
    id: 'icon-tile-stack',
    category: 'slop',
    name: 'Icon tile stacked above heading',
    description: 'Small rounded-square icon container above a heading is the universal AI feature-card template. Try side-by-side icon+heading.',
    severity: 'warning'
  }
];

export function getAntipattern(id) {
  return ANTIPATTERNS.find(ap => ap.id === id);
}

export function getRulesForCategory(category) {
  return ANTIPATTERNS.filter(ap => ap.category === category);
}
