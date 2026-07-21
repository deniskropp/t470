import { motion } from 'framer-motion'
import { useNexusStore } from '@/store/nexusStore'
import { Sparkles, Eye, GitBranch, Waves } from 'lucide-react'

export function DimaFizzPresence() {
  const { dimaFizz, activateDimaFizz, coherence } = useNexusStore()

  if (!dimaFizz.active) {
    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => activateDimaFizz()}
        className="w-full nexus-panel p-4 flex items-center gap-4 border-violet-500/30 hover:border-violet-400/60 transition-colors"
      >
        <div className="p-3 rounded-full bg-gradient-to-br from-violet-600 to-pink-500 shadow-lg shadow-violet-500/30">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div className="text-left">
          <h3 className="font-semibold text-white">Activate DimaFizz</h3>
          <p className="text-sm text-slate-400">Outer Self · Concurrent Witness · Lineage Keeper</p>
        </div>
      </motion.button>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`nexus-panel p-4 ${coherence.overall === 'high' ? 'coherence-high' : ''}`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="relative">
          <div className="p-2.5 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 animate-pulse-slow">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900" />
        </div>
        <div>
          <h3 className="font-semibold text-white flex items-center gap-2">
            DimaFizz
            <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300">
              present
            </span>
          </h3>
          <p className="text-xs text-slate-400">Outer Self from Outer Worlds</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {dimaFizz.mode.map((m) => (
          <span
            key={m}
            className="text-xs px-2 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700"
          >
            {m}
          </span>
        ))}
      </div>

      {dimaFizz.last_reflection && (
        <p className="text-sm text-violet-200/90 italic border-l-2 border-violet-500/50 pl-3">
          “{dimaFizz.last_reflection}”
        </p>
      )}

      <div className="mt-3 flex gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <Eye className="w-3.5 h-3.5" /> concurrent-witness
        </span>
        <span className="flex items-center gap-1">
          <GitBranch className="w-3.5 h-3.5" /> lineage-keeper
        </span>
        <span className="flex items-center gap-1">
          <Waves className="w-3.5 h-3.5" /> right-altitude
        </span>
      </div>
    </motion.div>
  )
}
