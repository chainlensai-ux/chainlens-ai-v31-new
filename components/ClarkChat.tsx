'use client'

import { useState } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────

type Tab = 'Trending' | 'New' | 'Smart Money'

interface Token {
  sym:    string
  name:   string
  price:  string
  change: string
  vol:    string
  signal: string
  up:     boolean
  color:  string
}

// ─── Mock data ────────────────────────────────────────────────────────────

const SCREENER: Record<Tab, Token[]> = {
  Trending: [
    { sym: 'BRETT',   name: 'Brett',        price: '$0.1823',  change: '+18.4%', vol: '$2.1M',  signal: 'HOT',    up: true,  color: '#f97316' },
    { sym: 'VIRTUAL', name: 'Virtuals',     price: '$2.1420',  change: '+11.8%', vol: '$1.3M',  signal: 'BUY',    up: true,  color: '#6366f1' },
    { sym: 'AERO',    name: 'Aerodrome',    price: '$1.4230',  change: '+9.1%',  vol: '$890K',  signal: 'BUY',    up: true,  color: '#22d3ee' },
    { sym: 'TOSHI',   name: 'Toshi',        price: '$0.0008',  change: '+6.2%',  vol: '$521K',  signal: 'WATCH',  up: true,  color: '#fb923c' },
    { sym: 'HIGHER',  name: 'Higher',       price: '$0.0031',  change: '+4.3%',  vol: '$340K',  signal: 'WATCH',  up: true,  color: '#a78bfa' },
    { sym: 'DEGEN',   name: 'Degen',        price: '$0.0142',  change: '-4.2%',  vol: '$440K',  signal: 'SELL',   up: false, color: '#f43f5e' },
  ],
  New: [
    { sym: 'BOING',   name: 'Boing',        price: '$0.0001',  change: '+240%',  vol: '$89K',   signal: 'NEW',    up: true,  color: '#ec4899' },
    { sym: 'WARP',    name: 'Warpcast',     price: '$0.0032',  change: '+64%',   vol: '$124K',  signal: 'HOT',    up: true,  color: '#8b5cf6' },
    { sym: 'BASED',   name: 'Based',        price: '$0.0008',  change: '+31%',   vol: '$67K',   signal: 'WATCH',  up: true,  color: '#0ea5e9' },
    { sym: 'FREN',    name: 'Fren',         price: '$0.0000',  change: '+180%',  vol: '$44K',   signal: 'NEW',    up: true,  color: '#10b981' },
    { sym: 'ONCHAIN', name: 'OnChain',      price: '$0.0019',  change: '-12%',   vol: '$38K',   signal: 'SELL',   up: false, color: '#475569' },
    { sym: 'LAUNCH',  name: 'LaunchBase',   price: '$0.0041',  change: '+22%',   vol: '$91K',   signal: 'WATCH',  up: true,  color: '#f59e0b' },
  ],
  'Smart Money': [
    { sym: 'CBBTC',   name: 'Coinbase BTC', price: '$67,420',  change: '+1.2%',  vol: '$12.3M', signal: 'HOLD',   up: true,  color: '#f59e0b' },
    { sym: 'AERO',    name: 'Aerodrome',    price: '$1.4230',  change: '+9.1%',  vol: '$890K',  signal: 'STRONG', up: true,  color: '#22d3ee' },
    { sym: 'BRETT',   name: 'Brett',        price: '$0.1823',  change: '+18.4%', vol: '$2.1M',  signal: 'BUY',    up: true,  color: '#f97316' },
    { sym: 'MORPHO',  name: 'Morpho',       price: '$1.8940',  change: '+3.4%',  vol: '$567K',  signal: 'BUY',    up: true,  color: '#10b981' },
    { sym: 'VIRTUAL', name: 'Virtuals',     price: '$2.1420',  change: '+11.8%', vol: '$1.3M',  signal: 'WATCH',  up: true,  color: '#6366f1' },
    { sym: 'EURC',    name: 'EURC',         price: '$1.0830',  change: '+0.3%',  vol: '$2.8M',  signal: 'HOLD',   up: true,  color: '#3b82f6' },
  ],
}

