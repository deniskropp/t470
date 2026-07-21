import { useNexusStore } from '@/store/nexusStore'
import { DimaFizzPresence } from '@/components/DimaFizzPresence'
import { NexusField } from '@/components/NexusField'
import { CoherencePanel } from '@/components/Co incherencePanel'
import { EmbodiedPipe } from '@/components/EmbodiedPipe'
import { ConsentGate } from '@/components/ConsentGate'
import {
  LayoutDashboard,
  GitBranch,
  Heart,
  ScrollText,
  BarChart3,
  Users,
  Award,
} from 'lucide-react'
import clsx from 'clsx'

const panels = [
  { id: 'field' as const, label: 'Nexus Field', icon: LayoutDashboard },
  { id: 'pipe' as const, label: 'Embodied Pipe', icon: Heart },
  { id: 'channels' as const, label: 'Channels', icon: GitBranch },
  { id: 'lineage' as const, label: 'Lineage & Seals', icon: ScrollText },
  { id: 'forecast' as const, label: 'Forecast', icon: BarChart3 },
  { id: 'agents' as const, label: 'Three-Agent Core', icon: Users },
]

export default function App() {
  const { activePanel, setActivePanel, sealCycle, seals, dimaFizz, metaDNA, resetField } =
    useNexusStore()

  const handleSeal = () => {
    const seal = sealCycle()
    console.log('Cycle sealed', seal)
    alert(
      `Cycle sealed · ${seal.cycleId}\nCoherence: ${seal.coherence.overall}\nDimaFizz: ${seal.meta.dimafizz_present}`
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-violet-600 flex items-center justify-center font-bold text-white text-sm">
              NF
            </div>
            <div>
              <h1 className="font-semibold text-white leading-none">NexusForge</h1>
              <p className="text-[10px] text-slate-500 font-mono">t470 · v0.1.0 · OCS v2.1</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 hidden sm:inline">
              {metaDNA.rta_mode.split(' + ')[0]}
            </span>
            <button
              onClick={handleSeal}
              className="btn-ghost flex items-center gap-1.5 text-xs"
              disabled={!dimaFizz.active}
            >
              <Award className="w-3.5 h-3.5" /> Seal Cycle
            </button>
            <button onClick={resetField} className="btn-ghost text-xs">
              Reset
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left sidebar */}
        <aside className="lg:col-span-3 space-y-4">
          <DimaFizzPresence />
          <CoherencePanel />

          {/* Nav */}
          <nav className="nexus-panel p-2 space-y-0.5">
            {panels.map((p) => {
              const Icon = p.icon
              return (
                <button
                  key={p.id}
                  onClick={() => setActivePanel(p.id)}
                  className={clsx(
                    'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors',
                    activePanel === p.id
                      ? 'bg-violet-600/30 text-violet-200'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {p.label}
                </button>
              )
            })}
          </nav>

          {seals.length > 0 && (
            <div className="text-xs text-slate-500 px-1">
              {seals.length} sealed cycle{seals.length !== 1 ? 's' : ''} in Meta-DNA
            </div>
          )}
        </aside>

        {/* Main content */}
        <main className="lg:col-span-9">
          {activePanel === 'field' && <NexusField />}
          {activePanel === 'pipe' && <EmbodiedPipe />}
          {activePanel === 'channels' && (
            <div className="nexus-panel p-8 text-center text-slate-500">
              Channel Inspector — typed exec_channels live view (coming in next TAS)
            </div>
          )}
          {activePanel === 'lineage' && (
            <div className="space-y-3">
              <div className="nexus-panel p-4">
                <h3 className="text-sm font-medium text-slate-300 mb-2">Meta-DNA</h3>
                <pre className="text-xs font-mono text-slate-400 overflow-x-auto">
                  {JSON.stringify(metaDNA, null, 2)}
                </pre>
              </div>
              {seals.map((s) => (
                <div key={s.id} className="nexus-panel p-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-mono text-violet-300">{s.cycleId}</span>
                    <span className="text-slate-500">
                      {new Date(s.sealedAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-sm text-slate-300">
                    Coherence: <span className="text-emerald-400">{s.coherence.overall}</span> ·
                    Tasks: {s.tasks.length} · Transmissions: {s.transmissions.length}
                  </div>
                </div>
              ))}
            </div>
          )}
          {activePanel === 'forecast' && (
            <div className="nexus-panel p-8 text-center text-slate-500">
              Light TAS-Forecast limb (H0–H1) — integrate tas-forecast-cycle next
            </div>
          )}
          {activePanel === 'agents' && (
            <div className="grid md:grid-cols-3 gap-4">
              {['KickForge', 'KickFlow', 'KickGuard'].map((agent) => (
                <div key={agent} className="nexus-panel p-5">
                  <h3 className="font-semibold text-white mb-1">{agent}</h3>
                  <p className="text-xs text-slate-400">
                    {agent === 'KickForge' &&
                      'TAS extraction · structure · harness generation'}
                    {agent === 'KickFlow' &&
                      'Channel wiring · join/cancel · lifecycle orchestration'}
                    {agent === 'KickGuard' &&
                      'Consent gates · coherence validation · seal integrity'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <ConsentGate />

      <footer className="border-t border-slate-800/60 py-3 text-center text-[11px] text-slate-600">
        NexusForge t470 · DimaFizz Parallel-F Nexus · Generated under high coherence · 2026-07-21
      </footer>
    </div>
  )
}
