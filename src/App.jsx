import { useMemo, useRef, useState } from 'react'
import Header from './components/Header'
import ProfileSelector from './components/ProfileSelector'
import ReelFeed from './components/ReelFeed'
import AnalyzePanel from './components/AnalyzePanel'
import ResultDashboard from './components/ResultDashboard'
import HostileJudge from './components/HostileJudge'
import { ANALYSIS_STEPS, profiles, getProfile } from './data/profiles'
import { analyzeReels } from './services/gemini'

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export default function App() {
  const [profileId, setProfileId] = useState(profiles[0].id)
  const [status, setStatus] = useState('idle')
  const [step, setStep] = useState(0)
  const [result, setResult] = useState(null)
  const [source, setSource] = useState('')
  const [notice, setNotice] = useState('')
  const analyzeRef = useRef(null)
  const resultsRef = useRef(null)

  const profile = useMemo(() => getProfile(profileId), [profileId])

  function handleProfileChange(nextId) {
    setProfileId(nextId)
    setStatus('idle')
    setStep(0)
    setResult(null)
    setSource('')
    setNotice('')
  }

  async function handleAnalyze() {
    if (status === 'analyzing') return

    setStatus('analyzing')
    setStep(0)
    setResult(null)
    setNotice('')
    analyzeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })

    const analysisPromise = analyzeReels(profile.reels, profile)

    for (let index = 0; index < ANALYSIS_STEPS.length; index += 1) {
      setStep(index)
      await sleep(700)
    }

    const outcome = await analysisPromise
    setResult(outcome.data)
    setSource(outcome.source)
    setNotice(outcome.message || '')
    setStatus('done')
    setStep(ANALYSIS_STEPS.length)
    requestAnimationFrame(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <ProfileSelector profiles={profiles} value={profileId} onChange={handleProfileChange} />
        <ReelFeed key={profileId} reels={profile.reels} />
        <div ref={analyzeRef}>
          <AnalyzePanel status={status} step={step} onAnalyze={handleAnalyze} />
        </div>
        {status === 'done' && result && (
          <div ref={resultsRef}>
            <ResultDashboard result={result} notice={notice} source={source} />
          </div>
        )}

        {/* Hostile judge panel for demo testing (dev-only) */}
        <div className="mt-6">
          <HostileJudge />
        </div>
      </main>
      <footer className="border-t border-white/8 py-6 text-center text-xs text-zinc-500">
        ReelMind AI · Fictional student interactions · Not affiliated with Instagram, YouTube, or TikTok
      </footer>
    </div>
  )
}
