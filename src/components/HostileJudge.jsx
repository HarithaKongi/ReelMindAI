import { useState } from 'react'
import { profiles } from '../data/profiles'
import { analyzeReels } from '../services/gemini'

const TEST_SCENARIOS = [
  { id: 'software-engineering', label: 'Java-heavy content', profileId: 'software-engineering' },
  { id: 'ai-enthusiast', label: 'AI-heavy content', profileId: 'ai-enthusiast' },
  { id: 'cybersecurity-learner', label: 'Cybersecurity content', profileId: 'cybersecurity-learner' },
  // Mostly entertainment: reuse ai-enthusiast but mark many as meme
  {
    id: 'mostly-entertainment',
    label: 'Mostly entertainment',
    profile: {
      id: 'mostly-entertainment',
      name: 'Mostly Entertainment',
      reels: Array.from({ length: 8 }).map((_, i) => ({
        id: `ent-${i}`,
        title: ['Prank', 'Meme', 'Dance', 'LOL'][i % 4] + ' moment',
        category: 'Entertainment',
        watchPercentage: 90 - i,
        interaction: i % 3 === 0 ? 'Replayed' : 'Watched',
        format: 'meme',
        description: 'Pure entertainment clip',
        gradient: ['#111827', '#0b1220'],
      })),
    },
  },
  // Mixed technology topics
  {
    id: 'mixed-tech',
    label: 'Mixed technology topics',
    profile: {
      id: 'mixed-tech',
      name: 'Mixed Tech',
      reels: [
        { id: 'm-1', title: 'Intro to Rust', category: 'Rust', watchPercentage: 92, interaction: 'Watched', format: 'tutorial', description: '' , gradient:['#0ea5a4','#0f172a']},
        { id: 'm-2', title: 'React tips', category: 'Web', watchPercentage: 80, interaction: 'Saved', format: 'tutorial', description: '' , gradient:['#1d4ed8','#1e3a8a']},
        { id: 'm-3', title: 'Kubernetes for Beginners', category: 'Cloud', watchPercentage: 85, interaction: 'Liked', format: 'tutorial', description: '' , gradient:['#0ea5a4','#083344']},
        { id: 'm-4', title: 'Gaming setup', category: 'Lifestyle', watchPercentage: 60, interaction: 'Watched', format: 'lifestyle', description: '' , gradient:['#0f172a','#111827']},
      ],
    },
  },
  // High engagement but low educational value
  {
    id: 'high-eng-low-edu',
    label: 'High engagement but low educational value',
    profile: {
      id: 'high-eng-low-edu',
      name: 'HighEngLowEdu',
      reels: [
        { id: 'h1', title: 'Shocking AI', category: 'AI', watchPercentage: 98, interaction: 'Replayed', format: 'clickbait', description: 'Clickbait list', gradient:['#7c3aed','#111827']},
        { id: 'h2', title: 'Meme about devs', category: 'Programming', watchPercentage: 95, interaction: 'Replayed', format: 'meme', description: 'Funny', gradient:['#2563eb','#1e293b']},
        { id: 'h3', title: 'Viral trick', category: 'Hack', watchPercentage: 97, interaction: 'Liked', format: 'viral', description: 'Low depth but high replay', gradient:['#b45309','#7f1d1d']},
      ],
    },
  },
  // Low engagement but highly educational
  {
    id: 'low-eng-high-edu',
    label: 'Low engagement but highly educational content',
    profile: {
      id: 'low-eng-high-edu',
      name: 'LowEngHighEdu',
      reels: [
        { id: 'l1', title: 'Advanced TypeScript patterns', category: 'Web', watchPercentage: 40, interaction: 'Saved', format: 'tutorial', description: 'Deep tutorial', gradient:['#1e293b','#0b1220']},
        { id: 'l2', title: 'Compiler internals', category: 'Systems', watchPercentage: 35, interaction: 'Saved', format: 'lecture', description: 'Hard topic', gradient:['#0f172a','#021124']},
      ],
    },
  },
  // Hype career content
  {
    id: 'hype-career',
    label: 'Hype career content',
    profile: {
      id: 'hype-career',
      name: 'Hype Career',
      reels: [
        { id: 'hc1', title: 'Get 1M in 30 days', category: 'Career', watchPercentage: 8, interaction: 'Skipped', format: 'clickbait', description: '' , gradient:['#9f1239','#431407']},
        { id: 'hc2', title: 'Top 10 tools to get hired', category: 'Career', watchPercentage: 12, interaction: 'Skipped', format: 'listicle', description: '' , gradient:['#9f1239','#431407']},
        { id: 'hc3', title: 'Real interview prep', category: 'Programming', watchPercentage: 90, interaction: 'Saved', format: 'tutorial', description: '' , gradient:['#1d4ed8','#1e3a8a']},
      ],
    },
  },
  // Conflicting interests
  {
    id: 'conflicting',
    label: 'Conflicting interests',
    profile: {
      id: 'conflicting',
      name: 'Conflicting',
      reels: [
        { id: 'c1', title: 'Intro to Web Design', category: 'Design', watchPercentage: 95, interaction: 'Saved', format: 'tutorial', description: '' , gradient:['#c026d3','#0b1220']},
        { id: 'c2', title: 'Kernel programming basics', category: 'Systems', watchPercentage: 90, interaction: 'Saved', format: 'lecture', description: '' , gradient:['#064e3b','#021124']},
      ],
    },
  },
  // Only one strong technology signal
  {
    id: 'one-strong',
    label: 'Only one strong technology signal',
    profile: {
      id: 'one-strong',
      name: 'OneSignal',
      reels: [
        { id: 'o1', title: 'Learn Go in 60s', category: 'Go', watchPercentage: 100, interaction: 'Saved', format: 'tutorial', description: '' , gradient:['#0ea5a4','#021124']},
        { id: 'o2', title: 'Funny cat', category: 'Entertainment', watchPercentage: 30, interaction: 'Watched', format: 'meme', description: '' , gradient:['#111827','#0b1220']},
      ],
    },
  },
]

