'use client'

import Image from 'next/image'

const NAV_GROUPS = [
  {
    label: 'Scanners',
    items: [
      { key: 'token-scanner', label: 'Token Scanner' },
      { key: 'wallet-scanner', label: 'Wallet Scanner' },
      { key: 'dev-wallet', label: 'Dev Wallet' },
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

interface NavItemProps {
  label: string
  isActive: boolean
  onClick: () => void
}

function NavItem({ label, isActive, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={[
        'w-full flex items-center pl-3 pr-2 py-[6px] rounded-[5px] text-left border-l-2 transition-colors',
        isActive
          ? 'bg-[#2DD4BF]/[0.07] text-[#2DD4BF] border-[#2DD4BF]'
          : 'text-[#3d5066] hover:text-[#64748b] hover:bg-white/[0.03] border-transparent',
      ].join(' ')}
    >
      <span
        className="text-[11px] font-medium truncate"
        style={{ fontFamily: 'var(--font-plex-mono)' }}
      >
        {label}
      </span>
    </button>
  )
}

export default function FeatureBar({ active, onSelect }: Props) {
  return (
    <aside className="w-[220px] shrink-0 h-screen flex flex-col bg-[#080c14] border-r border-white/[0.08] overflow-hidden">

      {/* Logo */}
      <div className="px-4 pt-5 pb-4 border-b border-white/[0.06] shrink-0">
        <div className="flex items-center gap-2.5">
          <Image
            src="/cl-logo.png"
            alt="ChainLens AI"
            width={24}
            height={24}
            className="opacity-90 shrink-0"
          />
          <div className="min-w-0">
            <div
              className="text-[13px] font-bold text-white leading-tight tracking-tight"
              style={{ fontFamily: 'var(--font-plex-mono)' }}
            >
              Chain<span className="text-[#2DD4BF]">Lens</span>
            </div>
            <div
              className="text-[9px] text-[#2a3a4a] tracking-[0.14em] uppercase mt-0.5"
              style={{ fontFamily: 'var(--font-plex-mono)' }}
            >
              AI Terminal
            </div>
          </div>
        </div>
      </div>

      {/* Home */}
      <div className="px-3 pt-3 pb-2 shrink-0">
        <button
          onClick={() => onSelect('home')}
          className={[
            'w-full flex items-center gap-2 pl-3 pr-2 py-[6px] rounded-[5px] transition-colors border-l-2',
            active === 'home'
              ? 'bg-[#2DD4BF]/[0.07] text-[#2DD4BF] border-[#2DD4BF]'
              : 'text-[#3d5066] hover:text-[#64748b] hover:bg-white/[0.03] border-transparent',
          ].join(' ')}
        >
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shrink-0"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span
            className="text-[11px] font-medium"
            style={{ fontFamily: 'var(--font-plex-mono)' }}
          >
            Home
          </span>
        </button>
      </div>

      {/* Tools label */}
      <div className="px-4 pb-1 shrink-0">
        <span
          className="text-[8px] font-semibold text-[#1e2d3d] tracking-[0.18em] uppercase"
          style={{ fontFamily: 'var(--font-plex-mono)' }}
        >
          Tools
        </span>
      </div>

      {/* Nav groups */}
      <nav className="flex-1 overflow-y-auto px-3 pb-2 space-y-1">
        {NAV_GROUPS.map(group => (
          <div key={group.label}>
            <div className="px-1 pt-3 pb-1.5">
              <span
                className="text-[8px] text-[#1e2d3d] tracking-[0.14em] uppercase"
                style={{ fontFamily: 'var(--font-plex-mono)' }}
              >
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
      </nav>

      {/* Bottom actions */}
      <div className="px-3 py-3 border-t border-white/[0.06] space-y-1.5 shrink-0">
        <button
          className="w-full flex items-center gap-2 pl-3 pr-2 py-[6px] rounded-[5px] transition-colors text-[#2a3a4a] hover:text-[#3d5066] hover:bg-white/[0.03]"
          style={{ fontFamily: 'var(--font-plex-mono)' }}
        >
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shrink-0"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
          </svg>
          <span className="text-[11px] font-medium">Settings</span>
        </button>
        <button
          className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-[7px] bg-[#2DD4BF]/[0.07] text-[#2DD4BF] hover:bg-[#2DD4BF]/[0.11] border border-[#2DD4BF]/[0.2] transition-colors"
          style={{ fontFamily: 'var(--font-plex-mono)' }}
        >
          <span className="text-[10px] font-semibold">Connect Wallet</span>
        </button>
      </div>

    </aside>
  )
}
