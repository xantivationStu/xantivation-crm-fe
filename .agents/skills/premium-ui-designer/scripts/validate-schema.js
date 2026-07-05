#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Paths to schema and sections directory
const schemaPath = path.join(__dirname, '..', '_schema.json');
const sectionsDir = path.join(__dirname, '..', 'sections');

// Helper function to check basic data types
function checkType(value, expectedType, pathStr) {
  if (expectedType === 'array') {
    if (!Array.isArray(value)) {
      throw new Error(`[SCHEMA ERROR] Field "${pathStr}" must be an array, got "${typeof value}".`);
    }
  } else if (expectedType === 'null') {
    if (value !== null) {
      throw new Error(`[SCHEMA ERROR] Field "${pathStr}" must be null.`);
    }
  } else {
    if (typeof value !== expectedType || value === null) {
      throw new Error(`[SCHEMA ERROR] Field "${pathStr}" must be of type ${expectedType}, got "${value === null ? 'null' : typeof value}".`);
    }
  }
}

// Robust manual schema validator for _schema.json draft-07
function validateSection(data, schema, filename) {
  const prefix = `${filename}`;

  // 1. Check required fields at the root
  if (schema.required) {
    for (const req of schema.required) {
      if (!(req in data)) {
        throw new Error(`[SCHEMA ERROR] "${prefix}" is missing required field "${req}".`);
      }
    }
  }

  // 2. Validate root fields
  for (const key in data) {
    if (!schema.properties[key]) {
      // Ignore fields not declared in the schema or warn
      continue;
    }
    const propSchema = schema.properties[key];
    const val = data[key];

    // Check type
    if (propSchema.type) {
      if (Array.isArray(propSchema.type)) {
        // Support union types (e.g. ["array", "null"])
        let ok = false;
        for (const t of propSchema.type) {
          try {
            checkType(val, t, key);
            ok = true;
            break;
          } catch (e) {
            // continue trying
          }
        }
        if (!ok) {
          throw new Error(`[SCHEMA ERROR] "${prefix}" -> field "${key}" should be one of types [${propSchema.type.join(', ')}], got "${typeof val}".`);
        }
      } else {
        checkType(val, propSchema.type, key);
      }
    }

    // Check enum
    if (propSchema.enum && !propSchema.enum.includes(val)) {
      throw new Error(`[SCHEMA ERROR] "${prefix}" -> field "${key}" has invalid value "${val}". Must be one of: [${propSchema.enum.join(', ')}].`);
    }

    // Validate nested arrays / objects
    if (key === 'content' && val.slots) {
      checkType(val.slots, 'array', 'content.slots');
      val.slots.forEach((slot, idx) => {
        const slotPath = `content.slots[${idx}]`;
        if (typeof slot !== 'object' || slot === null) {
          throw new Error(`[SCHEMA ERROR] "${prefix}" -> ${slotPath} must be an object.`);
        }
        if (!slot.name || typeof slot.name !== 'string') {
          throw new Error(`[SCHEMA ERROR] "${prefix}" -> ${slotPath} is missing required string "name".`);
        }
        if (typeof slot.required !== 'boolean') {
          throw new Error(`[SCHEMA ERROR] "${prefix}" -> ${slotPath} is missing required boolean "required".`);
        }
        const validTypes = ["text", "rich-text", "image", "video", "array", "component", "boolean", "select"];
        if (!validTypes.includes(slot.type)) {
          throw new Error(`[SCHEMA ERROR] "${prefix}" -> ${slotPath}.type is invalid. Got "${slot.type}". Must be one of: [${validTypes.join(', ')}].`);
        }
      });
    }

    if (key === 'layout_variants') {
      checkType(val, 'array', 'layout_variants');
      val.forEach((variant, idx) => {
        const varPath = `layout_variants[${idx}]`;
        if (typeof variant !== 'object' || variant === null) {
          throw new Error(`[SCHEMA ERROR] "${prefix}" -> ${varPath} must be an object.`);
        }
        
        // Check required fields in variant
        const reqVarFields = ["id", "name", "description"];
        for (const reqF of reqVarFields) {
          if (!(reqF in variant)) {
            throw new Error(`[SCHEMA ERROR] "${prefix}" -> ${varPath} is missing required variant field "${reqF}".`);
          }
        }

        // Validate visual_specs (optional)
        if ('visual_specs' in variant) {
          const specPath = `${varPath}.visual_specs`;
          const visualSpecs = variant.visual_specs;
          checkType(visualSpecs, 'object', specPath);
          const reqSpecs = ["typography", "spacing", "colors", "layout"];
          for (const reqS of reqSpecs) {
            if (!(reqS in visualSpecs) || typeof visualSpecs[reqS] !== 'string') {
              throw new Error(`[SCHEMA ERROR] "${prefix}" -> ${specPath}.${reqS} must be a string.`);
            }
          }
        }

        // Validate code_blueprint (optional)
        if ('code_blueprint' in variant) {
          const blueprintPath = `${varPath}.code_blueprint`;
          const codeBlueprint = variant.code_blueprint;
          checkType(codeBlueprint, 'object', blueprintPath);
          const optBlueprints = ["gsap_timeline", "scroll_trigger"];
          for (const optB of optBlueprints) {
            if (optB in codeBlueprint && typeof codeBlueprint[optB] !== 'string') {
              throw new Error(`[SCHEMA ERROR] "${prefix}" -> ${blueprintPath}.${optB} must be a string.`);
            }
          }
        }

        // Validate anti_patterns (optional)
        if ('anti_patterns' in variant) {
          const antiPath = `${varPath}.anti_patterns`;
          checkType(variant.anti_patterns, 'array', antiPath);
          variant.anti_patterns.forEach((ap, apIdx) => {
            if (typeof ap !== 'string') {
              throw new Error(`[SCHEMA ERROR] "${prefix}" -> ${antiPath}[${apIdx}] must be a string.`);
            }
          });
        }
      });
    }

    if (key === 'flow') {
      checkType(val, 'object', 'flow');
      // validate follows
      if ('follows' in val && val.follows !== null) {
        checkType(val.follows, 'array', 'flow.follows');
        val.follows.forEach((f, fIdx) => {
          if (typeof f !== 'string') {
            throw new Error(`[SCHEMA ERROR] "${prefix}" -> flow.follows[${fIdx}] must be a string.`);
          }
        });
      }
      // validate recommended_next
      if ('recommended_next' in val) {
        checkType(val.recommended_next, 'array', 'flow.recommended_next');
        val.recommended_next.forEach((rn, rnIdx) => {
          if (typeof rn !== 'string') {
            throw new Error(`[SCHEMA ERROR] "${prefix}" -> flow.recommended_next[${rnIdx}] must be a string.`);
          }
        });
      }
    }
    
    if (key === 'tech') {
      checkType(val, 'object', 'tech');
      if (val.animation_lib && !["framer-motion", "gsap", "css-only", "none"].includes(val.animation_lib)) {
        throw new Error(`[SCHEMA ERROR] "${prefix}" -> tech.animation_lib must be one of: framer-motion, gsap, css-only, none.`);
      }
      if (val.dependencies) {
        checkType(val.dependencies, 'array', 'tech.dependencies');
      }
    }
  }
}

