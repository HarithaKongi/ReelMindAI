const INTERACTION = {
  Saved: { weight: 1.0, tier: 'very strong', polarity: 'positive' },
  Replayed: { weight: 0.95, tier: 'very strong', polarity: 'positive' },
  Liked: { weight: 0.78, tier: 'strong', polarity: 'positive' },
  Watched: { weight: 0.45, tier: 'moderate', polarity: 'positive' },
  Skipped: { weight: 0.06, tier: 'negative', polarity: 'negative' },
}

const HIGH_COMPLETION = 85

export function behaviorMeta(reel) {
  const base = INTERACTION[reel.interaction] ?? INTERACTION.Watched
  let weight = base.weight
  let tier = base.tier

  if (reel.interaction === 'Skipped') {
    return { weight, tier, polarity: 'negative', label: 'rejection signal' }
  }

  if (reel.watchPercentage >= HIGH_COMPLETION && reel.interaction === 'Watched') {
    weight = Math.min(1, weight + 0.27)
    tier = 'strong'
  } else if (reel.watchPercentage >= HIGH_COMPLETION) {
    weight = Math.min(1, weight + 0.1)
  }

  if (reel.watchPercentage < 40 && reel.interaction !== 'Skipped') {
    weight = Math.max(0.1, weight - 0.12)
  }

  return {
    weight: Number(weight.toFixed(2)),
    tier,
    polarity: base.polarity,
    label: `${tier} signal`,
  }
}

export function rankReelsByBehavior(reels) {
  return [...reels]
    .map((reel) => ({ reel, meta: behaviorMeta(reel) }))
    .sort((a, b) => b.meta.weight - a.meta.weight)
}

export function buildBehavioralDigest(reels) {
  return rankReelsByBehavior(reels)
    .map(
      ({ reel, meta }, index) =>
        `${index + 1}. "${reel.title}" — ${reel.interaction}, ${reel.watchPercentage}% watched — weight ${meta.weight} (${meta.label})`,
    )
    .join('\n')
}

export function dominantBehavioralReels(reels, limit = 3) {
  return rankReelsByBehavior(reels)
    .filter(({ meta }) => meta.polarity === 'positive')
    .slice(0, limit)
    .map(({ reel }) => reel.title)
}

export function rejectedReels(reels) {
  return reels.filter((reel) => reel.interaction === 'Skipped' || reel.watchPercentage < 30).map((r) => r.title)
}

function tokenize(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 3)
}

export function overlapScore(a, b) {
  const setA = new Set(tokenize(a))
  const setB = new Set(tokenize(b))
  if (!setA.size || !setB.size) return 0
  let shared = 0
  setA.forEach((word) => {
    if (setB.has(word)) shared += 1
  })
  return shared / Math.max(setA.size, setB.size)
}

export function isRepetitiveRecommendation(recommendation, reels) {
  if (!recommendation) return true
  return reels.some((reel) => {
    if (overlapScore(recommendation, reel.title) >= 0.55) return true
    if (reel.interaction === 'Saved' && overlapScore(recommendation, reel.category) >= 0.7) return true
    return false
  })
}

export function normalizeQualityScore(raw) {
  if (!raw || typeof raw !== 'object') return null
  const pick = (key) => {
    const n = Number(raw[key])
    return Number.isFinite(n) ? Math.min(10, Math.max(0, n)) : null
  }

  const scores = {
    relevance: pick('relevance'),
    educationalValue: pick('educationalValue'),
    engagementPotential: pick('engagementPotential'),
    novelty: pick('novelty'),
    credibility: pick('credibility'),
    hypeRisk: pick('hypeRisk'),
  }

  const values = Object.values(scores).filter((v) => v !== null)
  if (values.length < 4) return null

  const composite =
    (scores.relevance ?? 0) * 0.22 +
    (scores.educationalValue ?? 0) * 0.24 +
    (scores.engagementPotential ?? 0) * 0.14 +
    (scores.novelty ?? 0) * 0.16 +
    (scores.credibility ?? 0) * 0.14 -
    (scores.hypeRisk ?? 5) * 0.1

  return { ...scores, composite: Number(composite.toFixed(2)) }
}

export function passesLocalQualityScore(score) {
  if (!score) return true
  if ((score.hypeRisk ?? 10) > 4) return false
  if ((score.educationalValue ?? 0) < 6) return false
  if ((score.novelty ?? 0) < 5) return false
  if ((score.relevance ?? 0) < 6) return false
  if (score.composite < 5.5) return false
  return true
}
