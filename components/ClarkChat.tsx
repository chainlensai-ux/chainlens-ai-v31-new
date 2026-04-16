'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

// ─── Types ────────────────────────────────────────────────────────────────

type ChainFilter = 'All Chains' | 'Ethereum' | 'Solana' | 'Arbitrum' | 'Base'
type TimeFilter  = '1H' | '24H' | '7D' | '30D'

interface Token {
  rank:      number
  chain:     string
  sym:       string
  name:      string
  price:     string
  change:    string
  volume:    string
  liquidity: string
  up:        boolean
  color:     string
}

// ─── Mock data ────────────────────────────────────────────────────────────

const TOKENS: Token[] = [
  { rank: 1, chain: 'Base',     sym: 'BRETT',   name: 'Brett',       price: '$0.1823',  change: '+18.4%', volume: '$2.1M',  liquidity: '$8.4M',   up: true,  color: '#f97316' },
  { rank: 2, chain: 'Ethereum', sym: 'VIRTUAL', name: 'Virtuals',    price: '$2.1420',  change: '+11.8%', volume: '$1.3M',  liquidity: '$12.1M',  up: true,  color: '#6366f1' },
  { rank: 3, chain: 'Base',     sym: 'AERO',    name: 'Aerodrome',   price: '$1.4230',  change: '+9.1%',  volume: '$890K',  liquidity: '$24.8M',  up: true,  color: '#22d3ee' },
  { rank: 4, chain: 'Solana',   sym: 'BONK',    name: 'Bonk',        price: '$0.00002', change: '+7.3%',  volume: '$4.2M',  liquidity: '$32.1M',  up: true,  color: '#f59e0b' },
  { rank: 5, chain: 'Base',     sym: 'TOSHI',   name: 'Toshi',       price: '$0.0008',  change: '+6.2%',  volume: '$521K',  liquidity: '$3.2M',   up: true,  color: '#fb923c' },
  { rank: 6, chain: 'Arbitrum', sym: 'ARB',     name: 'Arbitrum',    price: '$0.8840',  change: '-2.4%',  volume: '$3.8M',  liquidity: '$67.2M',  up: false, color: '#64748b' },
  { rank: 7, chain: 'Base',     sym: 'HIGHER',  name: 'Higher',      price: '$0.0031',  change: '+4.3%',  volume: '$340K',  liquidity: '$1.8M',   up: true,  color: '#a78bfa' },
  { rank: 8, chain: 'Ethereum', sym: 'UNI',     name: 'Uniswap',     price: '$8.2400',  change: '-1.1%',  volume: '$18.4M', liquidity: '$124M',   up: false, color: '#ff007a' },
]

const CHAIN_COLORS: Record<string, string> = {
  Base:     '#2DD4BF',
  Ethereum: '#627EEA',
  Solana:   '#9945FF',
  Arbitrum: '#12AAFF',
}

const CHAINS: ChainFilter[] = ['All Chains', 'Ethereum', 'Solana', 'Arbitrum', 'Base']
const TIMES:  TimeFilter[]  = ['1H', '24H', '7D', '30D']

const CHIPS = [
  { label: 'Find trending tokens', icon: '🔥' },
  { label: 'Whale movements',      icon: '🐋' },
  { label: 'High volatility',      icon: '⚡' },
  { label: 'Smart money flow',     icon: '💎' },
]

// ─── Main component ───────────────────────────────────────────────────────

interface Props {
  active:    string | null
  toolLabel: string
}

