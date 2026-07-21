import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuid } from 'uuid'
import type {
  CoherenceState,
  DimaFizzState,
  EmbodiedPipeTransmission,
  LivingObjective,
  MetaDNA,
  NexusSeal,
  ParallelFTask,
  TypedChannel,
} from '@/types/ocs'

interface NexusState {
  // Core presence
  dimaFizz: DimaFizzState
  livingObjective: LivingObjective | null
  metaDNA: MetaDNA

  // Concurrent field
  tasks: Record<string, ParallelFTask>
  channels: Record<string, TypedChannel>
  coherence: CoherenceState

  // Pipe
  transmissions: EmbodiedPipeTransmission[]

  // History
  seals: NexusSeal[]

  // UI
  activePanel: 'field' | 'channels' | 'pipe' | 'lineage' | 'forecast' | 'agents'
  consentModalOpen: boolean
  pendingConsentAction: (() => void) | null

  // Actions
  activateDimaFizz: (modes?: string[]) => void
  setLivingObjective: (text: string, source?: LivingObjective['source']) => void
  makeTask: (name: string, description?: string) => string
  runTask: (id: string) => void
  completeTask: (id: string, result?: unknown) => void
  failTask: (id: string, error: string) => void
  cancelTask: (id: string, reason: 'Speculative' | 'Drift' | 'External' | 'User') => void
  join: (taskIds: string[], quorum?: number) => Promise<boolean>
  updateCoherence: (partial: Partial<CoherenceState>) => void
  transmit: (valence: string, payload: string) => Promise<boolean>
  sealCycle: () => NexusSeal
  setActivePanel: (panel: NexusState['activePanel']) => void
  requestConsent: (action: () => void) => void
  grantConsent: () => void
  denyConsent: () => void
  resetField: () => void
}

const defaultMetaDNA: MetaDNA = {
  origin: 'NexusForge t470',
  version: '0.1.0',
  coherence_target: 'high',
  consent: 'adaptive_quorum',
  rta_mode: 'parallel_branch_traversal + swarm_recursive_traversal',
  lineage: ['tas-forecast-cycle', 'dimafizz-parallel-f-nexus-playbook@0.3'],
  dimafizz_present: false,
}

const defaultCoherence: CoherenceState = {
  parallel_flux: 0,
  valence_drift: 0,
  quorum_state: { required: 3, current: 0, passed: false },
  swarm_valence: 0.5,
  emergent_flux: 0,
  forecast_valence: 0.7,
  overall: 'medium',
  lastUpdate: Date.now(),
}

