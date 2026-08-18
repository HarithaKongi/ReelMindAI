const HYPE_PATTERNS = [
  /\b\d+\s+ai\s+tools\b/i,
  /\bwill get you a job\b/i,
  /\bbecome an?\s+.+\s+in\s+\d+\s+days?\b/i,
  /\bguaranteed\b/i,
  /\b\d+\s+lpa\b/i,
  /\bovernight\b/i,
  /\bone (skill|trick)\b/i,
  /\bget rich\b/i,
]

const KEYWORD_TRAP_PATTERNS = [
  /^java$/i,
  /^python$/i,
  /^javascript$/i,
  /^react$/i,
  /^ai tools?$/i,
  /^machine learning$/i,
]

export function isHypeContent(text) {
  if (!text || typeof text !== 'string') return false
  return HYPE_PATTERNS.some((pattern) => pattern.test(text))
}

export function isKeywordTrapInterest(interest) {
  if (!interest || typeof interest !== 'string') return true
  const trimmed = interest.trim()
  if (KEYWORD_TRAP_PATTERNS.some((pattern) => pattern.test(trimmed))) return true
  if (trimmed.split(/\s+/).length <= 2 && !/\b(career|engineering|security|development|learning)\b/i.test(trimmed)) {
    return true
  }
  return false
}
