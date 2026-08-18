import { Sparkles } from 'lucide-react'

export default function Header() {
  return (
    <header className="relative overflow-hidden border-b border-white/8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(124,140,255,0.16),transparent_42%),radial-gradient(ellipse_at_top_right,rgba(192,132,252,0.12),transparent_40%)]" />
      <div className="relative mx-auto flex max-w-7xl flex-col gap-5 px-4 py-6 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex flex-1 items-start gap-4">
          <Logo />
          <div className="min-w-0">
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              ReelMind AI
            </h1>
            <p className="mt-1 max-w-lg text-sm text-zinc-300">
              Detect deep learning interests from short-form behavior and recommend the single
              highest-impact reel to level up.
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <a
                href="#analyze"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-ink shadow-md hover:brightness-105 transition"
              >
                Analyze My Interests
              </a>

              <div className="hidden sm:flex items-center gap-3 text-xs text-zinc-400">
                <span className="rounded-full bg-white/6 px-2 py-1">Last 8 interactions</span>
                <span className="rounded-full bg-white/6 px-2 py-1">Live inference</span>
              </div>
            </div>
          </div>
        </div>

        <p className="hidden max-w-md text-sm leading-relaxed text-zinc-400 lg:block lg:text-right">
          Infers latent technology interests from short-form behavior — not keywords — then
          recommends one high-value educational reel.
        </p>
      </div>
    </header>
  )
}

function Logo() {
  return (
    <div className="relative grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-accent to-accent-2 shadow-[0_0_28px_rgba(124,140,255,0.35)]">
      <Sparkles className="h-5 w-5 text-white" strokeWidth={2.2} />
      <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-ink bg-emerald-400" />
    </div>
  )
}
