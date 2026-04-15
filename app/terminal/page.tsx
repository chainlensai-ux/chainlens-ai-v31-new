'use client'

import { useState } from 'react'
import FeatureBar from '@/components/FeatureBar'
import ClarkChat from '@/components/ClarkChat'
import ClarkRadar from '@/components/ClarkRadar'

const TOOL_LABELS: Record<string, string> = {
  'home':               'Dashboard',
  'token-scanner':      'Token Scanner',
  'wallet-scanner':     'Wallet Scanner',
  'dev-wallet':         'Dev Wallet Detector',
  'liquidity-scanner':  'Liquidity Safety',
  'whale-alerts':       'Whale Alerts',
  'pump-alerts':        'Pump Alerts',
  'base-radar':         'Base Radar',
  'clark-ai':           'Clark AI',
}

export default function TerminalPage() {
  const [active, setActive] = useState<string | null>('home')
  const toolLabel = active ? (TOOL_LABELS[active] ?? active) : 'Terminal'

  return (
    <div className="flex h-screen bg-[#06060a] text-white overflow-hidden">

      <FeatureBar active={active} onSelect={setActive} />

      {/* Content column — padded so panels float as cards */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden p-3 gap-3">

        {/* Topbar card */}
        <header className="h-12 shrink-0 flex items-center justify-between px-5 bg-[#080c14] border border-white/[0.08] rounded-xl">

          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5">
            <span
              className="text-[11px] text-[#475569]"
              style={{ fontFamily: 'var(--font-plex-mono)' }}
            >
              terminal
            </span>
            <span className="text-[11px] text-[#2a3a4a]">/</span>
            <span
              className="text-[11px] font-medium text-[#94a3b8]"
              style={{ fontFamily: 'var(--font-plex-mono)' }}
            >
              {toolLabel}
            </span>
          </div>

          {/* Search */}
          <div className="flex items-center gap-2 bg-[#06060a] border border-white/[0.07] rounded-lg px-3 py-1.5 w-56">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span className="text-[12px] text-[#334155]">Search tokens, wallets...</span>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF]" />
              <span className="text-[12px] text-[#475569]">CORTEX live</span>
            </div>
            <div className="w-px h-4 bg-white/[0.07]" />
            <button className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.07] rounded-lg px-2.5 py-1.5 hover:bg-white/[0.07] transition-colors">
              <div className="w-5 h-5 rounded-full bg-[#8b5cf6]/20 border border-[#8b5cf6]/30 flex items-center justify-center">
                <span className="text-[9px] font-bold text-[#8b5cf6]">U</span>
              </div>
              <span className="text-[12px] text-[#64748b] font-medium">Account</span>
            </button>
          </div>
        </header>

        {/* Panels row — gap creates visible separation */}
        <div className="flex flex-1 gap-3 overflow-hidden min-h-0">
          <ClarkChat active={active} toolLabel={toolLabel} />
          <ClarkRadar onSelectRadar={setActive} />
        </div>

      </div>
    </div>
  )
}
