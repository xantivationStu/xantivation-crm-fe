#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Curated high-quality seed palettes from premium designs
const SEEDS = [
  { id: "seed-oxblood", name: "Oxblood Leather", oklch: [0.360, 0.137, 0.0], mood: "Classic, elegant, deep artistic value" },
  { id: "seed-vermillion", name: "Sicilian Vermillion", oklch: [0.550, 0.180, 20.0], mood: "Warm, vibrant, dynamic Italian energy" },
  { id: "seed-terracotta", name: "Tuscan Terracotta", oklch: [0.652, 0.229, 34.8], mood: "Handcrafted, rustic ceramics, natural warmth" },
  { id: "seed-gold", name: "Editorial Gold", oklch: [0.691, 0.146, 74.6], mood: "Premium editorial, refined, Swiss minimalist" },
  { id: "seed-olive", name: "Mediterranean Olive", oklch: [0.350, 0.075, 110.0], mood: "Botanical, organic, peaceful and deep" },
  { id: "seed-moss", name: "Saihō-ji Moss", oklch: [0.550, 0.145, 150.0], mood: "Lichen moss, quiet, Zen meditation" },
  { id: "seed-teal", name: "Pacific Patina", oklch: [0.750, 0.080, 170.0], mood: "Sea glass, patina copper, clean tech (Climate-tech)" },
  { id: "seed-indigo", name: "Linear Indigo", oklch: [0.420, 0.161, 260.0], mood: "Technical utilities, maximum focus, engineering precision" },
  { id: "seed-plum", name: "Figma Plum", oklch: [0.500, 0.200, 340.0], mood: "Creative, modern design, smart and playful" },
  { id: "seed-rose", name: "Fintech Rose", oklch: [0.420, 0.163, 350.0], mood: "Editorial fashion, feminine, elegant minimalist" }
];

// --- MATHEMATICAL CONVERSION: OKLCH -> OKLAB -> sRGB -> HEX ---
function oklchToRgb(L, C, h) {
  const hRad = (h * Math.PI) / 180;
  const a = C * Math.cos(hRad);
  const b = C * Math.sin(hRad);

  // OKLAB to LMS (non-linear)
  const l = L + 0.3963377774 * a + 0.2158037573 * b;
  const m = L - 0.1055613458 * a - 0.0638541728 * b;
  const s = L - 0.0894841775 * a - 1.2914855480 * b;

  // LMS linear
  const l_ = l * l * l;
  const m_ = m * m * m;
  const s_ = s * s * s;

  // LMS to linear sRGB
  let r = +4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_;
  let g = -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_;
  let b_channel = -0.0041960863 * l_ - 0.7034186147 * m_ + 1.7076147010 * s_;

  // Gamma correction to sRGB
  const f = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055);
  
  r = Math.min(255, Math.max(0, Math.round(f(r) * 255)));
  g = Math.min(255, Math.max(0, Math.round(f(g) * 255)));
  b_channel = Math.min(255, Math.max(0, Math.round(f(b_channel) * 255)));

  return [r, g, b_channel];
}

function rgbToHex(r, g, b) {
  const hex = (c) => c.toString(16).padStart(2, '0');
  return `#${hex(r)}${hex(g)}${hex(b)}`;
}

function oklchToHex(L, C, h) {
  const [r, g, b] = oklchToRgb(L, C, h);
  return rgbToHex(r, g, b);
}

