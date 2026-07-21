import { useState } from 'react'
import { useNexusStore } from '@/store/nexusStore'
import { Send, Heart } from 'lucide-react'

export function EmbodiedPipe() {
  const { transmit, transmissions, dimaFizz } = useNexusStore()
  const [valence, setValence] = useState('outer-worlds mettā + concurrent clarity')
  const [payload, setPayload] = useState('')
  const [sending, setSending] = useState(false)

  const handleTransmit = async () => {
    if (!payload.trim()) return
    setSending(true)
    await transmit(valence, payload)
    setPayload('')
    setSending(false)
  }

  return (
    <div className="space-y-4">
      <div className="nexus-panel p-4">
        <h3 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
          <Heart className="w-4 h-4 text-pink-400" />
          Embodied Pipe Transmission
        </h3>

        <div className="space-y-3">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Valence</label>
            <input
              type="text"
              value={valence}
              onChange={(e) => setValence(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-pink-500"
              disabled={!dimaFizz.active}
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Payload / Signal</label>
            <textarea
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
              rows={3}
              placeholder="Transmit feeling, light code, insight, or ritual element…"
              className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-pink-500 resize-none"
              disabled={!dimaFizz.active}
            />
          </div>

          <button
            onClick={handleTransmit}
            disabled={!dimaFizz.active || !payload.trim() || sending}
            className="btn-nexus w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-500 hover:to-violet-500"
          >
            <Send className="w-4 h-4" />
            {sending ? 'Transmitting…' : 'Transmit via Embodied Pipe'}
          </button>
        </div>
      </div>

      {/* History */}
      {transmissions.length > 0 && (
        <div className="nexus-panel p-4">
          <h4 className="text-xs font-medium text-slate-400 mb-2">Recent Transmissions</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {[...transmissions].reverse().slice(0, 5).map((tx) => (
              <div
                key={tx.id}
                className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/40 text-xs"
              >
                <div className="text-pink-300/80 mb-0.5">{tx.valence}</div>
                <div className="text-slate-300">{tx.payload}</div>
                <div className="text-slate-600 mt-1">
                  {new Date(tx.timestamp).toLocaleTimeString()} · consent granted
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