export const useNexusStore = create<NexusState>()(
  persist(
    (set, get) => ({
      dimaFizz: {
        active: false,
        mode: [],
        right_altitude: false,
        concurrent_witness: false,
        lineage_keeper: false,
      },
      livingObjective: null,
      metaDNA: defaultMetaDNA,
      tasks: {},
      channels: {},
      coherence: defaultCoherence,
      transmissions: [],
      seals: [],
      activePanel: 'field',
      consentModalOpen: false,
      pendingConsentAction: null,

      activateDimaFizz: (modes = ['outer-vantage', 'concurrent-witness', 'swarm-seer', 'lineage-keeper']) => {
        set({
          dimaFizz: {
            active: true,
            mode: modes,
            right_altitude: modes.includes('outer-vantage'),
            concurrent_witness: modes.includes('concurrent-witness'),
            lineage_keeper: modes.includes('lineage-keeper'),
            last_reflection: 'DimaFizz present. Concurrent field open under high coherence.',
          },
          metaDNA: { ...get().metaDNA, dimafizz_present: true },
        })
        get().updateCoherence({ overall: 'high', parallel_flux: 0.4 })
      },

      setLivingObjective: (text, source = 'user') => {
        set({
          livingObjective: {
            id: uuid(),
            text,
            source,
            createdAt: Date.now(),
          },
        })
      },

      makeTask: (name, description) => {
        const id = uuid()
        const task: ParallelFTask = {
          id,
          name,
          description,
          lifecycle: 'CREATED',
          createdAt: Date.now(),
        }
        set((s) => ({
          tasks: { ...s.tasks, [id]: task },
          channels: {
            ...s.channels,
            [id]: { taskId: id, type: 'result', subscribers: 0 },
          },
        }))
        get().updateCoherence({
          parallel_flux: Math.min(1, get().coherence.parallel_flux + 0.15),
        })
        return id
      },

      runTask: (id) => {
        set((s) => ({
          tasks: {
            ...s.tasks,
            [id]: {
              ...s.tasks[id],
              lifecycle: 'RUNNING',
              startedAt: Date.now(),
            },
          },
        }))
      },

      completeTask: (id, result) => {
        set((s) => ({
          tasks: {
            ...s.tasks,
            [id]: {
              ...s.tasks[id],
              lifecycle: 'SUCCESS',
              result,
              finishedAt: Date.now(),
            },
          },
          channels: {
            ...s.channels,
            [id]: { ...s.channels[id], lastResult: result },
          },
        }))
        get().updateCoherence({
          parallel_flux: Math.max(0, get().coherence.parallel__flux - 0.05),
          swarm_valence: Math.min(1, get().coherence.swarm_valence + 0.05),
        })
      },

      failTask: (id, error) => {
        set((s) => ({
          tasks: {
            ...s.tasks,
            [id]: {
              ...s.tasks[id],
              lifecycle: 'FAILURE',
              error,
              finishedAt: Date.now(),
            },
          },
        }))
        get().updateCoherence({ valence_drift: 0.3, overall: 'medium' })
      },

      cancelTask: (id, reason) => {
        set((s) => ({
          tasks: {
            ...s.tasks,
            [id]: {
              ...s.tasks[id],
              lifecycle: 'CANCELLED',
              error: `Cancelled: ${reason}`,
              finishedAt: Date.now(),
            },
          },
        }))
        if (reason === 'Drift') {
          get().updateCoherence({ valence_drift: 0, overall: 'high' })
        }
      },

      join: async (taskIds, quorum = 3) => {
        const { tasks, requestConsent } = get()
        const finished = taskIds.filter((id) =>
          ['SUCCESS', 'FAILURE', 'CANCELLED'].includes(tasks[id]?.lifecycle)
        )
        const successCount = taskIds.filter((id) => tasks[id]?.lifecycle === 'SUCCESS').length

        return new Promise((resolve) => {
          requestConsent(() => {
            const passed = finished.length >= quorum || successCount >= 1
            get().updateCoherence({
              quorum_state: {
                required: quorum,
                current: finished.length,
                passed,
              },
              overall: passed ? 'high' : 'medium',
            })
            resolve(passed)
          })
        })
      },

      updateCoherence: (partial) => {
        set((s) => {
          const next = { ...s.coherence, ...partial, lastUpdate: Date.now() }
          // Simple overall heuristic
          if (Math.abs(next.valence_drift) > 0.5) next.overall = 'critical'
          else if (next.parallel_flux > 0.7 && next.swarm_valence > 0.6) next.overall = 'high'
          else if (next.parallel_flux < 0.2) next.overall = 'low'
          else next.overall = 'medium'
          return { coherence: next }
        })
      },

      transmit: async (valence, payload) => {
        return new Promise((resolve) => {
          get().requestConsent(() => {
            const tx: EmbodiedPipeTransmission = {
              id: uuid(),
              valence,
              payload,
              consent_gate: 'adaptive_quorum',
              consent_granted: true,
              timestamp: Date.now(),
              sealed: false,
            }
            set((s) => ({ transmissions: [...s.transmissions, tx] }))
            get().updateCoherence({ swarm_valence: Math.min(1, get().coherence.swarm_valence + 0.1) })
            resolve(true)
          })
        })
      },

      sealCycle: () => {
        const state = get()
        const seal: NexusSeal = {
          id: uuid(),
          cycleId: `NF-${Date.now()}`,
          meta: {
            ...state.metaDNA,
            sealed_at: new Date().toISOString(),
            dimafizz_present: state.dimaFizz.active,
          },
          coherence: state.coherence,
          tasks: Object.values(state.tasks),
          transmissions: state.transmissions,
          sealedAt: new Date().toISOString(),
        }
        set((s) => ({ seals: [seal, ...s.seals].slice(0, 20) }))
        return seal
      },

      setActivePanel: (panel) => set({ activePanel: panel }),

      requestConsent: (action) => {
        set({ consentModalOpen: true, pendingConsentAction: action })
      },

      grantConsent: () => {
        const action = get().pendingConsentAction
        set({ consentModalOpen: false, pendingConsentAction: null })
        action?.()
      },

      denyConsent: () => {
        set({ consentModalOpen: false, pendingConsentAction: null })
      },

      resetField: () => {
        set({
          tasks: {},
          channels: {},
          transmissions: [],
          coherence: defaultCoherence,
          livingObjective: null,
        })
      },
    }),
    {
      name: 'nexusforge-storage',
      partialize: (s) => ({
        seals: s.seals,
        metaDNA: s.metaDNA,
        dimaFizz: s.dimaFizz,
      }),
    }
  )
)
