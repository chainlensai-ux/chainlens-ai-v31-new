'use client'

import { useState, useRef, useEffect } from 'react'

const STARTERS: Record<string, Array<{ type: 'system' | 'clark'; text: string }>> = {
  'home': [
    { type: 'system', text: 'ChainLens terminal ready.' },
    { type: 'clark',  text: 'Select a tool from the sidebar to begin, or ask me anything about Base, wallets, or tokens.' },
  ],
  'token-scanner': [
    { type: 'system', text: 'Token scanner initialised. CORTEX contract analysis ready.' },
    { type: 'clark',  text: "Paste a contract address and I'll break down token structure, holder distribution, and risk flags." },
  ],
  'wallet-scanner': [
    { type: 'system', text: 'Wallet profiler ready — ETH · BNB · Base · SOL · BTC' },
    { type: 'clark',  text: "Drop any wallet address and I'll build a full profile — holdings, PnL, degen score, and smart money signals." },
  ],
  'dev-wallet': [
    { type: 'system', text: 'Dev cluster detector initialised.' },
    { type: 'clark',  text: "Give me a contract address and I'll trace the deployer wallet cluster to flag insider wallets and pre-mine activity." },
  ],
  'liquidity-scanner': [
    { type: 'system', text: 'Liquidity safety module active.' },
    { type: 'clark',  text: "Paste a contract — I'll check LP lock status, liquidity depth, and assign a rug risk score." },
  ],
  'whale-alerts': [
    { type: 'system', text: 'Monitoring Base chain for whale moves...' },
    { type: 'clark',  text: 'Watching for wallets moving >$50K on Base. Large entries and exits will surface here in real time.' },
  ],
  'pump-alerts': [
    { type: 'system', text: 'DexScreener scanner active — refresh every 60s.' },
    { type: 'clark',  text: 'Scanning for tokens showing unusual volume spikes. Early signals appear here before they go viral.' },
  ],
  'base-radar': [
    { type: 'system', text: 'Tracking new Base deployments...' },
    { type: 'clark',  text: "Monitoring the newest contracts deployed on Base. I'll flag anything worth watching." },
  ],
  'clark-ai': [
    { type: 'system', text: 'CORTEX full intelligence mode active.' },
    { type: 'clark',  text: 'Ask me anything — token analysis, wallet profiling, market context, or onchain strategy.' },
  ],
}

type Msg = { type: 'system' | 'user' | 'clark'; text: string }

const BOOT: Msg[] = [
  { type: 'system', text: 'ChainLens CORTEX v2.4 online. All modules loaded.' },
  { type: 'clark',  text: 'Select a tool from the sidebar or ask me anything.' },
]

const CHIPS = ['Scan contract', 'Top pumps on Base', 'Whale activity', 'Rug check']

interface Props {
  active: string | null
  toolLabel: string
}

