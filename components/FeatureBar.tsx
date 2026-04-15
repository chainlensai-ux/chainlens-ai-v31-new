'use client'

import Image from 'next/image'

const NAV_GROUPS = [
  {
    label: 'Scanners',
    items: [
      { key: 'token-scanner', label: 'Token Scanner' },
      { key: 'wallet-scanner', label: 'Wallet Scanner' },
      { key: 'dev-wallet', label: 'Dev Wallet Detector' },
      { key: 'liquidity-scanner', label: 'Liquidity Safety' },
    ],
  },
  {
    label: 'Alerts',
    items: [
      { key: 'whale-alerts', label: 'Whale Alerts' },
      { key: 'pump-alerts', label: 'Pump Alerts' },
    ],
  },
  {
    label: 'Radar & AI',
    items: [
      { key: 'base-radar', label: 'Base Radar' },
      { key: 'clark-ai', label: 'Clark AI' },
    ],
  },
]

interface Props {
  active: string | null
  onSelect: (key: string) => void
}

function NavItem({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2 pl-3 pr-2 py-[7px] rounded-lg text-[12px] font-medium transition-colors text-left
        border-l-2 ${isActive
          ? 'bg-[#2DD4BF]/[0.08] text-[#2DD4BF] border-[#2DD4BF]'
          : 'text-[#94a3b8] hover:text-white hover:bg-white/[0.04] border-transparent'
        }`}
    >
      {label}
    </button>
  )
}

export default function FeatureBar({ active, onSelect }: Props) {
  return (
    <aside className="w-[240px] shrink-0 h-screen flex flex-col bg-[#080c14] border-r border-white/[0.08]">

      {/* Logo + Home */}
      <div className="px-4 pt-5 pb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2.5 mb-4">
          <Image src="/cl-logo.png" alt="ChainLens AI" width={26} height={26} />
          <div>
            <div className="text-[13px] font-bold text-white leading-tight" style={{ fontFamily: 'var(--font-mono)' }}>
              Chain<span className="text-[#2DD4BF]">Lens</span>
            </div>
            <div className="text-[9px] text-[#475569] tracking-[0.12em] uppercase mt-0.5" style={{ fontFamily: 'var(--font-mono)' }}>
              AI Terminal
            </div>
          </div>
        </div>

        <button
          onClick={() => onSelect('home')}
          className={`w-full flex items-center gap-2.5 pl-3 pr-2 py-[7px] rounded-lg transition-colors border-l-2 ${
            active === 'home'
              ? 'bg-[#2DD4BF]/[0.08] text-[#2DD4BF] border-[#2DD4BF]'
              : 'text-[#94a3b8] hover:text-white hover:bg-white/[0.04] border-transparent'
          }`}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <div>
            <div className="text-[12px] font-medium leading-tight">Home</div>
            <div className="text-[10px] text-[#475569] mt-0.5">Dashboard</div>
          </div>
        </button>
      </div>

      {/* Tools header */}
      <div className="px-4 pt-4 pb-2">
        <span className="text-[9px] font-semibold text-[#475569] tracking-[0.14em] uppercase" style={{ fontFamily: 'var(--font-mono)' }}>
          Tools
        </span>
      </div>

      {/* Nav groups — scrollable */}
      <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-1">
        {NAV_GROUPS.map(group => (
          <div key={group.label}>
            <div className="px-2 pt-3 pb-1.5">
              <span className="text-[9px] text-[#475569] tracking-[0.1em] uppercase" style={{ fontFamily: 'var(--font-mono)' }}>
                {group.label}
              </span>
            </div>
            <div className="space-y-0.5">
              {group.items.map(item => (
                <NavItem
                  key={item.key}
                  label={item.label}
                  isActive={active === item.key}
                  onClick={() => onSelect(item.key)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom actions */}
      <div className="px-3 py-4 border-t border-white/[0.08] space-y-1">
        <button className="w-full flex items-center gap-2.5 pl-3 pr-2 py-[7px] rounded-lg text-[12px] text-[#94a3b8] hover:text-white hover:bg-white/[0.04] transition-colors">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
          </svg>
          Settings
        </button>
        <button className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-[10px] text-[12px] font-semibold bg-[#2DD4BF]/[0.08] text-[#2DD4BF] hover:bg-[#2DD4BF]/[0.14] border border-[#2DD4BF]/30 transition-colors">
          Connect Wallet
        </button>
      </div>

    </aside>
  )
}
