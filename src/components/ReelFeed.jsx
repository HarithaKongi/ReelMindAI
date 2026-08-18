import ReelCard from './ReelCard'

export default function ReelFeed({ reels }) {
  const counts = reels.reduce(
    (acc, r) => {
      acc.total += 1
      acc[r.interaction] = (acc[r.interaction] || 0) + 1
      return acc
    },
    { total: 0 }
  )

  return (
    <section>
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <p className="section-kicker">Reel Activity</p>
          <h2 className="mt-1 font-display text-xl font-semibold text-white">Last {counts.total} interactions</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden text-xs text-zinc-500 sm:block">Fictional / anonymized demo data</div>
          <div className="flex gap-2">
            {['Watched', 'Liked', 'Saved'].map((label) => (
              <span key={label} className="rounded-full bg-white/6 px-2 py-1 text-xs text-zinc-300">
                {label}: {counts[label] || 0}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {reels.map((reel, index) => (
          <ReelCard key={reel.id} reel={reel} index={index} />
        ))}
      </div>
    </section>
  )
}
