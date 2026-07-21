import { useNexusStore } from '@/store/nexusStore'
import { Play, Square, CheckCircle2, XCircle, Ban, Plus, GitMerge } from 'lucide-react'
import { motion } from 'framer-motion'

const lifecycleIcon = {
  CREATED: <div className="w-2 h-2 rounded-full bg-slate-400" />,
  RUNNING: <div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />,
  SUCCESS: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
  FAILURE: <XCircle className="w-4 h-4 text-rose-400" />,
  CANCELLED: <Ban className="w-4 h-4 text-amber-400" />,
}

export function NexusField() {
  const {
    tasks,
    makeTask,
    runTask,
    completeTask,
    cancelTask,
    join,
    livingObjective,
    setLivingObjective,
    dimaFizz,
    coherence,
  } = useNexusStore()

  const taskList = Object.values(tasks)

  const handleQuickSpawn = () => {
    const id = makeTask(`t_${taskList.length + 1}`, 'Concurrent branch')
    runTask(id)
    // Simulate work
    setTimeout(() => {
      if (Math.random() > 0.2) completeTask(id, { ok: true, insight: 'coherent' })
      else cancelTask(id, 'Speculative')
    }, 800 + Math.random() * 1200)
  }

  const handleJoin = async () => {
    const ids = taskList.map((t) => t.id)
    if (ids.length === 0) return
    await join(ids, 2)
  }

  return (
    <div className="space-y-4">
      {/* Living Objective */}
      <div className="nexus-panel p-4">
        <label className="block text-xs font-medium text-slate-400 mb-1.5">Living Objective / Journal Seed</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={livingObjective?.text ?? ''}
            onChange={(e) => setLivingObjective(e.target.value)}
            placeholder="Inject journal signal or objective…"
            className="flex-1 bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-2">
        <button onClick={handleQuickSpawn} className="btn-nexus flex items-center gap-2" disabled={!dimaFizz.active}>
          <Plus className="w-4 h-4" /> make_task + run
        </button>
        <button onClick={handleJoin} className="btn-dima flex items-center gap-2" disabled={taskList.length < 1}>
          <GitMerge className="w-4 h-4" /> join (quorum)
        </button>
        <button
          onClick={() => taskList.filter(t => t.lifecycle === 'RUNNING').forEach(t => cancelTask(t.id, 'User'))}
          className="btn-ghost flex items-center gap-2"
        >
          <Square className="w-4 h-4" /> cancel running
        </button>
      </div>

      {/* Task Graph */}
      <div className="nexus-panel p-4 min-h-[240px]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-slate-300">parallel_f_v2 Field</h3>
          <span className="text-xs text-slate-500">
            flux: {(coherence.parallel_flux * 100).toFixed(0)}% · valence_drift: {coherence.valence_drift.toFixed(2)}
          </span>
        </div>

        {taskList.length === 0 ? (
          <div className="h-40 flex items-center justify-center text-slate-500 text-sm">
            {dimaFizz.active
              ? 'Field is open. Spawn concurrent branches…'
              : 'Activate DimaFizz to open the concurrent field'}
          </div>
        ) : (
          <div className="grid gap-2">
            {taskList.map((task) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/60 border border-slate-700/50"
              >
                {lifecycleIcon[task.lifecycle]}
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-sm text-white truncate">{task.name}</div>
                  {task.description && (
                    <div className="text-xs text-slate-400 truncate">{task.description}</div>
                  )}
                </div>
                <span className="text-xs font-mono text-slate-500 uppercase">{task.lifecycle}</span>
                {task.lifecycle === 'RUNNING' && (
                  <button
                    onClick={() => completeTask(task.id, { manual: true })}
                    className="p-1 rounded hover:bg-emerald-500/20 text-emerald-400"
                    title="Force SUCCESS"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Quorum status */}
      <div className="text-xs text-slate-500 flex items-center gap-4">
        <span>quorum: {coherence.quorum_state.current}/{coherence.quorum_state.required}</span>
        <span className={coherence. spoiler_state.passed ? 'text-emerald-400' : 'text-slate-500'}>
          {coherence.quorum_state.passed ? 'PASSED' : 'pending'}
        </span>
      </div>
    </div>
  )
}