const SIGNAL_STYLES: Record<string, string> = {
  HOT:    'text-amber-400   bg-amber-400/[0.08]   border-amber-400/[0.22]',
  BUY:    'text-[#2DD4BF]   bg-[#2DD4BF]/[0.08]   border-[#2DD4BF]/[0.22]',
  STRONG: 'text-emerald-400 bg-emerald-400/[0.08]  border-emerald-400/[0.22]',
  WATCH:  'text-sky-400     bg-sky-400/[0.08]      border-sky-400/[0.22]',
  SELL:   'text-rose-400    bg-rose-400/[0.08]     border-rose-400/[0.22]',
  NEW:    'text-violet-400  bg-violet-400/[0.08]   border-violet-400/[0.22]',
  HOLD:   'text-slate-400   bg-white/[0.04]        border-white/[0.1]',
}

const CHIPS = ['Scan Wallet', 'Analyze Token', 'Track Whales', "What's pumping on Base?"]
const TABS: Tab[] = ['Trending', 'New', 'Smart Money']

// ─── Sub-components ───────────────────────────────────────────────────────

function TokenAvatar({ sym, color }: { sym: string; color: string }) {
  return (
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-[11px] font-bold"
      style={{ background: `${color}18`, color, border: `1px solid ${color}38` }}
    >
      {sym.slice(0, 2)}
    </div>
  )
}