function pickProfile(item) {
  if (item.profile) return item.profile
  return profiles.find((p) => p.id === item.profileId) || profiles[0]
}

export default function HostileJudge() {
  const [running, setRunning] = useState(false)
  const [results, setResults] = useState([])

  async function runTests() {
    setRunning(true)
    setResults([])
    for (const scenario of TEST_SCENARIOS) {
      const profile = pickProfile(scenario)
      // run analysis (uses fallback if no API key)
      const outcome = await analyzeReels(profile.reels, profile)
      const data = outcome.data
      // compute simple risk flags on client side
      const labels = (data.evidenceSignals || []).map((s) => s.label.toLowerCase())
      const hasMeme = labels.some((l) => l.includes('meme') || l.includes('entertain'))
      const hasSaved = labels.some((l) => l.includes('saved') || l.includes('save'))
      const multipleDomains = new Set((data.graph?.nodes || []).map((n) => n.split(' ')[0])).size > 1
      const shallowRisk = !hasSaved && hasMeme && data.confidence >= 80
      const conflictRisk = multipleDomains && (data.confidence < 75 || labels.length < 4)

      setResults((r) => [
        ...r,
        {
          scenario: scenario.label,
          recommended: data.recommendedTechReel,
          interest: data.interestDetected,
          confidence: data.confidence,
          source: outcome.source,
          message: outcome.message,
          shallowRisk,
          conflictRisk,
          raw: data,
        },
      ])
      // short delay to avoid UI lock
      await new Promise((s) => setTimeout(s, 120))
    }

    setRunning(false)
  }

  return (
    <div className="mt-6 rounded-lg border border-white/6 bg-white/3 p-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">Hostile Judge — Run test scenarios</h4>
        <button
          className="rounded bg-accent px-3 py-1 text-sm font-semibold text-ink"
          onClick={runTests}
          disabled={running}
        >
          {running ? 'Running…' : 'Run tests'}
        </button>
      </div>

      <div className="mt-3 space-y-2 max-h-64 overflow-auto">
        {results.map((res, idx) => (
          <div key={idx} className="rounded-md border border-white/6 bg-white/2 p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">{res.scenario}</div>
                <div className="text-xs text-zinc-400">Interest: {res.interest} · Confidence: {res.confidence}%</div>
              </div>
              <div className="text-sm text-zinc-200">{res.recommended}</div>
            </div>
            <div className="mt-2 text-xs text-zinc-400">
              {res.source === 'fallback' ? 'Fallback used' : 'Live model'} {res.message && `· ${res.message}`}
            </div>
            <div className="mt-2 flex gap-2">
              {res.shallowRisk && <span className="keyword-badge px-2 py-1 text-xs">Potential shallow recommendation</span>}
              {res.conflictRisk && <span className="keyword-badge px-2 py-1 text-xs">Conflicting interests</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
