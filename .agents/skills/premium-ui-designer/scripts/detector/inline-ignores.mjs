const DIRECTIVE_RE = /slop-(disable-next-line|disable-line|disable)\b[ \t]*([^\n\r]*)/gi;
const TRAILING_CLOSER_RE = /\s*(?:\*\/\}?|--+>|\*\}|#\}|%>|\}\})\s*$/;

function normalizeRule(token) {
  return String(token || '').trim().toLowerCase();
}

function parseRuleList(remainder) {
  let text = String(remainder || '').replace(TRAILING_CLOSER_RE, '').trim();
  const reasonSep = text.match(/\s*(?:--+|:)\s*/);
  if (reasonSep) text = text.slice(0, reasonSep.index);
  const tokens = text.split(/[\s,]+/).map(normalizeRule).filter(Boolean);
  if (tokens.length === 0 || tokens.includes('*')) return ['*'];
  return tokens;
}

function addRules(set, rules) {
  for (const rule of rules) set.add(rule);
}

function getSet(map, key) {
  let set = map.get(key);
  if (!set) {
    set = new Set();
    map.set(key, set);
  }
  return set;
}

export function parseInlineIgnores(content) {
  const result = { file: new Set(), line: new Map(), nextLine: new Map() };
  const text = typeof content === 'string' ? content : '';
  if (!/slop-disable/i.test(text)) return result;

  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    DIRECTIVE_RE.lastIndex = 0;
    let m;
    while ((m = DIRECTIVE_RE.exec(lines[i])) !== null) {
      const variant = m[1].toLowerCase();
      const rules = parseRuleList(m[2]);
      if (variant === 'disable') {
        addRules(result.file, rules);
      } else if (variant === 'disable-line') {
        addRules(getSet(result.line, i + 1), rules);
      } else {
        addRules(getSet(result.nextLine, i + 2), rules);
      }
    }
  }
  return result;
}

function setMatches(set, rule) {
  return Boolean(set) && (set.has('*') || set.has(rule));
}

export function isInlineIgnored(finding, directives) {
  const rule = normalizeRule(finding && finding.antipattern);
  if (!rule) return false;
  if (setMatches(directives.file, rule)) return true;
  const line = Number(finding && finding.line) || 0;
  if (line > 0) {
    if (setMatches(directives.line.get(line), rule)) return true;
    if (setMatches(directives.nextLine.get(line), rule)) return true;
  }
  return false;
}

export function hasDirectives(directives) {
  return directives.file.size > 0 || directives.line.size > 0 || directives.nextLine.size > 0;
}

export function applyInlineIgnores(findings, content) {
  if (!Array.isArray(findings) || findings.length === 0) return findings;
  const directives = parseInlineIgnores(content);
  if (!hasDirectives(directives)) return findings;
  return findings.filter((finding) => !isInlineIgnored(finding, directives));
}
