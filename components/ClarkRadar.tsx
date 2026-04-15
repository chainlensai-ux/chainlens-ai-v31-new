'use client'

import type { ReactNode } from 'react'

const LIVE_SIGNALS = [
  { pair: 'BRETT/WETH',   chain: 'Base', change: '+18.4%', signal: 'BUY',   up: true  },
  { pair: 'TOSHI/WETH',   chain: 'Base', change: '+6.2%',  signal: 'WATCH', up: true  },
  { pair: 'VIRTUAL/ETH',  chain: 'Base', change: '-3.1%',  signal: 'SELL',  up: false },
]

const WALLET_ACTIVITY = [
  { addr: '0x7a25...88D',  action: 'Bought 2.4 ETH of BRETT', time: '2m' },
  { addr: '0xd8dA...6045', action: 'Sold 50K TOSHI',          time: '7m' },
  { addr: '0xAb5C...4Fe2', action: 'Added $120K LP on Base',  time: '14m' },
  { addr: '0x1f98...4B5a', action: 'Bridged 18 ETH → Base',   time: '21m' },
]

const TOKEN_MOMENTUM = [
  { sym: 'BRETT',  pct: '+18.4%', vol: '$2.1M', up: true,  bar: 74 },
  { sym: 'AERO',   pct: '+9.1%',  vol: '$890K', up: true,  bar: 36 },
  { sym: 'HIGHER', pct: '+4.3%',  vol: '$340K', up: true,  bar: 17 },
  { sym: 'DEGEN',  pct: '-4.2%',  vol: '$440K', up: false, bar: 17 },
]

const AI_NOTES = [
  'Smart money rotating into Base meme layer.',
  'Unusual LP removal on VIRTUAL/WETH — rug risk elevated.',
  'BTC dominance rising — alt momentum may slow.',
]

const SIGNAL_COLORS: Record<string, string> = {
  BUY:   'text-[#2DD4BF] bg-[#2DD4BF]/[0.08] border-[#2DD4BF]/[0.18]',
  WATCH: 'text-amber-400 bg-amber-400/[0.08] border-amber-400/[0.18]',
  SELL:  'text-rose-400  bg-rose-400/[0.08]  border-rose-400/[0.18]',
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border-b border-white/[0.05] last:border-none">
      <div className="px-4 pt-3.5 pb-2">
        <span
          className="text-[8px] font-semibold text-[#1e2d3d] uppercase tracking-[0.15em]"
          style={{ fontFamily: 'var(--font-plex-mono)' }}
        >
          {title}
        </span>
      </div>
      <div className="px-3 pb-3">
        {children}
      </div>
    </div>
  )
}

