import { Brain, Cpu, Shield } from 'lucide-react'

const ICONS = {
  'software-engineering': Cpu,
  'ai-enthusiast': Brain,
  'cybersecurity-learner': Shield,
}

export default function ProfileSelector({ profiles, value, onChange }) {
  return (
    <section className="glass-card p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="section-kicker">Demo Student Profile</p>
          <h2 className="mt-1 font-display text-lg font-semibold text-white">Whose feed is this?</h2>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {profiles.map((profile) => {
          const Icon = ICONS[profile.id] ?? Cpu
          const active = profile.id === value
          return (
            <button
              key={profile.id}
              type="button"
              onClick={() => onChange(profile.id)}
              className={`rounded-xl border px-3 py-3 text-left transition duration-200 ${
                active
                  ? 'border-accent/50 bg-accent/15 shadow-[0_0_24px_rgba(124,140,255,0.18)]'
                  : 'border-white/8 bg-white/3 hover:border-white/16 hover:bg-white/6'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon className={`h-4 w-4 ${active ? 'text-accent-2' : 'text-zinc-400'}`} />
                <span className={`text-sm font-semibold ${active ? 'text-white' : 'text-zinc-300'}`}>
                  {profile.name}
                </span>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-zinc-500">{profile.description}</p>
            </button>
          )
        })}
      </div>
    </section>
  )
}
