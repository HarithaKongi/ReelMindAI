import { Loader2, Sparkles } from 'lucide-react'
import { ANALYSIS_STEPS } from '../data/profiles'

export default function AnalyzePanel({ status, step, onAnalyze, disabled }) {
  const analyzing = status === 'analyzing'

  return (
    <section id="analyze" className="glass-card overflow-hidden p-5 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <p className="section-kicker">AI Analysis</p>
          <h2 className="mt-1 font-display text-xl font-semibold text-white">Infer latent interest</h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-300">
            The model reads topic, context, intent, and cross-reel relationships — then applies a
            hype filter to surface one high-impact educational reel.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onAnalyze}
            disabled={disabled || analyzing}
            className={`analyze-btn inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 font-display text-base font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70 ${
              !analyzing ? 'pulse' : ''
            }`}
          >
            {analyzing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
            {analyzing ? 'Analyzing…' : 'Analyze My Interests'}
          </button>

          <div className="hidden sm:block">
            <div
              className={`ai-animation rounded-full p-3 ${analyzing ? 'playing' : 'idle'}`}
              aria-hidden
            >
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g className="graph-core">
                  <circle cx="24" cy="24" r="7" fill="#7c8cff" opacity="0.95" />
                </g>
                <g className="graph-node" transform="translate(0,0)">
                  <circle cx="10" cy="14" r="3" fill="#c084fc" />
                  <circle cx="38" cy="12" r="2.5" fill="#6dd3ff" />
                  <circle cx="36" cy="34" r="2.5" fill="#ffd36d" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {analyzing && (
        <ol className="mt-6 grid gap-2 sm:grid-cols-2">
          {ANALYSIS_STEPS.map((label, index) => {
            const done = index < step
            const current = index === step
            return (
              <li
                key={label}
                className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition ${
                  current
                    ? 'border-accent/40 bg-accent/12 text-white'
                    : done
                      ? 'border-emerald-400/20 bg-emerald-400/8 text-emerald-200'
                      : 'border-white/6 bg-white/3 text-zinc-500'
                }`}
              >
                <span
                  className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-bold ${
                    current
                      ? 'bg-accent text-ink'
                      : done
                        ? 'bg-emerald-400 text-ink'
                        : 'bg-white/8 text-zinc-400'
                  }`}
                >
                  {done ? '✓' : index + 1}
                </span>
                {label}
              </li>
            )
          })}
        </ol>
      )}
    </section>
  )
}