export default function ClarkRadar({ onSelectRadar }: { onSelectRadar: (val: string) => void }) {
  return (
    <aside className="w-[272px] shrink-0 flex flex-col bg-[#080c14] border-l border-white/[0.08] overflow-y-auto overflow-x-hidden">

      {/* Panel header */}
      <div className="shrink-0 flex items-center justify-between px-4 h-9 border-b border-white/[0.06]">
        <span
          className="text-[10px] font-semibold text-[#2a3a4a] tracking-[0.1em]"
          style={{ fontFamily: 'var(--font-plex-mono)' }}
        >
          CLARK RADAR
        </span>
        <div className="flex items-center gap-1.5">
          <div className="w-1 h-1 rounded-full bg-[#2DD4BF]" />
          <span
            className="text-[9px] text-[#1e2d3d]"
            style={{ fontFamily: 'var(--font-plex-mono)' }}
          >
            LIVE
          </span>
        </div>
      </div>

      {/* Live Signal */}
      <Section title="Live Signal">
        <div className="space-y-1">
          {LIVE_SIGNALS.map((s, i) => (
            <button
              key={i}
              onClick={() => onSelectRadar(s.pair.split('/')[0].toLowerCase())}
              className="w-full flex items-center gap-2 px-2.5 py-2 rounded-[5px] bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.04] hover:border-white/[0.07] transition-colors"
            >
              <div className="flex-1 min-w-0 text-left">
                <div
                  className="text-[10px] font-semibold text-[#475569] truncate"
                  style={{ fontFamily: 'var(--font-plex-mono)' }}
                >
                  {s.pair}
                </div>
                <div
                  className="text-[8px] text-[#1e2d3d] mt-0.5"
                  style={{ fontFamily: 'var(--font-plex-mono)' }}
                >
                  {s.chain}
                </div>
              </div>
              <span
                className={`text-[9px] font-bold shrink-0 ${s.up ? 'text-[#2DD4BF]' : 'text-rose-400'}`}
                style={{ fontFamily: 'var(--font-plex-mono)' }}
              >
                {s.change}
              </span>
              <span
                className={`text-[8px] font-semibold px-1.5 py-0.5 rounded-[3px] border shrink-0 ${SIGNAL_COLORS[s.signal]}`}
                style={{ fontFamily: 'var(--font-plex-mono)' }}
              >
                {s.signal}
              </span>
            </button>
          ))}
        </div>
      </Section>

      {/* Wallet Activity */}
      <Section title="Wallet Activity">
        <div className="space-y-2">
          {WALLET_ACTIVITY.map((w, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="shrink-0 w-1 h-1 rounded-full bg-[#2a3a4a] mt-1.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-1">
                  <span
                    className="text-[10px] font-medium text-[#334155] truncate"
                    style={{ fontFamily: 'var(--font-plex-mono)' }}
                  >
                    {w.addr}
                  </span>
                  <span
                    className="text-[8px] text-[#1e2d3d] shrink-0"
                    style={{ fontFamily: 'var(--font-plex-mono)' }}
                  >
                    {w.time}
                  </span>
                </div>
                <div
                  className="text-[10px] text-[#2a3a4a] mt-0.5 leading-snug truncate"
                  style={{ fontFamily: 'var(--font-plex-mono)' }}
                >
                  {w.action}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Token Momentum */}
      <Section title="Token Momentum">
        <div className="space-y-2">
          {TOKEN_MOMENTUM.map((t, i) => (
            <div key={i} className="flex items-center gap-2">
              <span
                className="text-[10px] font-bold text-[#334155] w-[44px] shrink-0"
                style={{ fontFamily: 'var(--font-plex-mono)' }}
              >
                {t.sym}
              </span>
              <div className="flex-1 h-[2px] rounded-full bg-white/[0.05] overflow-hidden">
                <div
                  className={`h-full rounded-full ${t.up ? 'bg-[#2DD4BF]/[0.45]' : 'bg-rose-400/[0.45]'}`}
                  style={{ width: `${t.bar}%` }}
                />
              </div>
              <span
                className={`text-[9px] font-bold w-[40px] text-right shrink-0 ${t.up ? 'text-[#2DD4BF]' : 'text-rose-400'}`}
                style={{ fontFamily: 'var(--font-plex-mono)' }}
              >
                {t.pct}
              </span>
              <span
                className="text-[8px] text-[#1e2d3d] w-[34px] text-right shrink-0"
                style={{ fontFamily: 'var(--font-plex-mono)' }}
              >
                {t.vol}
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* AI Notes */}
      <Section title="AI Notes">
        <div className="space-y-1.5">
          {AI_NOTES.map((note, i) => (
            <div
              key={i}
              className="flex gap-2 items-start px-2.5 py-2 rounded-[5px] bg-white/[0.02] border border-white/[0.04]"
            >
              <span
                className="shrink-0 text-[8px] font-bold text-[#334155] mt-0.5"
                style={{ fontFamily: 'var(--font-plex-mono)' }}
              >
                C
              </span>
              <p
                className="text-[10px] text-[#2a3a4a] leading-snug"
                style={{ fontFamily: 'var(--font-plex-mono)' }}
              >
                {note}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-1.5 px-1">
          <div className="w-1 h-1 rounded-full bg-[#2DD4BF]" />
          <span
            className="text-[9px] text-[#1e2d3d]"
            style={{ fontFamily: 'var(--font-plex-mono)' }}
          >
            CORTEX monitoring live
          </span>
        </div>
      </Section>

    </aside>
  )
}
