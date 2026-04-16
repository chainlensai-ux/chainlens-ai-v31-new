'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

// ─── Icons ────────────────────────────────────────────────────────────────

function IcDashboard() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/>
      <rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="14" y="14" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/>
    </svg>
  )
}
function IcRadar() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5.64 17.36a9 9 0 1 1 12.72 0"/>
      <path d="M8.46 14.54a5 5 0 1 1 7.07 0"/>
      <circle cx="12" cy="12" r="1" fill="currentColor"/>
    </svg>
  )
}
function IcMarkets() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  )
}
function IcPortfolio() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  )
}
function IcAIInsights() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/>
      <path d="M19 3v4m2-2h-4"/>
    </svg>
  )
}
function IcSecurity() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  )
}
function IcReports() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  )
}
function IcSettings() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
    </svg>
  )
}

// ─── Data ─────────────────────────────────────────────────────────────────

type Item = { key: string; label: string; icon: ReactNode }

const NAV: Item[] = [
  { key: 'dashboard',   label: 'Dashboard',  icon: <IcDashboard />  },
  { key: 'radar',       label: 'Radar',       icon: <IcRadar />      },
  { key: 'markets',     label: 'Markets',     icon: <IcMarkets />    },
  { key: 'portfolio',   label: 'Portfolio',   icon: <IcPortfolio />  },
  { key: 'ai-insights', label: 'AI Insights', icon: <IcAIInsights /> },
  { key: 'security',    label: 'Security',    icon: <IcSecurity />   },
  { key: 'reports',     label: 'Reports',     icon: <IcReports />    },
  { key: 'settings',    label: 'Settings',    icon: <IcSettings />   },
]

// ─── NavItem ──────────────────────────────────────────────────────────────

interface NavItemProps {
  item:     Item
  active:   string | null
  onSelect: (key: string) => void
}

function NavItem({ item, active, onSelect }: NavItemProps) {
  const on = active === item.key

  return (
    <motion.button
      onClick={() => onSelect(item.key)}
      className="w-full flex items-center gap-3 px-3 text-[13px] font-medium transition-colors"
      style={{
        height: '40px',
        borderRadius: '10px',
        background: on ? 'rgba(45,212,191,0.12)' : 'transparent',
        border:     on ? '1px solid rgba(45,212,191,0.22)' : '1px solid transparent',
        color:      on ? '#2DD4BF' : '#4d6280',
      }}
      whileHover={!on ? { x: 2 } : {}}
      transition={{ duration: 0.12 }}
      onMouseEnter={e => {
        if (!on) {
          const el = e.currentTarget as HTMLButtonElement
          el.style.color      = '#94a3b8'
          el.style.background = 'rgba(255,255,255,0.04)'
        }
      }}
      onMouseLeave={e => {
        if (!on) {
          const el = e.currentTarget as HTMLButtonElement
          el.style.color      = '#4d6280'
          el.style.background = 'transparent'
        }
      }}
    >
      <span style={{ color: on ? '#2DD4BF' : '#3d5268' }}>
        {item.icon}
      </span>
      {item.label}
    </motion.button>
  )
}

// ─── Component ────────────────────────────────────────────────────────────

interface Props {
  active?:   string | null
  onSelect?: (key: string) => void
}

export default function FeatureBar({ active = 'dashboard', onSelect = () => {} }: Props) {
  return (
    <aside
      className="w-[250px] h-screen shrink-0 flex flex-col"
      style={{ background: '#07090f', borderRight: '1px solid rgba(255,255,255,0.07)' }}
    >

      {/* ── Branding ─────────────────────────────────────────────── */}
      <div
        className="relative px-5 pt-6 pb-5 shrink-0 overflow-hidden"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 10% 60%, rgba(45,212,191,0.07) 0%, transparent 65%)' }}
        />
        <div className="relative flex items-center gap-3">
          <div
            className="shrink-0 rounded-xl p-1.5"
            style={{
              background: 'rgba(45,212,191,0.08)',
              border: '1px solid rgba(45,212,191,0.18)',
              boxShadow: '0 0 14px rgba(45,212,191,0.1)',
            }}
          >
            <Image src="/cl-logo.png" alt="ChainLens AI" width={32} height={32} className="shrink-0" />
          </div>
          <div>
            <p className="text-[15px] font-extrabold leading-tight tracking-tight" style={{ color: '#f8fafc' }}>
              Chain<span style={{ color: '#2DD4BF' }}>Lens</span>
            </p>
            <p className="text-[10px] font-medium mt-0.5" style={{ color: '#2d4258' }}>
              Base Intelligence Terminal
            </p>
          </div>
        </div>
      </div>

      {/* ── Navigation ───────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-0.5">
        {NAV.map(item => (
          <NavItem key={item.key} item={item} active={active} onSelect={onSelect} />
        ))}
      </nav>

      {/* ── Bottom CTAs ──────────────────────────────────────────── */}
      <div
        className="shrink-0 px-3 py-4 flex flex-col gap-2"
        style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
      >

        {/* Connect Wallet — large, solid teal */}
        <button
          className="w-full h-11 rounded-xl text-[13px] font-bold tracking-wide transition-all active:scale-[0.98]"
          style={{
            background: 'linear-gradient(90deg, #2DD4BF 0%, #14b8a6 100%)',
            color: '#061210',
            boxShadow: '0 0 22px rgba(45,212,191,0.28)',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLButtonElement
            el.style.boxShadow = '0 0 32px rgba(45,212,191,0.44)'
            el.style.opacity   = '0.92'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLButtonElement
            el.style.boxShadow = '0 0 22px rgba(45,212,191,0.28)'
            el.style.opacity   = '1'
          }}
        >
          Connect Wallet
        </button>

        {/* Sign In / Sign Up row */}
        <div className="flex gap-2">
          <button
            className="flex-1 h-9 rounded-xl text-[12px] font-medium transition-all"
            style={{
              color: '#64748b',
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.03)',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLButtonElement
              el.style.color       = '#e2e8f0'
              el.style.background  = 'rgba(255,255,255,0.06)'
              el.style.borderColor = 'rgba(255,255,255,0.13)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLButtonElement
              el.style.color       = '#64748b'
              el.style.background  = 'rgba(255,255,255,0.03)'
              el.style.borderColor = 'rgba(255,255,255,0.08)'
            }}
          >
            Sign In
          </button>
          <button
            className="flex-1 h-9 rounded-xl text-[12px] font-bold transition-all active:scale-[0.98]"
            style={{
              background: 'rgba(45,212,191,0.1)',
              color: '#2DD4BF',
              border: '1px solid rgba(45,212,191,0.28)',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLButtonElement
              el.style.background  = 'rgba(45,212,191,0.18)'
              el.style.borderColor = 'rgba(45,212,191,0.44)'
              el.style.boxShadow   = '0 0 14px rgba(45,212,191,0.18)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLButtonElement
              el.style.background  = 'rgba(45,212,191,0.1)'
              el.style.borderColor = 'rgba(45,212,191,0.28)'
              el.style.boxShadow   = 'none'
            }}
          >
            Sign Up
          </button>
        </div>

      </div>
    </aside>
  )
}
