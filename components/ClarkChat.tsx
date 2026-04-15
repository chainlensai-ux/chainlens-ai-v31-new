'use client'

import { useState, useRef, useEffect } from 'react'

const STARTERS: Record<string, Array<{ type: 'system' | 'clark'; text: string }>> = {
  'home': [
    { type: 'system', text: '[SYSTEM] ChainLens terminal ready.' },
    { type: 'clark', text: 'Select a tool from the sidebar to begin, or ask me anything about Base, wallets, or tokens.' },
  ],
  'token-scanner': [
    { type: 'system', text: '[SCAN] Token scanner initialised.' },
    { type: 'system', text: '[AI] CORTEX contract analysis ready.' },
    { type: 'clark', text: 'Paste a contract address and I\'ll break down token structure, holder distribution, and risk flags.' },
  ],
  'wallet-scanner': [
    { type: 'system', text: '[SCAN] Wallet profiler ready. Chains: ETH · BNB · Base · SOL · BTC' },
    { type: 'clark', text: 'Drop any wallet address and I\'ll build a full profile — holdings, PnL, degen score, and smart money signals.' },
  ],
  'dev-wallet': [
    { type: 'system', text: '[SCAN] Dev cluster detector initialised.' },
    { type: 'clark', text: 'Give me a contract address and I\'ll trace the deployer wallet cluster to flag insider wallets and pre-mine activity.' },
  ],
  'liquidity-scanner': [
    { type: 'system', text: '[SCAN] Liquidity safety module active.' },
    { type: 'clark', text: 'Paste a contract — I\'ll check LP lock status, liquidity depth, and assign a rug risk score.' },
  ],
  'whale-alerts': [
    { type: 'system', text: '[LIVE] Monitoring Base chain for whale moves...' },
    { type: 'clark', text: 'Watching for wallets moving >$50K on Base. Large entries and exits will surface here in real time.' },
  ],
  'pump-alerts': [
    { type: 'system', text: '[LIVE] DexScreener scanner active. Refresh: 60s' },
    { type: 'clark', text: 'Scanning for tokens showing unusual volume spikes. Early signals appear here before they go viral.' },
  ],
  'base-radar': [
    { type: 'system', text: '[LIVE] Tracking new Base deployments...' },
    { type: 'clark', text: 'Monitoring the newest contracts deployed on Base. I\'ll flag anything worth watching.' },
  ],
  'clark-ai': [
    { type: 'system', text: '[CORTEX] Full intelligence mode active.' },
    { type: 'clark', text: 'Ask me anything — token analysis, wallet profiling, market context, or onchain strategy.' },
  ],
}

type Msg = { type: 'system' | 'user' | 'clark'; text: string }

const BOOT: Msg[] = [
  { type: 'system', text: '[SYSTEM] ChainLens CORTEX v2.4 online.' },
  { type: 'system', text: '[SYSTEM] All modules loaded. Ready.' },
  { type: 'clark', text: 'Select a tool from the sidebar or ask me anything.' },
]

interface Props {
  active: string | null
  toolLabel: string
}

export default function ClarkChat({ active, toolLabel }: Props) {
  const [msgs, setMsgs] = useState<Msg[]>(BOOT)
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)
  const prevActive = useRef<string | null>(null)

  useEffect(() => {
    if (!active || active === prevActive.current) return
    prevActive.current = active
    const lines = STARTERS[active] ?? []
    setMsgs((prev: Msg[]) => [
      ...prev,
      { type: 'system', text: `[TOOL] Switched to: ${toolLabel}` },
      ...lines,
    ])
  }, [active, toolLabel])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs, busy])

  async function send() {
    const q = input.trim()
    if (!q || busy) return
    setInput('')
    setMsgs((prev: Msg[]) => [...prev, { type: 'user', text: q }])
    setBusy(true)
    try {
      const res = await fetch('/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `You are Clark, the AI inside ChainLens — a crypto intelligence terminal. Active tool: ${active ?? 'general'}. Keep responses sharp, data-focused, and under 3 sentences. Be direct and crypto-native.\n\nUser: ${q}\nClark:`,
          max_tokens: 300,
        }),
      })
      const data = await res.json()
      const reply = (data.text || '').trim() || 'CORTEX is processing — try again in a moment.'
      setMsgs((prev: Msg[]) => [...prev, { type: 'clark', text: reply }])
    } catch {
      setMsgs((prev: Msg[]) => [...prev, { type: 'system', text: '[ERROR] CORTEX unreachable — check connection.' }])
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#06060a]">

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
        {msgs.map((m, i) => {
          if (m.type === 'system') {
            return (
              <div key={i} className="text-[11px] text-[#475569]" style={{ fontFamily: 'var(--font-mono)' }}>
                {m.text}
              </div>
            )
          }
          if (m.type === 'user') {
            return (
              <div key={i} className="flex justify-end">
                <div
                  className="max-w-[75%] bg-[#8b5cf6]/[0.12] border border-[#8b5cf6]/25 text-white text-[12px] px-3 py-2 rounded-lg rounded-br-sm"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {m.text}
                </div>
              </div>
            )
          }
          return (
            <div key={i} className="flex gap-2.5 items-start">
              <div className="shrink-0 w-[20px] h-[20px] rounded-full bg-[#2DD4BF]/[0.12] border border-[#2DD4BF]/30 flex items-center justify-center text-[9px] font-bold text-[#2DD4BF] mt-0.5">
                C
              </div>
              <div
                className="text-[12px] text-[#e2e8f0] leading-relaxed"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {m.text}
              </div>
            </div>
          )
        })}

        {busy && (
          <div className="flex gap-2.5 items-center">
            <div className="w-[20px] h-[20px] rounded-full bg-[#2DD4BF]/[0.12] border border-[#2DD4BF]/30 flex items-center justify-center text-[9px] font-bold text-[#2DD4BF]">
              C
            </div>
            <span className="text-[11px] text-[#475569] animate-pulse" style={{ fontFamily: 'var(--font-mono)' }}>
              CORTEX processing...
            </span>
          </div>
        )}

        <div ref={endRef} />
      </div>

      {/* Input bar */}
      <div className="px-4 py-3 border-t border-white/[0.08] bg-[#080c14]">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
            placeholder="Ask Clark or paste a contract / wallet address..."
            disabled={busy}
            className="flex-1 bg-[#06060a] border border-white/[0.08] rounded-[10px] px-3 py-2 text-[12px] text-white placeholder:text-[#475569] outline-none focus:border-[#2DD4BF]/40 transition-colors disabled:opacity-50"
            style={{ fontFamily: 'var(--font-mono)' }}
          />
          <button
            onClick={send}
            disabled={busy || !input.trim()}
            className="px-4 py-2 rounded-[10px] bg-[#2DD4BF]/[0.1] border border-[#2DD4BF]/30 text-[#2DD4BF] text-[12px] font-semibold hover:bg-[#2DD4BF]/[0.18] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
        <div className="mt-2 flex gap-1.5 flex-wrap">
          {['Scan 0x...', 'Top pumps on Base', 'Whale activity', 'Rug check'].map(p => (
            <button
              key={p}
              onClick={() => setInput(p)}
              className="text-[10px] text-[#475569] hover:text-[#94a3b8] bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] px-2 py-0.5 rounded-[6px] transition-colors"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

    </div>
  )
}