function SignalBadge({ signal }: { signal: string }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold border tracking-wider ${SIGNAL_STYLES[signal] ?? SIGNAL_STYLES.HOLD}`}
      style={{ fontFamily: 'var(--font-plex-mono)' }}
    >
      {signal}
    </span>
  )
}

// ─── Main component ───────────────────────────────────────────────────────

interface Props {
  active:    string | null
  toolLabel: string
}

export default function ClarkChat({ active, toolLabel }: Props) {
  const [query,    setQuery]    = useState('')
  const [tab,      setTab]      = useState<Tab>('Trending')
  const [response, setResponse] = useState<string | null>(null)
  const [busy,     setBusy]     = useState(false)

  async function handleAsk() {
    const q = query.trim()
    if (!q || busy) return
    setBusy(true)
    setResponse(null)
    try {
      const res = await fetch('/api/claude', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `You are Clark, the AI inside ChainLens — a crypto intelligence terminal for Base chain. Active tool: ${active ?? 'general'}. Keep responses sharp, data-focused, and under 3 sentences.\n\nUser: ${q}\nClark:`,
          max_tokens: 300,
        }),
      })
      const data  = await res.json()
      setResponse((data.text || '').trim() || 'CORTEX is processing — try again in a moment.')
    } catch {
      setResponse('CORTEX unreachable — check your connection.')
    } finally {
      setBusy(false)
    }
  }

  const tokens = SCREENER[tab]

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden rounded-xl" style={{ background: '#06090e', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="flex-1 overflow-y-auto">
        <div className="px-10 py-12 max-w-[820px] mx-auto w-full space-y-12">

          {/* ─── Clark Hero ─────────────────────────────────────── */}
          <div className="relative rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>

            {/* Ambient glow orbs */}
            <div
              className="absolute -top-28 -left-24 w-[480px] h-[380px] rounded-full blur-3xl pointer-events-none"
              style={{ background: 'rgba(45,212,191,0.16)' }}
            />
            <div
              className="absolute -bottom-24 right-0 w-[440px] h-[360px] rounded-full blur-3xl pointer-events-none"
              style={{ background: 'rgba(139,92,246,0.14)' }}
            />

            {/* Card surface */}
            <div className="relative" style={{ background: 'linear-gradient(150deg, #0e1929 0%, #0a1020 50%, #07090e 100%)' }}>

              {/* Top edge glow line */}
              <div
                className="absolute inset-x-0 top-0 h-px pointer-events-none"
                style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(45,212,191,0.7) 25%, rgba(139,92,246,0.65) 75%, transparent 100%)' }}
              />

              <div className="px-12 pt-14 pb-14">

                {/* CORTEX badge */}
                <div
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-8"
                  style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.22)' }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-[#a78bfa]"
                    style={{ boxShadow: '0 0 7px rgba(167,139,250,1)' }}
                  />
                  <span className="text-[11px] font-semibold text-[#a78bfa] tracking-wide">
                    CORTEX &middot; AI Intelligence Layer
                  </span>
                </div>

                {/* Headline */}
                <h1
                  className="font-extrabold leading-[1.04] tracking-[-0.025em] mb-6"
                  style={{ fontSize: '52px' }}
                >
                  <span style={{ color: '#f8fafc' }}>Ask Clark</span>
                  <br />
                  <span
                    style={{
                      background: 'linear-gradient(88deg, #2DD4BF 0%, #60a5fa 55%, #a78bfa 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    anything on Base
                  </span>
                </h1>

                {/* Subtitle */}
                <p
                  className="text-[17px] leading-relaxed mb-11"
                  style={{ color: '#94a3b8', maxWidth: '460px' }}
                >
                  Real-time wallet scanning, whale tracking, token analysis
                  <br />and momentum signals — all powered by CORTEX.
                </p>

                {/* Input */}
                <div className="relative mb-6">
                  <input
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleAsk() }}
                    placeholder="Ask a question or paste a contract / wallet address..."
                    disabled={busy}
                    className="w-full rounded-2xl pl-6 pr-44 text-[15px] outline-none transition-all disabled:opacity-50"
                    style={{
                      padding: '20px 176px 20px 24px',
                      background: 'rgba(3,6,14,0.9)',
                      border: '1px solid rgba(255,255,255,0.11)',
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
                      color: '#f1f5f9',
                    }}
                    onFocus={e => {
                      e.currentTarget.style.borderColor = 'rgba(45,212,191,0.5)';
                      e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.04), 0 0 0 3px rgba(45,212,191,0.08)';
                    }}
                    onBlur={e => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.11)';
                      e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.04)';
                    }}
                  />
                  <button
                    onClick={handleAsk}
                    disabled={!query.trim() || busy}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 px-6 py-3 rounded-xl text-[13px] font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.97]"
                    style={{
                      background: '#2DD4BF',
                      color: '#020a07',
                      boxShadow: '0 0 24px rgba(45,212,191,0.4), 0 1px 0 rgba(255,255,255,0.2) inset',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    Ask Clark
                  </button>
                </div>

                {/* Action chips */}
                <div className="flex gap-2 flex-wrap">
                  {CHIPS.map(chip => (
                    <button
                      key={chip}
                      onClick={() => setQuery(chip)}
                      className="text-[12px] font-medium px-4 py-2.5 rounded-xl transition-all"
                      style={{
                        color: '#8fafc7',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.1)',
                      }}
                      onMouseEnter={e => {
                        const el = e.currentTarget as HTMLButtonElement
                        el.style.color = '#2DD4BF'
                        el.style.borderColor = 'rgba(45,212,191,0.4)'
                        el.style.background = 'rgba(45,212,191,0.07)'
                        el.style.boxShadow = '0 0 18px rgba(45,212,191,0.13)'
                      }}
                      onMouseLeave={e => {
                        const el = e.currentTarget as HTMLButtonElement
                        el.style.color = '#8fafc7'
                        el.style.borderColor = 'rgba(255,255,255,0.1)'
                        el.style.background = 'rgba(255,255,255,0.04)'
                        el.style.boxShadow = 'none'
                      }}
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                {/* Clark response */}
                {(busy || response) && (
                  <div
                    className="mt-8 flex gap-4 items-start p-5 rounded-xl"
                    style={{ background: 'rgba(139,92,246,0.07)', border: '1px solid rgba(139,92,246,0.18)' }}
                  >
                    <div
                      className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5"
                      style={{ background: 'rgba(139,92,246,0.18)', border: '1px solid rgba(167,139,250,0.3)' }}
                    >
                      <span className="text-[11px] font-bold text-[#a78bfa]" style={{ fontFamily: 'var(--font-plex-mono)' }}>C</span>
                    </div>
                    <div className="flex-1 pt-0.5">
                      {busy ? (
                        <div className="flex items-center gap-2 py-1">
                          {[0, 0.15, 0.3].map((delay, i) => (
                            <div
                              key={i}
                              className="w-2 h-2 rounded-full animate-pulse"
                              style={{ background: 'rgba(139,92,246,0.7)', animationDelay: `${delay}s` }}
                            />
                          ))}
                        </div>
                      ) : (
                        <p className="text-[14px] leading-relaxed" style={{ color: '#94a3b8' }}>{response}</p>
                      )}
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>

          {/* ─── Token Screener ─────────────────────────────────── */}
          <div>

            {/* Heading row with inline tabs */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-[22px] font-bold tracking-tight" style={{ color: '#f8fafc' }}>
                  Base Token Screener
                </h2>
                <p className="text-[13px] mt-1" style={{ color: '#64748b' }}>
                  Track what&apos;s moving on Base in real time
                </p>
              </div>
              <div
                className="flex gap-0.5 p-1 rounded-xl shrink-0"
                style={{ background: '#050810', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                {TABS.map(t => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={[
                      'px-4 py-2 rounded-lg text-[12px] font-semibold transition-all',
                      tab === t
                        ? 'text-white border border-white/[0.1]'
                        : 'text-[#64748b] border border-transparent hover:text-[#94a3b8] hover:bg-white/[0.04]',
                    ].join(' ')}
                    style={tab === t ? { background: '#0f1b2e', boxShadow: '0 2px 10px rgba(0,0,0,0.6)' } : {}}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Table card */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{ background: '#060912', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              {/* Column headers */}
              <div
                className="flex items-center px-7 py-4"
                style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div className="flex-1 text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: '#64748b' }}>Token</div>
                <div className="w-32 text-right text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: '#64748b' }}>Price</div>
                <div className="w-20 text-right text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: '#64748b' }}>24h</div>
                <div className="w-24 text-right text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: '#64748b' }}>Volume</div>
                <div className="w-24 text-right text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: '#64748b' }}>Signal</div>
              </div>

              {/* Rows */}
              {tokens.map((token, i) => (
                <div
                  key={token.sym}
                  className="relative group flex items-center px-7 cursor-pointer transition-colors hover:bg-white/[0.04]"
                  style={{
                    paddingTop: '22px',
                    paddingBottom: '22px',
                    borderBottom: i < tokens.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  }}
                >
                  {/* Token color accent */}
                  <div
                    className="absolute inset-y-0 left-0 w-[3px] opacity-0 group-hover:opacity-100 transition-opacity rounded-r-sm"
                    style={{ background: token.color }}
                  />

                  {/* Token identity */}
                  <div className="flex-1 flex items-center gap-4 min-w-0 pl-1">
                    <TokenAvatar sym={token.sym} color={token.color} />
                    <div className="min-w-0">
                      <p className="text-[14px] font-semibold leading-tight" style={{ color: '#f1f5f9' }}>{token.name}</p>
                      <p
                        className="text-[11px] mt-0.5"
                        style={{ fontFamily: 'var(--font-plex-mono)', color: '#4d6280' }}
                      >
                        {token.sym} · Base
                      </p>
                    </div>
                  </div>

                  {/* Price */}
                  <div
                    className="w-32 text-right text-[14px] font-medium"
                    style={{ fontFamily: 'var(--font-plex-mono)', color: '#f1f5f9' }}
                  >
                    {token.price}
                  </div>

                  {/* Change */}
                  <div
                    className="w-20 text-right text-[14px] font-bold"
                    style={{ fontFamily: 'var(--font-plex-mono)', color: token.up ? '#2DD4BF' : '#fb7185' }}
                  >
                    {token.change}
                  </div>

                  {/* Volume */}
                  <div
                    className="w-24 text-right text-[13px]"
                    style={{ fontFamily: 'var(--font-plex-mono)', color: '#5d7a94' }}
                  >
                    {token.vol}
                  </div>

                  {/* Signal */}
                  <div className="w-24 flex justify-end">
                    <SignalBadge signal={token.signal} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
