import { getAntipattern } from './registry.mjs';

export function getAP(id) {
  return getAntipattern(id);
}

export function finding(id, filePath, snippet, line = 0) {
  const ap = getAP(id);
  if (!ap) {
    throw new Error(`Antipattern ID "${id}" not found in registry.`);
  }
  return {
    antipattern: id,
    name: ap.name,
    description: ap.description,
    severity: ap.severity || 'warning',
    file: filePath,
    line,
    snippet
  };
}
