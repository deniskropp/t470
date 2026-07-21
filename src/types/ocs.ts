/**
 * OCS v2.1 + ParallelF + KickLang core types
 * Derived from unified-playbook-schema + dimafizz-parallel-f-nexus-playbook
 */

export type CoherenceHook =
  | 'parallel_flux'
  | 'valence_drift'
  | 'failure_cascade'
  | 'quorum_state'
  | 'swarm_valence'
  | 'emergent_flux'
  | 'forecast_valence'
  | 'app_coherence'

export type ConsentMode = 'explicit' | 'adaptive_quorum' | 'majority' | 'coherence_floor'

export type ParallelFLifecycle = 'CREATED' | 'RUNNING' | 'SUCCESS' | 'FAILURE' | 'CANCELLED'

export type CancelReason = 'Speculative' | 'Drift' | 'External' | 'User'

export interface MetaDNA {
  origin: string
  version: string
  coherence_target: 'high' | 'medium' | 'low'
  consent: ConsentMode
  rta_mode: string
  primary_journal_signal?: string
  lineage: string[]
  dimafizz_present: boolean
  sealed_at?: string
}

export interface ParallelFTask {
  id: string
  name: string
  description?: string
  lifecycle: ParallelFLifecycle
  result?: unknown
  error?: string
  createdAt: number
  startedAt?: number
  finishedAt?: number
  parentId?: string
}

export interface TypedChannel {
  taskId: string
  type: string
  lastResult?: unknown
  subscribers: number
}

export interface CoherenceState {
  parallel_flux: number // 0-1
  valence_drift: number // -1 to 1, 0 = stable
  quorum_state: { required: number; current: number; passed: boolean }
  swarm_valence: number
  emergent_flux: number
  forecast_valence: number
  overall: 'high' | 'medium' | 'low' | 'critical'
  lastUpdate: number
}

export interface EmbodiedPipeTransmission {
  id: string
  valence: string
  payload: string
  consent_gate: ConsentMode
  consent_granted: boolean
  timestamp: number
  sealed: boolean
}

export interface DimaFizzState {
  active: boolean
  mode: string[]
  right_altitude: boolean
  concurrent_witness: boolean
  lineage_keeper: boolean
  last_reflection?: string
}

export interface LivingObjective {
  id: string
  text: string
  source: 'journal' | 'user' | 'forecast' | 'seal'
  createdAt: number
  meta?: Record<string, unknown>
}

export interface NexusSeal {
  id: string
  cycleId: string
  meta: MetaDNA
  coherence: CoherenceState
  tasks: ParallelFTask[]
  transmissions: EmbodiedPipeTransmission[]
  sealedAt: string
  reportCard?: string
}

// KickLang block skeleton
export interface KickLangBlock {
  sigil: string // e.g. ⫻flow/nexus:...
  meta?: Record<string, unknown>
  body: string
  raw: string
}
