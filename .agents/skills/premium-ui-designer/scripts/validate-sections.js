#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Paths to sections directory and source directory
const sectionsDir = path.join(__dirname, '..', 'sections');
const srcDir = path.join(__dirname, '..', '..', '..', '..', 'src');

// Map section ID to expected component file names in the project
const SECTION_TO_COMPONENT_MAPPING = {
  "navbar": ["Header.jsx", "Header.tsx", "Navbar.jsx", "Navbar.tsx"],
  "hero": ["Hero.jsx", "Hero.tsx", "DynamicHero.jsx", "DynamicHero.tsx"],
  "dynamic-hero": ["Hero.jsx", "Hero.tsx", "DynamicHero.jsx", "DynamicHero.tsx"],
  "marquee": ["Marquee.jsx", "Marquee.tsx", "LogoBar.jsx", "LogoBar.tsx"],
  "logo-bar": ["Marquee.jsx", "Marquee.tsx", "LogoBar.jsx", "LogoBar.tsx"],
  "features-grid": ["FeaturesGrid.jsx", "FeaturesGrid.tsx", "ServicesSection.jsx", "ServicesSection.tsx"],
  "how-it-works": ["HowItWorks.jsx", "HowItWorks.tsx", "Process.jsx", "Process.tsx"],
  "showcase": ["Showcase.jsx", "Showcase.tsx", "Portfolio.jsx", "Portfolio.tsx"],
  "stats-bar": ["StatsBar.jsx", "StatsBar.tsx", "TechStack.jsx", "TechStack.tsx"],
  "testimonials": ["Testimonials.jsx", "Testimonials.tsx"],
  "pricing": ["Pricing.jsx", "Pricing.tsx"],
  "blog": ["Blog.jsx", "Blog.tsx"],
  "faq": ["Faq.jsx", "Faq.tsx", "FAQ.jsx", "FAQ.tsx"],
  "cta-banner": ["CtaBanner.jsx", "CtaBanner.tsx", "CTA.jsx", "CTA.tsx", "CTASection.jsx", "CTASection.tsx"],
  "footer": ["Footer.jsx", "Footer.tsx"]
};

// Helper function to recursively search for files matching a list of filenames in a directory
function findComponentFile(dir, targetNames) {
  if (!fs.existsSync(dir)) return null;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      // Ignore node_modules and dot folders
      if (file !== 'node_modules' && !file.startsWith('.')) {
        const found = findComponentFile(fullPath, targetNames);
        if (found) return found;
      }
    } else {
      if (targetNames.includes(file)) {
        return fullPath;
      }
    }
  }
  return null;
}

function validateSectionComponent(sectionId, definition, filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let issues = [];

  // 1. Verify Layout Variants are referenced in JSX code
  if (definition.layout_variants && Array.isArray(definition.layout_variants)) {
    definition.layout_variants.forEach(variant => {
      // Check if variant.id string exists in the component source code
      const variantRegex = new RegExp(`['"\`]${variant.id}['"\`]`, 'i');
      if (!variantRegex.test(content) && !content.includes(variant.id)) {
        issues.push(`Layout variant "${variant.id}" is defined in definition.json but not referenced/implemented in the JSX component code.`);
      }
    });
  }

  // 2. Verify Content Slots (especially required ones) are referenced in JSX code
  if (definition.content && Array.isArray(definition.content.slots)) {
    definition.content.slots.forEach(slot => {
      // Check if slot name (e.g. eyebrow, section_title) is referenced in the component
      // (either destructured, accessed via object, or used as a key/variable)
      const slotRegex = new RegExp(`(?:\\b${slot.name}\\b|content\\.${slot.name})`);
      if (!slotRegex.test(content)) {
        const severity = slot.required ? "[ERROR]" : "[WARN]";
        issues.push(`${severity} Content slot "${slot.name}" (${slot.required ? 'required' : 'optional'}) is defined in definition.json but not referenced in the JSX component code.`);
      }
    });
  }

  return issues;
}

function main() {
  console.log(`=== STARTING SECTION TO JSX SYNTAX & FIELD VERIFICATION ===`);
  console.log(`Sections Directory: ${sectionsDir}`);
  console.log(`Source Code Directory: ${srcDir}\n`);

  if (!fs.existsSync(sectionsDir)) {
    console.error(`Error: Sections directory not found at: ${sectionsDir}`);
    process.exit(1);
  }

  const subdirs = fs.readdirSync(sectionsDir).filter(f => {
    return fs.statSync(path.join(sectionsDir, f)).isDirectory();
  });

  let totalErrors = 0;
  let totalWarnings = 0;

  subdirs.forEach(dir => {
    const defPath = path.join(sectionsDir, dir, 'definition.json');
    if (!fs.existsSync(defPath)) {
      return;
    }

    let definition;
    try {
      definition = JSON.parse(fs.readFileSync(defPath, 'utf8'));
    } catch (err) {
      console.error(`[✗] Failed to parse JSON for section "${dir}": ${err.message}`);
      totalErrors++;
      return;
    }

    const sectionId = definition.id || dir;
    const mappedNames = SECTION_TO_COMPONENT_MAPPING[sectionId];
    
    if (!mappedNames) {
      console.log(`[-] Info: No JSX component mapping defined for section type "${sectionId}". skipping JSX code check.`);
      return;
    }

    const componentPath = findComponentFile(srcDir, mappedNames);
    if (!componentPath) {
      console.log(`[?] Note: Mapped component file(s) [${mappedNames.join(', ')}] for section "${sectionId}" not found in src/. (Section not yet implemented).`);
      return;
    }

    const relativeComponentPath = path.relative(srcDir, componentPath);
    console.log(`[*] Checking section "${sectionId}" against [src/${relativeComponentPath}]...`);

    const issues = validateSectionComponent(sectionId, definition, componentPath);
    if (issues.length > 0) {
      issues.forEach(issue => {
        if (issue.includes('[ERROR]')) {
          console.error(`   [✗] ${issue}`);
          totalErrors++;
        } else {
          console.warn(`   [!] ${issue}`);
          totalWarnings++;
        }
      });
    } else {
      console.log(`   [✓] All defined layout variants and required slots are correctly implemented.`);
    }
  });

  console.log(`\n=== VERIFICATION SUMMARY ===`);
  console.log(`Total Errors: ${totalErrors}`);
  console.log(`Total Warnings: ${totalWarnings}`);

  if (totalErrors > 0) {
    console.error(`\n[FAILED] Section layout/slot verification failed with errors.`);
    process.exit(1);
  } else {
    console.log(`\n[SUCCESS] Section layout/slot verification completed successfully.`);
    process.exit(0);
  }
}

main();
