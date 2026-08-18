import { AlertTriangle, Check, ShieldCheck, X } from 'lucide-react'
import InterestGraph from './InterestGraph'

export default function ResultDashboard({ result, notice }) {
  if (!result) return null

  const passed = result.hypeFilter.status === 'PASSED'

  // Basic client-side sanity checks to detect brittle or shallow recommendations
  const labels = (result.evidenceSignals || []).map((s) => (s.label || '').toLowerCase())
  const memeSignals = labels.filter((l) => l.includes('meme') || l.includes('entertain') || l.includes('viral'))
  const savedSignals = labels.filter((l) => l.includes('save') || l.includes('saved') || l.includes('completion') || l.includes('completed'))
  const presentSignals = (result.evidenceSignals || []).filter((s) => s.present)
  const presentCount = presentSignals.length
  const singleSignalRisk = presentCount <= 1 || (savedSignals.length <= 0 && presentCount <= 2)
  const shallowRisk = memeSignals.length >= 2 && savedSignals.length === 0 && result.confidence >= 75
  const multipleDomains = new Set((result.graph?.nodes || []).map((n) => (n || '').split(' ')[0])).size > 1
  const conflictRisk = multipleDomains && (result.confidence < 80 || presentCount < 4)

  return (
    <section className="space-y-6" aria-live="polite">
      {notice && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-400/25 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{notice}</p>
        </div>
      )}

      {/* Client-side risk banners */}
      {shallowRisk && (
        <div className="flex items-start gap-3 rounded-2xl border border-rose-400/25 bg-rose-400/6 px-4 py-3 text-sm text-rose-100">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            Potential shallow recommendation: high entertainment signals with limited saved/learning
            signals. Consider collecting more tutorial or saved items to increase recommendation quality.
          </p>
        </div>
      )}

      {singleSignalRisk && !shallowRisk && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-400/25 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>Only one strong signal detected — recommendation may be brittle. Saving or replaying a tutorial helps.</p>
        </div>
      )}

      {conflictRisk && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-400/25 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>Multiple topic clusters detected. The recommendation focuses on the dominant theme; consider exploring dedicated paths for other interests.</p>
        </div>
      )}

      {/* Prominent latent-interest result */}
      <article className="glass-card p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="section-kicker">Latent Interest</p>
            <div className="mt-1 flex items-baseline gap-4">
              <h2 className="font-display text-3xl font-extrabold text-white">{result.interestDetected}</h2>
              <div className="flex items-center gap-2">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-accent to-accent-2 grid place-items-center shadow-md">
                  <span className="font-bold text-ink">{result.confidence}%</span>
                </div>
                <div className="text-sm text-zinc-300">Confidence</div>
              </div>
            </div>
            <p className="mt-2 max-w-xl text-sm text-zinc-300">{result.why}</p>
          </div>

          <div className="mt-3 sm:mt-0">
            <div className="rounded-lg border border-white/6 bg-white/2 p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400">Why selected</p>
              <p className="mt-2 text-sm text-zinc-200">{result.whyThisRecommendation}</p>
            </div>
          </div>
        </div>
      </article>

      <article className="glass-card p-5 sm:p-6">
        <p className="section-kicker">Why not a generic recommendation?</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-1">
          <div className="flex flex-col gap-3">
            <p className="text-xs uppercase text-zinc-400">Observed content</p>
            <ul className="mt-2 space-y-1 text-sm text-zinc-200">
              {['Java Meme', 'Coding Interview', 'Software Engineer Lifestyle', 'Developer Laptop'].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-accent" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-2">
            <div className="rounded-lg border border-white/6 bg-white/3 p-3">
              <p className="font-semibold text-sm">Shallow recommendation</p>
              <div className="mt-2 flex items-center justify-between gap-3">
                <div className="text-sm text-zinc-200">"Another Java Reel"</div>
                <span className="keyword-badge inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold">✗ Keyword Match</span>
              </div>
            </div>

            <div className="rounded-lg border border-white/6 bg-white/5 p-3">
              <p className="font-semibold text-sm">ReelMind AI</p>
              <div className="mt-2 flex items-center justify-between gap-3">
                <div className="text-sm text-zinc-200">"How DSA Is Actually Used in Software Engineering Interviews"</div>
                <span className="latent-badge inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold">✓ Latent Interest Match</span>
              </div>
            </div>

            <p className="mt-1 text-sm text-zinc-300">The student's interactions span programming, technical interviews, developer culture and developer hardware. The broader pattern indicates software engineering rather than isolated Java interest.</p>
          </div>
        </div>
      </article>

      <div className="grid gap-4 lg:grid-cols-2">
        <article className="glass-card p-5">
          <p className="section-kicker">Evidence Signals</p>
          <ul className="mt-4 space-y-2.5">
            { // show concise evidence prioritized
              // map incoming signals to short, clear labels
              result.evidenceSignals
                .slice(0, 6)
                .map((signal) => {
                  const label = signal.label
                  return (
                    <li key={label} className="flex items-center gap-2.5 text-sm">
                      {signal.present ? (
                        <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-400/15 text-emerald-300">
                          <Check className="h-4 w-4" />
                        </span>
                      ) : (
                        <span className="grid h-6 w-6 place-items-center rounded-full bg-rose-400/15 text-rose-300">
                          <X className="h-4 w-4" />
                        </span>
                      )}
                      <span className={signal.present ? 'text-zinc-200' : 'text-zinc-500 line-through'}>
                        {label}
                      </span>
                    </li>
                  )
                })
            }
          </ul>

          <div className="mt-4 text-xs text-zinc-400">
            Concise evidence: ✓ High coding-interview engagement • ✓ Saved programming content • ✓ Strong developer-content completion
          </div>
        </article>

        <article className="glass-card p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="section-kicker">Hype Filter</p>
              <p className="mt-2 text-sm font-medium text-zinc-200">{result.hypeFilter.summary}</p>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] ${
                passed
                  ? 'border-emerald-400/30 bg-emerald-400/12 text-emerald-300'
                  : 'border-rose-400/30 bg-rose-400/12 text-rose-300'
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              {result.hypeFilter.status}
            </span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">{result.hypeFilter.explanation}</p>
        </article>
      </div>

      <article className="glass-card p-5 sm:p-6">
        <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-kicker">Interest Profile</p>
            <h3 className="mt-1 font-display text-xl font-semibold uppercase tracking-wide text-white">
              {result.graph.center}
            </h3>
          </div>
          <p className="text-sm text-zinc-400">
            <span className="font-semibold text-accent-2">{result.confidence}%</span> confidence
          </p>
        </div>
        <p className="mb-2 text-xs uppercase tracking-[0.16em] text-zinc-500">Evidence</p>
        <div className="mb-4 flex flex-wrap gap-2">
          {result.evidenceSignals
            .filter((signal) => signal.present)
            .map((signal) => (
              <span
                key={signal.label}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-200"
              >
                ✓ {signal.label}
              </span>
            ))}
        </div>
        <InterestGraph center={result.graph.center} nodes={result.graph.nodes} />
      </article>
    </section>
  )
}

