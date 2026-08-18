import { buildBehavioralDigest, dominantBehavioralReels, rejectedReels } from '../src/services/inference.js'
import { GoogleGenerativeAI } from '@google/generative-ai'

const MODEL = 'gemini-2.0-flash'

const SYSTEM_INSTRUCTION = `You are ReelMind AI — a latent-interest inference engine for short-form video.

You beat shallow keyword recommenders. Repeated words in titles do NOT equal repeated intent.
A Java meme + coding interview joke + developer lifestyle + laptop comparison → Software Engineering / Programming Career, NOT "Java".

Use this INTERNAL framework for every reel and for the full feed. Do NOT output these steps or any chain-of-thought:
1. SURFACE TOPIC — what the reel appears to be about on the surface
2. CONTEXT — what situation, role, or concept it represents
3. USER INTENT — why the student likely engaged (learn, identify, entertain, reject)
4. BEHAVIOR — engagement strength from interaction + watch %
5. CROSS-REEL PATTERN — shared underlying theme across multiple reels
6. LATENT INTEREST — broader technology/career interest that best explains the cluster
7. RECOMMENDATION — useful next content adjacent to that interest (not a duplicate of what they already consumed)
8. QUALITY — is the pick genuinely educational or hype?

Behavioral weighting (strongest → weakest):
- Saved = very strong learning intent
- Replayed = very strong identity or unresolved curiosity
- Liked = strong affinity
- High completion (≥85%) on a watch = strong attention signal
- Normal watch = moderate signal
- Skipped = negative signal (treat as rejection, especially for career/hype content)

Separate entertainment from genuine interest. Memes can signal career identity when clustered with lifestyle, tutorials, and tools.

Recommendation selection (internal only):
- Draft 2–3 candidate educational reel titles aligned to the latent interest
- Score each candidate 0–10 on: relevance, educationalValue, engagementPotential, novelty, credibility, hypeRisk
- Pick the candidate with the best balance: high educational value + relevance + novelty, low hypeRisk
- Prefer adjacent next-step learning over repeating surface topics already saved or replayed
- Reject hype patterns: "N tools that will get you a job", "Become X in N days", guaranteed salary, empty listicles

Output rules:
- Return ONLY valid JSON
- No markdown, no reasoning steps, no scoring math in user-facing text
- "why" and "whyThisRecommendation" must cite reel titles + interactions as concise evidence
- interestDetected must be a career/domain cluster, never a single language or buzzword`

function buildPrompt(reels, profileName) {
  const catalog = reels
    .map(
      (reel, index) =>
        `${index + 1}. Title: ${reel.title}\n   Category: ${reel.category}\n   Format: ${reel.format}\n   Watch: ${reel.watchPercentage}%\n   Interaction: ${reel.interaction}\n   Context note: ${reel.description}`,
    )
    .join('\n\n')

  const behavioralDigest = buildBehavioralDigest(reels)
  const topSignals = dominantBehavioralReels(reels).join('; ')
  const rejections = rejectedReels(reels).join('; ') || 'none'

  return `Profile hint only (infer independently from evidence): ${profileName}\n\nReel interactions:\n${catalog}\n\nPre-ranked behavioral signals (use as evidence, not as keyword labels):\n${behavioralDigest}\n\nStrongest positive signals: ${topSignals}\nRejected / weak signals: ${rejections}\n\nReturn JSON with EXACTLY this shape (snake_case):
{
  "current_reel": "",
  "interest_detected": "",
  "why": "",
  "recommended_tech_reel": "",
  "category": "",
  "why_this_recommendation": "",
  "difficulty": "",
  "confidence": 0,
  "hype_filtered": true,
  "evidence": []
}`}

function extractJson(text) {
  if (!text) throw new Error('Empty model response')
  const trimmed = text.trim()
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/)
  const raw = fenced ? fenced[1] : trimmed
  const start = raw.indexOf('{')
  const end = raw.lastIndexOf('}')
  if (start === -1 || end === -1) throw new Error('No JSON object in response')
  return JSON.parse(raw.slice(start, end + 1))
}

function toClientSchema(parsed) {
  // Accept snake_case from model and normalize to client camelCase schema
  const map = (k, alt) => parsed[k] ?? parsed[alt]
  const evidence = Array.isArray(parsed.evidence) ? parsed.evidence : []
  const evidenceSignals = evidence.map((e) => ({ label: String(e || '').trim(), present: true }))

  const hypeFiltered = Boolean(parsed.hype_filtered || parsed.hypeFiltered || false)

  return {
    currentReel: map('current_reel', 'currentReel') || '',
    interestDetected: map('interest_detected', 'interestDetected') || '',
    why: map('why', 'why') || '',
    recommendedTechReel: map('recommended_tech_reel', 'recommendedTechReel') || '',
    category: map('category', 'category') || '',
    whyThisRecommendation: map('why_this_recommendation', 'whyThisRecommendation') || '',
    difficulty: map('difficulty', 'difficulty') || '',
    confidence: Number(map('confidence', 'confidence')) || 0,
    evidenceSignals,
    hypeFilter: {
      status: hypeFiltered ? 'PASSED' : 'FAILED',
      summary: hypeFiltered ? 'Low hype risk • Passed server filter' : 'Hype detected • Recommendation filtered',
      explanation: hypeFiltered ? 'Server-side hype filter passed' : 'Server-side filter flagged potentially hype-heavy candidates',
    },
    graph: {
      center: map('interest_detected', 'interestDetected') || '',
      nodes: evidenceSignals.map((s) => s.label).slice(0, 6),
    },
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed')

  const { reels, profileName } = req.body || {}
  if (!Array.isArray(reels)) return res.status(400).json({ error: 'Missing reels' })

  const apiKey = process.env.GENERATIVE_API_KEY || process.env.GEMINI_API_KEY
  if (!apiKey) {
    return res.status(400).json({ error: 'No server-side API key configured (set GENERATIVE_API_KEY)' })
  }

  try {
    const params = {
      systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
      contents: [{ role: 'user', parts: [{ text: buildPrompt(reels, profileName) }] }],
      generationConfig: { temperature: 0.25, maxOutputTokens: 900, responseMimeType: 'application/json' },
    }

    // Use the official SDK to call the model from server-side via the SDK client
    const client = new GoogleGenerativeAI(apiKey)
    const gm = client.getGenerativeModel({ model: MODEL })
    const result = await gm.generateContent(params)
    // result is a GenerateContentResult with a `response` property
    const modelResponse = result?.response || result

    const text = modelResponse?.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('\n') || ''
    let parsed
    try {
      parsed = extractJson(text)
    } catch {
      // If parsing fails, fall back to trying to use the structured response directly
      parsed = modelResponse
    }

    const normalized = toClientSchema(parsed)
    return res.status(200).json(normalized)
  } catch (err) {
    console.error('Generator error:', err && err.message ? err.message : err)
    return res.status(500).json({ error: err.message || 'Unknown server error' })
  }
}