export default function ClarkChat({ active, toolLabel }: Props) {
  const [query,    setQuery]    = useState('')
  const [chain,    setChain]    = useState<ChainFilter>('All Chains')
  const [time,     setTime]     = useState<TimeFilter>('24H')
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
      const data = await res.json()
      setResponse((data.text || '').trim() || 'CORTEX is processing — try again in a moment.')
    } catch {
      setResponse('CORTEX unreachable — check your connection.')
    } finally {
      setBusy(false)
    }
  }

  const filtered = chain === 'All Chains' ? TOKENS : TOKENS.filter(t => t.chain === chain)

  return (
    <div className="px-6 py-6 w-full max-w-[920px] mx-auto space-y-6">

      {/* ─── Clark AI Command Center Card ──────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42, ease: 'easeOut' }}
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(140deg, #0d1829 0%, #0a1220 55%, #080e1c 100%)',
          border: '1px solid rgba(255,255,255,0.09)',
        }}
      >
        {/* Ambient glows */}
        <div
          className="absolute -top-28 -left-20 w-[380px] h-[300px] rounded-full blur-3xl pointer-events-none"
          style={{ background: 'rgba(45,212,191,0.1)' }}
        />
        <div
          className="absolute -bottom-20 right-0 w-[320px] h-[260px] rounded-full blur-3xl pointer-events-none"
          style={{ background: 'rgba(139,92,246,0.1)' }}
        />
        {/* Top edge glow */}
        <div
          className="absolute inset-x-0 top-0 h-px pointer-events-none"
          style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(45,212,191,0.55) 35%, rgba(139,92,246,0.5) 70%, transparent 100%)' }}
        />

        <div className="relative px-8 pt-9 pb-8">

          {/* Icon + title */}
          <div className="flex items-center gap-4 mb-7">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
              style={{
                background: 'linear-gradient(135deg, rgba(45,212,191,0.18), rgba(139,92,246,0.18))',
                border: '1px solid rgba(45,212,191,0.28)',
                boxShadow: '0 0 28px rgba(45,212,191,0.18)',
              }}
            >
              <span
                style={{
                  fontSize: '20px',
                  background: 'linear-gradient(135deg, #2DD4BF, #8B5CF6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                ⚡
              </span>
            </div>
            <div>
              <h1 className="text-[22px] font-extrabold tracking-tight" style={{ color: '#f1f5f9' }}>
                Clark AI Command Center
              </h1>
              <p className="text-[12px] mt-0.5" style={{ color: '#3d5268' }}>
                Powered by CORTEX AI Engine · Base Intelligence Layer
              </p>
            </div>
          </div>

          {/* Search input */}
          <div className="relative mb-5">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleAsk() }}
              placeholder="Ask anything about Base chain..."
              disabled={busy}
              className="w-full rounded-xl text-[14px] outline-none transition-all disabled:opacity-50"
              style={{
                padding: '14px 148px 14px 18px',
                background: 'rgba(4,7,16,0.85)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#f1f5f9',
              }}
              onFocus={e => {
                e.currentTarget.style.borderColor = 'rgba(45,212,191,0.48)'
                e.currentTarget.style.boxShadow   = '0 0 0 3px rgba(45,212,191,0.07)'
              }}
              onBlur={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                e.currentTarget.style.boxShadow   = 'none'
              }}
            />
            <button
              onClick={handleAsk}
              disabled={!query.trim() || busy}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 rounded-lg text-[13px] font-bold transition-all disabled:opacity-30 active:scale-[0.97]"
              style={{
                background: 'linear-gradient(90deg, #2DD4BF 0%, #0ea5e9 100%)',
                color: '#fff',
                boxShadow: '0 0 18px rgba(45,212,191,0.32)',
              }}
            >
              Ask Clark
            </button>
          </div>

          {/* 4 action chips — 2×2 grid */}
          <div className="grid grid-cols-2 gap-2.5 mb-7">
            {CHIPS.map(chip => (
              <motion.button
                key={chip.label}
                onClick={() => setQuery(chip.label)}
                className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-[13px] font-medium text-left transition-colors"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#94a3b8',
                }}
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.1 }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLButtonElement
                  el.style.color       = '#2DD4BF'
                  el.style.borderColor = 'rgba(45,212,191,0.3)'
                  el.style.background  = 'rgba(45,212,191,0.06)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLButtonElement
                  el.style.color       = '#94a3b8'
                  el.style.borderColor = 'rgba(255,255,255,0.08)'
                  el.style.background  = 'rgba(255,255,255,0.04)'
                }}
              >
                <span>{chip.icon}</span>
                {chip.label}
              </motion.button>
            ))}
          </div>

          {/* Clark response */}
          {(busy || response) && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="flex gap-3 items-start p-4 rounded-xl mb-7"
              style={{
                background: 'rgba(139,92,246,0.07)',
                border: '1px solid rgba(139,92,246,0.18)',
              }}
            >
              <div
                className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5"
                style={{ background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(167,139,250,0.3)' }}
              >
                <span
                  className="text-[10px] font-bold text-[#a78bfa]"
                  style={{ fontFamily: 'var(--font-plex-mono)' }}
                >
                  C
                </span>
              </div>
              <div className="flex-1 pt-0.5">
                {busy ? (
                  <div className="flex items-center gap-2 py-1">
                    {[0, 0.15, 0.3].map((delay, i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full animate-pulse"
                        style={{ background: 'rgba(139,92,246,0.7)', animationDelay: `${delay}s` }}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-[13px] leading-relaxed" style={{ color: '#94a3b8' }}>
                    {response}
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* Stats row */}
          <div
            className="grid grid-cols-3 pt-6"
            style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
          >
            {[
              { label: 'Active Queries', value: '12,847' },
              { label: 'AI Accuracy',    value: '98.7%'  },
              { label: 'Data Sources',   value: '150+'   },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="flex flex-col items-center py-1"
                style={i > 0 ? { borderLeft: '1px solid rgba(255,255,255,0.07)' } : {}}
              >
                <p
                  className="text-[24px] font-black leading-none"
                  style={{
                    fontFamily: 'var(--font-plex-mono)',
                    background: 'linear-gradient(135deg, #2DD4BF 0%, #8B5CF6 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {stat.value}
                </p>
                <p className="text-[11px] mt-1.5" style={{ color: '#3d5268' }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

        </div>
      </motion.div>

      {/* ─── Token Screener ────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42, delay: 0.1, ease: 'easeOut' }}
      >

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-[18px] font-bold tracking-tight" style={{ color: '#f1f5f9' }}>
              Token Screener
            </h2>
            <div
              className="flex items-center gap-1.5 px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(45,212,191,0.1)', border: '1px solid rgba(45,212,191,0.2)' }}
            >
              <div
                className="w-1 h-1 rounded-full bg-[#2DD4BF]"
                style={{ boxShadow: '0 0 4px rgba(45,212,191,1)' }}
              />
              <span
                className="text-[9px] font-bold text-[#2DD4BF] tracking-wider"
                style={{ fontFamily: 'var(--font-plex-mono)' }}
              >
                LIVE
              </span>
            </div>
          </div>

          {/* Time filter */}
          <div
            className="flex gap-0.5 p-1 rounded-lg shrink-0"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            {TIMES.map(t => (
              <button
                key={t}
                onClick={() => setTime(t)}
                className="px-3 py-1.5 rounded-md text-[11px] font-semibold transition-all"
                style={
                  time === t
                    ? { background: 'rgba(45,212,191,0.14)', color: '#2DD4BF', border: '1px solid rgba(45,212,191,0.24)' }
                    : { color: '#475569', border: '1px solid transparent' }
                }
                onMouseEnter={e => {
                  if (time !== t) (e.currentTarget as HTMLButtonElement).style.color = '#94a3b8'
                }}
                onMouseLeave={e => {
                  if (time !== t) (e.currentTarget as HTMLButtonElement).style.color = '#475569'
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Chain filters */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {CHAINS.map(c => (
            <button
              key={c}
              onClick={() => setChain(c)}
              className="px-3.5 py-1.5 rounded-lg text-[12px] font-medium transition-all"
              style={
                chain === c
                  ? { background: 'rgba(45,212,191,0.12)', color: '#2DD4BF',  border: '1px solid rgba(45,212,191,0.25)' }
                  : { background: 'rgba(255,255,255,0.04)', color: '#475569', border: '1px solid rgba(255,255,255,0.07)' }
              }
              onMouseEnter={e => {
                if (chain !== c) {
                  const el = e.currentTarget as HTMLButtonElement
                  el.style.color = '#94a3b8'
                  el.style.borderColor = 'rgba(255,255,255,0.13)'
                }
              }}
              onMouseLeave={e => {
                if (chain !== c) {
                  const el = e.currentTarget as HTMLButtonElement
                  el.style.color = '#475569'
                  el.style.borderColor = 'rgba(255,255,255,0.07)'
                }
              }}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Table */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: '#080e1a', border: '1px solid rgba(255,255,255,0.07)' }}
        >

          {/* Column headers */}
          <div
            className="grid items-center px-5 py-3"
            style={{
              gridTemplateColumns: '40px 1fr 88px 110px 100px 100px 100px',
              background: 'rgba(255,255,255,0.025)',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            {['#', 'Token', 'Chain', 'Price', '24H Change', 'Volume', 'Liquidity'].map((h, i) => (
              <div
                key={h}
                className={`text-[10px] font-bold uppercase tracking-[0.13em] ${i === 0 ? 'text-center' : i === 1 ? 'text-left' : 'text-right'}`}
                style={{ color: '#2d4258' }}
              >
                {h}
              </div>
            ))}
          </div>

          {/* Rows */}
          {filtered.map((token, i) => (
            <motion.div
              key={token.sym}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.28, delay: i * 0.04 }}
              className="relative group grid items-center px-5 cursor-pointer hover:bg-white/[0.03]"
              style={{
                gridTemplateColumns: '40px 1fr 88px 110px 100px 100px 100px',
                paddingTop: '14px',
                paddingBottom: '14px',
                borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              }}
            >
              {/* Hover accent bar */}
              <div
                className="absolute inset-y-0 left-0 w-[3px] opacity-0 group-hover:opacity-100 transition-opacity rounded-r-full"
                style={{ background: token.color }}
              />

              {/* Rank */}
              <div
                className="text-center text-[12px]"
                style={{ fontFamily: 'var(--font-plex-mono)', color: '#2d4258' }}
              >
                {token.rank}
              </div>

              {/* Token identity */}
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold"
                  style={{ background: `${token.color}18`, color: token.color, border: `1px solid ${token.color}30` }}
                >
                  {token.sym.slice(0, 2)}
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold leading-tight" style={{ color: '#e2e8f0' }}>
                    {token.name}
                  </p>
                  <p
                    className="text-[10px] mt-0.5"
                    style={{ fontFamily: 'var(--font-plex-mono)', color: '#2d4258' }}
                  >
                    {token.sym}
                  </p>
                </div>
              </div>

              {/* Chain badge */}
              <div className="flex justify-end">
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-md"
                  style={{
                    color:      CHAIN_COLORS[token.chain] ?? '#64748b',
                    background: `${CHAIN_COLORS[token.chain] ?? '#64748b'}14`,
                    border:     `1px solid ${CHAIN_COLORS[token.chain] ?? '#64748b'}28`,
                  }}
                >
                  {token.chain}
                </span>
              </div>

              {/* Price */}
              <div
                className="text-right text-[13px] font-medium"
                style={{ fontFamily: 'var(--font-plex-mono)', color: '#e2e8f0' }}
              >
                {token.price}
              </div>

              {/* 24H Change */}
              <div
                className="text-right text-[13px] font-bold"
                style={{ fontFamily: 'var(--font-plex-mono)', color: token.up ? '#2DD4BF' : '#fb7185' }}
              >
                {token.change}
              </div>

              {/* Volume */}
              <div
                className="text-right text-[12px]"
                style={{ fontFamily: 'var(--font-plex-mono)', color: '#475569' }}
              >
                {token.volume}
              </div>

              {/* Liquidity */}
              <div
                className="text-right text-[12px]"
                style={{ fontFamily: 'var(--font-plex-mono)', color: '#3d5268' }}
              >
                {token.liquidity}
              </div>

            </motion.div>
          ))}

        </div>
      </motion.div>

    </div>
  )
}
