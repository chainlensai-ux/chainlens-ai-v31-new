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

      {/* ── Sidebar ── */}
      <FeatureBar active={active} onSelect={setActive} />

      {/* ── Content column ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* ── Topbar ── */}
        <header className="h-12 shrink-0 flex items-center justify-between px-4 bg-[#080c14] border-b border-white/[0.08]">
          {/* Left: breadcrumb */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#475569]" style={{ fontFamily: 'var(--font-mono)' }}>
              terminal
            </span>
            <span className="text-[11px] text-[#475569]">/</span>
            <span className="text-[11px] text-white font-medium" style={{ fontFamily: 'var(--font-mono)' }}>
              {toolLabel}
            </span>
          </div>

          {/* Center: search slot */}
          <div className="flex items-center gap-2 bg-[#06060a] border border-white/[0.08] rounded-[8px] px-3 py-1.5 w-64">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span className="text-[11px] text-[#475569]" style={{ fontFamily: 'var(--font-mono)' }}>
              Search tokens, wallets...
            </span>
          </div>

          {/* Right: status + actions */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF] animate-pulse" />
              <span className="text-[10px] text-[#475569]" style={{ fontFamily: 'var(--font-mono)' }}>
                CORTEX live
              </span>
            </div>
            <div className="w-px h-4 bg-white/[0.08]" />
            <div className="flex items-center gap-1.5 bg-white/[0.04] border border-white/[0.08] rounded-[8px] px-2.5 py-1 cursor-pointer hover:bg-white/[0.07] transition-colors">
              <div className="w-4 h-4 rounded-full bg-[#8b5cf6]/30 border border-[#8b5cf6]/40 flex items-center justify-center text-[8px] text-[#8b5cf6]">
                U
              </div>
              <span className="text-[11px] text-[#94a3b8]">Account</span>
            </div>
          </div>
        </header>

        {/* ── Main panels ── */}
        <div className="flex flex-1 overflow-hidden">
          <ClarkChat active={active} toolLabel={toolLabel} />
          <ClarkRadar onSelectRadar={setActive} />
        </div>

      </div>
    </div>
  )
}
