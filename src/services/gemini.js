import { getFallbackResult } from './fallback'
import { isHypeContent, isKeywordTrapInterest } from './guards'
import { isRepetitiveRecommendation } from './inference'
import { passesQualityGate } from './qualityGate'

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0
}

function validateResult(parsed, profileId, reels) {
  const fallback = getFallbackResult(profileId)
  const evidenceSignals = Array.isArray(parsed.evidenceSignals)
    ? parsed.evidenceSignals
        .filter((item) => item && isNonEmptyString(item.label))
        .map((item) => ({ label: item.label.trim(), present: Boolean(item.present) }))
    : fallback.evidenceSignals

  const graphNodes = Array.isArray(parsed.graph?.nodes)
    ? parsed.graph.nodes.filter(isNonEmptyString).slice(0, 6)
    : fallback.graph.nodes

  const hype = parsed.hypeFilter && typeof parsed.hypeFilter === 'object' ? parsed.hypeFilter : {}

  let interestDetected = isNonEmptyString(parsed.interestDetected)
    ? parsed.interestDetected.trim()
    : fallback.interestDetected
  if (isKeywordTrapInterest(interestDetected)) interestDetected = fallback.interestDetected

  let recommendedTechReel = isNonEmptyString(parsed.recommendedTechReel)
    ? parsed.recommendedTechReel.trim()
    : fallback.recommendedTechReel
  if (isHypeContent(recommendedTechReel) || isRepetitiveRecommendation(recommendedTechReel, reels)) {
    recommendedTechReel = fallback.recommendedTechReel
  }

  return {
    currentReel: isNonEmptyString(parsed.currentReel) ? parsed.currentReel.trim() : fallback.currentReel,
    interestDetected,
    why: isNonEmptyString(parsed.why) ? parsed.why.trim() : fallback.why,
    recommendedTechReel,
    category: isNonEmptyString(parsed.category) ? parsed.category.trim() : fallback.category,
    whyThisRecommendation: isNonEmptyString(parsed.whyThisRecommendation)
      ? parsed.whyThisRecommendation.trim()
      : fallback.whyThisRecommendation,
    difficulty: isNonEmptyString(parsed.difficulty) ? parsed.difficulty.trim() : fallback.difficulty,
    confidence: clampConfidence(parsed.confidence, fallback.confidence),
    evidenceSignals: evidenceSignals.length ? evidenceSignals : fallback.evidenceSignals,
    hypeFilter: {
      status: isNonEmptyString(hype.status) ? hype.status.trim().toUpperCase() : fallback.hypeFilter.status,
      summary: isNonEmptyString(hype.summary) ? hype.summary.trim() : fallback.hypeFilter.summary,
      explanation: isNonEmptyString(hype.explanation)
        ? hype.explanation.trim()
        : fallback.hypeFilter.explanation,
    },
    graph: {
      center: isNonEmptyString(parsed.graph?.center) ? parsed.graph.center.trim() : fallback.graph.center,
      nodes: graphNodes.length ? graphNodes : fallback.graph.nodes,
    },
  }
}

function clampConfidence(value, fallback) {
  const n = Number(value)
  if (!Number.isFinite(n)) return fallback
  return Math.min(99, Math.max(60, Math.round(n)))
}

async function callGemini(reels, profileName) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 24000)

  try {
    // Proxy to server-side endpoint to avoid exposing API keys in the browser.
    const resp = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({ reels, profileName }),
    })

    if (!resp.ok) {
      const detail = await resp.text().catch(() => '')
      throw new Error(`Server generator HTTP ${resp.status}${detail ? `: ${detail.slice(0, 180)}` : ''}`)
    }

    // Expect the server to return parsed JSON object matching the schema
    const parsed = await resp.json()
    return parsed
  } finally {
    clearTimeout(timeoutId)
  }
}

export async function analyzeReels(reels, profile) {
  const fallback = getFallbackResult(profile.id)

  try {
    const parsed = await callGemini(reels, profile.name)
    // Server should return parsed JSON; verify local quality gates still apply
    if (!passesQualityGate(parsed, reels)) {
      return {
        ok: true,
        source: 'fallback',
        data: fallback,
        message:
          'Generator returned a shallow, repetitive, or hype-heavy result. Using the curated fallback so inference stays reliable.',
      }
    }
    return {
      ok: true,
      source: 'gemini',
      data: validateResult(parsed, profile.id, reels),
      message: '',
    }
  } catch (error) {
    const reason = error?.name === 'AbortError' ? 'The model timed out.' : error?.message || 'Unknown error'
    return {
      ok: false,
      source: 'fallback',
      data: fallback,
      message: `${reason} Showing a high-fidelity fallback so the demo continues.`,
    }
  }
}
