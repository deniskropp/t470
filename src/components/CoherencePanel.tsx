import { useNexusStore } from '@/store/nexusStore'
import { Activity, AlertTriangle, CheckCircle } from 'lucide-react'

export function CoherencePanel() {
  const { coherence } = useNexusStore()

  const bars = [
    { key: 'parallel_flux', label: 'parallel_flux', value: coherence.parallel_flux, color: 'bg-sky-400' },
    { key: 'swarm_valence', label: 'swarm_valence', value: coherence.swarm_valence, color: 'bg-violet-400' },
    { key: 'emergent_flux', label: 'emergent_flux', value: coherence.emergent_flux, color: 'bg-pink-400' },
    { key: 'forecast_valence', label: 'forecast_valence', value: coherence.forecast_valence, color: 'bg-emerald-400' },
  ]

  const overallIcon =
    coherence.overall === 'high' ? (
      <CheckCircle className="w-5 h-5 text-emerald-400" />
    ) : coherence.overall === 'critical' ? (
      <AlertTriangle className="w-5 h-5 text-rose-400" />
    ) : (
      <Activity className="w-5 h-5 text-amber-400" />
    )

  return (
    <div className={`nexus-panel p-4 ${coherence.overall === 'high' ? 'coherence-high' : coherence.overall === 'critical' ? 'coherence-drift' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-300 flex items-center gap-2">
          {overallIcon}
          CoherenceMonitorBridge
        </h3>
        <span
          className={`text-xs font-mono px-2 py-0.5 rounded ${
            coherence.overall === 'high'
              ? 'bg-emerald-500/20 text-emerald-300'
              : coherence.overall === 'critical'
              ? 'bg-rose-500/20 text-rose-300'
              : 'bg-amber-500/20 text-amber-300'
          }`}
        >
          {coherence.overall.toUpperCase()}
        </span>
      </div>

      <div className="space-y-3">
        {bars.map((b) => (
          <div key={b.key}>
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>{b.label}</span>
              <span>{(b.value * 100).toFixed(0)}%</span>
            </div>
            <div classNameName="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full ${b.color} transition-all duration-500 rounded-full`}
                style={{ width: `${Math.max(2, b.value * 100)}%` }}
              />
            </div>
          </div>
        ))}

        <div className="pt-2 border-t border-slate-800">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">valence_drift</span>
            <span
              className={
                Math.abs(coherence.valence_drift) > 0.3
                  ? 'text-amber-400'
                  : 'text-slate-300'
              }
            >
              {coherence.valence_drift.toFixed(3)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
