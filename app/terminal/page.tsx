'use client'

import { useState } from 'react'
import FeatureBar from '@/components/FeatureBar'
import ClarkChat from '@/components/ClarkChat'
import ClarkRadar from '@/components/ClarkRadar'

const TOOL_LABELS: Record<string, string> = {
  'home': 'Dashboard',
  'token-scanner': 'Token Scanner',
  'wallet-scanner': 'Wallet Scanner',
  'dev-wallet': 'Dev Wallet Detector',
  'liquidity-scanner': 'Liquidity Safety',
  'whale-alerts': 'Whale Alerts',
  'pump-alerts': 'Pump Alerts',
  'base-radar': 'Base Radar',
  'clark-ai': 'Clark AI',
}

export default function TerminalPage() {
  const [active, setActive] = useState<string | null>('home')
  const toolLabel = active ? (TOOL_LABELS[active] ?? active) : 'Terminal'

  return (
    <div className="flex h-screen bg-[#06060a] text-white overflow-hidden">

      <FeatureBar active={active} onSelect={setActive} />

      {/* Content column */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Topbar */}
        <header className="h-11 shrink-0 flex items-center justify-between px-5 bg-[#080c14] border-b border-white/[0.08]">

          {/* Left: breadcrumb */}
          <div className="flex items-center gap-1.5">
            <span
              className="text-[10px] text-[#334155]"
              style={{ fontFamily: 'var(--font-plex-mono)' }}
            >
              terminal
            </span>
            <span className="text-[10px] text-[#1e2d3d]">/</span>
            <span
              className="text-[10px] text-[#64748b] font-medium"
              style={{ fontFamily: 'var(--font-plex-mono)' }}
            >
              {toolLabel}
            </span>
          </div>

          {/* Center: search slot */}
          <div className="flex items-center gap-2 bg-[#06060a] border border-white/[0.06] rounded-[7px] px-3 py-1.5 w-52">
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2a3a4a"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span
              className="text-[10px] text-[#1e2d3d]"
              style={{ fontFamily: 'var(--font-plex-mono)' }}
            >
              Search tokens, wallets...
            </span>
          </div>

          {/* Right: status + account */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF]" />
              <span
                className="text-[10px] text-[#334155]"
                style={{ fontFamily: 'var(--font-plex-mono)' }}
              >
                CORTEX live
              </span>
            </div>
            <div className="w-px h-3.5 bg-white/[0.06]" />
            <div className="flex items-center gap-1.5 bg-white/[0.03] border border-white/[0.06] rounded-[6px] px-2 py-1 cursor-pointer hover:bg-white/[0.06] transition-colors">
              <div className="w-[18px] h-[18px] rounded-full bg-[#8b5cf6]/[0.15] border border-[#8b5cf6]/[0.25] flex items-center justify-center">
                <span className="text-[8px] font-bold text-[#8b5cf6]">U</span>
              </div>
              <span
                className="text-[10px] text-[#475569]"
                style={{ fontFamily: 'var(--font-plex-mono)' }}
              >
                Account
              </span>
            </div>
          </div>
        </header>

        {/* Main panels */}
        <div className="flex flex-1 overflow-hidden">
          <ClarkChat active={active} toolLabel={toolLabel} />
          <ClarkRadar onSelectRadar={setActive} />
        </div>

      </div>
    </div>
  )
}
