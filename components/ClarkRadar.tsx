'use client'

const LIVE_SIGNALS = [
  { pair: 'BRETT/WETH', chain: 'Base', change: '+18.4%', signal: 'BUY', up: true },
  { pair: 'TOSHI/WETH', chain: 'Base', change: '+6.2%', signal: 'WATCH', up: true },
  { pair: 'VIRTUAL/ETH', chain: 'Base', change: '-3.1%', signal: 'SELL', up: false },
]

const WALLET_ACTIVITY = [
  { addr: '0x7a25...88D', action: 'Bought 2.4 ETH of BRETT', time: '2m ago' },
  { addr: '0xd8dA...6045', action: 'Sold 50K TOSHI', time: '7m ago' },
  { addr: '0xAb5C...4Fe2', action: 'Added $120K LP on Base', time: '14m ago' },
  { addr: '0x1f98...4B5a', action: 'Bridged 18 ETH → Base', time: '21m ago' },
]

const TOKEN_MOMENTUM = [
  { sym: 'BRETT', pct: '+18.4%', vol: '$2.1M', up: true },
  { sym: 'AERO', pct: '+9.1%', vol: '$890K', up: true },
  { sym: 'HIGHER', pct: '+4.3%', vol: '$340K', up: true },
  { sym: 'DEGEN', pct: '-4.2%', vol: '$440K', up: false },
]

const AI_NOTES = [
  'Smart money rotating into Base meme layer — watch BRETT cluster.',
  'Unusual LP removal on VIRTUAL/WETH — rug risk elevated.',
  'BTC dominance rising — alt momentum may slow in 24–48h.',
]

function PanelSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-white/[0.06] last:border-none">
      <div className="px-4 pt-4 pb-2">
        <span className="text-[9px] font-semibold text-[#475569] uppercase tracking-[0.12em]" style={{ fontFamily: 'var(--font-mono)' }}>
          {title}
        </span>
      </div>
      <div className="px-3 pb-3">
        {children}
      </div>
    </div>
  )
}

const SIGNAL_COLORS: Record<string, string> = {
  BUY: 'text-[#2DD4BF] bg-[#2DD4BF]/[0.1] border-[#2DD4BF]/25',
  WATCH: 'text-amber-400 bg-amber-400/[0.1] border-amber-400/25',
  SELL: 'text-rose-400 bg-rose-400/[0.1] border-rose-400/25',
}

export default function ClarkRadar({ onSelectRadar }: { onSelectRadar: (val: string) => void }) {
  return (
    <aside className="w-[288px] shrink-0 flex flex-col bg-[#080c14] border-l border-white/[0.08] overflow-y-auto">

      {/* Live Signal */}
      <PanelSection title="Live Signal">
        <div className="space-y-1.5">
          {LIVE_SIGNALS.map((s, i) => (
            <button
              key={i}
              onClick={() => onSelectRadar(s.pair.split('/')[0].toLowerCase())}
              className="w-full flex items-center justify-between px-2.5 py-2 rounded-[8px] bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] transition-colors group"
            >
              <div className="text-left">
                <div className="text-[11px] font-semibold text-white group-hover:text-[#2DD4BF] transition-colors" style={{ fontFamily: 'var(--font-mono)' }}>
                  {s.pair}
                </div>
                <div className="text-[9px] text-[#475569] mt-0.5">{s.chain}</div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`text-[10px] font-bold ${s.up ? 'text-[#2DD4BF]' : 'text-rose-400'}`} style={{ fontFamily: 'var(--font-mono)' }}>
                  {s.change}
                </span>
                <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-[5px] border ${SIGNAL_COLORS[s.signal]}`}>
                  {s.signal}
                </span>
              </div>
            </button>
          ))}
        </div>
      </PanelSection>

      {/* Wallet Activity */}
      <PanelSection title="Wallet Activity">
        <div className="space-y-2">
          {WALLET_ACTIVITY.map((w, i) => (
            <div key={i} className="flex gap-2 items-start">
              <div className="shrink-0 w-1.5 h-1.5 rounded-full bg-[#2DD4BF]/50 mt-1.5" />
              <div>
                <div className="text-[10px] font-semibold text-[#94a3b8]" style={{ fontFamily: 'var(--font-mono)' }}>
                  {w.addr}
                </div>
                <div className="text-[10px] text-[#475569] mt-0.5 leading-snug">{w.action}</div>
              </div>
              <div className="ml-auto shrink-0 text-[9px] text-[#475569] pt-0.5" style={{ fontFamily: 'var(--font-mono)' }}>
                {w.time}
              </div>
            </div>
          ))}
        </div>
      </PanelSection>

      {/* Token Momentum */}
      <PanelSection title="Token Momentum">
        <div className="space-y-1.5">
          {TOKEN_MOMENTUM.map((t, i) => (
            <div key={i} className="flex items-center gap-2 px-2 py-1.5 rounded-[8px] hover:bg-white/[0.04] transition-colors cursor-default">
              <span className="text-[11px] font-bold text-white w-14 shrink-0" style={{ fontFamily: 'var(--font-mono)' }}>
                {t.sym}
              </span>
              <div className="flex-1 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className={`h-full rounded-full ${t.up ? 'bg-[#2DD4BF]' : 'bg-rose-400'}`}
                  style={{ width: `${Math.min(100, Math.abs(parseFloat(t.pct)) * 4)}%` }}
                />
              </div>
              <span className={`text-[10px] font-bold w-12 text-right shrink-0 ${t.up ? 'text-[#2DD4BF]' : 'text-rose-400'}`} style={{ fontFamily: 'var(--font-mono)' }}>
                {t.pct}
              </span>
              <span className="text-[9px] text-[#475569] w-10 text-right shrink-0" style={{ fontFamily: 'var(--font-mono)' }}>
                {t.vol}
              </span>
            </div>
          ))}
        </div>
      </PanelSection>

      {/* AI Notes */}
      <PanelSection title="AI Notes">
        <div className="space-y-2">
          {AI_NOTES.map((note, i) => (
            <div key={i} className="flex gap-2 items-start px-2 py-1.5 rounded-[8px] bg-[#8b5cf6]/[0.05] border border-[#8b5cf6]/[0.12]">
              <span className="shrink-0 text-[#8b5cf6] text-[9px] mt-0.5 font-bold" style={{ fontFamily: 'var(--font-mono)' }}>C</span>
              <p className="text-[10px] text-[#94a3b8] leading-snug">{note}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-1.5 px-1">
          <div className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF] animate-pulse" />
          <span className="text-[9px] text-[#475569]" style={{ fontFamily: 'var(--font-mono)' }}>CORTEX monitoring live</span>
        </div>
      </PanelSection>

    </aside>
  )
}
