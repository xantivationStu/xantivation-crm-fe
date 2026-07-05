#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', '..', '..', '..', 'src');

async function main() {
  const { detectText } = await import('./detector/detect-text.mjs');
  const { ANTIPATTERNS } = await import('./detector/registry.mjs');

  const args = process.argv.slice(2);
  const jsonMode = args.includes('--json');
  const fixSuggestions = args.includes('--fix-suggestions');

  console.log(`Scanning source directory: ${srcDir}`);
  if (!fs.existsSync(srcDir)) {
    console.error(`src directory does not exist at: ${srcDir}`);
    process.exit(1);
  }

  // Get files recursively
  function getFiles(dir, files_ = []) {
    if (!fs.existsSync(dir)) return files_;
    const files = fs.readdirSync(dir);
    for (const i in files) {
      const name = path.join(dir, files[i]);
      if (fs.statSync(name).isDirectory()) {
        if (!name.includes('node_modules') && !name.includes('.next')) {
          getFiles(name, files_);
        }
      } else {
        if (/\.(js|jsx|ts|tsx|css)$/.test(name)) {
          files_.push(name);
        }
      }
    }
    return files_;
  }

  const files = getFiles(srcDir);
  console.log(`Found ${files.length} source files to analyze...\n`);

  let allFindings = [];

  for (const filePath of files) {
    const content = fs.readFileSync(filePath, 'utf8');
    const relativePath = path.relative(srcDir, filePath);
    const fileFindings = detectText(content, relativePath);
    allFindings.push(...fileFindings);
  }

  if (jsonMode) {
    console.log(JSON.stringify(allFindings, null, 2));
    process.exit(0);
  }

  // Print text findings
  allFindings.forEach(finding => {
    console.warn(`[ warning ] ${finding.name} at: ${finding.file}:${finding.line}`);
    console.warn(`    -> ${finding.description}`);
    console.warn(`    -> Line: "${finding.snippet}"`);
    if (fixSuggestions) {
      const suggestion = getFixSuggestion(finding.antipattern);
      if (suggestion) {
        console.warn(`    -> Suggestion: ${suggestion}`);
      }
    }
    console.warn('');
  });

  // Print dynamic check for newly added routes (Rule 15 check)
  const routeDirs = fs.existsSync(path.join(srcDir, 'app')) ? fs.readdirSync(path.join(srcDir, 'app')) : [];
  if (routeDirs.length > 0) {
    console.log(`[RULE 15 REMINDER] Detected ${routeDirs.length} route folder(s) in App router. Make sure to run 'npm run build' or 'npm run dev' to verify that newly created routes compile successfully without style errors!`);
  }

  if (allFindings.length > 0) {
    console.log(`\n[SCAN COMPLETE] Detected ${allFindings.length} UI anti-pattern warning(s).`);
    console.log(`Recommendation: Please review the files above and refine the source code to achieve the highest aesthetic quality!`);
    process.exit(0);
  } else {
    console.log(`\n[SCAN COMPLETE] Excellent! No anti-pattern violations detected!`);
    process.exit(0);
  }
}

function getFixSuggestion(id) {
  const suggestions = {
    'side-stripe-border': 'Remove the border-l- or border-r- accent border. Use full subtle borders or spacing.',
    'gradient-text': 'Use a solid color instead of gradient text, or only keep it on primary Hero H1 titles.',
    'glassmorphism-abuse': 'Limit backdrop-blur to fixed/absolute navigation headers, dropdowns, or overlays.',
    'hero-metric-template': 'Design a custom layout instead of repeating statistic + small label blocks.',
    'identical-card-grids': 'Vary card structures, use Bento grids, or dynamically map elements with varying visual properties.',
    'tracked-uppercase-eyebrows': 'Reduce tracking or use standard/lowercase styling for eyebrow elements.',
    'sequential-number-prefixes': 'Only use sequential numbers for real ordered lists or processes.',
    'text-overflow': 'Add overflow-hidden and whitespace-nowrap alongside text-ellipsis.',
    'ghost-cards': 'Choose either a defined border or a soft shadow (blur <= 8px), never both on the same card.',
    'over-rounding': 'Limit card corner radius to 12px-16px.',
    'sketchy-doodle-svgs': 'Remove sketchy SVGs. Use standard vectors or clean Ghibli-tech dashes.',
    'stripe-backgrounds': 'Avoid diagonal stripes for background textures.',
    'unresponsive-negative-margins': 'Add responsive prefixes like md:-mt-12 to negative margins, or reset them on mobile.',
    'low-contrast-typography': 'Use text-specific variables like var(--muted-foreground) instead of background variables like var(--muted).',
    'blind-route-creation': 'Test the route by building the project before proceeding.',
    'mobile-mascot-clipping': 'Adjust mascot offsets using media queries on mobile or rotate the SVG itself instead of its parent.',
    'overflow-shadow-clipping': 'Add vertical padding (e.g. py-2) to the horizontal scroll container.',
    'display-letter-spacing-cramping': 'Keep letter-spacing on display H1s at or above -0.04em.',
    'missing-prefers-reduced-motion': 'Add a @media (prefers-reduced-motion: reduce) query for transitions and animations.',
    'meta-criticism-copy': 'Avoid self-referential copywriting; state the product value directly.',
    'generic-alt-text': 'Describe the image elements, mood, and context in the alt attribute.',
    'system-emoji-icons': 'Replace system unicode emojis with polished SVG/Lucide icons.',
    'raw-100vh': 'Use min-h-[100dvh] or 100svh instead of raw 100vh on mobile.',
    'cliche-device-mockup': 'Use borderless canvas views or actual screenshots instead of CSS browser/macOS device mockups.',
    'sparkle-dingbat-abuse': 'Limit sparkles to 6 per file and use standard SVGs for icons.',
    'saturated-glow': 'Use low-opacity (3-12%) and wide-blur (>=80px) colored shadows on dark backgrounds.',
    'cream-palette': 'Use deliberate brand neutral or off-white palettes instead of the generic cream/beige default.',
    'centered-long-text': 'Left-align paragraphs/descriptions that span more than 3 lines.',
    'oversized-entrance': 'Keep entrance animation translateY/y offsets between 16px and 32px.',
    'colored-box-shadow': 'Use neutral dark shadows or highly diffused low-opacity colored shadows.',
    'icon-tile-stack': 'Place the icon beside the heading or inline instead of stacking it inside a square block above.'
  };
  return suggestions[id] || null;
}

main().catch(err => {
  console.error('Fatal error running linter:', err);
  process.exit(1);
});
