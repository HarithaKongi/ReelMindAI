import { behaviorMeta } from '../services/inference'

export function signalWeight(reel) {
  return behaviorMeta(reel).weight
}

export function watchTone(percentage) {
  if (percentage >= 90) return 'high'
  if (percentage >= 70) return 'good'
  if (percentage >= 40) return 'mid'
  return 'low'
}

export function behaviorLabel(reel) {
  return behaviorMeta(reel).label
}
