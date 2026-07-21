import { motion, AnimatePresence } from 'framer-motion'
import { useNexusStore } from '@/store/nexusStore'
import { Shield, X } from 'lucide-react'

export function ConsentGate() {
  const { consentModalOpen, grantConsent, denyConsent, dimaFizz } = useNexusStore()

  return (
    <AnimatePresence>
      {consentModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="consent-gate nexus-panel max-w-md w-full mx-4 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-violet-500/20">
                  <Shield className="w-6 h-6 text-violet-300" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Consent Gate</h2>
                  <p className="text-sm text-slate-400">OCS adaptive_quorum · DimaFizz present</p>
                </div>
              </div>
              <button onClick={denyConsent} className="btn-ghost p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-slate-300 mb-6 leading-relaxed">
              {dimaFizz.active
                ? 'DimaFizz concurrent-witness requests your explicit consent to proceed with this join / transmission / seal. The field remains spacious and invitational.'
                : 'This action requires consent under OCS v2.1 protocol. Proceed?'}
            </p>

            <div className="flex gap-3 justify-end">
              <button onClick={denyConsent} className="btn-ghost">
                Deny / Halt
              </button>
              <button onClick={grantConsent} className="btn-dima">
                Grant Consent · Continue
              </button>
            </div>

            <p className="mt-4 text-xs text-slate-500 text-center">
              Consent is first. Coherence is continuous. You may always re-ground.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
