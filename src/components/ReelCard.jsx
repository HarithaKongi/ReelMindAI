import { Bookmark, Eye, Heart, Repeat2, SkipForward } from 'lucide-react'
import { signalWeight, watchTone } from '../utils/behavior'

const INTERACTION_META = {
  Watched: { icon: Eye, className: 'text-sky-300' },
  Liked: { icon: Heart, className: 'text-pink-400' },
  Replayed: { icon: Repeat2, className: 'text-violet-300' },
  Saved: { icon: Bookmark, className: 'text-amber-300' },
  Skipped: { icon: SkipForward, className: 'text-rose-400' },
}

const TONE_BAR = {
  high: 'bg-emerald-400',
  good: 'bg-sky-400',
  mid: 'bg-amber-400',
  low: 'bg-rose-400',
}

export default function ReelCard({ reel, index }) {
  const meta = INTERACTION_META[reel.interaction] ?? INTERACTION_META.Watched
  const Icon = meta.icon
  const tone = watchTone(reel.watchPercentage)
  const weight = Math.round(signalWeight(reel) * 100)

  return (
    <article
      className="glass-card group overflow-hidden p-3.5"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div
        className="relative mb-3 h-24 overflow-hidden rounded-xl"
        style={{
          background: `linear-gradient(135deg, ${reel.gradient[0]}, ${reel.gradient[1]})`,
        }}
      >
        <div className="absolute inset-0 opacity-40 mix-blend-overlay bg-[radial-gradient(circle_at_20%_20%,white,transparent_35%),radial-gradient(circle_at_80%_80%,#c084fc,transparent_40%)]" />
        <div className="absolute left-3 top-3 rounded-md bg-black/35 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/90 backdrop-blur-sm">
          {reel.category}
        </div>
        <div className="absolute bottom-3 right-3 grid h-8 w-8 place-items-center rounded-full bg-black/40 backdrop-blur-sm">
          <Icon className={`h-4 w-4 ${meta.className}`} />
        </div>
        <div className="absolute bottom-3 left-3 text-[10px] font-medium uppercase tracking-wider text-white/80">
          {reel.format}
        </div>
      </div>
      <h3 className="line-clamp-2 min-h-10 text-sm font-semibold leading-snug text-white">
        {reel.title}
      </h3>
      <div className="mt-3 flex items-center justify-between text-xs text-zinc-400">
        <span className="flex items-center gap-1.5">
          <Icon className={`h-3.5 w-3.5 ${meta.className}`} />
          {reel.interaction}
        </span>
        <span className="tabular-nums text-zinc-300">{reel.watchPercentage}% watched</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/8">
        <div
          className={`h-full rounded-full ${TONE_BAR[tone]}`}
          style={{ width: `${reel.watchPercentage}%` }}
        />
      </div>
      <p className="mt-2 text-[11px] text-zinc-500">Behavioral weight {weight}</p>
    </article>
  )
}