// --- GENERATE PRESET JSON COMPLIANT WITH NEXT.JS/TAILWIND ---
function generatePreset(seed, name) {
  const [sL, sC, sH] = seed.oklch;

  // 1. Create hue-tinted neutrals with very low saturation based on seed hue
  const bgLight = oklchToHex(0.98, 0.006, sH);
  const cardLight = oklchToHex(0.995, 0.003, sH);
  const borderLight = oklchToHex(0.91, 0.008, sH);
  const textLight = oklchToHex(0.15, 0.015, sH);
  const textLightMuted = oklchToHex(0.45, 0.01, sH);

  const bgDark = oklchToHex(0.09, 0.012, sH);
  const cardDark = oklchToHex(0.12, 0.015, sH);
  const borderDark = oklchToHex(0.22, 0.015, sH);
  const textDark = oklchToHex(0.92, 0.008, sH);
  const textDarkMuted = oklchToHex(0.65, 0.01, sH);

  // 2. Adjust primary color to ensure proper contrast
  const primaryLight = oklchToHex(Math.max(0.35, Math.min(0.6, sL)), sC, sH);
  const primaryDark = oklchToHex(Math.max(0.6, Math.min(0.85, sL)), sC, sH);

  // 3. Default typography pair (Display Serif + Body Sans)
  let fonts = {
    sans: "Inter, sans-serif",
    serif: "Lora, serif",
    mono: "JetBrains Mono, monospace"
  };
  
  // For gold/ochre or olive styles -> prefer classic Playfair Display / Lora serif fonts
  if (sH > 30 && sH < 120) {
    fonts.serif = "Playfair Display, serif";
  } else if (sH >= 240 && sH <= 280) {
    // For indigo/blue styles -> prefer engineer-minimalist Geist Sans/Mono
    fonts.sans = "Geist Sans, sans-serif";
    fonts.mono = "Geist Mono, monospace";
  }

  return {
    id: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    name: name,
    description: `Automatically generated palette based on seed: ${seed.name}. Mood: ${seed.mood}`,
    fonts: fonts,
    radius: "0.5rem",
    light: {
      "background": bgLight,
      "foreground": textLight,
      "card": cardLight,
      "card-foreground": textLight,
      "popover": cardLight,
      "popover-foreground": textLight,
      "primary": primaryLight,
      "primary-foreground": "#ffffff",
      "secondary": oklchToHex(0.94, 0.01, sH),
      "secondary-foreground": textLight,
      "muted": oklchToHex(0.95, 0.005, sH),
      "muted-foreground": textLightMuted,
      "accent": oklchToHex(0.92, 0.02, sH),
      "accent-foreground": primaryLight,
      "destructive": "#ef4444",
      "destructive-foreground": "#ffffff",
      "border": borderLight,
      "input": borderLight,
      "ring": primaryLight
    },
    dark: {
      "background": bgDark,
      "foreground": textDark,
      "card": cardDark,
      "card-foreground": textDark,
      "popover": cardDark,
      "popover-foreground": textDark,
      "primary": primaryDark,
      "primary-foreground": bgDark,
      "secondary": oklchToHex(0.18, 0.02, sH),
      "secondary-foreground": textDark,
      "muted": oklchToHex(0.15, 0.015, sH),
      "muted-foreground": textDarkMuted,
      "accent": oklchToHex(0.2, 0.03, sH),
      "accent-foreground": primaryDark,
      "destructive": "#f87171",
      "destructive-foreground": bgDark,
      "border": borderDark,
      "input": borderDark,
      "ring": primaryDark
    }
  };
}

// --- MAIN CLI RUNNER ---
function main() {
  const args = process.argv.slice(2);
  let seed = null;
  let customHex = null;

  // Read CLI arguments
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--id' && args[i + 1]) {
      seed = SEEDS.find(s => s.id === args[i + 1]);
    } else if (args[i] === '--hex' && args[i + 1]) {
      customHex = args[i + 1];
    }
  }

  // If none specified, select a random seed
  if (!seed && !customHex) {
    const randomIdx = crypto.randomInt(0, SEEDS.length);
    seed = SEEDS[randomIdx];
  }

  let presetName = "";
  let generatedData = null;

  if (customHex) {
    // Custom HEX case: fallback to simulated OKLCH (simplified simulation for demo)
    console.log(`Custom HEX input: ${customHex}. Simulating OKLCH...`);
    // Use custom HEX as primary, other colors fallback to gray scale
    presetName = "Custom-Brand";
    seed = {
      name: "Custom Hex Seed",
      oklch: [0.55, 0.15, 240], // Default to blue if calculation is too simple
      mood: "Custom brand color from HEX"
    };
    generatedData = generatePreset(seed, presetName);
    generatedData.light.primary = customHex;
    generatedData.dark.primary = customHex;
  } else {
    console.log(`Using seed: ${seed.name}`);
    console.log(`Mood: ${seed.mood}`);
    presetName = seed.name.replace(/\s+/g, "");
    generatedData = generatePreset(seed, presetName);
  }

  const outputFilename = `${generatedData.id}.json`;
  const outputPath = path.join(__dirname, '..', 'color-presets', outputFilename);

  fs.writeFileSync(outputPath, JSON.stringify(generatedData, null, 2), 'utf8');
  console.log(`SUCCESS: Color preset successfully generated at: .agents/skills/color-presets/${outputFilename}`);
}

main();