function main() {
  console.log('Loading schema from:', schemaPath);
  let schema;
  try {
    schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
  } catch (err) {
    console.error('Failed to read or parse schema file:', err.message);
    process.exit(1);
  }

  if (!fs.existsSync(sectionsDir)) {
    console.error(`Sections directory not found at: ${sectionsDir}`);
    process.exit(1);
  }

  const subdirs = fs.readdirSync(sectionsDir).filter(f => {
    return fs.statSync(path.join(sectionsDir, f)).isDirectory();
  });

  console.log(`Found ${subdirs.length} section directories to validate...\n`);
  let errorCount = 0;

  subdirs.forEach(dir => {
    const defPath = path.join(sectionsDir, dir, 'definition.json');
    if (!fs.existsSync(defPath)) {
      console.log(`[!] Warning: Skipping directory "${dir}" because it does not contain definition.json.`);
      return;
    }

    try {
      const data = JSON.parse(fs.readFileSync(defPath, 'utf8'));
      validateSection(data, schema, `${dir}/definition.json`);
      console.log(`[✓] PASS: .agents/skills/sections/${dir}/definition.json is valid.`);
    } catch (err) {
      console.error(`[✗] FAIL: Error in .agents/skills/sections/${dir}/definition.json`);
      console.error(`    -> ${err.message}\n`);
      errorCount++;
    }
  });

  if (errorCount > 0) {
    console.error(`\n[FAILED] Detected ${errorCount} schema validation error(s).`);
    process.exit(1);
  } else {
    console.log('\n[SUCCESS] All section definitions match the schema!');
    process.exit(0);
  }
}

main();