export default function ClarkChat({ active, toolLabel }: Props) {
  const [msgs, setMsgs]   = useState<Msg[]>(BOOT)
  const [input, setInput] = useState('')
  const [busy, setBusy]   = useState(false)
  const endRef            = useRef<HTMLDivElement>(null)
  const prevActive        = useRef<string | null>(null)

  useEffect(() => {
    if (!active || active === prevActive.current) return
    prevActive.current = active
    const lines = STARTERS[active] ?? []
    setMsgs((prev: Msg[]) => [
      ...prev,
      { type: 'system', text: `Switched to: ${toolLabel}` },
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
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `You are Clark, the AI inside ChainLens — a crypto intelligence terminal. Active tool: ${active ?? 'general'}. Keep responses sharp, data-focused, and under 3 sentences. Be direct and crypto-native.\n\nUser: ${q}\nClark:`,
          max_tokens: 300,
        }),
      })
      const data  = await res.json()
      const reply = (data.text || '').trim() || 'CORTEX is processing — try again in a moment.'
      setMsgs((prev: Msg[]) => [...prev, { type: 'clark', text: reply }])
    } catch {
      setMsgs((prev: Msg[]) => [...prev, { type: 'system', text: 'CORTEX unreachable — check your connection.' }])
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#080c14] rounded-xl border border-white/[0.08]">

      {/* Panel header */}
      <div className="shrink-0 flex items-center justify-between px-5 h-12 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <span className="text-[14px] font-semibold text-[#e2e8f0]">{toolLabel}</span>
          <span
            className="text-[10px] px-2 py-0.5 rounded-full border font-medium"
            style={{
              background: 'rgba(45,212,191,0.08)',
              borderColor: 'rgba(45,212,191,0.2)',
              color: '#2DD4BF',
              fontFamily: 'var(--font-plex-mono)',
            }}
          >
            Base
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF]" />
          <span className="text-[12px] text-[#475569] font-medium">Live</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
        {msgs.map((m, i) => {

          if (m.type === 'system') {
            return (
              <div
                key={i}
                className="text-[11px] text-[#3d5066] leading-relaxed"
                style={{ fontFamily: 'var(--font-plex-mono)' }}
              >
                — {m.text}
              </div>
            )
          }

          if (m.type === 'user') {
            return (
              <div key={i} className="flex justify-end">
                <div className="max-w-[72%] bg-[#8b5cf6]/[0.1] border border-[#8b5cf6]/[0.15] text-[#ddd6fe] text-[13px] leading-relaxed px-4 py-2.5 rounded-xl rounded-br-sm">
                  {m.text}
                </div>
              </div>
            )
          }

          // Clark message
          return (
            <div key={i} className="flex gap-3 items-start">
              <div className="shrink-0 w-6 h-6 rounded-full bg-[#2DD4BF]/[0.1] border border-[#2DD4BF]/[0.2] flex items-center justify-center mt-0.5">
                <span
                  className="text-[9px] font-bold text-[#2DD4BF]"
                  style={{ fontFamily: 'var(--font-plex-mono)' }}
                >
                  C
                </span>
              </div>
              <div className="text-[13px] text-[#94a3b8] leading-relaxed pt-0.5">
                {m.text}
              </div>
            </div>
          )
        })}

        {/* Typing indicator */}
        {busy && (
          <div className="flex gap-3 items-center">
            <div className="shrink-0 w-6 h-6 rounded-full bg-[#2DD4BF]/[0.1] border border-[#2DD4BF]/[0.2] flex items-center justify-center">
              <span
                className="text-[9px] font-bold text-[#2DD4BF]"
                style={{ fontFamily: 'var(--font-plex-mono)' }}
              >
                C
              </span>
            </div>
            <div className="flex items-center gap-1 pt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#3d5066] animate-pulse" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#3d5066] animate-pulse" style={{ animationDelay: '0.15s' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-[#3d5066] animate-pulse" style={{ animationDelay: '0.3s' }} />
            </div>
          </div>
        )}

        <div ref={endRef} />
      </div>

      {/* Input bar */}
      <div className="shrink-0 px-5 py-4 border-t border-white/[0.06]">
        <div className="flex gap-2.5 mb-3">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
            }}
            placeholder="Ask Clark or paste a contract / wallet address..."
            disabled={busy}
            className="flex-1 min-w-0 bg-[#06060a] border border-white/[0.08] rounded-xl px-4 py-2.5 text-[13px] text-white placeholder:text-[#334155] outline-none focus:border-[#2DD4BF]/[0.3] transition-colors disabled:opacity-40"
          />
          <button
            onClick={send}
            disabled={busy || !input.trim()}
            className="shrink-0 px-5 py-2.5 rounded-xl bg-[#2DD4BF]/[0.1] border border-[#2DD4BF]/[0.25] text-[#2DD4BF] text-[13px] font-semibold hover:bg-[#2DD4BF]/[0.16] transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>

        {/* Quick chips */}
        <div className="flex gap-1.5 flex-wrap">
          {CHIPS.map(p => (
            <button
              key={p}
              onClick={() => setInput(p)}
              className="text-[11px] text-[#475569] hover:text-[#64748b] bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] px-2.5 py-1 rounded-lg font-medium transition-colors"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

    </div>
  )
}
