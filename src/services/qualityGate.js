import { isHypeContent, isKeywordTrapInterest } from './guards'
import { isRepetitiveRecommendation, normalizeQualityScore, passesLocalQualityScore } from './inference'

export function passesQualityGate(parsed, reels = []) {
  if (!parsed || typeof parsed !== 'object') return false
  if (isHypeContent(parsed.recommendedTechReel)) return false
  if (isKeywordTrapInterest(parsed.interestDetected)) return false
  if (parsed.hypeFilter?.status && parsed.hypeFilter.status.toUpperCase() !== 'PASSED') return false
  if (reels.length && isRepetitiveRecommendation(parsed.recommendedTechReel, reels)) return false

  const score = normalizeQualityScore(parsed.qualityScore)
  if (score && !passesLocalQualityScore(score)) return false

  return true
}
